import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles, Dialog, CircularProgress, Fade } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import { Link, withRouter } from 'react-router-dom';
import {
  getMarketData,
  getMarketSevens,
  createTrustlineRequest,
  getTransactions,
  getSoloPrice,
  cleanTrustlineError
} from '../../actions/index';
import SevenChart from '../../components/shared/SevenChart';
import WalletAddressModal from './WalletAddressModal';
import { getPriceChange, getPriceColor } from '../../utils/utils2';
import TransactionSingle from './TransactionSingle';
import { decrypt } from '../../utils/encryption';
import { format } from '../../utils/utils2';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class WalletSoloTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      activationSoloModal: false,
      activationSoloModalFirst: false,
      loadingFinished: true,
      transactionLimit: 5,
      showCopyNotification: false
    };
    this.openAddressModal = this.openAddressModal.bind(this);
    this.closeAddressModal = this.closeAddressModal.bind(this);
    this.activateSoloWalletModalFirst = this.activateSoloWalletModalFirst.bind(
      this
    );
    this.loadMore = this.loadMore.bind(this);
    this.confirmStartActivation = this.confirmStartActivation.bind(this);
    this.cancelConfirmActivation = this.cancelConfirmActivation.bind(this);
    this.closeTrustlineErrorModal = this.closeTrustlineErrorModal.bind(this);
  }

  cancelConfirmActivation() {
    this.setState({
      activationSoloModalFirst: false
    });
  }

  closeTrustlineErrorModal() {
    this.props.cleanTrustlineError();

    this.setState({
      activationSoloModal: false
    });
  }

  confirmStartActivation() {
    this.setState({
      activationSoloModal: true,
      activationSoloModalFirst: false
    });
    this.activateSoloWallet();
  }

  activateSoloWalletModalFirst() {
    this.setState({
      activationSoloModalFirst: true
    });

    // this.activateSoloWallet();
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

    await this.props.getSoloPrice();

    this.soloInterval = setInterval(async () => {
      await this.props.getSoloPrice();
    }, 10000);

    await this.props.getTransactions({
      address: this.props.wallet.walletAddress,
      limit: this.state.transactionLimit
    });
  }

  componentWillUnmount() {
    clearInterval(this.soloInterval);
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

        this.props.getSoloPrice();
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

    const pass = this.refs.activateSoloPass.value.trim();

    const salt = wallet.details.walletSalt;

    const secret = wallet.details.wallet.secret
      ? wallet.details.wallet.secret
      : '';

    const keypair = {
      privateKey:
        typeof wallet.details.wallet.privateKey === 'undefined'
          ? undefined
          : wallet.details.wallet.privateKey,
      publicKey:
        typeof wallet.details.wallet.publicKey === 'undefined'
          ? undefined
          : wallet.details.wallet.publicKey
    };

    const secretDecrypted =
      secret === '' ? '' : decrypt(secret, salt, wallet.walletAddress, pass);

    const privateKeyDecrypted =
      typeof keypair.privateKey === 'undefined'
        ? undefined
        : decrypt(keypair.privateKey, salt, wallet.walletAddress, pass);
    // const { privateKey, publicKey, secret } = wallet.details.wallet;
    // const { walletSalt } = wallet.details;
    // const keypair = {
    //   privateKey,
    //   publicKey
    // };

    this.setState({
      activationSoloModal: true
    });

    await this.props.createTrustlineRequest({
      address: wallet.walletAddress,
      secret: secretDecrypted,
      keypair: {
        publicKey: keypair.publicKey,
        privateKey: privateKeyDecrypted
      },
      id: wallet.id
    });
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
      connection,
      soloPrice,
      trustlineError
    } = this.props;

    const {
      isModalOpen,
      priceChange,
      priceColor,
      activationSoloModal,
      loadingFinished,
      activationSoloModalFirst,
      showCopyNotification
    } = this.state;

    let totalBalance = 0;

    if (soloPrice.price !== null) {
      const price = soloPrice.price[defaultFiat.currency];
      const { solo } = wallet.balance;

      const soloValue = solo * price;
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
              onClick={this.activateSoloWalletModalFirst}
              disabled={wallet.balance.xrp >= 21 ? false : true}
            >
              Activate
            </button>
          </div>
          <div className={classes.sendReceiveBtns}>
            <button disabled>RECEIVE</button>
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
          <Dialog
            open={activationSoloModalFirst}
            classes={{ paper: classes.activationSoloModalPaper }}
            // open
          >
            <h1 className={classes.activationSoloModalTitle}>
              Type your Wallet Password
            </h1>
            <div className={classes.activationSoloModalBody}>
              <input type="password" ref="activateSoloPass" />
            </div>
            <div className={classes.confirmActivationBtnContainer}>
              <button onClick={this.cancelConfirmActivation}>CANCEL</button>
              <button onClick={this.confirmStartActivation}>SUBMIT</button>
            </div>
          </Dialog>

          <Dialog
            open={activationSoloModal}
            classes={{ paper: classes.activationSoloModalPaper }}
          >
            <h1 className={classes.activationSoloModalTitle}>
              Activating SOLO...
            </h1>
            <div className={classes.activationSoloModalBody}>
              <span>Please wait</span>
              <CircularProgress
                classes={{
                  circle: classes.activatinSoloCircle,
                  root: classes.rootCircle
                }}
              />
            </div>
          </Dialog>

          <Dialog
            open={trustlineError.error}
            classes={{ paper: classes.activationSoloModalPaper }}
            // open
          >
            <h1 className={classes.activationSoloModalTitle}>Error</h1>
            <div className={classes.activationSoloModalBody}>
              <p style={{ color: 'white', padding: '0 24px 32px' }}>
                {trustlineError.reason}
              </p>
            </div>
            <div className={classes.confirmActivationBtnContainer}>
              <button onClick={this.closeTrustlineErrorModal}>DISMISS</button>
            </div>
          </Dialog>
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
      );
    }

    return (
      <div className={classes.tabContainer}>
        <p className={classes.balanceTitle}>Your Balance:</p>
        <h2 className={classes.balance}>
          {format(wallet.balance.solo, 4)}
          <span> SOLO</span>
        </h2>
        {connection.connected && soloPrice.price !== null ? (
          <p className={classes.fiatValue}>
            {defaultFiat.symbol}
            {format(totalBalance, 2)} {defaultFiat.currency.toUpperCase()}
          </p>
        ) : (
          ''
        )}
        <div className={classes.marketInfo}>
          <div className={classes.marketPrice}>
            <p>Market Price:</p>
            {soloPrice.price === null || !connection.connected ? (
              <CircularProgress
                size={20}
                classes={{
                  circle: classes.marketCircle
                }}
              />
            ) : (
              <span>
                {defaultFiat.symbol}
                {soloPrice.price[defaultFiat.currency]}{' '}
                {defaultFiat.currency.toUpperCase()}
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
          {transactions.updated && transactions.transactions.txs.length > 0 ? (
            <h1 style={{ marginBottom: 24 }}>Recent Transactions</h1>
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
                      currency="solo"
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
    connection: state.connection,
    soloPrice: state.soloPrice,
    trustlineError: state.trustlineError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getMarketData,
      getMarketSevens,
      createTrustlineRequest,
      getTransactions,
      getSoloPrice,
      cleanTrustlineError
    },
    dispatch
  );
}

const styles = theme => ({
  activationSoloModalPaper: {
    background: Colors.darkerGray,
    borderRadius: 15,
    // padding: 35,
    width: '60%',
    '& h1': {
      fontSize: 24,
      textAlign: 'center',
      color: 'white',
      fontWeight: 300,
      padding: '32px 24px'
    }
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
    },
    '& input': {
      background: Colors.slabGray,
      border: 'none',
      borderRadius: 25,
      height: 50,
      padding: '0 16px',
      color: 'white',
      fontSize: 16,
      width: '60%',
      marginBottom: 32,
      '&:focus': {
        outline: 'none'
      }
    }
  },
  confirmActivationBtnContainer: {
    height: 50,
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: `1px solid ${Colors.lightGray}`,
    '& button': {
      border: 'none',
      background: 'none',
      color: Colors.freshGreen,
      fontSize: 20,
      cursor: 'pointer',
      marginRight: 15,
      '&:first-of-type': {
        color: Colors.lightGray
      }
    }
  },
  activatinSoloCircle: {
    color: Colors.darkRed
  },
  rootCircle: {
    marginBottom: 24
  },
  walletFunctions: {
    background: Colors.darkerGray,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24
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
