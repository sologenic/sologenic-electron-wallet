import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles, Fade } from '@material-ui/core';
import Colors from '../constants/Colors';
import ScreenHeader from '../components/shared/ScreenHeader';

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
              Passphrase
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
          {tabOnView === 'passphrase' ? (
            <Fade in>
              <div className={classes.passphraseTab}>
                <p>
                  Enter the 12 word passphrase that was given to you when you
                  created your wallet.
                </p>
                <p>
                  You should have writte it down in a safe place upon creation
                  as prompted.
                </p>
                <textarea
                  ref="passphrase"
                  className={classes.phraseTextarea}
                  placeholder="Passphrase"
                ></textarea>
                <button>Add Wallet</button>
              </div>
            </Fade>
          ) : (
            ''
          )}
          {tabOnView === 'address-secret' ? <div>Address & Secret</div> : ''}
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
  },
  passphraseTab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 32,
    '& p': {
      fontWeight: 300,
      marginBottom: 24,
      width: '50%',
      textAlign: 'center'
    },
    '& button': {
      border: 'none',
      background: Colors.darkRed,
      borderRadius: 25,
      color: 'white',
      fontSize: 18,
      cursor: 'pointer',
      transition: '.2s',
      width: 150,
      height: 35,
      '&:hover': {
        opacity: 0.7,
        transition: '.2s'
      }
    }
  },
  phraseTextarea: {
    width: '70%',
    margin: '24px auto',
    background: 'none',
    borderBottom: '2px solid white',
    color: 'white',
    fontSize: 14,
    resize: 'none',
    border: 'none',
    '&:focus': { outline: 'none' },
    '&::placeholder': {
      fontSize: 18
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ImportWalletScreen)
);
