import React, { Component, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import ScreeHeader from '../components/shared/ScreenHeader.js';

class HomeScreen extends Component {
  render() {
    return (
      <div>
        <ScreeHeader title="Your Wallets" showSettings={true} />
        <h1>Hello</h1>
      </div>
    );
  }
}

const styles = theme => ({});

export default withStyles(styles)(HomeScreen);
