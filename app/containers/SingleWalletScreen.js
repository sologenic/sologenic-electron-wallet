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

// MUI COMPONENTS
import {
  withStyles,
  Collapse,
  Dialog,
  TextField,
  Fade
} from '@material-ui/core';
import Colors from '../constants/Colors';
import Images from '../constants/Images';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader';
import WalletTab from '../components/shared/WalletTab';
import WalletSoloTab from '../components/shared/WalletSoloTab';
import WalletTokenTab from '../components/shared/WalletTokenTab';
import { ArrowBack } from '@material-ui/icons';

// ACTION
import {
  changeWalletNickname,
  closeOptions,
  deleteWallet,
  getBalance,
  getTransactions,
  changeTabOnView
} from '../actions/index';

class SingleWalletScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabOnView: 'xrp',
      changingNickName: false,
      openDeleteModal: false,
      currentWallet: null
    };

    this.startNicknameChange = this.startNicknameChange.bind(this);
    this.startWalletDelete = this.startWalletDelete.bind(this);
    this.cancelChangeNickname = this.cancelChangeNickname.bind(this);
    this.changeNicknameWallet = this.changeNicknameWallet.bind(this);
    this.deleteWallet = this.deleteWallet.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.closeOptions = this.closeOptions.bind(this);
  }

  closeOptions(e) {
    e.stopPropagation();
    this.props.closeOptions();
  }

  async componentDidMount() {
    // const { walletID } = this.props.location.state;

    const { pathname } = this.props.location;
    const pathElmnts = pathname.split('/');

    const { wallets } = this.props;
    const currentWallet = wallets.wallets.find(
      item => item.id === pathElmnts[2]
    );

    await this.props.getBalance({
      address: currentWallet.walletAddress,
      id: currentWallet.id
    });

    this.balanceInterval = setInterval(() => {
      this.props.getBalance({
        address: currentWallet.walletAddress,
        id: currentWallet.id
      });
    }, 15000);

    this.setState({
      currentWallet
    });
  }

  componentWillUnmount() {
    clearInterval(this.balanceInterval);
  }

  startNicknameChange() {
    this.setState({ changingNickName: true });
  }

  startWalletDelete() {
    this.setState({ openDeleteModal: true });
  }

  cancelChangeNickname() {
    this.setState({
      changingNickName: false
    });
  }

  closeDeleteModal() {
    this.setState({ openDeleteModal: false });
  }

  async deleteWallet() {
    await this.props.deleteWallet({ wallet: this.state.currentWallet });

    await this.props.closeOptions();

    this.props.history.push('/dashboard');
  }

  async changeNicknameWallet() {
    const newName = this.refs.walletNickname.value;

    await this.props.changeWalletNickname({
      wallet: this.state.currentWallet,
      newName
    });

    await this.props.closeOptions();
    this.setState({ changingNickName: false });

    // this.props.history.push('/dashboard');
  }

  async changeTab(tab) {
    await this.props.closeOptions();
    this.props.changeTabOnView(tab);
    // this.setState({ tabOnView: tab });
  }

  render() {
    const { classes, location, walletOptions, tabOnView } = this.props;
    const { changingNickName, openDeleteModal, currentWallet } = this.state;

    if (currentWallet === null) {
      return <span />;
    }

    let wallet = currentWallet;

    if (changingNickName) {
      return (
        <div>
          <div className={classes.headerWrapper}>
            <ArrowBack
              onClick={this.cancelChangeNickname}
              style={{ cursor: 'pointer' }}
            />
            <h1>Change Wallet Nickname</h1>
            <span />
          </div>
          <div className={classes.changingWalletBody}>
            <div className={classes.inputContainer}>
              <input
                type="text"
                placeholder="Wallet Nickname"
                ref="walletNickname"
              />
            </div>
          </div>
          <div className={classes.nextBtnContainer}>
            <button onClick={this.changeNicknameWallet}>
              <p>Confirm</p>
            </button>
          </div>
        </div>
      );
    }

    return (
      <Fade in>
        <div>
          <ScreenHeader
            showBackArrow={true}
            title={wallet.nickname}
            showSettings={false}
            dark={true}
            showWalletOptions={true}
            fixed={true}
          />
          <Dialog
            open={openDeleteModal}
            classes={{ paper: classes.deleteModalContainer }}
          >
            <h2>Delete this Wallet?</h2>
            <p>Are you sure you would like to delete this wallet?</p>
            <div className={classes.deleteBtnsContainer}>
              <button onClick={this.closeDeleteModal}>CANCEL</button>
              <button onClick={this.deleteWallet}>DELETE</button>
            </div>
          </Dialog>
          <div
            className={`${classes.walletOptions} ${
              walletOptions.isOpen ? classes.wallletOptionsOpen : ''
            }`}
          >
            <button onClick={this.startNicknameChange}>
              Change Wallet Nickname
            </button>
            <button onClick={this.startWalletDelete}>Delete Wallet</button>
          </div>
          {/* <div className={classes.totalBalance}>
            <p>Total Balance:</p>
            <span>$0.00</span>
          </div> */}
          <div className={classes.singleWalletBody}>
            <div className={classes.tabsDiv}>
              <div
                className={`${classes.singleTab} ${
                  tabOnView.view === 'xrp' ? classes.activeTab : ''
                }`}
                onClick={() => this.changeTab('xrp')}
              >
                <img src={Images.xrp} />
              </div>
              <div
                className={`${classes.singleTab} ${
                  tabOnView.view === 'solo' ? classes.activeTab : ''
                }`}
                onClick={() => this.changeTab('solo')}
              >
                <img src={Images.solo} />
              </div>
              <div
                className={`${classes.singleTab} ${
                  tabOnView.view === 'token' ? classes.activeTab : ''
                }`}
                onClick={() => this.changeTab('token')}
              >
                <img src={Images.tokenizedAsset} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 122 }}>
            {tabOnView.view === 'xrp' ? (
              <WalletTab wallet={wallet} tabOnView={tabOnView.view} />
            ) : (
              ''
            )}
            {tabOnView.view === 'solo' ? (
              <WalletSoloTab wallet={wallet} tabOnView={tabOnView.view} />
            ) : (
              ''
            )}
            {tabOnView.view === 'token' ? (
              <WalletTokenTab wallet={wallet} tabOnView={tabOnView.view} />
            ) : (
              ''
            )}
          </div>
        </div>
      </Fade>
    );
  }
}

