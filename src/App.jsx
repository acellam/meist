import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route } from "react-router-dom";

import IssueList from "./IssueList";
import IssueEdit from "./IssueEdit";

const contentNode = document.getElementById( "contents" );
const NoMatch = () => <p>Page Not Found</p>;

const RoutedApp = () => (
    <BrowserRouter>
        <switch>
            <Route exact path="/" render={() => <Redirect to="/issues" />} />
            <Route path="/issues" component={IssueList} />
            <Route path="/issues/:id" component={IssueEdit} />
            <Route path="*" component={NoMatch} />
        </switch>
    </BrowserRouter> );

ReactDOM.render( <RoutedApp />, contentNode );

if ( module.hot ) {
    module.hot.accept();
}
