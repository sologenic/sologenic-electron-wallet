import React from 'react';
import routes from './constants/routes.js';
import { Switch, Route, Redirect, IndexRoute } from 'react-router-dom';
import { conenct, connect } from 'react-redux';
import App from './App';
import HomeScreen from './containers/HomeScreen';
import SettingsScreen from './containers/SettingsScreen';
import OrientationScreen from './containers/OrientationScreen';
import TermsScreen from './containers/TermsScreen';
import ChangePinScreen from './containers/ChangePinScreen';
import SetPinScreen from './containers/SetPinScreen';
import PinScreen from './containers/PinScreen.js';
import AddWalletScreen from './containers/AddWalletScreen';
import RecoveryPhraseScreen from './containers/RecoveryPhraseScreen';
import RecoveryTestScreen from './containers/RecoveryTestScreen';
import SingleWalletScreen from './containers/SingleWalletScreen';
import ChangeWalletNicknameScreen from './containers/ChangeWalletNicknameScreen';
import TransferXRPScreen from './containers/TransferXRPScreen';

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <App>
        <Switch>
          <Route exact path="/" component={OrientationScreen} />
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
          <Route
            exact
            path={routes.AddWalletScreen}
            component={AddWalletScreen}
          />
          <Route
            exact
            path={routes.RecoveryPhraseScreen}
            component={RecoveryPhraseScreen}
          />
          <Route
            exact
            path={routes.RecoveryTestScreen}
            component={RecoveryTestScreen}
          />
          <Route
            exact
            path={routes.SingleWalletScreen}
            component={SingleWalletScreen}
          />
          <Route
            exact
            path={routes.ChangeWalletNicknameScreen}
            component={ChangeWalletNicknameScreen}
          />
          <Route
            exact
            path={routes.TransferXRPScreen}
            component={TransferXRPScreen}
          />
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
