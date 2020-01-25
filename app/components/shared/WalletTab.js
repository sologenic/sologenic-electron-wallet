import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import {
  getMarketData,
  getMarketSevens,
  transferXRP,
  getTransactions
} from '../../actions/index';
import SevenChart from '../../components/shared/SevenChart';
import WalletAddressModal from './WalletAddressModal';
import { getPriceChange, getPriceColor } from '../../utils/utils2';
import TransactionSingle from './TransactionSingle';

class WalletTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      transactionLimit: 5,
      loadingFinished: true
    };
    this.openAddressModal = this.openAddressModal.bind(this);
    this.closeAddressModal = this.closeAddressModal.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  async loadMore() {
    const newLimit = this.state.transactionLimit + 5;

    this.setState({
      loadingFinished: false,
      transactionLimit: newLimit
    });

    await this.props.getTransactions({
      address: this.props.wallet.walletAddress,
      limit: newLimit
    });

    this.setState({
      loadingFinished: true
    });
  }

  async componentDidMount() {
    await this.props.getMarketSevens();
    const priceChange = getPriceChange(
      this.props.marketData.market.last,
      this.props.marketData.market.open
    );
    const priceColor = getPriceColor(priceChange);

    this.setState({
      priceColor,
      priceChange
    });

    await this.props.getTransactions({
      address: this.props.wallet.walletAddress,
      limit: this.state.transactionLimit
    });
  }

  openAddressModal() {
    this.setState({ isModalOpen: true });
  }

  closeAddressModal() {
    this.setState({ isModalOpen: false });
  }

  // sendXRP() {
  //   // await this.props.transferXRP();
  //   this.props.history.push({
  //     pathname: '/send-xrp',
  //     state: {
  //       wallet: this.props.wallet
  //     }
  //   });
  // }

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
      loadingFinished
    } = this.state;

    let totalBalance = 0;
    let xrpValue = 0;
    const { xrp } = wallet.balance;

    if (typeof marketData.market.last !== 'undefined') {
      const { last } = marketData.market;

      xrpValue = xrp * last;
      // const soloValue = solo * 0;

      totalBalance = xrpValue;
    }

    if (xrp === 0) {
      return <div>Deposit to activate</div>;
    }

    if (xrp > 0 && xrp < 21) {
      return <div>Running low</div>;
    }

    return (
      <div className={classes.tabContainer}>
        <p className={classes.balanceTitle}>Your Balance:</p>
        <h2 className={classes.balance}>
          {wallet.balance.xrp}
          <span> XRP</span>
        </h2>
        <p className={classes.fiatValue}>
          {defaultFiat.symbol}
          {totalBalance.toFixed(2)} {defaultFiat.currency.toUpperCase()}
        </p>
        <div className={classes.marketInfo}>
          <div className={classes.marketPrice}>
            <p>Market Price:</p>
            <span>
              {defaultFiat.symbol}
              {marketData.market.last} {defaultFiat.currency.toUpperCase()}
            </span>
          </div>
          <div className={classes.marketGraph}>
            <SevenChart
              color={priceColor}
              marketSevens={marketSevens.sevens[`xrp${defaultFiat.currency}`]}
            />
            <p style={{ color: priceColor, textAlign: 'center' }}>
              {priceChange}
            </p>
          </div>
        </div>
        <div className={classes.sendReceiveBtns}>
          <button onClick={() => console.log('receive MONEY!!!!')}>
            RECEIVE
          </button>
          <Link
            className={classes.sendMoneyBtn}
            to={{ pathname: '/send-xrp', state: { wallet: wallet } }}
          >
            SEND
          </Link>
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
                if (
                  tx.type === 'payment' &&
                  tx.specification.source.maxAmount.currency === 'XRP'
                ) {
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
    transactions: state.transactions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getMarketData, getMarketSevens, transferXRP, getTransactions },
    dispatch
  );
}

const styles = theme => ({
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
  loadMoreBtn: {
    border: 'none',
    color: 'white',
    background: 'none',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none'
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
    background: Colors.slabGray
  },
  balance: {
    textAlign: 'center',
    fontSize: 32,
    marginTop: 12,
    fontWeight: 300
  },
  balanceTitle: {
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 32,
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
  connect(mapStateToProps, mapDispatchToProps)(WalletTab)
);
