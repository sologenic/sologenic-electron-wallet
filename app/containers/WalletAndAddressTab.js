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
import {
  isValidRippleAddress,
  isValidSecret,
  getXAddressFromRippleClassicAddress
} from '../utils/utils2';
import {
  createTrustlineRequest,
  fillNewWallet,
  checkForExistingTrustline
} from '../actions/index';
import { withStyles, Fade, Dialog } from '@material-ui/core';
import { encrypt } from '../utils/encryption';
import { withRouter } from 'react-router-dom';

class WalletAndAddressTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openWrongInfoModal: false,
      openAlreadyExistsModal: false,
      importSuccessfulModal: false
    };
    this.startImporting = this.startImporting.bind(this);
    this.validateInputs = this.validateInputs.bind(this);
    this.dismissErrorModal = this.dismissErrorModal.bind(this);
  }

  dismissErrorModal() {
    this.setState({
      openWrongInfoModal: false
    });
  }

  validateInputs() {
    const address = this.refs.walletAddress.value.trim();
    const secret = this.refs.walletSecret.value.trim();
    const nickName = this.refs.walletNickname.value.trim();

    const isAddressValid = isValidRippleAddress(address);
    const isSecretValid = isValidSecret(secret);

    if (!isAddressValid && !isSecretValid) {
      this.setState({
        openWrongInfoModal: true
      });
    } else {
      this.startImporting(address, secret, nickName);
    }
  }

  async startImporting(address, secret, nickname) {
    const pass = this.refs.importedPassword.value.trim();

    const salt = Math.random()
      .toString(36)
      .slice(2);

    const encryptedPrivateKey = encrypt(secret, salt, address, pass);

    const { wallets } = this.props.wallets;

    const filteredArray =
      wallets.length > 0 ? wallets.filter(item => item.id === address) : [];

    const itAlreadyExists = filteredArray.length > 0 ? true : false;

    if (!itAlreadyExists) {
      await this.props.fillNewWallet({
        nickname: nickname,
        wallet: {
          wallet: {
            secret: encryptedPrivateKey
          },
          walletSalt: salt
        },
        walletAddress: address,
        rippleClassicAddress: address
      });

      // await this.props.createTrustlineRequest({
      //   address,
      //   secret,
      //   keypair: '',
      //   id: address
      // });

      await this.props.checkForExistingTrustline({
        address,
        secret,
        keypair: '',
        id: address
      });

      this.setState({
        importSuccessfulModal: true
      });
    } else {
      this.setState({
        openAlreadyExistsModal: true
      });
    }
  }

  render() {
    const { classes } = this.props;
    const {
      openWrongInfoModal,
      openAlreadyExistsModal,
      importSuccessfulModal
    } = this.state;

    return (
      <Fade in>
        <div className={classes.walletAndAddressTab}>
          <input type="text" ref="walletAddress" placeholder="Wallet Address" />
          <input
            type="text"
            ref="walletSecret"
            placeholder="Wallet Secret Key"
          />
          <input
            type="text"
            ref="walletNickname"
            placeholder="Wallet Nickname"
          />
          <p style={{ marginBottom: 5 }}>
            Choose a NEW password for this wallet
          </p>
          <input
            type="password"
            ref="importedPassword"
            placeholder="Wallet Password"
          />
          <p className={classes.footnote}>
            Note: You will need this password to make transactions with this
            wallet.
          </p>
          <button onClick={this.validateInputs}>Add Wallet</button>
          <Dialog
            open={openWrongInfoModal}
            classes={{ paper: classes.errorModal }}
          >
            <h1>Error</h1>
            <p>
              The information you have entered is invalid. Please, check the
              wallet address and secret key and try again.
            </p>
            <div className={classes.dismissBtn}>
              <button onClick={this.dismissErrorModal}>DISMISS</button>
            </div>
          </Dialog>
          <Dialog
            open={openAlreadyExistsModal}
            classes={{ paper: classes.phraseErrorModal }}
          >
            <h1>Error</h1>
            <p>You already imported this wallet.</p>
            <div className={classes.dismissBtn}>
              <button onClick={this.closeAlreadyExistsModal}>DISMISS</button>
            </div>
          </Dialog>
          <Dialog
            open={importSuccessfulModal}
            classes={{ paper: classes.importSuccessfulModal }}
          >
            <h1>Success</h1>
            <p>Wallet has been imported.</p>
            <div className={classes.dismissBtn}>
              <button
                style={{ color: Colors.freshGreen }}
                onClick={() => this.props.history.push('/dashboard')}
              >
                VIEW WALLETS
              </button>
            </div>
          </Dialog>
        </div>
      </Fade>
    );
  }
}

function mapStateToProps(state) {
  return {
    wallets: state.wallets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fillNewWallet,
      createTrustlineRequest,
      checkForExistingTrustline
    },
    dispatch
  );
}

const styles = theme => ({
  walletAndAddressTab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 32,
    width: '60%',
    margin: '0 auto',
    '& button': {
      border: 'none',
      background: Colors.darkRed,
      borderRadius: 25,
      color: 'white',
      fontSize: 18,
      cursor: 'pointer',
      transition: '.2s',
      width: 150,
      height: 35,
      marginTop: 24,
      '&:hover': {
        opacity: 0.7,
        transition: '.2s'
      }
    },
    '& input': {
      background: Colors.darkGray,
      borderRadius: 25,
      border: 'none',
      color: 'white',
      padding: '16px 16px',
      fontSize: 16,
      width: '100%',
      marginBottom: 16,
      '&::placeholder': {
        fontSize: 16
      },
      '&:last-of-type': {
        marginBottom: 0
      },

      '&:focus': {
        outline: 'none'
        // boxShadow: '0 0 10px black'
      }
    },
    '& span': {
      fontSize: 14,
      color: Colors.gray,
      alignSelf: 'flex-start',
      marginTop: 5
    }
  },
  importSuccessfulModal: {
    background: Colors.darkerGray,
    borderRadius: 15,
    color: 'white',
    '& h1': {
      fontSize: 28,
      padding: '32px 24px',
      fontWeight: 300
    },
    '& p': {
      padding: '0 24px 32px'
    }
  },
  footnote: {
    width: '100%',
    margin: '5px auto 0',
    fontSize: 14,
    color: Colors.gray
  },
  errorModal: {
    background: Colors.darkerGray,
    color: 'white',
    width: '60%',
    borderRadius: 15,
    '& h1': {
      fontSize: 32,
      padding: '18px 24px 12px',
      fontWeight: 300
    },
    '& p': {
      padding: '12px 24px 18px',
      fontSize: 14,
      fontWeight: 300
    }
  },
  dismissBtn: {
    borderTop: `1px solid ${Colors.gray}`,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',

    '& button': {
      border: 'none',
      background: 'none',
      color: Colors.lightGray,
      cursor: 'pointer',
      transition: '.2s',
      height: 50,
      marginRight: 24,
      fontSize: 16,
      '&:focus': {
        outline: 'none'
      },
      '&:hover': {
        transition: '.2s',
        color: Colors.gray
      }
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(WalletAndAddressTab))
);
