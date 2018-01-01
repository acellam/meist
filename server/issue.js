const validIssueStatus = {
    New: true,
    Open: true,
    Assigned: true,
    Fixed: true,
    Verified: true,
    Closed: true,
};
const issueFieldType = {
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

module.exports = {
    validateIssue,
};
