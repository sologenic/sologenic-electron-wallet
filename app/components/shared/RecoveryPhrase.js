import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../../constants/Colors';
import storage from 'electron-json-storage';
// MUI COMPONENTS
import { withStyles } from '@material-ui/core';
import { Error } from '@material-ui/icons';

// ACTIONS
import { addNewWallet } from '../../actions/index';

class RecoveryPhrase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWrongPhrase: false
    };
    this.getPlaceholder = this.getPlaceholder.bind(this);
    this.checkPhrase = this.checkPhrase.bind(this);
  }

  getPlaceholder(length) {
    const placeholder = [];
    for (var i = 0; i < length; i++) {
      placeholder.push('_');
    }
    const string = placeholder.join('');

    return string;
  }

  checkPhrase() {
    const inputs = document.getElementsByClassName('inputWord');
    const { phrase } = this.props;
    const words = [];

    for (var i = 0; i < inputs.length; i++) {
      words.push(inputs[i].value);
    }

    const isCorrect = words.map(i => {
      const isInArray = phrase.includes(i);

      if (!isInArray) {
        return false;
      } else {
        return true;
      }
    });

    if (isCorrect.includes(false)) {
      this.setState({
        isWrongPhrase: true
      });
    } else {
      this.props.addNewWallet({
        nickname: this.props.newWallet.newWallet.walletNickname,
        wallet: this.props.newWallet.newWallet.wallet,
        walletAddress: this.props.newWallet.newWallet.walletAddress,
        rippleClassicAddress: this.props.newWallet.newWallet
          .rippleClassicAddress
      });

      this.props.history.push('/dashboard');
    }
  }

  render() {
    const { classes, phrase, randomNumbers } = this.props;
    const { isWrongPhrase } = this.state;

    console.log(this.props);

    if (randomNumbers && randomNumbers.length) {
      return (
        <div className={classes.testContainer}>
          {isWrongPhrase ? <Error style={{ marginTop: 32 }} /> : ''}

          <p className={classes.recoveryInst}>
            {isWrongPhrase
              ? 'The information you entered was incorrect. Please double check your written Recovery Phrase and try again.'
              : 'To ensure that you have complied with the steps as instructed, please enter the missing info of your given Recovery Phrase below.'}
          </p>
          <div className={classes.mnemonicContainer}>
            {phrase.map((word, idx) => {
              idx++;
              if (randomNumbers.includes(idx)) {
                const length = word.length;
                const placeholder = this.getPlaceholder(length);
                return (
                  <div
                    key={idx}
                    className={`${classes.wordSingle} ${classes.wordMissing}`}
                  >
                    <input
                      type="text"
                      key={idx}
                      placeholder={placeholder}
                      className="inputWord"
                      style={
                        isWrongPhrase ? { color: Colors.errorBackground } : {}
                      }
                    />
                    <b>{idx}</b>
                  </div>
                );
              }
              return (
                <span key={idx} className={classes.wordSingle}>
                  <em>{word}</em> <b>{idx}</b>
                </span>
              );
            })}
          </div>
          <button
            className={classes.addWalletBtnCheck}
            onClick={this.checkPhrase}
          >
            Add Wallet
          </button>
        </div>
      );
    }

    return (
      <div>
        <p className={classes.recoveryInst}>
          The sequence of words below is your Recovery Phrase. You need this to
          regain access to your XRP. You should never share this with anyone.
        </p>
        <div className={classes.mnemonicContainer}>
          {phrase.map((word, idx) => {
            idx++;
            return (
              <span key={idx} className={classes.wordSingle}>
                <em>{word}</em> <b>{idx}</b>
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    newWallet: state.newWallet
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addNewWallet }, dispatch);
}
const styles = theme => ({
  testContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  recoveryInst: {
    width: '60%',
    margin: '32px auto',
    textAlign: 'center'
  },
  mnemonicContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    flexWrap: 'wrap',
    margin: '0 auto'
  },
  wordSingle: {
    width: '30%',
    border: '1px solid gray',
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14,
    margin: '8px 0',
    padding: '8px 0',
    '& b': {
      fontSize: 12,
      color: Colors.lightGray,
      paddingRight: 8
    },
    '& em': {
      fontStyle: 'normal',
      paddingLeft: 8,
      fontWeight: 300
    },
    '& input': {
      background: 'none',
      border: 'none',
      width: '90%',
      paddingLeft: 8,
      color: 'white',
      fontSize: 12,
      '&:active': {
        outline: 'none'
      },
      '&:focus': {
        outline: 'none'
      },
      '&::placeholder': {
        letterSpacing: 2,
        color: 'white'
      }
    }
  },
  wordMissing: {
    background: Colors.gray,
    borderColor: 'transparent'
  },
  addWalletBtnCheck: {
    background: Colors.darkRed,
    color: 'white',
    padding: '8px 12px',
    borderRadius: 25,
    border: 'none',
    fontSize: 16,
    width: 150,
    marginTop: 32,
    cursor: 'pointer',
    transition: '.5s',
    '&:hover': {
      background: Colors.error,
      transition: '.5s'
    },
    '&:active': {
      outline: 'none'
    },
    '&:focus': {
      outline: 'none'
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(RecoveryPhrase)
);
