import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import ScreenHeader from '../components/shared/ScreenHeader';

class TermsScreen extends Component {
  render() {
    return (
      <div>
        <ScreenHeader title="Terms & Conditions" showSettings={false} />
        <h1>Hello!</h1>
      </div>
    );
  }
}

const styles = theme => ({});

export default withStyles(styles)(TermsScreen);
