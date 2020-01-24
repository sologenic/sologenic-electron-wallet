import React, { Component } from 'react';
import { generateQRCode } from '../../utils/utils2';
import { withStyles, Dialog } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Colors from '../../constants/Colors';

class WalletAddressModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null
    };
    this.closeModa = this.closeModal.bind(this);
  }

  componentDidMount() {
    const uri = generateQRCode(this.props.data);
    this.setState({
      uri
    });
  }

  closeModal() {
    console.log('Close');
  }

  render() {
    const { uri } = this.state;
    const { classes, isModalOpen, closeModal } = this.props;
    return (
      <Dialog open={isModalOpen} classes={{ paper: classes.addressModal }}>
        <Close onClick={closeModal} />
        <h1>Wallet Address</h1>
        <img src={uri} />
      </Dialog>
    );
  }
}

const styles = theme => ({
  addressModal: {
    background: Colors.darkerGray,
    padding: '25px 50px',
    position: 'relative',
    '& h1': {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 24,
      fontWeight: 300
    },
    '& img': {
      height: 'auto',
      width: 200
    },
    '& svg': {
      position: 'absolute',
      top: 20,
      right: 10,
      cursor: 'pointer',
      color: 'white',
      fontSize: 25
    }
  }
});

export default withStyles(styles)(WalletAddressModal);
