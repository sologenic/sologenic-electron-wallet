//     Sologenic Wallet, Decentralized Wallet. Copyright (C) 2020 Sologenic

//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
import TransferSOLOScreen from './containers/TransferSOLOScreen';
import ImportWalletScreen from './containers/ImportWalletScreen';
import ReceiveScreen from './containers/ReceiveScreen';
import { bindActionCreators } from 'redux';
import { setConnection, connectToRippleApi } from './actions/index';

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.checkIfOnline = this.checkIfOnline.bind(this);
  }

  checkIfOnline() {
    var online = navigator.onLine;

    return online;
  }

  async componentDidMount() {
    const online = navigator.onLine;
    await this.props.setConnection(online);

    // if (online) {
    //   await this.props.connectToRippleApi();
    // }

    this.checkOnline = setInterval(async () => {
      const online = navigator.onLine;
      await this.props.setConnection(online);
    }, 10000);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.connection.connected !== this.props.connection.connected) {
      if (this.props.connection.connected) {
        await this.props.connectToRippleApi();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.checkOnline);
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
          <Route
            exact
            path={routes.TransferSOLOScreen}
            component={TransferSOLOScreen}
          />
          <Route
            exact
            path={routes.ImportWalletScreen}
            component={ImportWalletScreen}
          />
          <Route exact path={routes.ReceiveScreen} component={ReceiveScreen} />
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setConnection, connectToRippleApi }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
