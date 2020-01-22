import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader.js';

// MUI COMPONENTS
import { withStyles } from '@material-ui/core';
import Colors from '../constants/Colors.js';
import Images from '../constants/Images.js';

class SingleWalletScreen extends Component {
  render() {
    const { classes, location } = this.props;
    const { wallet } = location.state;

    console.log('Single', wallet);

    return (
      <div>
        <ScreenHeader
          showBackArrow={true}
          title={wallet.nickname}
          showSettings={false}
          dark={true}
          showWalletOptions={true}
        />
        <div className={classes.totalBalance}>
          <p>Total Balance:</p>
          <span>$0.00</span>
        </div>
        <div className={classes.singleWalletBody}>
          <div className={classes.tabsDiv}>
            <div
              className={classes.singleTab}
              onClick={() => console.log('XRP Clicked')}
            >
              <img src={Images.xrp} />
            </div>
            <div
              className={classes.singleTab}
              onClick={() => console.log('SOLO Clicked')}
            >
              <img src={Images.solo} />
            </div>
            <div
              className={classes.singleTab}
              onClick={() => console.log('TOKEN Clicked')}
            >
              <img src={Images.tokenizedAsset} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
const styles = theme => ({
  totalBalance: {
    display: 'flex',
    width: '30%',
    margin: '0 auto 12px',
    fontSize: 14,
    justifyContent: 'center',
    '& p': {
      color: Colors.lightGray,
      marginRight: 5
    }
  },
  singleWalletBody: {
    background: Colors.slabGray
  },
  tabsDiv: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  singleTab: {
    width: '33%',
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0',
    cursor: 'pointer',
    transition: '.2s',
    '& img': {
      width: 35,
      objectFit: 'contain'
    },
    '&:hover': {
      background: Colors.darkGray,
      transition: '.2s'
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(SingleWalletScreen)
);
