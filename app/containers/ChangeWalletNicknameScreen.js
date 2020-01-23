import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core';
import ScreenHeader from '../components/shared/ScreenHeader';

class ChangeWalletNicknameScreen extends Component {
  render() {
    const { classes, location } = this.props;
    const { wallet } = location.state;
    return (
      <div>
        <ScreenHeader
          showSettings={false}
          title="Change Wallet Nickname"
          showBackArrow
        />
        <h1>{wallet.nickname}</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

const styles = theme => ({});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ChangeWalletNicknameScreen)
);
