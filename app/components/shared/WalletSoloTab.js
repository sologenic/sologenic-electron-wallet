import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles, Dialog, CircularProgress } from '@material-ui/core';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import { Link, withRouter } from 'react-router-dom';
import {
  getMarketData,
  getMarketSevens,
  createTrustlineRequest,
  getTransactions
} from '../../actions/index';
import SevenChart from '../../components/shared/SevenChart';
import WalletAddressModal from './WalletAddressModal';
import { getPriceChange, getPriceColor } from '../../utils/utils2';
import TransactionSingle from './TransactionSingle';

class WalletSoloTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      activationSoloModal: false,
      loadingFinished: true,
      transactionLimit: 5
    };
    this.openAddressModal = this.openAddressModal.bind(this);
    this.closeAddressModal = this.closeAddressModal.bind(this);
    this.activateSoloWallet = this.activateSoloWallet.bind(this);
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

  componentDidUpdate(prevProps) {
    if (prevProps.connection.connected !== this.props.connection.connected) {
      if (this.props.connection.connected) {
        this.props.getMarketData({
          defaultFiat: this.props.defaultFiat.currency
        });

        this.props.getTransactions({
          address: this.props.wallet.walletAddress,
          limit: this.state.transactionLimit
        });
      }
    }
  }

  openAddressModal() {
    this.setState({ isModalOpen: true });
  }

  closeAddressModal() {
    this.setState({ isModalOpen: false });
  }

  async activateSoloWallet() {
    const { wallet } = this.props;

    console.log('SOLO WALLET SINGLE!!!!!', wallet);

    const { privateKey, publicKey, secret } = wallet.details.wallet;
    const keypair = {
      privateKey,
      publicKey
    };

    this.setState({
      activationSoloModal: true
    });

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
      transactions,
      connection
    } = this.props;

    const {
      isModalOpen,
      priceChange,
      priceColor,
      activationSoloModal,
      loadingFinished
    } = this.state;

    let totalBalance = 0;

    if (
      marketData.market !== null &&
      typeof marketData.market.last !== 'undefined'
    ) {
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
            In order to activate your SOLO wallet, you must first send at{' '}
            <b>least 21 XRP</b> to this address.
          </p>
          <div className={classes.actSoloBtn}>
            <button
              className={classes.actSoloWalletBtn}
              onClick={this.activateSoloWallet}
              disabled={wallet.balance.xrp > 21 ? false : true}
            >
              Activate
            </button>
          </div>
          <div className={classes.sendReceiveBtns}>
            <button onClick={() => console.log('receive MONEY!!!!')} disabled>
              RECEIVE
            </button>
            <button disabled className={classes.sendMoneyBtn}>
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
          <Dialog
            open={activationSoloModal}
            classes={{ paper: classes.activationSoloModalPaper }}
            // open
          >
            <h1 className={classes.activationSoloModalTitle}>
              Activating SOLO...
            </h1>
            <div className={classes.activationSoloModalBody}>
              <span>Please wait</span>
              <CircularProgress
                classes={{ circle: classes.activatinSoloCircle }}
              />
            </div>
          </Dialog>
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
        {connection.connected ? (
          <p className={classes.fiatValue}>
            {defaultFiat.symbol}
            {totalBalance.toFixed(2)} {defaultFiat.currency.toUpperCase()}
          </p>
        ) : (
          ''
        )}
        <div className={classes.marketInfo}>
          <div className={classes.marketPrice}>
            <p>Market Price:</p>
            {!marketData.updated || !connection.connected ? (
              <CircularProgress
                size={20}
                classes={{ circle: classes.marketCircle }}
              />
            ) : (
              <span>
                {defaultFiat.symbol}
                {marketData.market.last} {defaultFiat.currency.toUpperCase()}
              </span>
            )}
          </div>
          {/* <div className={classes.marketGraph}>
            <SevenChart
              color={priceColor}
              marketSevens={marketSevens.sevens[`xrp${defaultFiat.currency}`]}
            />
            {this.props.connection.connected ? (
              <p style={{ color: priceColor, textAlign: 'center' }}>
                {priceChange}
              </p>
            ) : (
              ''
            )}
          </div> */}
        </div>
        <div className={classes.sendReceiveBtns}>
          <button
            onClick={() =>
              this.props.history.push({
                pathname: '/receive-screen',
                state: {
                  wallet: wallet,
                  currency: 'solo'
                }
              })
            }
          >
            RECEIVE
          </button>
          {!this.props.connection.connected ? (
            <button disabled className={classes.sendMoneyBtn}>
              SEND
            </button>
          ) : (
            <Link
              className={classes.sendMoneyBtn}
              to={{ pathname: '/send-solo', state: { wallet: wallet } }}
            >
              SEND
            </Link>
          )}
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
          {transactions.updated && transactions.transactions.txs.length > 0 ? (
            <h1>Recent Transactions</h1>
          ) : (
            <h1>No recent transactions</h1>
          )}
          {transactions.updated && transactions.transactions.txs.length > 0
            ? transactions.transactions.txs.map((tx, idx) => {
                if (
                  tx.type === 'payment' &&
                  tx.specification.source.maxAmount.currency ===
                    '534F4C4F00000000000000000000000000000000'
                ) {
                  return (
                    <TransactionSingle
                      key={idx}
                      tx={tx}
                      currentLedger={transactions.transactions.currentLedger}
                      address={wallet.walletAddress}
                    />
                  );
                }
              })
            : ''}
          {transactions.updated && transactions.transactions.txs.length > 0 ? (
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
    wallets: state.wallets,
    connection: state.connection
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
  marketCircle: {
    color: Colors.lightGray
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
  actSoloBtn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '24px 0'
  },
  actSoloWalletBtn: {
    background: Colors.darkRed,
    borderRadius: 25,
    border: 'none',
    color: 'white',
    fontSize: 18,
    width: 120,
    padding: '10px 0',
    transition: '.2s',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.6,
      transition: '.2s'
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed'
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
      fontSize: 16
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
    margin: '0 auto',
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
      '&:disabled': {
        opacity: 0.7,
        cursor: 'not-allowed'
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
  connect(mapStateToProps, mapDispatchToProps)(withRouter(WalletSoloTab))
);
