import React, { Component } from 'react';

import { BrowserRouter, Switch, } from 'react-router-dom'
import PrivateRouter from './router/PrivateRouter'
import PublicRouter from './router/PublicRouter'

import Login from './components/Login'
import Home from './components/Home'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <PublicRouter exact path='/login' component={Login} />
          <PrivateRouter path='/' component={Home} />
        </Switch>
      </BrowserRouter>

    );
  }
}

export default App;
