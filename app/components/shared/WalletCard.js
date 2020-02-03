//     Sologenic Wallet, Decentralized Wallet. Copyright (C) 2020 Sologenic

//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import { Link } from 'react-router-dom';

// MUI COMPONENTS
import { withStyles, Grow, CircularProgress } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';

// ACTIONS
import { getBalance, getMarketData, getSoloPrice } from '../../actions/index';

// UTILS
import { format } from '../../utils/utils2';

class WalletCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { id, walletAddress } = this.props.wallet;

    if (this.props.connection.connected) {
      await this.props.getBalance({
        address: walletAddress,
        id
      });

      await this.props.getMarketData({
        defaultFiat: this.props.defaultCurrency.currency
      });

      await this.props.getSoloPrice();

      this.fetchMarketPrices = setInterval(async () => {
        await this.props.getMarketData({
          defaultFiat: this.props.defaultCurrency.currency
        });

        await this.props.getSoloPrice();
      }, 10000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.fetchMarketPrices);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.connection.connected !== this.props.connection.connected) {
      if (this.props.connection.connected) {
        this.props.getMarketData({
          defaultFiat: this.props.defaultCurrency.currency
        });

        this.props.getBalance({
          address: this.props.wallet.walletAddress,
          id: this.props.wallet.id
        });

        this.props.getSoloPrice();
      }
    }
  }

  render() {
    const {
      classes,
      nickname,
      balance,
      defaultCurrency,
      wallet,
      marketData,
      connection,
      soloPrice
    } = this.props;

    let totalBalance = { balance: 0, updated: false };

    if (
      marketData.market !== null &&
      typeof marketData.market.last !== 'undefined' &&
      soloPrice.price !== null
    ) {
      const { last } = marketData.market;
      const { xrp, solo } = wallet.balance;
      const price = soloPrice.price[defaultCurrency.currency];

      const xrpValue = xrp * last;
      let soloValue;
      if (typeof solo === 'undefined') {
        soloValue = 0;
      } else {
        soloValue = solo * price;
      }

      totalBalance = { balance: xrpValue + soloValue, updated: true };
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
                    {!marketData.updated ||
                    !connection.connected ||
                    soloPrice.price === null ? (
                      <CircularProgress
                        size={15}
                        classes={{ circle: classes.totalBalanceCircle }}
                      />
                    ) : totalBalance.updated ? (
                      <p>
                        {defaultCurrency.symbol}
                        {format(totalBalance.balance, 2)}{' '}
                        {defaultCurrency.currency.toUpperCase()}
                      </p>
                    ) : (
                      ''
                    )}
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
                {balance.xrp === 0
                  ? 'Not Activated'
                  : `${format(balance.xrp, 6)} XRP`}
              </p>
            </div>
            <div className={classes.walletBodySection}>
              <img src={Images.solo} />
              <p className={!wallet.trustline ? classes.notActivated : ''}>
                {!wallet.trustline
                  ? 'Not Activated'
                  : `${format(balance.solo, 6)} SOLO`}
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
    marketData: state.marketData,
    connection: state.connection,
    soloPrice: state.soloPrice
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getBalance, getMarketData, getSoloPrice },
    dispatch
  );
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
    background: 'transparent',
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
  totalBalanceCircle: {
    color: Colors.lightGray
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
      marginBottom: 12,
      width: 35
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
