import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import os from 'os';
import storage from 'electron-json-storage';
import { setDefaultFiatCurrency } from '../actions/index.js';

storage.setDataPath(os.tmpdir());

class RootContainer extends Component {
  componentDidMount() {
    let localStorage = storage.getAll((err, data) => {
      this.props.setDefaultFiatCurrency(data.defaultCurrency.currency);
    });
  }

  render() {
    return this.props.children;
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { setDefaultFiatCurrency: setDefaultFiatCurrency },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
