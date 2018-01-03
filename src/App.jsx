import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Redirect, Switch, withRouter } from "react-router-dom";

import IssueList from "./IssueList";
import IssueEdit from "./IssueEdit";

const contentNode = document.getElementById( "contents" );
const NoMatch = () => <p>Page Not Found</p>;

const App = props => (
    <div>
        <div className="header">
            <h1>Issue Tracker</h1>
        </div>
        <div className="contents">
            {props.children}
        </div>
        <div className="footer">
            Full source code available at this <a href="https://github.com/mistaguy/meist"> GitHub repository</a>.
        </div>
    </div>
);
App.propTypes = {
    children: PropTypes.object.isRequired,
};

const RoutedApp = () => (
    <App>
        <BrowserRouter>
            <Switch>
                <Route key="key1" exact path="/" render={() => <Redirect to="/issues" />} />
                <Route key="key2" exact path="/issues" component={withRouter( IssueList )} />
                <Route key="key3" exact path="/issues/:id" component={IssueEdit} />
                <Route key="key4" exact path="*" component={NoMatch} />
            </Switch>
        </BrowserRouter>
    </App>
);

ReactDOM.render( <RoutedApp />, contentNode );

if ( module.hot ) {
    module.hot.accept();
}
