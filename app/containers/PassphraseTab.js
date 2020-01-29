import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../constants/Colors';
import {
  countWords,
  getWalletFromMnemonic,
  getRippleClassicAddressFromXAddress
} from '../utils/utils2';
import { createTrustlineRequest, fillNewWallet } from '../actions/index';
import { withStyles, Fade, Dialog } from '@material-ui/core';
import { encrypt } from '../utils/encryption';

class PassphraseTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openErrorInPhraseModal: false,
      openAlreadyExistsModal: false
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

    const isPassphraseValid = countWords(phrase);

    if (!isPassphraseValid) {
      this.setState({
        openErrorInPhraseModal: true
      });
    } else {
      this.startPasshphraseImporting(phrase);
    }
  }

  closeErrorInPassphraseModal() {
    this.setState({
      openErrorInPhraseModal: false
    });
  }

  async startPasshphraseImporting(phrase) {
    const importedWallet = getWalletFromMnemonic(phrase);

    console.log('PASSPHRASE NEW WALLET', importedWallet);

    const importedWalletAddress = importedWallet.getAddress();

    console.log('PASSPHRASE NEW WALLET', importedWalletAddress);

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

    const itAlreadyExists = wallets.filter(item => item.id === walletAddress);

    console.log('PASSPHRASE', itAlreadyExists);

    if (itAlreadyExists.length === 0) {
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

      await this.props.createTrustlineRequest({
        address: rippleClassicAddress,
        secret: '',
        keypair: {
          publicKey: importedWallet.publicKey,
          privateKey: importedWallet.privateKey
        },
        id: rippleClassicAddress
      });
    } else {
      this.setState({
        openAlreadyExistsModal: true
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { openErrorInPhraseModal, openAlreadyExistsModal } = this.state;

    return (
      <Fade in>
        <div className={classes.passphraseTab}>
          <p>
            Enter the 12 word passphrase that was given to you when you created
            your wallet.
          </p>
          <p>
            You should have writte it down in a safe place upon creation as
            prompted.
          </p>
          <textarea
            ref="passphrase"
            className={classes.phraseTextarea}
            placeholder="Passphrase"
          ></textarea>
          <input type="password" ref="passwordForImported" />
          <button onClick={this.checkPassphrase}>Add Wallet</button>
          <Dialog
            open={openErrorInPhraseModal}
            classes={{ paper: classes.phraseErrorModal }}
          >
            <h1>Error</h1>
            <p>
              You have entered an invalid mnemonic passphrase. It should consist
              of 12 words, each separated by a space. Please, check your phrase
              and try again.
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
            <p>This wallet already exists.</p>
            <div className={classes.dismissBtn}>
              <button onClick={this.closeAlreadyExistsModal}>DISMISS</button>
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
      createTrustlineRequest
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
    }
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
  connect(mapStateToProps, mapDispatchToProps)(PassphraseTab)
);