function mapStateToProps(state) {
  return {
    walletOptions: state.walletOptions,
    wallets: state.wallets,
    tabOnView: state.tabOnView
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changeWalletNickname,
      closeOptions,
      deleteWallet,
      getBalance,
      getTransactions,
      closeOptions,
      changeTabOnView
    },
    dispatch
  );
}
const styles = theme => ({
  totalBalance: {
    display: 'flex',
    width: '30%',
    margin: '0 auto 12px',
    fontSize: 14,
    justifyContent: 'center',
    '& p': {
      color: Colors.lightGray,
      marginRight: 5
    }
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    background: Colors.headerBackground,
    '& h1': {
      fontSize: 20,
      fontWeight: 300,
      textAlign: 'center',
      width: '65%'
    },
    '& img': {
      width: 20,
      height: 'auto'
    }
  },
  deleteModalContainer: {
    background: Colors.darkerGray,
    color: 'white',
    borderRadius: 15,
    '& h2': {
      fontSize: 20,
      fontWeight: 300,
      padding: '12px 12px 24px'
    },
    '& p': {
      fontSize: 14,
      padding: '0 12px',
      fontWeight: 300
    }
  },
  deleteBtnsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTop: `1px solid ${Colors.darkGray}`,
    padding: '20px 0',
    marginTop: 20,
    '& button': {
      fontSize: 16,
      color: Colors.errorBackground,
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      width: '30%',
      '&:focus': {
        outline: 'none'
      },
      '&:first-of-type': {
        color: Colors.lightGray
      }
    }
  },
  walletOptions: {
    position: 'absolute',
    top: 45,
    right: 30,
    width: 200,
    height: 0,
    zIndex: 999999,
    overflow: 'hidden',
    transition: '.2s',
    background: Colors.darkerGray,
    transition: '.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',

    '& button': {
      border: 'none',
      background: 'transparent',
      color: 'white',
      padding: '9px 5px',
      cursor: 'pointer',
      width: '90%',
      textAlign: 'left',
      fontSize: 14,
      '&:first-of-type': {
        borderBottom: '1px solid gray'
      },
      '&:focus': {
        outline: 'none'
      },
      '&:hover': {
        background: Colors.darkGray,
        transition: '.2s'
      }
    }
  },
  wallletOptionsOpen: {
    height: 70,
    transition: '.2s',
    border: '1px solid gray'
  },
  singleWalletBody: {
    background: Colors.slabGray
  },
  tabsDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'fixed',
    background: Colors.slabGray,
    width: '100%',
    top: 60,
    boxShadow: '0 0px 10px rgb(38, 38, 38)',
    zIndex: 99999
  },
  singleTab: {
    width: '33%',
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0',
    cursor: 'pointer',
    transition: '.2s',
    opacity: 0.4,
    borderBottom: '3px solid transparent',

    '& img': {
      width: 35,
      objectFit: 'contain'
    },
    '&:hover': {
      background: Colors.darkGray,
      transition: '.2s'
    }
  },
  activeTab: {
    opacity: 1,
    borderColor: 'white'
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: 32,
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
  connect(mapStateToProps, mapDispatchToProps)(SingleWalletScreen)
);
