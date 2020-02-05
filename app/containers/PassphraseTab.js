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
  countWords,
  getWalletFromMnemonic,
  getRippleClassicAddressFromXAddress
} from '../utils/utils2';
import {
  createTrustlineRequest,
  fillNewWallet,
  checkForExistingTrustline
} from '../actions/index';
import { withStyles, Fade, Dialog } from '@material-ui/core';
import { encrypt } from '../utils/encryption';
import { withRouter } from 'react-router-dom';
class PassphraseTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openErrorInPhraseModal: false,
      openAlreadyExistsModal: false,
      importSuccessfulModal: false,
      passwordEmpty: false
    };

    this.checkPassphrase = this.checkPassphrase.bind(this);
    this.startPasshphraseImporting = this.startPasshphraseImporting.bind(this);
    this.closeErrorInPassphraseModal = this.closeErrorInPassphraseModal.bind(
      this
    );
    this.closeAlreadyExistsModal = this.closeAlreadyExistsModal.bind(this);
  }

  closeAlreadyExistsModal() {
    this.setState({
      openAlreadyExistsModal: false
    });
  }

  checkPassphrase() {
    const phrase = this.refs.passphrase.value.trim();
    const password = this.refs.passwordForImported.value.trim();

    const isPassphraseValid = countWords(phrase);

    if (password === '') {
      return this.setState({
        openErrorInPhraseModal: true,
        passwordEmpty: true
      });
    }

    if (!isPassphraseValid) {
      this.setState({
        openErrorInPhraseModal: true,
        passwordEmpty: false
      });
    } else {
      this.startPasshphraseImporting(phrase);
    }
  }

  closeErrorInPassphraseModal() {
    this.setState({
      openErrorInPhraseModal: false,
      passwordForImported: false
    });
  }

  async startPasshphraseImporting(phrase) {
    const importedWallet = getWalletFromMnemonic(phrase);

    if (typeof importedWallet === 'undefined') {
      return this.setState({
        openErrorInPhraseModal: true,
        passwordEmpty: false
      });
    }

    const importedWalletAddress = importedWallet.getAddress();

    const rippleClassicAddress = await getRippleClassicAddressFromXAddress(
      importedWalletAddress
    );

    const privateKey = importedWallet.privateKey;
    const walletAddress = rippleClassicAddress;
    const passphrase = this.refs.passwordForImported.value.trim();

    const salt = Math.random()
      .toString(36)
      .slice(2);

    const encryptedPrivateKey = encrypt(
      privateKey,
      salt,
      walletAddress,
      passphrase
    );

    const { wallets } = this.props.wallets;

    const filteredArray =
      wallets.length > 0
        ? wallets.filter(item => item.id === walletAddress)
        : [];

    const itAlreadyExists = filteredArray.length > 0 ? true : false;

    if (!itAlreadyExists) {
      await this.props.fillNewWallet({
        nickname: '',
        wallet: {
          wallet: {
            publicKey: importedWallet.publicKey,
            privateKey: encryptedPrivateKey
          },
          walletSalt: salt
        },
        walletAddress: rippleClassicAddress,
        rippleClassicAddress: rippleClassicAddress
      });

      // await this.props.createTrustlineRequest({
      //   address: rippleClassicAddress,
      //   secret: '',
      //   keypair: {
      //     publicKey: importedWallet.publicKey,
      //     privateKey: importedWallet.privateKey
      //   },
      //   id: rippleClassicAddress
      // });

      await this.props.checkForExistingTrustline({
        address: rippleClassicAddress,
        secret: '',
        keypair: {
          publicKey: importedWallet.publicKey,
          privateKey: importedWallet.privateKey
        },
        id: rippleClassicAddress
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
      openErrorInPhraseModal,
      openAlreadyExistsModal,
      importSuccessfulModal,
      passwordEmpty
    } = this.state;

    return (
      <Fade in>
        <div className={classes.passphraseTab}>
          <p>
            Enter the 12 recovery words that was given to you when you created
            your wallet.
          </p>
          <p>
            You should have writte it down in a safe place upon creation as
            prompted.
          </p>
          <textarea
            ref="passphrase"
            className={classes.phraseTextarea}
            placeholder="Recovery Words"
          ></textarea>
          <p style={{ marginTop: 32, marginBottom: 5 }}>
            Choose a NEW password for this wallet.
          </p>
          <input
            type="password"
            ref="passwordForImported"
            placeholder="New Password"
          />
          <p className={classes.footnote} style={{ textAlign: 'left' }}>
            Note: You will need this password to make transactions with this
            wallet. Please, write down the password and store it in a safe
            place, if you lose it, there is no way to recover it.
          </p>
          <button onClick={this.checkPassphrase}>Add Wallet</button>
          <Dialog
            open={openErrorInPhraseModal}
            classes={{ paper: classes.phraseErrorModal }}
          >
            <h1>Error</h1>
            <p style={{ lineHeight: '20px' }}>
              {passwordEmpty
                ? 'Please, choose a password. You will need this for every transaction within the app.'
                : 'You have entered an invalid mnemonic passphrase. It should consist of 12 words, each separated by a space. Please, check your phrase and try again.'}
            </p>
            <div className={classes.dismissBtn}>
              <button onClick={this.closeErrorInPassphraseModal}>
                DISMISS
              </button>
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
  passphraseTab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 32,
    '& p': {
      fontWeight: 300,
      marginBottom: 24,
      width: '50%',
      textAlign: 'center'
    },
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
      '&:hover': {
        opacity: 0.7,
        transition: '.2s'
      }
    },
    '& input': {
      color: 'white',
      width: '60%',
      border: 'none',
      padding: '16px 16px',
      fontSize: 16,
      background: Colors.darkGray,
      borderRadius: 25
    }
  },
  footnote: {
    width: '50%',
    margin: '5px auto 0',
    fontSize: 14,
    color: Colors.gray
  },
  phraseTextarea: {
    width: '70%',
    margin: '24px auto',
    background: 'none',
    borderBottom: '2px solid white',
    color: 'white',
    fontSize: 14,
    resize: 'none',
    border: 'none',
    '&:focus': { outline: 'none' },
    '&::placeholder': {
      fontSize: 18
    }
  },
  phraseErrorModal: {
    background: Colors.darkerGray,
    color: 'white',
    width: '60%',
    borderRadius: 15,
    '& h1': {
      fontSize: 28,
      padding: '12px 24px',
      fontWeight: 300
    },
    '& p': {
      fontSize: 14,
      padding: '12px 24px 24px'
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
  dismissBtn: {
    borderTop: `1px solid ${Colors.gray}`,
    display: 'flex',
    justifyContent: 'flex-end',
    '& button': {
      background: 'none',
      border: 'none',
      fontSize: 18,
      transition: '.2s',
      color: Colors.lightGray,
      marginRight: 12,
      cursor: 'pointer',
      height: 35,
      '&:hover': {
        color: Colors.gray
      }
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(PassphraseTab))
);
