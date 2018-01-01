import "babel-polyfill";
import SourceMapSupport from "source-map-support";

import express from "express";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import { validateIssue } from "./issue";
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
    db.collection( "issues" ).find().toArray()
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

    const err = validateIssue( newIssue );

    if ( err ) {
        res.status( 422 ).json( { message: `Invalid requrest: ${ err }` } );
        return;
    }

    db.collection( "issues" ).insertOne( newIssue )
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
