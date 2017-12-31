const express = require( "express" );
const swaggerUi = require( "swagger-ui-express" );
const swaggerDocument = require( "./swagger.json" );
const bodyParser = require( "body-parser" );
const { MongoClient } = require( "mongodb" );

const app = express();

app.use( express.static( "static" ) );
app.use( bodyParser.json() );
app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup( swaggerDocument ) );

let db;

const memIssues = [
    {
        id: 1,
        status: "Open",
        owner: "Ravan",
        created: new Date( "2016-08-15" ),
        effort: 5,
        completionDate: undefined,
        title: "Error in console when clicking Add",
    }, {
        id: 2,
        status: "Assigned",
        owner: "Eddie",
        created: new Date( "2016-08-16" ),
        effort: 14,
        completionDate: new Date( "2016-08-30" ),
        title:
            "Missing bottom border on panel",
    } ];

const validIssueStatus = {
    New: true,
    Open: true,
    Assigned: true,
    Fixed: true,
    Verified: true,
    Closed: true,
};
const issueFieldType = {
    id: "required",
    status: "required",
    owner: "required",
    effort: "optional",
    created: "required",
    completionDate: "optional",
    title: "required",
};

function validateIssue( issue ) {
    Object.keys( issueFieldType ).forEach( ( key ) => {
        const type = issueFieldType[ key ];

        if ( !type ) {
            // eslint-disable-next-line no-param-reassign
            delete issue[ key ];
        } else if ( type === "required" && !issue[ key ] ) {
            return `${ key } is required.`;
        }
    } );

    if ( !validIssueStatus[ issue.status ] ) {
        return `${ issue.status } is not a valid status.`;
    }

    return null;
}

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

    newIssue.id = memIssues.length + 1;
    newIssue.created = new Date();

    if ( !newIssue.status ) {
        newIssue.status = "New";
    }

    const err = validateIssue( newIssue );

    if ( err ) {
        res.status( 422 ).json( { message: `Invalid requrest: ${ err }` } );
        return;
    }

    memIssues.push( newIssue );
    res.json( newIssue );
} );
