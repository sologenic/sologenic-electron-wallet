import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core';
import Colors from '../../constants/Colors';
import { getMarketData, getMarketSevens } from '../../actions/index';
import SevenChart from '../../components/shared/SevenChart';

class WalletTab extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await this.props.getMarketSevens();
  }

  render() {
    const {
      tabOnView,
      classes,
      wallet,
      defaultFiat,
      marketData,
      marketSevens
    } = this.props;
    console.log('WALLET TAB XRP', this.props);

    let totalBalance = 0;

    if (typeof marketData.market.last !== 'undefined') {
      const { last } = marketData.market;
      const { xrp } = wallet.balance;

      const xrpValue = xrp * last;
      // const soloValue = solo * 0;

      totalBalance = xrpValue;
    }

    return (
      <div className={classes.tabContainer}>
        <p className={classes.balanceTitle}>Your Balance:</p>
        <h2 className={classes.balance}>
          {wallet.balance.xrp}
          <span> XRP</span>
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
              color="#FFF"
              marketSevens={marketSevens.sevens[`xrp${defaultFiat.currency}`]}
            />
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    defaultFiat: state.defaultFiat,
    marketData: state.marketData,
    marketSevens: state.marketSevens
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getMarketData, getMarketSevens }, dispatch);
}

const styles = theme => ({
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
  connect(mapStateToProps, mapDispatchToProps)(WalletTab)
);
