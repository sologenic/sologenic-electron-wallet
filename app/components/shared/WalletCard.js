import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import { Link } from 'react-router-dom';

// MUI COMPONENTS
import { withStyles, Grow } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';

// ACTIONS
import { getBalance, getMarketData } from '../../actions/index';

class WalletCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { id, walletAddress } = this.props.wallet;
    await this.props.getBalance({
      address: walletAddress,
      id
    });
    await this.props.getMarketData({
      defaultFiat: this.props.defaultCurrency.currency
    });
  }

  render() {
    const {
      classes,
      nickname,
      balance,
      defaultCurrency,
      wallet,
      marketData
    } = this.props;

    console.log('Wallet Card', this.props);

    let totalBalance = 0;

    if (typeof marketData.market.last !== 'undefined') {
      const { last } = marketData.market;
      const { xrp, solo } = wallet.balance;

      const xrpValue = xrp * last;
      const soloValue = solo * 0;

      totalBalance = xrpValue + soloValue;
    }

    return (
      <Grow in timeout={1000}>

      <div className={classes.walletCardContainer}>
        <Link
          style={{ textDecoration: 'none', color: 'white' }}
          to={{
            pathname: `/single-wallet-screen/${wallet.id}`,
            state: { walletID: wallet.id }
          }}
        >
          <div className={classes.walletCardHeader}>
            <ChevronRight classes={{ root: classes.arrow }} />
            <div className={classes.grayCircle}></div>
            <div className={classes.walletInfo}>
              <p className={classes.walletName}>{nickname}</p>
              <div className={classes.walletBalance}>
                <div className={classes.balanceLine}>
                  <span>Total Balance:</span>{' '}
                  <p>
                    ~{defaultCurrency.symbol}
                    {totalBalance.toFixed(2)}{' '}
                    {defaultCurrency.currency.toUpperCase()}
                  </p>
                </div>
                <div className={classes.balanceLine}>
                  <span>Tokenized Assets:</span>
                  <p>0</p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className={classes.walletBody}>
          <div
            className={classes.walletBodySection}
            style={{ borderRight: '1px solid gray' }}
          >
            <img src={Images.xrp} />
            <p className={balance.xrp === 0 ? classes.notActivated : ''}>
              {balance.xrp === 0 ? 'Not Activated' : `${balance.xrp} XRP`}
            </p>
          </div>
          <div className={classes.walletBodySection}>
            <img src={Images.solo} />
            <p className={balance.solo === 0 ? classes.notActivated : ''}>
              {balance.solo === 0 ? 'Not Activated' : balance.solo}
            </p>
          </div>
        </div>
      </div>
      </Grow>
    );
  }
}

function mapStateToProps(state) {
  return {
    defaultCurrency: state.defaultFiat,
    wallets: state.wallets,
    marketData: state.marketData
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getBalance, getMarketData }, dispatch);
}
const styles = theme => ({
  walletCardContainer: {
    width: '60%',
    margin: '0 auto',
    background: Colors.slabGray,
    borderRadius: 10,
    marginTop: 32,
    '&:last-of-type': {
      marginBottom: 32
    }
  },
  grayCircle: {
    height: 30,
    width: 30,
    background: Colors.lightGray,
    borderRadius: '50%'
  },
  arrow: {
    position: 'absolute',
    right: 12,
    top: 12
  },
  walletCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 12,
    position: 'relative',
    transition: '.2s',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    '&:hover': {
      background: Colors.darkGray,
      transition: '.2s'
    }
  },
  walletInfo: {
    width: '90%'
  },
  walletName: {
    fontSize: 18
  },
  balanceLine: {
    display: 'flex',
    width: '70%',
    justifyContent: 'space-between',
    fontSize: 14,
    color: Colors.lightGray,
    marginTop: 5
  },
  walletBalance: {
    marginTop: 12
  },
  walletBody: {
    display: 'flex',
    background: Colors.darkGray,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    padding: '12px 0'
  },
  walletBodySection: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& img': {
      marginBottom: 12
    }
  },
  notActivated: {
    fontSize: 12,
    color: Colors.lightGray
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(WalletCard)
);
