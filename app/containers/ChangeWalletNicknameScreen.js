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
