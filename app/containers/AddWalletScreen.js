import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../constants/Colors';
import { generateNewWallet } from '../actions/index';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader.js';

// MUI COMPONENTS
import { withStyles } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';

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
    this.state = {};
    this.createWallet = this.createWallet.bind(this);
  }

  createWallet() {
    const result = generateNewRandomWallet();
    console.log('New WALLET', result);
    const walletAddress = getAddress(result);
    console.log('WALLET ADDRESS', walletAddress);
    const rippleClassicAddress = getRippleClassicAddressFromXAddress(
      walletAddress
    );
    console.log('Ripple ADDRESS', rippleClassicAddress);
    const nickname = this.refs.walletNickname.value.trim();

    this.props.generateNewWallet({
      result,
      nickname,
      walletAddress,
      rippleClassicAddress
    });
    console.log('Wallet Name', nickname);

    this.props.history.push({
      pathname: '/recovery-phrase-screen'
    });
  }

  render() {
    const { classes } = this.props;
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
