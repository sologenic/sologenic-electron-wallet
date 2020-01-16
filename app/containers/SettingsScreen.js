import React, { Component, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Fade } from '@material-ui/core';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import ScreeHeader from '../components/shared/ScreenHeader.js';

class SettingsScreen extends Component {
  openChangeCurrencyModal() {
    console.log('DEFAULT Currency PRESSED');
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <ScreeHeader title="Settings" showSettings={false} />
        <div className={classes.settingsFields}>
          <div className={classes.inputWrapper}>
            <label>Set Default Fiat Currency</label>
            <div
              onClick={this.openChangeCurrencyModal.bind(this)}
              className={classes.dropdownCurrency}
            >
              <span>USD</span>
            </div>
          </div>
          <div className={classes.inputWrapper}>
            <label>Security</label>
            <div className={classes.dropdownCurrency}>
              <span>Change Pin</span>
            </div>
          </div>
          <div className={classes.inputWrapper}>
            <label>Legal</label>
            <div className={classes.dropdownCurrency}>
              <span>Terms & Conditions</span>
            </div>
            <div className={classes.dropdownCurrency}>
              <span>Privacy Policy</span>
            </div>
          </div>
          <div className={classes.inputWrapper}>
            <label>Support</label>
            <div className={classes.dropdownCurrency}>
              <span>Contact Us</span>
            </div>
          </div>
        </div>
      </div>
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
      paddingLeft: 24
    }
  },
  dropdownCurrency: {
    background: Colors.slabGray,
    width: '100%',
    padding: '16px 0',
    borderRadius: 25,
    marginTop: 8,
    '& span': {
      fontWeight: 300,
      padding: '0 24px'
    }
  }
});

export default withStyles(styles)(SettingsScreen);
