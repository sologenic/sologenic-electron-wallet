import React, { Component } from 'react';
import { withStyles, Slide } from '@material-ui/core';
import Colors from '../../constants/Colors';
import moment from 'moment';
import { FileCopy, KeyboardArrowUp, ExpandMore } from '@material-ui/icons';

class TransactionSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondLineOpen: false
    };
    this.toggleSecondLine = this.toggleSecondLine.bind(this);
  }

  toggleSecondLine() {
    console.log('Expand');
    this.setState({
      secondLineOpen: !this.state.secondLineOpen
    });
  }

  render() {
    const { classes, tx } = this.props;
    const {
      timestamp,
      deliveredAmount,
      result,
      fee,
      ledgerVersion
    } = tx.outcome;
    const { secondLineOpen } = this.state;

    const datetime = moment(timestamp)
      .format('L.LT')
      .split('.');
    const date = datetime[0];
    const time = datetime[1];

    let status;
    let statusColor;

    switch (result) {
      case 'tesSUCCESS':
        status = 'Completed';
        statusColor = Colors.freshGreen;
        break;
      case 'tecUNFUNDED_PAYMENT':
        status = 'Failed';
        statusColor = Colors.errorBackground;
        break;
    }

    return (
      <Slide in direction="right" mountOnEnter unmountOnExit>
        <div className={classes.txWrapper}>
          <div className={classes.firstLine}>
            {secondLineOpen ? (
              <KeyboardArrowUp
                onClick={() => this.toggleSecondLine()}
                classes={{ root: classes.expandIcon }}
              />
            ) : (
              <ExpandMore
                onClick={() => this.toggleSecondLine()}
                classes={{ root: classes.expandIcon }}
              />
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
              <p style={{ color: statusColor }}>
                {tx.specification.source.maxAmount.currency}{' '}
                {tx.specification.source.maxAmount.value}
              </p>
            </div>
            <div className={classes.status}>
              <p style={{ color: statusColor }}>{status}</p>
            </div>
          </div>
          {secondLineOpen ? (
            <div className={classes.secondLine}>
              <div className={classes.confirmations}>
                <span>Confirmations</span>
                <b>{ledgerVersion}</b>
              </div>
              <div className={classes.fee}>
                <span>Fee</span>
                <b>{fee}</b>
              </div>
              <div className={classes.copyAddress}>
                <section>
                  <span>Copy Address</span> <FileCopy />
                </section>
              </div>
            </div>
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
    '& span': {
      fontSize: 12
    },
    '& p': {
      fontSize: 14
    }
  },
  amount: {
    borderLeft: `1px solid ${Colors.lightGray}`,
    borderRight: `1px solid ${Colors.lightGray}`
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
