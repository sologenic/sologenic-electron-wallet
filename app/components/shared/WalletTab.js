import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import {
  withStyles,
  Dialog,
  CircularProgress,
  Fade,
  Slide
} from '@material-ui/core';
import { Help, FileCopy } from '@material-ui/icons';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import {
  getMarketData,
  getMarketSevens,
  transferXRP,
  getTransactions,
  closeOptions
} from '../../actions/index';
import SevenChart from '../../components/shared/SevenChart';
import WalletAddressModal from './WalletAddressModal';
import { getPriceChange, getPriceColor } from '../../utils/utils2';
import TransactionSingle from './TransactionSingle';
import { format } from '../../utils/utils2';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class WalletTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      transactionLimit: 5,
      loadingFinished: true,
      why21XrpModal: false,
      showCopyNotification: false
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

  componentDidUpdate(prevProps, prevState) {
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

    if (prevState.showCopyNotification !== this.state.showCopyNotification) {
      if (this.state.showCopyNotification) {
        setTimeout(
          function() {
            this.setState({
              showCopyNotification: false
            });
          }.bind(this),
          1500
        );
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
      why21XrpModal,
      showCopyNotification
    } = this.state;

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
        <Slide in direction="up" mountOnEnter unmountOnExit>
          <div
            className={classes.tabContainer}
            onClick={() => this.props.closeOptions()}
          >
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
                There is a 20 XRP reserve requirement to activate any XRP
                wallet. Once an XRP address is funded with the 20 XRP, the
                activation fee will be locked by the XRP ledger network and is
                non-refundable and non-recoverable unless the network lowers the
                reserve requirement.
              </p>
              <p>
                In addition, the user must transfer and maintain at least 1 XRP
                to cover transaction fees for SOLO or other tokenized asset
                transactions. The current minimum transaction cost required by
                the network for a standard transaction is 0.00001 XRP (10
                drops). It sometimes increases due to higher than usual load.
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
                <CopyToClipboard
                  text={wallet.walletAddress}
                  onCopy={() => this.setState({ showCopyNotification: true })}
                >
                  <FileCopy />
                </CopyToClipboard>
                <img onClick={this.openAddressModal} src={Images.qricon} />
              </div>
            </div>
            <WalletAddressModal
              data={wallet.walletAddress}
              isModalOpen={isModalOpen}
              closeModal={this.closeAddressModal}
            />
            {showCopyNotification ? (
              <Fade in>
                <p
                  style={{
                    padding: '8px 0',
                    borderRadius: 5,
                    background: 'white',
                    boxShadow: '0 0 15px black',
                    color: 'black',
                    position: 'fixed',
                    width: 100,
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    fontSize: 12
                  }}
                >
                  Address Copied!
                </p>
              </Fade>
            ) : (
              ''
            )}
          </div>
        </Slide>
      );
    }

    return (
      <Slide in direction="up" mountOnEnter unmountOnExit>
        <div
          className={classes.tabContainer}
          onClick={() => this.props.closeOptions()}
        >
          <p className={classes.balanceTitle}>Your Balance:</p>
          <h2 className={classes.balance}>
            {format(wallet.balance.xrp, 6)}
            <span> XRP</span>
          </h2>
          {connection.connected ? (
            <p className={classes.fiatValue}>
              {defaultFiat.symbol}
              {format(totalBalance, 2)} {defaultFiat.currency.toUpperCase()}
            </p>
          ) : (
            ''
          )}
          {xrp > 0 && xrp < 21 ? (
            <p className={classes.lowXrpMessage}>
              Your XRP balance is running low. You need at least 21 XRP to pay
              for transactions fees.
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
                  marketSevens={
                    marketSevens.sevens[`xrp${defaultFiat.currency}`]
                  }
                />

                <p style={{ color: priceColor, textAlign: 'center' }}>
                  {Number.isNaN(priceChange) ? '' : priceChange}
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
              <CopyToClipboard
                text={wallet.walletAddress}
                onCopy={() => this.setState({ showCopyNotification: true })}
              >
                <FileCopy />
              </CopyToClipboard>
              <img onClick={this.openAddressModal} src={Images.qricon} />
            </div>
          </div>
          <WalletAddressModal
            data={wallet.walletAddress}
            isModalOpen={isModalOpen}
            closeModal={this.closeAddressModal}
          />
          <div className={classes.transactionsContainer}>
            {transactions.updated &&
            transactions.transactions.txs.xrpTransactions.length > 0 ? (
              <h1 style={{ marginBottom: 24 }}>Recent Transactions</h1>
            ) : (
              <h1>No recent transactions</h1>
            )}
            {transactions.updated &&
            transactions.transactions.txs.xrpTransactions.length > 0
              ? transactions.transactions.txs.xrpTransactions.map((tx, idx) => {
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
                        currency="xrp"
                      />
                    );
                  }
                })
              : ''}
            {transactions.updated &&
            transactions.transactions.txs.xrpTransactions.length > 0 ? (
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
          {showCopyNotification ? (
            <Fade in>
              <p
                style={{
                  padding: '8px 0',
                  borderRadius: 5,
                  background: 'white',
                  boxShadow: '0 0 15px black',
                  color: 'black',
                  position: 'fixed',
                  width: 100,
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  fontSize: 12
                }}
              >
                Address Copied!
              </p>
            </Fade>
          ) : (
            ''
          )}
        </div>
      </Slide>
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
    {
      getMarketData,
      getMarketSevens,
      transferXRP,
      getTransactions,
      closeOptions
    },
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
  seeQR: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 5,
    '& img': {
      width: 20,
      cursor: 'pointer'
    },
    '& svg': {
      fontSize: 15,
      cursor: 'pointer'
    }
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
    paddingTop: 24
    //
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
