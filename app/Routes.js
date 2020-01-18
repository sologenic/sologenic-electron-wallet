import React from 'react';
import routes from './constants/routes.js';
import { Switch, Route, Redirect } from 'react-router-dom';
import { conenct, connect } from 'react-redux';
import App from './App';
import HomeScreen from './containers/HomeScreen';
import SettingsScreen from './containers/SettingsScreen';
import OrientationScreen from './containers/OrientationScreen';
import TermsScreen from './containers/TermsScreen';
import ChangePinScreen from './containers/ChangePinScreen';
import SetPinScreen from './containers/SetPinScreen';
import PinScreen from './containers/PinScreen.js';

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRoute: ''
    };
  }

  render() {
    return (
      <App>
        <Switch>
          <Redirect exact from="/" to={routes.OrientationScreen} />

          <Route
            exact
            path={routes.OrientationScreen}
            component={OrientationScreen}
          />
          <Route exact path={routes.HomeScreen} component={HomeScreen} />
          <Route
            exact
            path={routes.SettingsScreen}
            component={SettingsScreen}
          />
          <Route exact path={routes.CreatePinScreen} component={HomeScreen} />
          <Route
            exact
            path={routes.OrientationScreen}
            component={SettingsScreen}
          />
          <Route exact path={routes.TermsScreen} component={TermsScreen} />
          <Route
            exact
            path={routes.ChangePinScreen}
            component={ChangePinScreen}
          />
          <Route exact path={routes.SetPinScreen} component={SetPinScreen} />
          <Route exact path={routes.PinScreen} component={PinScreen} />
        </Switch>
      </App>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}

export default connect(mapStateToProps, null)(Routes);
