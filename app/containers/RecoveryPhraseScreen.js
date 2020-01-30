import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../constants/Colors';
import Images from '../constants/Images';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader.js';
import RecoveryPhrase from '../components/shared/RecoveryPhrase';

// MUI COMPONENTS
import { withStyles, Radio, Dialog, Fade } from '@material-ui/core';
import { FileCopy, Print, ChevronRight, Close } from '@material-ui/icons';
import { genereateRandomNumbers } from '../utils/utils2';

// UTILS
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { generateQRCode } from '../utils/utils2';

class RecoveryPhraseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWrittenDown: false,
      uri: '',
      isMnemonicOpen: false,
      showCopyNotification: false
    };
    this.writtenDown = this.writtenDown.bind(this);
    this.goToTest = this.goToTest.bind(this);
    this.openMnemonicModal = this.openMnemonicModal.bind(this);
    this.closeMnemonicModal = this.closeMnemonicModal.bind(this);
  }

  closeMnemonicModal() {
    this.setState({
      isMnemonicOpen: false
    });
  }

  openMnemonicModal() {
    const phrase = this.props.newWallet.newWallet.wallet.mnemonic;
    const uri = generateQRCode(phrase);

    this.setState({
      uri,
      isMnemonicOpen: true
    });
  }

  writtenDown() {
    this.setState({
      isWrittenDown: true
    });
  }

  goToTest() {
    const randomNumbers = genereateRandomNumbers();
    this.props.history.push({
      pathname: '/recovery-test-screen',
      state: { randomNumbers }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showCopyNotification !== this.state.showCopyNotification) {
      if (this.state.showCopyNotification) {
        setTimeout(
          function() {
            this.setState({
              showCopyNotification: false
            });
          }.bind(this),
          1500
        );
      }
    }
  }

  render() {
    const { classes, newWallet } = this.props;
    const {
      isWrittenDown,
      uri,
      isMnemonicOpen,
      showCopyNotification
    } = this.state;

    const mnemonic = newWallet.newWallet.wallet.mnemonic.split(' ');

    return (
      <div className={classes.recoveryPhraseScreenContainer}>
        <ScreenHeader
          title="Your Recovery Words"
          showBackArrow={true}
          showSettings={false}
        />

        <RecoveryPhrase phrase={mnemonic} />
        <div className={classes.utilBtns}>
          <CopyToClipboard
            text={newWallet.newWallet.wallet.mnemonic}
            onCopy={() => this.setState({ showCopyNotification: true })}
          >
            <button style={{ cursor: 'pointer' }}>
              Copy <FileCopy />
            </button>
          </CopyToClipboard>
          {/* <button>
            Print <Print />
          </button> */}
          <button
            onClick={this.openMnemonicModal}
            style={{ cursor: 'pointer' }}
          >
            Show QR <img src={Images.qricon} />
          </button>
        </div>
        <div className={classes.writtenDown}>
          <Radio
            classes={{ root: classes.radio }}
            onChange={this.writtenDown}
          />
          <span>
            I have written down my words, and I understand that without them I
            will not have access to my wallet should I lose it
          </span>
        </div>
        <div className={classes.btnContainer}>
          <button
            className={classes.nextBtn}
            onClick={this.goToTest}
            disabled={isWrittenDown ? false : true}
          >
            Next <ChevronRight />
          </button>
        </div>
        <Dialog
          open={isMnemonicOpen}
          classes={{ paper: classes.mnemonicModal }}
        >
          <h1>Recovery Words</h1>
          <img src={uri} />
          <Close onClick={this.closeMnemonicModal} />
        </Dialog>
        {showCopyNotification ? (
          <Fade in>
            <p
              style={{
                padding: '24px 0',
                borderRadius: 5,
                background: 'white',
                boxShadow: '0 0 15px black',
                color: 'black',
                position: 'absolute',
                width: 150,
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center'
              }}
            >
              Recovery Words Copied!
            </p>
          </Fade>
        ) : (
          ''
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    newWallet: state.newWallet
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
const styles = theme => ({
  mnemonicModal: {
    background: Colors.darkerGray,
    position: 'relative',
    borderRadius: 15,
    color: 'white',
    display: 'flex',
    alignItems: 'center',

    '& h1': {
      fontSize: 28,
      padding: '32px 24px'
    },
    '& img': {
      width: 120,
      height: 120,
      objectFit: 'container',
      marginBottom: 32
    },
    '& svg': {
      position: 'absolute',
      top: 8,
      right: 8,
      color: 'white',
      fontSize: 24,
      cursor: 'pointer'
    }
  },

  recoveryInst: {
    width: '60%',
    margin: '32px auto',
    textAlign: 'center'
  },
  utilBtns: {
    width: '35%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '32px auto 0',
    '& button': {
      borderRadius: 25,
      border: 'none',
      background: 'none',
      display: 'flex',
      alignItems: 'center',
      color: Colors.lightGray,
      cursor: 'pointer',
      '& svg': {
        fontSize: 14,
        marginLeft: 5
      },
      '& img': {
        width: 16,
        marginLeft: 5
      }
    }
  },
  radio: {
    color: 'white'
  },
  btnContainer: {
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 16,
    '& button': {
      background: Colors.darkRed,
      border: 'none',
      borderRadius: 25,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      fontSize: 14,
      color: 'white',
      cursor: 'pointer',
      marginRight: -8,
      '& svg': {
        fontSize: 16,
        color: 'white'
      },
      '&:disabled': {
        background: Colors.slabGray,
        color: Colors.lightGray,
        '& svg': {
          color: Colors.lightGray
        }
      }
    }
  },
  writtenDown: {
    width: '90%',
    margin: '24px auto 0',
    paddingTop: 16,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTop: '1px solid gray',

    '& span': {
      fontSize: 14,
      fontWeight: 300,
      textAlign: 'right',
      lineHeight: 1.5
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(RecoveryPhraseScreen)
);
