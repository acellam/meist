import React from "react";
import PropTypes from "prop-types";

export default class IssueFilter extends React.Component {
    // MOUNT
    constructor() {
        super();

        this.state = {
            status: ( this.props && this.props.initFilter.status ) || "",
            effort_gte: ( this.props && this.props.initFilter.effort_gte ) || "",
            effort_lte: ( this.props && this.props.initFilter.effort_lte ) || "",
            changed: false,
        };

        this.clearFilter = this.clearFilter.bind( this );
        this.setFilterOpen = this.setFilterOpen.bind( this );
        this.setFilterAssigned = this.setFilterAssigned.bind( this );
        this.onChangeStatus = this.onChangeStatus.bind( this );
        this.onChangeEffortGte = this.onChangeEffortGte.bind( this );
        this.onChangeEffortLte = this.onChangeEffortLte.bind( this );
        this.applyFilter = this.applyFilter.bind( this );
        this.resetFilter = this.resetFilter.bind( this );
    }

    render() {
        return (
            <div>
                Status:
                <select value={this.state.status} onChange={this.onChangeStatus}>
                    <option value="">(Any)</option>
                    <option value="New">New</option>
                    <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Verified">Verified</option>
                    <option value="Closed">Closed</option>
                </select>
                &nbsp;Effort between:
                <input
                    size={5}
                    value={this.state.effort_gte}
                    onChange={this.onChangeEffortGte}
                />
                &nbsp;-&nbsp;
                <input
                    size={5}
                    value={this.state.effort_lte}
                    onChange={this.onChangeEffortLte}
                />
                <button onClick={this.applyFilter}>Apply</button>
                <button onClick={this.resetFilter} disabled={!this.state.changed}>Reset</button>
                <button onClick={this.clearFilter}>Clear</button>
            </div>
        );
    }

    componentWillReceiveProps( newProps ) {
        this.setState( {
            status: ( newProps.initFilter && newProps.initFilter.status ) || "",
            effort_gte: ( newProps.initFilter && newProps.initFilter.effort_gte ) || "",
            effort_lte: ( newProps.initFilter && newProps.initFilter.effort_lte ) || "",
            changed: false,
        } );
    }

    // PRIVATE METHODS
    resetFilter() {
        this.setState( {
            status: this.props.initFilter.status || "",
            effort_gte: this.props.initFilter.effort_gte || "",
            effort_lte: this.props.initFilter.effort_lte || "",
            changed: false,
        } );
    }

    applyFilter() {
        const newFilter = {};

        if ( this.state.status ) newFilter.status = this.state.status;
        if ( this.state.effort_gte ) newFilter.effort_gte = this.state.effort_gte;
        if ( this.state.effort_lte ) newFilter.effort_lte = this.state.effort_lte;

        this.props.setFilter( newFilter );
    }

    onChangeEffortLte( e ) {
        const effortString = e.target.value;

        if ( effortString.match( /^\d*$/ ) ) {
            this.setState( { effort_lte: e.target.value, changed: true } );
        }
    }

    onChangeStatus( e ) {
        this.setState( { status: e.target.value, changed: true } );
    }

    onChangeEffortGte( e ) {
        const effortString = e.target.value;

        if ( effortString.match( /^\d*$/ ) ) {
            this.setState( { effort_gte: e.target.value, changed: true } );
        }
    }

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
    initFilter: PropTypes.object.isRequired,
};
