import React from "react";
import PropTypes from "prop-types";
import { Link as ReactLink } from "react-router-dom";

export default class IssueEdit extends React.Component { // eslint-disable-line
    render() {
        return (
            <div>
                <p>This is a placeholder for editing issue {this.props.match.params.id}.</p>
                <ReactLink to="/issues">Back to issue list</ReactLink>
            </div>
        );
    }
}

IssueEdit.propTypes = {
    params: PropTypes.object.isRequired,
};
