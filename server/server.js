import "babel-polyfill";
import SourceMapSupport from "source-map-support";

import express from "express";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from "path";

import Issue from "./issue";
import { loadHotLoadModule } from "./development";
import swaggerDocument from "../docs/swagger.json";

SourceMapSupport.install();

const app = express();
let db;

app.use( express.static( "static" ) );
app.use( bodyParser.json() );
app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup( swaggerDocument ) );

loadHotLoadModule( app );

MongoClient.connect( "mongodb://localhost:27017" ).then( ( client ) => {
    db = client.db( "issuetracker" );

    app.listen( 3000, () => {
        console.log( "App started on port 3000" );
    } );
} ).catch( ( error ) => {
    console.log( "ERROR:", error );
} );

app.get( "/api/issues", ( req, res ) => {
    const filter = {};

    if ( req.query.status ) filter.status = req.query.status;
    if ( req.query.effort_lte || req.query.effort_gte ) filter.effort = {};
    if ( req.query.effort_lte ) filter.effort.$lte = parseInt( req.query.effort_lte, 10 );
    if ( req.query.effort_gte ) filter.effort.$gte = parseInt( req.query.effort_gte, 10 );

    db.collection( "issues" ).find( filter ).toArray()
        .then( ( issues ) => {
            const metadata = { total_count: issues.length };
            res.json( { _metadata: metadata, records: issues } );
        } )
        .catch( ( error ) => {
            console.log( error );
            res.status( 500 ).json( { message: `Internal Server Error: ${ error }` } );
        } );
} );

app.post( "/api/issues", ( req, res ) => {
    const newIssue = req.body;

    newIssue.created = new Date();

    if ( !newIssue.status ) {
        newIssue.status = "New";
    }

    const err = Issue.validateIssue( newIssue );

    if ( err ) {
        res.status( 422 ).json( { message: `Invalid requrest: ${ err }` } );
        return;
    }

    db.collection( "issues" ).insertOne( Issue.cleanupIssue( newIssue ) )
        .then( result =>
            db.collection( "issues" ).find( { _id: result.insertedId } ).limit( 1 ).next() )
        .then( ( foundIssue ) => {
            res.json( foundIssue );
        } )
        .catch( ( error ) => {
            console.log( error );
            res.status( 500 ).json( { message: `Internal Server Error: ${ error }` } );
        } );
} );

app.get( "*", ( req, res ) => {
    res.sendFile( path.resolve( "static/index.html" ) );
} );
