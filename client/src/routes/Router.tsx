import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Index from 'views/Index/Index';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <Index />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
