import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { withStyles, Dialog, CircularProgress } from '@material-ui/core';
import { Help } from '@material-ui/icons';
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
      loadingFinished: true,
      why21XrpModal: false
    };
    this.openAddressModal = this.openAddressModal.bind(this);
    this.closeAddressModal = this.closeAddressModal.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.open21XrpModal = this.open21XrpModal.bind(this);
    this.closeWhy21XrpModal = this.closeWhy21XrpModal.bind(this);
  }

  open21XrpModal() {
    this.setState({
      why21XrpModal: true
    });
  }

  closeWhy21XrpModal() {
    this.setState({
      why21XrpModal: false
    });
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

  componentDidUpdate(prevProps) {
    if (prevProps.connection.connected !== this.props.connection.connected) {
      if (this.props.connection.connected) {
        this.props.getMarketData({
          defaultFiat: this.props.defaultFiat.currency
        });

        this.props.getMarketSevens();

        this.props.getTransactions({
          address: this.props.wallet.walletAddress,
          limit: this.state.transactionLimit
        });
      }
    }
  }

  async componentDidMount() {
    if (this.props.connection.connected) {
      await this.props.getMarketSevens();
    }
    const priceChange = getPriceChange(
      this.props.marketData.market.last,
      this.props.marketData.market.open
    );
    const priceColor = getPriceColor(priceChange);

    this.setState({
      priceColor,
      priceChange
    });

    if (this.props.connection.connected) {
      await this.props.getTransactions({
        address: this.props.wallet.walletAddress,
        limit: this.state.transactionLimit
      });
    }
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
      transactions,
      connection
    } = this.props;

    const {
      isModalOpen,
      priceChange,
      priceColor,
      loadingFinished,
      why21XrpModal
    } = this.state;

    console.log('TRANS_________________', transactions);

    let totalBalance = 0;
    let xrpValue = 0;
    const { xrp } = wallet.balance;

    if (
      marketData.market !== null &&
      typeof marketData.market.last !== 'undefined'
    ) {
      const { last } = marketData.market;

      xrpValue = xrp * last;
      // const soloValue = solo * 0;

      totalBalance = xrpValue;
    }

    if (xrp === 0) {
      return (
        <div className={classes.tabContainer}>
          <p className={classes.inOrderToActivate}>
            In order to activate your XRP wallet, you must first send at{' '}
            <b>least 21 XRP</b> to this address
          </p>
          <div className={classes.actBtnContainer}>
            <button
              className={classes.actXrpWalletBtn}
              onClick={this.openAddressModal}
            >
              Activate
            </button>
          </div>
          <div className={classes.why21Link}>
            <p onClick={this.open21XrpModal}>
              Why 21 XRP <Help />
            </p>
          </div>
          <div className={classes.sendReceiveBtns}>
            <button onClick={() => console.log('receive MONEY!!!!')} disabled>
              RECEIVE
            </button>
            <button disabled className={classes.sendMoneyBtn}>
              SEND
            </button>
          </div>
          <Dialog
            open={why21XrpModal}
            classes={{ paper: classes.why21XrpModal }}
            // open
          >
            <h1 className={classes.activationSoloModalTitle}>Why 21 XRP?</h1>
            <p>
              Similar to some bank accounts, Ripple Wallets require a minimum
              balance of 20 XRP to facilitate use of the XRP Ledger.
            </p>
            <p>
              We ask you to deposit 21 XRP here instead, in order to facilitate
              the activation of your SOLO Wallet, which you can do as soon as
              your XRP Wallet is activated.
            </p>
            <div className={classes.why21dismissbtn}>
              <button onClick={this.closeWhy21XrpModal}>DISMISS</button>
            </div>
          </Dialog>
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
        </div>
      );
    }

    return (
      <div className={classes.tabContainer}>
        <p className={classes.balanceTitle}>Your Balance:</p>
        <h2 className={classes.balance}>
          {wallet.balance.xrp}
          <span> XRP</span>
        </h2>
        {connection.connected ? (
          <p className={classes.fiatValue}>
            {defaultFiat.symbol}
            {totalBalance.toFixed(2)} {defaultFiat.currency.toUpperCase()}
          </p>
        ) : (
          ''
        )}
        {xrp > 0 && xrp < 21 ? (
          <p className={classes.lowXrpMessage}>
            Your XRP balance is running low. You need XRP to pay for
            transactions fees.
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
          {this.props.connection.connected ? (
            <div className={classes.marketGraph}>
              <SevenChart
                color={priceColor}
                marketSevens={marketSevens.sevens[`xrp${defaultFiat.currency}`]}
              />

              <p style={{ color: priceColor, textAlign: 'center' }}>
                {priceChange}
              </p>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className={classes.sendReceiveBtns}>
          <button
            onClick={() =>
              this.props.history.push({
                pathname: '/receive-screen',
                state: {
                  wallet: wallet,
                  currency: 'xrp'
                }
              })
            }
          >
            RECEIVE
          </button>
          {(xrp > 0 && xrp < 21) || !this.props.connection.connected ? (
            <button disabled className={classes.sendMoneyBtn}>
              SEND
            </button>
          ) : (
            <Link
              className={classes.sendMoneyBtn}
              to={{ pathname: '/send-xrp', state: { wallet: wallet } }}
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
                  tx.specification.source.maxAmount.currency === 'XRP'
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
    connection: state.connection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getMarketData, getMarketSevens, transferXRP, getTransactions },
    dispatch
  );
}

const styles = theme => ({
  why21XrpModal: {
    background: Colors.darkerGray,
    color: 'white',
    width: '60%',
    borderRadius: 15,
    '& h1': {
      fontSize: 24,
      padding: '12px 24px'
    },
    '& p': {
      fontSize: 14,
      padding: '12px 24px'
    }
  },
  marketCircle: {
    color: Colors.lightGray
  },
  lowXrpMessage: {
    color: Colors.errorBackground,
    fontSize: 14,
    width: '60%',
    margin: '12px auto',
    textAlign: 'center'
  },
  why21dismissbtn: {
    borderTop: `1px solid ${Colors.lightGray}`,
    display: 'flex',
    justifyContent: 'flex-end',
    '& button': {
      background: 'none',
      border: 'none',
      color: Colors.lightGray,
      fontSize: 20,
      transition: '.2s',
      height: 50,
      marginRight: 15,
      cursor: 'pointer',
      '&:hover': {
        color: Colors.gray,
        transition: '.2s'
      }
    }
  },
  inOrderToActivate: {
    fontSize: 16,
    textAlign: 'center',
    width: '60%',
    margin: '0 auto 32px',
    paddingTop: 24
  },
  why21Link: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '24px 0 32px',
    '& p': {
      fontSize: 14,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textDecoration: 'underline',
      cursor: 'pointer',
      '& svg': {
        fontSize: 14,
        marginLeft: 5,
        borderRadius: '50%'
      }
    }
  },
  actXrpWalletBtn: {
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
    }
  },
  actBtnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
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
      fontSize: 16
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
    fontSize: 16,
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
      },
      '&:disabled': {
        opacity: 0.6,
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
  connect(mapStateToProps, mapDispatchToProps)(withRouter(WalletTab))
);
