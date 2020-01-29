import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeModal } from '../actions/index';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader.js';
import RecoveryPhrase from '../components/shared/RecoveryPhrase';
import Modal from '../components/shared/Modal';

// MUI COMPONENTS
import { withStyles, Dialog, DialogTitle } from '@material-ui/core';

const modalContent = {
  title: 'Wallet Creation Successful',
  content: 'Activate your wallet to start sending and receiving funds.',
  button: 'View Wallets'
};

class RecoveryTestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.goToWallets = this.goToWallets.bind(this);
  }

  async goToWallets() {
    await this.props.closeModal();
    this.props.history.push('/dashboard');
  }

  render() {
    const { classes, newWallet, modal } = this.props;

    return (
      <div>
        <ScreenHeader
          title="Recovery Words Test"
          showBackArrow={true}
          showSettings={false}
        />
        <RecoveryPhrase
          phrase={newWallet.newWallet.wallet.mnemonic.split(' ')}
          randomNumbers={this.props.location.state.randomNumbers}
          history={this.props.history}
        />
        <Modal
          title={modalContent.title}
          content={modalContent.content}
          shouldShow={modal.isOpen}
          type="success"
          buttonText={modalContent.button}
          onClick={this.goToWallets}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    newWallet: state.newWallet,
    modal: state.modal
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ closeModal }, dispatch);
}
const styles = theme => ({});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(RecoveryTestScreen)
);
