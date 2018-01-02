/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import PropTypes from "prop-types";

export default class IssueFilter extends React.Component {
    // MOUNT
    constructor() {
        super();

        this.clearFilter = this.clearFilter.bind( this );
        this.setFilterOpen = this.setFilterOpen.bind( this );
        this.setFilterAssigned = this.setFilterAssigned.bind( this );
    }
    render() {
        const Separator = () => <span> | </span>;

        return (
            <div>
                <a href="#" onClick={this.clearFilter}>All Issues</a>
                <Separator />
                <a href="#" onClick={this.setFilterOpen}>Open Issues</a>
                <Separator />
                <a href="#" onClick={this.setFilterAssigned}>Assigned Issues</a>
            </div>
        );
    }

    // PRIVATE METHODS

    setFilterOpen( e ) {
        e.preventDefault();
        this.props.setFilter( { status: "Open" } );
    }

    setFilterAssigned( e ) {
        e.preventDefault();
        this.props.setFilter( { status: "Assigned" } );
    }
    clearFilter( e ) {
        e.preventDefault();
        this.props.setFilter( {} );
    }
}

IssueFilter.propTypes = {
    setFilter: PropTypes.func.isRequired,
};
