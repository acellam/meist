import React from "react";
import { Link as ReactLink } from "react-router-dom";
import queryString from "query-string";

export default class IssueFilter extends React.Component { // eslint-disable-line
    render() {
        const Separator = () => <span> | </span>;

        return (
            <div>
                <ReactLink to="/issues">All Issues</ReactLink>
                <Separator />
                <ReactLink to={{ pathname: "/issues", search: queryString.stringify( { status: "Open" } ) }}>
                    Open Issues
                </ReactLink>
                <Separator />
                <ReactLink to="/issues?status=Assigned">Assigned Issues</ReactLink>
            </div> );
    }
}
