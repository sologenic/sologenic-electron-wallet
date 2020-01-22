import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../constants/Colors';
import Images from '../constants/Images';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader.js';
import RecoveryPhrase from '../components/shared/RecoveryPhrase';

// MUI COMPONENTS
import { withStyles, Radio } from '@material-ui/core';
import { FileCopy, Print, ChevronRight } from '@material-ui/icons';
import { genereateRandomNumbers } from '../utils/utils2';

class RecoveryPhraseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { isWrittenDown: false };
    this.writtenDown = this.writtenDown.bind(this);
    this.goToTest = this.goToTest.bind(this);
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

  render() {
    const { classes, newWallet } = this.props;
    const { isWrittenDown } = this.state;

    const mnemonic = newWallet.newWallet.wallet.mnemonic.split(' ');

    return (
      <div className={classes.recoveryPhraseScreenContainer}>
        <ScreenHeader
          title="Your Recovery Phrase"
          showBackArrow={true}
          showSettings={false}
        />

        <RecoveryPhrase phrase={mnemonic} />
        <div className={classes.utilBtns}>
          <button>
            Copy <FileCopy />
          </button>
          <button>
            Print <Print />
          </button>
          <button>
            Show QR <img src={Images.qricon} />
          </button>
        </div>
        <div className={classes.writtenDown}>
          <span>
            I have written down my passphrase, and I understand that without it
            I will not have access to my wallet should I lose it
          </span>
          <Radio
            classes={{ root: classes.radio }}
            onChange={this.writtenDown}
          />
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
