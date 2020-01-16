import React from 'react';
import routes from './constants/routes.js';
import { Switch, Route, Redirect } from 'react-router-dom';
import App from './App';
import HomeScreen from './containers/HomeScreen';
import SettingsScreen from './containers/SettingsScreen';
import OrientationScreen from './containers/OrientationScreen';
import TermsScreen from './containers/TermsScreen';

export default () => (
  <App>
    <Switch>
      <Redirect exact from="/" to={routes.TermsScreen} />

      <Route
        exact
        path={routes.OrientationScreen}
        component={OrientationScreen}
      />
      <Route exact path={routes.HomeScreen} component={HomeScreen} />
      <Route exact path={routes.SettingsScreen} component={SettingsScreen} />
      <Route exact path={routes.CreatePinScreen} component={HomeScreen} />
      <Route exact path={routes.OrientationScreen} component={SettingsScreen} />
      <Route exact path={routes.TermsScreen} component={TermsScreen} />
    </Switch>
  </App>
);
