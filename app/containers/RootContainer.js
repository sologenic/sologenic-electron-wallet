import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import os from 'os';
import storage from 'electron-json-storage';
import {
  setDefaultFiatCurrency,
  setPinCode,
  setTerms
} from '../actions/index.js';

storage.setDataPath(os.tmpdir());

class RootContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isStoreUpdated: false };
  }

  async componentDidMount() {
    await storage.getAll((err, data) => {
      console.log('Storage', data);
      this.props.setDefaultFiatCurrency(data.defaultCurrency.currency);
      this.props.setPinCode(data.pincode.pin);
      this.props.setTerms(data.terms.accepted);
    });

    this.setState({ isStoreUpdated: true });
  }

  render() {
    if (!this.state.isStoreUpdated) {
      return <span>Loading...</span>;
    }

    return this.props.children;
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
      setTerms: setTerms
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
