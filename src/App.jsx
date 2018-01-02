import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch, withRouter } from "react-router-dom";

import IssueList from "./IssueList";
import IssueEdit from "./IssueEdit";

const contentNode = document.getElementById( "contents" );
const NoMatch = () => <p>Page Not Found</p>;

const RoutedApp = () => (
    <BrowserRouter>
        <Switch>
            <Route key="key1" exact path="/" render={() => <Redirect to="/issues" />} />
            <Route key="key2" exact path="/issues" component={withRouter( IssueList )} />
            <Route key="key3" exact path="/issues/:id" component={IssueEdit} />
            <Route key="key4" exact path="*" component={NoMatch} />
        </Switch>
    </BrowserRouter> );

ReactDOM.render( <RoutedApp />, contentNode );

if ( module.hot ) {
    module.hot.accept();
}
