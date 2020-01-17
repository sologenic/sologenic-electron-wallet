import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import Colors from '../constants/Colors.js';
import Images from '../constants/Images';
import { withStyles } from '@material-ui/core';
import ScreenHeader from '../components/shared/ScreenHeader';

class ChangePinScreen extends Component {
  render() {
    return <ScreenHeader title="Change Pin" showSettings={false} />;
  }
}

const styles = theme => ({});

export default withStyles(styles)(ChangePinScreen);
