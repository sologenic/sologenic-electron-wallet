import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles, Fade } from '@material-ui/core';
import Colors from '../constants/Colors';
import ScreenHeader from '../components/shared/ScreenHeader';
import PassphraseTab from './PassphraseTab';
import WalletAndAddressTab from './WalletAndAddressTab';

class ImportWalletScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabOnView: 'passphrase'
    };

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab(tab) {
    this.setState({
      tabOnView: tab
    });
  }

  render() {
    const { classes } = this.props;
    const { tabOnView } = this.state;
    return (
      <Fade in>
        <div>
          <ScreenHeader
            title="Import Existing Wallet"
            showBackArrow
            showSettings={false}
          />
          <div className={classes.importTabs}>
            <div
              onClick={() => this.changeTab('passphrase')}
              className={tabOnView === 'passphrase' ? classes.activeTab : ''}
            >
              Recovery Words
            </div>
            <div
              onClick={() => this.changeTab('address-secret')}
              className={
                tabOnView === 'address-secret' ? classes.activeTab : ''
              }
            >
              Wallet Address + Secret
            </div>
          </div>
          {tabOnView === 'passphrase' ? <PassphraseTab /> : ''}
          {tabOnView === 'address-secret' ? <WalletAndAddressTab /> : ''}
        </div>
      </Fade>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

const styles = themes => ({
  importTabs: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& div': {
      width: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '18px 0',
      cursor: 'pointer',
      transition: '.2s',
      '&:hover': {
        background: Colors.darkerGray,
        transition: '.2s'
      }
    }
  },
  activeTab: {
    borderBottom: '3px solid white'
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ImportWalletScreen)
);
