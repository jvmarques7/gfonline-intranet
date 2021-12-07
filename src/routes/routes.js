import React from 'react'
import {Switch, Route} from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom';
import { InternalLogin } from '../internal/login';
import { Home } from '../internal/home';
import { EventRegister } from '../internal/events';
import { Clients } from '../internal/clients';

  export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                {/* Rotas Intranet */}
                <Route path="/intranet" component={InternalLogin} />
                <Route path="/" exact component={Home} />
                <Route path="/eventos" component={EventRegister} />
                <Route path="/clientes" component={Clients}/>
            </Switch>
        </BrowserRouter>
    );
  }