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

import React, { Component, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import routes from '../constants/routes.js';

// MUI IMPORTS
import { withStyles } from '@material-ui/core/styles';
import {
  CheckCircle,
  ExpandMore,
  ChevronRight,
  Warning
} from '@material-ui/icons';
import { Fade, Dialog } from '@material-ui/core';

// APP COMPONENTS
import ScreeHeader from '../components/shared/ScreenHeader.js';

// OTHER COMPONENTS
import { Link } from 'react-router-dom';

// CONSTANTS
import Colors from '../constants/Colors';
import Images from '../constants/Images';

// ACTIONS
import {
  setDefaultFiatCurrency,
  setTerms,
  setPinCode,
  fillWallets,
  cleanDefaultFiat
} from '../actions/index.js';

// STORAGE
import storage from 'electron-json-storage';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectFiatMenuOpen: false,
      selectedFiat: '',
      openResetDataModal: false,
      wrongPin: false,
      deletingInProgress: false
    };
    this.setSelectedFiat = this.setSelectedFiat.bind(this);
    this.confirmSelectedFiat = this.confirmSelectedFiat.bind(this);
    this.closeChangeCurrencyModal = this.closeChangeCurrencyModal.bind(this);
    this.openResetDataModal = this.openResetDataModal.bind(this);
    this.closeResetDataModal = this.closeResetDataModal.bind(this);
    this.confirmDeletion = this.confirmDeletion.bind(this);
  }

  openResetDataModal() {
    this.setState({
      openResetDataModal: true
    });
  }

  closeResetDataModal() {
    this.setState({
      openResetDataModal: false
    });
  }

  openChangeCurrencyModal() {
    this.setState({
      selectFiatMenuOpen: true
    });
  }

  closeChangeCurrencyModal() {
    this.setState({
      selectFiatMenuOpen: false,
      selectedFiat: ''
    });
  }

  setSelectedFiat(fiat) {
    this.setState({
      selectedFiat: fiat
    });
  }

  confirmSelectedFiat() {
    this.props.setDefaultFiatCurrency(this.state.selectedFiat);

    this.setState({ selectFiatMenuOpen: false });
  }

  async confirmDeletion() {
    const pin = this.refs.deletePin.value.trim();

    const correctPin = this.props.pinCode.pin;

    if (pin !== correctPin) {
      this.setState({
        wrongPin: true
      });
    } else {
      this.setState({
        deletingInProgress: true
      });

      await this.props.setPinCode('');
      await this.props.setTerms(false);
      await this.props.fillWallets([]);
      await this.props.cleanDefaultFiat();

      await storage.clear();

      setTimeout(() => {
        this.props.history.push('/');
      }, 2000);
    }
  }

  render() {
    const { classes, defaultFiat } = this.props;
    const {
      selectFiatMenuOpen,
      selectedFiat,
      openResetDataModal,
      wrongPin,
      deletingInProgress
    } = this.state;
    const fiats = ['usd', 'cad', 'gbp', 'eur', 'jpy', 'aed'];

    return (
      <Fade in>
        <div>
          <ScreeHeader
            title="Settings"
            showSettings={false}
            showBackArrow={true}
          />
          {selectFiatMenuOpen ? (
            <div className={classes.modalBkg}>
              <div className={classes.selectFiatMenu}>
                <p>Select Currency</p>
                <div className={classes.selectFiatContainer}>
                  {fiats.map((item, idx) => {
                    return (
                      <span
                        key={idx}
                        className={`${
                          item === selectedFiat ? classes.activeFiat : ''
                        } ${classes.singleFiat}`}
                        onClick={() => this.setSelectedFiat(item)}
                      >
                        {item.toUpperCase()}
                        {item === defaultFiat.currency ? <CheckCircle /> : ''}
                      </span>
                    );
                  })}
                </div>
                <div className={classes.btnContainers}>
                  <button
                    className={`${classes.modalBtn} ${classes.cancelBtn}`}
                    onClick={this.closeChangeCurrencyModal}
                  >
                    CANCEL
                  </button>
                  <button
                    className={`${classes.modalBtn} ${classes.confirmBtn}`}
                    onClick={this.confirmSelectedFiat}
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className={classes.settingsFields}>
            <div className={classes.inputWrapper}>
              <label>Set Default Fiat Currency</label>
              <div
                onClick={this.openChangeCurrencyModal.bind(this)}
                className={classes.dropdownCurrency}
              >
                <span>{defaultFiat.currency.toUpperCase()}</span>
                <ExpandMore />
              </div>
            </div>
            <div className={classes.inputWrapper}>
              <label>Security</label>
              <Link
                className={classes.settingsLink}
                to={routes.ChangePinScreen}
              >
                <div className={classes.dropdownCurrency}>
                  <span>Change Pin</span>
                  <ChevronRight />
                </div>
              </Link>
            </div>
            <div className={classes.inputWrapper}>
              <label>Legal</label>
              <Link
                className={classes.settingsLink}
                to={{
                  pathname: '/terms-conditions',
                  state: {
                    fromSettings: true
                  }
                }}
              >
                <div className={classes.dropdownCurrency}>
                  <span>License Agreement</span>
                  <ChevronRight />
                </div>
              </Link>
              {/* <a
                className={classes.settingsLink}
                href="https://sologenic.com/privacy-policy"
                target="_blank"
                rel="noreferrer noopener"
              >
                <div className={classes.dropdownCurrency}>
                  <span>Privacy Policy</span>
                  <ChevronRight />
                </div>
              </a> */}
            </div>
            <div className={classes.inputWrapper}>
              <label>Support</label>
              <a
                className={classes.settingsLink}
                href="https://github.com/sologenic/sologenic-electron-wallet/issues"
                target="_blank"
                rel="noreferrer noopener"
              >
                <div className={classes.dropdownCurrency}>
                  <span>Report an issue</span>
                  <ChevronRight />
                </div>
              </a>
            </div>
            <div className={classes.inputWrapper}>
              <label>Reset</label>
              <div
                className={classes.dropdownCurrency}
                onClick={this.openResetDataModal}
              >
                <span>Reset Data</span>
                <ChevronRight />
              </div>
            </div>
          </div>
          <Dialog
            open={openResetDataModal}
            classes={{ paper: classes.resetDataModal }}
          >
            <h1>Are you sure?</h1>
            <div
              className={classes.infoCompartment}
              style={{ cursor: 'pointer' }}
            >
              <p>
                Resetting your data will delete all your wallets from the
                application.
              </p>
              <Warning />
            </div>
            <div className={classes.enterPin}>
              {wrongPin ? (
                <p style={{ color: Colors.errorBackground }}>Wrong Pin</p>
              ) : (
                <p>Enter Your Pin</p>
              )}
              <input type="password" ref="deletePin" />
            </div>
            <div className={classes.confirmDeletionBtn}>
              {deletingInProgress ? (
                ''
              ) : (
                <button onClick={this.closeResetDataModal}>CANCEL</button>
              )}
              <button
                onClick={this.confirmDeletion}
                disabled={deletingInProgress}
              >
                {deletingInProgress ? 'DELETING' : 'CONFIRM'}
              </button>
            </div>
          </Dialog>
        </div>
      </Fade>
    );
  }
}

const styles = theme => ({
  settingsFields: {
    width: '95%',
    margin: '24px auto 0'
  },
  inputWrapper: {
    marginBottom: 24,
    '& label': {
      paddingLeft: 24,
      fontSize: 12
    }
  },
  infoCompartment: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px 24px',

    '& p': {
      width: '75%'
    },
    '& svg': {
      fontSize: 50,
      color: Colors.errorBackground
    }
  },
  enterPin: {
    padding: '0 24px',
    '& input': {
      marginTop: 12,
      marginBottom: 12,
      border: 'none',
      background: Colors.slabGray,
      color: 'white',
      borderRadius: 15,
      padding: 12,
      width: 150
    }
  },
  resetDataModal: {
    background: Colors.darkerGray,
    color: 'white',
    borderRadius: 15,
    width: '50%',
    '& h1': {
      fontSize: 28,
      padding: '32px 24px'
    },
    '& p': {
      fontSize: 16
    }
  },
  confirmDeletionBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: `1px solid ${Colors.gray}`,
    '& button': {
      border: 'none',
      background: 'none',
      fontSize: 18,
      marginRight: 16,
      color: Colors.freshGreen,
      cursor: 'pointer',
      height: 50,
      '&:first-of-type': {
        color: Colors.lightGray
      }
    }
  },
  modalBkg: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: 'rgba(0,0,0,.8)',
    display: 'flex',
    justifyContent: 'center'
  },
  selectFiatMenu: {
    marginTop: '25%',
    background: Colors.darkerGray,
    height: 365,
    borderRadius: 10,
    width: '70%',
    '& p': {
      padding: 16,
      paddingBottom: 0
    }
  },
  selectFiatContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '16px 0',
    padding: '0 16px'
  },
  singleFiat: {
    fontWeight: 300,
    padding: 12,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& svg': {
      color: Colors.freshGreen,
      fontSize: 16
    }
  },
  activeFiat: {
    background: Colors.slabGray,
    borderRadius: 25
  },
  btnContainers: {
    borderTop: '1px solid',
    borderColor: Colors.lightGray,
    display: 'flex',
    alignItems: 'center',
    padding: '20px 0',
    justifyContent: 'flex-end',
    paddingRight: 16,
    '& button': {
      background: 'none',
      fontSize: 14,
      border: 'none',
      cursor: 'pointer',
      '&:active': {
        outline: 'none'
      }
    }
  },
  confirmBtn: {
    color: Colors.freshGreen
  },
  cancelBtn: {
    color: Colors.lightGray,
    marginRight: 16
  },
  dropdownCurrency: {
    background: Colors.slabGray,
    width: '100%',
    padding: '8px 0',
    borderRadius: 25,
    marginTop: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& span': {
      fontWeight: 300,
      padding: '0 24px',
      fontSize: 12
    },
    '&:hover': {
      background: Colors.gray
    },
    '& svg': {
      marginRight: 16
    }
  },
  settingsLink: {
    color: 'white',
    textDecoration: 'none'
  }
});

function mapStateToProps(state) {
  return {
    defaultFiat: state.defaultFiat,
    pinCode: state.pinCode
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setDefaultFiatCurrency: setDefaultFiatCurrency,
      setPinCode: setPinCode,
      setTerms: setTerms,
      fillWallets: fillWallets,
      cleanDefaultFiat: cleanDefaultFiat
    },
    dispatch
  );
}

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
);
