import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Colors from '../../constants/Colors';
import moment from 'moment';

class TransactionSingle extends Component {
  render() {
    const { classes, tx } = this.props;
    const { timestamp, deliveredAmount } = tx.outcome;

    const datetime = moment(timestamp)
      .format('L.LT')
      .split('.');
    const date = datetime[0];
    const time = datetime[1];

    return (
      <div className={classes.txWrapper}>
        <div className={classes.timeContainer}>
          <span>{date}</span>
          <span>{time}</span>
        </div>
        <div className={classes.amount}>{}</div>
      </div>
    );
  }
}

const styles = theme => ({});

export default withStyles(styles)(TransactionSingle);
