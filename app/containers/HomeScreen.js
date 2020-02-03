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

import React, { Component, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import ScreeHeader from '../components/shared/ScreenHeader.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connectToRippleApi, connection } from '../actions/index';
import {
  Close,
  ExpandMore,
  Add,
  GetApp,
  Wifi,
  WifiOff
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import WalletCard from '../components/shared/WalletCard';
import storage from 'electron-json-storage';
import { CircularProgress, Grow } from '@material-ui/core';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addWalletOpen: false
    };
    this.openAddWallet = this.openAddWallet.bind(this);
    this.closeAddWallet = this.closeAddWallet.bind(this);
  }

  openAddWallet() {
    this.setState({
      addWalletOpen: true
    });
  }
  closeAddWallet() {
    this.setState({
      addWalletOpen: false
    });
  }

  render() {
    const { classes, wallets, connection } = this.props;
    const { addWalletOpen } = this.state;

    return (
      <div className={classes.homeScreenContainer}>
        <ScreeHeader title="Your Wallets" showSettings={true} />
        <div className={classes.walletsContainer}>
          {wallets.wallets && wallets.wallets.length > 0 ? (
            wallets.wallets.map((wlt, idx) => {
              return (
                <WalletCard
                  nickname={wlt.nickname}
                  balance={wlt.balance}
                  wallet={wlt}
                  key={idx}
                />
              );
            })
          ) : (
            <h3>No Wallets Added</h3>
          )}
        </div>

        <Add onClick={this.openAddWallet} classes={{ root: classes.addBtn }} />
        <div
          className={`${classes.addWalletScreen} ${
            addWalletOpen ? classes.addWalletActive : ''
          }`}
        >
          <div className={classes.addWalletBtn}>
            <p>Create New Wallet</p>
            <Link to="/add-wallet-screen" style={{ color: 'white' }}>
              <Add classes={{ root: classes.addBtn1 }} />
            </Link>
          </div>
          <div className={classes.addWalletBtn}>
            <p>I Already Have A Wallet</p>
            <Link to="/import-wallet" style={{ color: 'white' }}>
              <GetApp
                onClick={this.importWallet}
                classes={{ root: classes.addBtn1 }}
              />
            </Link>
          </div>
          <ExpandMore
            onClick={this.closeAddWallet}
            classes={{ root: classes.addBtn2 }}
          />
        </div>
        <p
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            color: this.props.connection.connected
              ? Colors.freshGreen
              : Colors.errorBackground
          }}
        >
          {this.props.connection.connected ? <Wifi /> : <WifiOff />}
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { wallets: state.wallets, connection: state.connection };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      connectToRippleApi
    },
    dispatch
  );
}

const styles = theme => ({
  loadingProgress: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleProgress: {
    color: Colors.darkRed
  },
  homeScreenContainer: {
    position: 'relative',
    height: '100vh',
    '& h3': {
      fontWeight: 300,
      textAlign: 'center',
      marginTop: 32
    },
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  walletsContainer: {
    height: '555px',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  addWalletScreen: {
    position: 'absolute',
    height: 0,
    width: '100vw',
    bottom: 0,
    left: 0,
    background: 'rgba(0,0,0,.8)',
    transition: '.2s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    overflow: 'hidden'
  },
  addWalletActive: {
    height: '100vh',
    transition: '.2s'
  },
  addBtn: {
    background: Colors.darkRed,
    borderRadius: '50%',
    padding: 16,
    position: 'absolute',
    bottom: 32,
    right: 32,
    cursor: 'pointer',
    transition: '.5s',
    '&:hover': {
      background: Colors.error,
      transition: '.5s'
    }
  },
  addBtn1: {
    background: Colors.darkRed,
    borderRadius: '50%',
    padding: 12,
    cursor: 'pointer',
    transition: '.5s',
    '&:hover': {
      background: Colors.error,
      transition: '.5s'
    }
  },
  addWalletBtn: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 32,
    marginBottom: 12,
    '& svg': {
      marginLeft: 12
    }
  },
  addBtn2: {
    background: Colors.darkRed,
    borderRadius: '50%',
    padding: 16,
    cursor: 'pointer',
    transition: '.5s',
    marginRight: 32,
    marginBottom: 32,
    '&:hover': {
      background: Colors.error,
      transition: '.5s'
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
);
