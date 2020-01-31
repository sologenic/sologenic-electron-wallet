import React, { Component } from 'react';
import { withStyles, Slide, Fade } from '@material-ui/core';
import Colors from '../../constants/Colors';
import moment from 'moment';
import {
  FileCopy,
  KeyboardArrowUp,
  ExpandMore,
  CallMade,
  CallReceived
} from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class TransactionSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondLineOpen: false,
      showCopyNotification: false
    };
    this.toggleSecondLine = this.toggleSecondLine.bind(this);
  }

  toggleSecondLine() {
    this.setState({
      secondLineOpen: !this.state.secondLineOpen
    });
  }

  componentDidUpdate(prevProps, prevState) {
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

  render() {
    const { classes, tx, currentLedger, currency } = this.props;

    const {
      timestamp,
      deliveredAmount,
      result,
      fee,
      ledgerVersion
    } = tx.outcome;
    const { secondLineOpen, showCopyNotification } = this.state;

    const thisWalletReceived =
      tx.specification.destination.address === this.props.address
        ? true
        : false;
    const otherAddress =
      tx.specification.destination.address === this.props.address
        ? tx.specification.source.address
        : tx.specification.destination.address;

    const datetime = moment(timestamp)
      .format('L.LT')
      .split('.');
    const date = datetime[0];
    const time = datetime[1];

    let status;
    let statusColor;
    let newFontSize;
    let currencyName =
      tx.specification.source.maxAmount.currency === 'XRP'
        ? 'XRP'
        : tx.specification.source.maxAmount.currency ===
          '534F4C4F00000000000000000000000000000000'
        ? 'Ƨ'
        : '';

    if (tx.specification.source.maxAmount.value.length <= 4) {
      newFontSize = 16;
    } else if (
      tx.specification.source.maxAmount.value.length > 4 &&
      tx.specification.source.maxAmount.value.length < 7
    ) {
      newFontSize = 14;
    } else if (tx.specification.source.maxAmount.value.length >= 7) {
      newFontSize = 12;
    }

    switch (result) {
      case 'tesSUCCESS':
        status = 'Completed';
        statusColor = Colors.freshGreen;
        break;
      case 'tecUNFUNDED_PAYMENT':
        status = 'Failed';
        statusColor = Colors.errorBackground;
        break;
      case 'tecPATH_DRY':
        status = 'Failed';
        statusColor = Colors.errorBackground;
        break;
      case 'tecPATH_PARTIAL':
        status = 'Failed';
        statusColor = Colors.errorBackground;
        break;
      default:
        status = 'Failed';
        statusColor = Colors.errorBackground;
    }

    return (
      <Slide in direction="right" mountOnEnter unmountOnExit>
        <div
          className={classes.txWrapper}
          onClick={() => this.toggleSecondLine()}
          style={{ cursor: 'pointer' }}
        >
          <div className={classes.firstLine}>
            {secondLineOpen ? (
              <KeyboardArrowUp
                // onClick={() => this.toggleSecondLine()}
                classes={{ root: classes.expandIcon }}
              />
            ) : (
              <ExpandMore classes={{ root: classes.expandIcon }} />
            )}
            <div className={classes.timeContainer}>
              <span
                className={classes.circle}
                style={{ background: statusColor }}
              ></span>
              <section>
                <span>{date}</span>
                <span>{time}</span>
              </section>
            </div>
            <div className={classes.amount}>
              <p style={{ color: 'white', fontSize: newFontSize }}>
                <span style={{ fontSize: 12, color: Colors.lightGray }}>
                  {thisWalletReceived ? '+' : '-'}
                  {currencyName}
                </span>{' '}
                {!thisWalletReceived && currency === 'solo'
                  ? tx.specification.source.maxAmount.value
                  : !thisWalletReceived && currency === 'xrp'
                  ? tx.specification.source.maxAmount.value
                  : thisWalletReceived
                  ? tx.outcome.deliveredAmount.value
                  : ''}{' '}
                {thisWalletReceived ? (
                  <CallReceived
                    style={{ color: Colors.lightGray, fontSize: 12 }}
                  />
                ) : (
                  <CallMade style={{ color: Colors.lightGray, fontSize: 12 }} />
                )}
              </p>
            </div>
            <div
              className={classes.status}
              style={{ justifyContent: 'flex-end' }}
            >
              <p style={{ color: statusColor, marginRight: 40 }}>{status}</p>
            </div>
          </div>
          {secondLineOpen ? (
            <div className={classes.secondLine} style={{ height: 50 }}>
              <div className={classes.confirmations}>
                <span>Confirmations</span>
                <b>{currentLedger - ledgerVersion}</b>
              </div>
              <div className={classes.fee}>
                {!thisWalletReceived && status !== 'Failed' ? (
                  <section>
                    <span>Tx Fee</span>
                    <b>
                      <span style={{ color: Colors.lightGray, fontSize: 10 }}>
                        XRP
                      </span>
                      {fee}
                    </b>
                  </section>
                ) : (
                  ''
                )}
              </div>
              <div className={classes.burnAmount}>
                {!thisWalletReceived && currency === 'solo' ? (
                  <section>
                    <span>Burn Amount</span>
                    <b>
                      <span style={{ color: Colors.lightGray, fontSize: 10 }}>
                        Ƨ
                      </span>
                      {Number(
                        tx.outcome.deliveredAmount
                          ? Number(tx.specification.source.maxAmount.value) *
                              0.0001
                          : ''
                      )}
                    </b>
                  </section>
                ) : (
                  ''
                )}
              </div>
            </div>
          ) : (
            ''
          )}
          {secondLineOpen ? (
            <div className={`${classes.secondLine} ${classes.thirdLine}`}>
              <CopyToClipboard
                text={otherAddress}
                onCopy={() => this.setState({ showCopyNotification: true })}
              >
                <div className={classes.copyAddress}>
                  <section>
                    <span>Copy Address</span> <FileCopy />
                  </section>
                </div>
              </CopyToClipboard>
              <CopyToClipboard
                text={tx.id}
                onCopy={() => this.setState({ showCopyNotification: true })}
              >
                <div
                  className={classes.copyAddress}
                  style={{
                    borderLeft: `1px solid ${Colors.lightGray}`,
                    borderRight: `1px solid ${Colors.lightGray}`
                  }}
                >
                  <section>
                    <span>Copy TX ID</span> <FileCopy />
                  </section>
                </div>
              </CopyToClipboard>
              <div className={classes.confirmations}>
                <a
                  href={`https://bithomp.com/explorer/${tx.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'white', fontSize: 14 }}
                >
                  View on Bithomp
                </a>
              </div>
            </div>
          ) : (
            ''
          )}
          {showCopyNotification ? (
            <Fade in>
              <p
                style={{
                  padding: '8px 0',
                  borderRadius: 5,
                  background: 'white',
                  boxShadow: '0 0 15px black',
                  color: 'black',
                  position: 'absolute',
                  width: 100,
                  bottom: 0,
                  fontSize: 12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center'
                }}
              >
                Copied!
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

const styles = theme => ({
  txWrapper: {
    background: Colors.slabGray,
    borderRadius: 25,
    padding: 6,
    position: 'relative',
    marginBottom: 12,
    width: '70%'
  },
  expandIcon: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  copyAddress: {
    '& section': {
      border: '1px solid white',
      borderRadius: 25,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 6,

      '& span': {
        fontSize: 12,
        marginRight: 5
      },
      '& svg': {
        fontSize: 8
      }
    }
  },
  confirmations: {
    flexDirection: 'column',
    padding: '6px 0',

    '& span': {
      fontSize: 12
    },
    '& p': {
      fontSize: 14
    }
  },
  fee: {
    display: 'flex',
    flexDirection: 'column',
    borderLeft: `1px solid ${Colors.lightGray}`,
    borderRight: `1px solid ${Colors.lightGray}`,
    justifyContent: 'center',
    alignItems: 'center',
    '& span': {
      fontSize: 12
    },
    '& b': {
      fontSize: 14,
      marginTop: 5
    },
    '& section': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  burnAmount: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& span': {
      fontSize: 12
    },
    '& b': {
      fontSize: 14,
      marginTop: 5
    },
    '& section': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  amount: {
    borderLeft: `1px solid ${Colors.lightGray}`,
    borderRight: `1px solid ${Colors.lightGray}`,
    '& p': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& svg': {
        fontSize: 16,
        marginLeft: 2
      },
      '& span': {
        marginRight: 2
      }
    }
  },
  firstLine: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    '& div': {
      width: '33%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  secondLine: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    '& div': {
      width: '33%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  thirdLine: {},
  timeContainer: {
    display: 'flex',
    alignItems: 'center',
    '& section': {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: 5,
      '& span': {
        fontSize: 14
      }
    }
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: '50%'
  }
});

export default withStyles(styles)(TransactionSingle);
