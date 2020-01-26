import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import {Link} from 'react-router-dom';
import {
  getMarketData,
  getMarketSevens,
  createTrustlineRequest,
  getTransactions
} from '../../actions/index';
import WalletAddressModal from './WalletAddressModal';
import TransactionSingle from './TransactionSingle';

class WalletTokenTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      activationSoloModal: false,
      loadingFinished: true
    };
    this.openAddressModal = this.openAddressModal.bind(this);
    this.closeAddressModal = this.closeAddressModal.bind(this);
  }


  openAddressModal() {
    this.setState({ isModalOpen: true });
  }

  closeAddressModal() {
    this.setState({ isModalOpen: false });
  }

 

  render() {
    const {
      tabOnView,
      classes,
      wallet,
      defaultFiat,
      marketData,
      marketSevens,
      transactions
    } = this.props;

    const {
      isModalOpen,
      priceChange,
      priceColor,
      activationSoloModal,
      loadingFinished
    } = this.state;

    let totalBalance = 0;

    if (typeof marketData.market.last !== 'undefined') {
      const { last } = marketData.market;
      const { solo } = wallet.balance;

      const soloValue = solo * last;
      // const soloValue = solo * 0;

      totalBalance = soloValue;
    }

    

    return (
      <div className={classes.tabContainer}>
        <p className={classes.balanceTitle}>Tokenized assets trading coming in Q3 2020</p>
        <div className={classes.sendReceiveBtns}>
          <button onClick={() => console.log('')} disabled>
            RECEIVE
          </button>
          <button
            className={classes.sendMoneyBtn}
            disabled
          >
            SEND
          </button>
        </div>
        <div className={classes.walletFunctions}>
          <div className={classes.walletAddress}>
            <label>Wallet Address</label>
            <input type="text" value={wallet.walletAddress} readOnly />
          </div>
          <div className={classes.seeQR}>
            <img onClick={this.openAddressModal} src={Images.qricon} />
          </div>
        </div>
        <WalletAddressModal
          data={wallet.walletAddress}
          isModalOpen={isModalOpen}
          closeModal={this.closeAddressModal}
        />
        <div className={classes.transactionsContainer}>
          {transactions.updated && transactions.transactions.length > 0 ? (
            <h1>Recent Transactions</h1>
          ) : (
            <h1>No recent transactions</h1>
          )}
          {transactions.updated && transactions.transactions.length > 0
            ? transactions.transactions.map((tx, idx) => {
                if (tx.type === 'payment') {
                  return <TransactionSingle key={idx} tx={tx} />;
                }
              })
            : ''}
          {transactions.updated && transactions.transactions.length > 0 ? (
            <button
              className={classes.loadMoreBtn}
              onClick={this.loadMore}
              disabled={loadingFinished ? false : true}
            >
              {loadingFinished ? 'Load More' : '...'}
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    defaultFiat: state.defaultFiat,
    marketData: state.marketData,
    marketSevens: state.marketSevens,
    transactions: state.transactions,
    wallets: state.wallets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getMarketData, getMarketSevens, createTrustlineRequest, getTransactions },
    dispatch
  );
}

const styles = theme => ({
  activationSoloModalPaper: {
    background: Colors.darkerGray,
    padding: 35,
    '& h1': {
      fontSize: 32,
      textAlign: 'center',
      paddingBottom: 25,
      color: 'white',
      fontWeight: 300
    }
  },
  transactionsContainer: {
    width: '100%',
    padding: '24px 0',
    margin: '0 auto',
    background: Colors.darkerGray,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  loadMoreBtn: {
    border: 'none',
    color: 'white',
    background: 'none',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none'
    }
  },
  activationSoloModalBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& span': {
      fontSize: 14,
      color: 'white',
      marginBottom: 12
    }
  },
  activatinSoloCircle: {
    color: Colors.darkRed
  },
  walletFunctions: {
    background: Colors.darkerGray,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    '& img': {
      marginLeft: 10,
      width: 35,
      height: 'auto',
      cursor: 'pointer'
    }
  },
  actSoloWalletBtn: {
    background: Colors.darkRed,
    color: 'white',
    borderRadius: 25,
    border: 'none',
    transition: '.2s',
    cursor: 'pointer',
    width: 150,
    alignSelf: 'center',
    margin: '12px auto 65px',
    height: 35,
    fontSize: 18,
    '&:hover': {
      opacity: 0.5,
      transition: '.2s'
    }
  },
  walletAddress: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    border: `1px solid ${Colors.gray}`,
    borderRadius: 25,
    display: 'flex',
    padding: '12px 16px',
    flexDirection: 'column',
    '& input': {
      color: 'white',
      background: 'none',
      border: 'none',
      fontSize: 18
    },
    '& label': {
      fontSize: 14,
      color: Colors.gray,
      padding: '0 0 6px 0'
    }
  },
  tabContainer: {
    background: Colors.slabGray,
    display: 'flex',
    flexDirection: 'column'
  },
  balance: {
    textAlign: 'center',
    fontSize: 32,
    marginTop: 12,
    fontWeight: 300
  },
  balanceTitle: {
    textAlign: 'center',
    fontSize: 16,
    paddingTop: 32,
    margin: '0 auto 48px',
    width: '50%',
    color: Colors.lightGray
  },
  fiatValue: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 12,
    fontWeight: 300
  },
  marketInfo: {
    width: '50%',
    margin: '30px auto',
    display: 'flex',
    justifyContent: 'space-between'
  },
  marketPrice: {
    '& p': {
      color: Colors.lightGray,
      marginBottom: 8
    }
  },
  sendReceiveBtns: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '60%',
    margin: '0 auto',
    paddingBottom: 24,
    '& button': {
      width: 150,
      borderRadius: 25,
      color: 'white',
      padding: '12px 0',
      fontSize: 20,
      cursor: 'pointer',
      transition: '.2s',
      background: Colors.darkRed,
      borderColor: Colors.darkRed,
      '&:first-of-type': {
        background: 'none',
        borderColor: 'white'
      },
      '&:hover': {
        opacity: 0.6,
        transition: '.2s'
      },
      "&:disabled": {
        opacity: .7,
        cursor: "not-allowed"
      }
    },
    '& a': {
      width: 150,
      borderRadius: 25,
      color: 'white',
      padding: '12px 0',
      fontSize: 20,
      cursor: 'pointer',
      transition: '.2s',
      background: Colors.darkRed,
      borderColor: Colors.darkRed,
      // textAlign: "center",
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      '&:hover': {
        opacity: 0.6,
        transition: '.2s'
      }
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(WalletTokenTab)
);
