import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import {
  getMarketData,
  getMarketSevens,
  createTrustlineRequest
} from '../../actions/index';
import SevenChart from '../../components/shared/SevenChart';
import WalletAddressModal from './WalletAddressModal';
import { getPriceChange, getPriceColor } from '../../utils/utils2';
import TransactionSingle from './TransactionSingle';

class WalletSoloTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
    this.openAddressModal = this.openAddressModal.bind(this);
    this.closeAddressModal = this.closeAddressModal.bind(this);
    this.activateSoloWallet = this.activateSoloWallet.bind(this);
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
  }

  openAddressModal() {
    this.setState({ isModalOpen: true });
  }

  closeAddressModal() {
    this.setState({ isModalOpen: false });
  }

  async activateSoloWallet() {
    const { wallet } = this.props;
    const { privateKey, publicKey, secret } = wallet.details.wallet;
    const keypair = {
      privateKey,
      publicKey
    };

    if (secret) {
      await this.props.createTrustlineRequest({
        address: wallet.walletAddress,
        secret,
        keypair: '',
        id: wallet.id
      });
    } else if (keypair) {
      await this.props.createTrustlineRequest({
        address: wallet.walletAddress,
        secret: '',
        keypair,
        id: wallet.id
      });
    }
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

    const { isModalOpen, priceChange, priceColor } = this.state;

    let totalBalance = 0;

    if (typeof marketData.market.last !== 'undefined') {
      const { last } = marketData.market;
      const { solo } = wallet.balance;

      const soloValue = solo * last;
      // const soloValue = solo * 0;

      totalBalance = soloValue;
    }

    if (!wallet.trustline) {
      return (
        <div className={classes.tabContainer}>
          <p className={classes.balanceTitle}>
            Click below to activate your SOLO wallet. It could take up to 10
            seconds
          </p>
          <button
            className={classes.actSoloWalletBtn}
            onClick={this.activateSoloWallet}
          >
            Activate
          </button>
          <div className={classes.sendReceiveBtns}>
            <button onClick={() => console.log('receive MONEY!!!!')} disabled>
              RECEIVE
            </button>
            <button
              className={classes.sendMoneyBtn}
              disabled
              onClick={() => console.log('send MONEY!!!!')}
            >
              SEND
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={classes.tabContainer}>
        <p className={classes.balanceTitle}>Your Balance:</p>
        <h2 className={classes.balance}>
          {wallet.balance.solo}
          <span> SOLO</span>
        </h2>
        <p className={classes.fiatValue}>
          ~{defaultFiat.symbol}
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
          <button
            className={classes.sendMoneyBtn}
            onClick={() => console.log('send MONEY!!!!')}
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
            transactions.transactions.map((tx, idx) => {
              return <TransactionSingle key={idx} tx={tx} />;
            })
          ) : (
            <h1>No recent transactions</h1>
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
    { getMarketData, getMarketSevens, createTrustlineRequest },
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
  actSoloWalletBtn: {
    background: Colors.darkRed,
    color: 'white',
    borderRadius: 25,
    border: 'none',
    transition: '.2s',
    cursor: 'pointer',
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
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(WalletSoloTab)
);
