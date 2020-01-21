import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader.js';
import RecoveryPhrase from '../components/shared/RecoveryPhrase';

// MUI COMPONENTS
import { withStyles } from '@material-ui/core';

class RecoveryTestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, newWallet } = this.props;

    return (
      <div>
        <ScreenHeader
          title="Recovery Phrase Test"
          showBackArrow={true}
          showSettings={false}
        />
        <RecoveryPhrase
          phrase={newWallet.newWallet.wallet.mnemonic.split(' ')}
          randomNumbers={this.props.location.state.randomNumbers}
          history={this.props.history}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    newWallet: state.newWallet
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
const styles = theme => ({});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(RecoveryTestScreen)
);
