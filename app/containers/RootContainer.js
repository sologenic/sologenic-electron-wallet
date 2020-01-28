import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import os from 'os';
import storage from 'electron-json-storage';
import { ConnectedRouter } from 'connected-react-router';
import Routes from '../Routes';
import {
  setDefaultFiatCurrency,
  setPinCode,
  setTerms,
  fillWallets
} from '../actions/index.js';

storage.setDataPath();

class RootContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isStoreUpdated: false };
  }

  async componentDidMount() {
    await storage.getAll((err, data) => {
      console.log('Storage', data);
      if (Object.entries(data).length > 0) {
        this.props.setPinCode(data.pincode.pin);
        this.props.setTerms(data.terms.accepted);

        if (typeof data.wallets === 'undefined') {
          this.props.fillWallets({ wallets: [] });
        } else {
          this.props.fillWallets(data.wallets);
        }

        if (typeof data.defaultCurrency === 'undefined') {
          this.props.setDefaultFiatCurrency('usd');
        } else {
          this.props.setDefaultFiatCurrency(data.defaultCurrency.currency);
        }
      }

      this.setState({ isStoreUpdated: true });
    });

    // LINE BELOW WILL DELETE ALL THE LOCAL STORAGE --- ONLY USE ON DEVELOPMENT
    // await storage.clear();
  }

  render() {
    if (!this.state.isStoreUpdated) {
      return <span />;
    }

    return (
      <ConnectedRouter history={this.props.history}>
        <Routes />
      </ConnectedRouter>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setDefaultFiatCurrency: setDefaultFiatCurrency,
      setPinCode: setPinCode,
      setTerms: setTerms,
      fillWallets: fillWallets
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
