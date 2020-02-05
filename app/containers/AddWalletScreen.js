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
import Colors from '../constants/Colors';
import { generateNewWallet } from '../actions/index';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader.js';

// MUI COMPONENTS
import { withStyles, Dialog, Fade } from '@material-ui/core';
import { ChevronRight, VisibilityOff, Visibility } from '@material-ui/icons';

// WALLET
import {
  generateNewRandomWallet,
  getAddress,
  getRippleClassicAddressFromXAddress,
  generateMnemonicArray
} from '../utils/utils2';

class AddWalletScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { isShown: false, passwordEmpty: false };
    this.createWallet = this.createWallet.bind(this);
    this.showPassword = this.showPassword.bind(this);
    this.hidePassword = this.hidePassword.bind(this);
  }

  showPassword() {
    const input = this.refs.walletPassphrase;

    input.type = 'text';

    this.setState({
      isShown: true
    });
  }

  hidePassword() {
    const input = this.refs.walletPassphrase;
    input.type = 'password';

    this.setState({
      isShown: false
    });
  }

  createWallet() {
    const result = generateNewRandomWallet();
    const walletAddress = getAddress(result);
    const rippleClassicAddress = getRippleClassicAddressFromXAddress(
      walletAddress
    );
    const nickname = this.refs.walletNickname.value.trim();

    if (this.refs.walletPassphrase.value.trim() === '') {
      this.setState({
        passwordEmpty: true,
        openPasswordEmptyModal: true
      });
    } else {
      this.props.generateNewWallet({
        result,
        nickname,
        walletAddress,
        rippleClassicAddress,
        passphraseProvisional: this.refs.walletPassphrase.value.trim()
      });

      this.props.history.push({
        pathname: '/recovery-phrase-screen'
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { passwordEmpty, openPasswordEmptyModal } = this.state;
    return (
      <div className={classes.walletNicknameContainer}>
        <ScreenHeader
          title="Create New Wallet"
          showSettings={false}
          showBackArrow={true}
        />
        <div className={classes.inputContainer}>
          <input
            type="text"
            placeholder="Wallet Nickname"
            ref="walletNickname"
          />
        </div>
        <div
          className={classes.inputContainer}
          style={{ position: 'relative' }}
        >
          <input
            type="password"
            placeholder="Wallet Password"
            ref="walletPassphrase"
          />
          {this.state.isShown ? (
            <VisibilityOff
              onClick={this.hidePassword}
              style={{
                position: 'absolute',
                right: '25%',
                top: '50%',
                fontSize: 20,
                transform: 'translateY(-50%)',
                cursor: 'pointer'
              }}
            />
          ) : (
            <Visibility
              onClick={this.showPassword}
              style={{
                position: 'absolute',
                right: '25%',
                top: '50%',
                fontSize: 20,
                transform: 'translateY(-50%)',
                cursor: 'pointer'
              }}
            />
          )}
        </div>
        {passwordEmpty ? (
          <Fade in>
            <p
              style={{
                color: Colors.errorBackground,
                margin: '12px auto',
                width: '50%',
                fontSize: 14,
                textAlign: 'center'
              }}
            >
              Please, choose a password.
            </p>
          </Fade>
        ) : (
          ''
        )}
        <p className={classes.footnote}>
          Note: You will need this password to make transactions with this
          wallet. Please, write down the password and store it in a safe place,
          if you lose it, there is no way to recover it.
        </p>
        <div className={classes.nextBtnContainer}>
          <button onClick={this.createWallet}>
            <p>Next</p>
            <ChevronRight />
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ generateNewWallet }, dispatch);
}
const styles = theme => ({
  walletNicknameContainer: {
    height: '100vh',
    '& input': {
      background: Colors.darkGray,
      borderRadius: 25,
      padding: '12px 20px',
      border: 'none',
      width: '50%',
      fontSize: 18,
      color: 'white',
      fontWeight: 300,
      '&:active': {
        outline: 'none'
      },
      '&:focus': {
        outline: 'none'
      }
    }
  },
  footnote: {
    width: '50%',
    margin: '5px auto 0',
    fontSize: 14,
    color: Colors.gray
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: 32
  },
  nextBtnContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    '& button': {
      background: Colors.darkRed,
      border: 'none',
      color: 'white',
      borderRadius: 25,
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      fontSize: 16,
      transition: '.5s',
      cursor: 'pointer',
      '&:hover': {
        background: Colors.error,
        transition: '.5s'
      }
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(AddWalletScreen)
);
