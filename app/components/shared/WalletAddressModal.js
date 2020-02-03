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
  }

  componentDidMount() {
    const uri = generateQRCode(this.props.data);
    this.setState({
      uri
    });
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
