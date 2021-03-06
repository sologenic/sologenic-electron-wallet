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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../constants/Colors';
import Images from '../constants/Images';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader.js';

// MUI COMPONENTS
import { withStyles } from '@material-ui/core';

// OTHER COMPONENTS
import PinInput from 'react-pin-input';

class PinScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPinWrong: false
    };
    this.checkPin = this.checkPin.bind(this);
  }

  checkPin(pin) {
    const { pinCode } = this.props;

    if (pinCode.pin !== pin) {
      this.setState({
        isPinWrong: true
      });

      this.refs.pinContainer.clear;
    } else {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    const { classes } = this.props;
    const { isPinWrong } = this.state;
    return (
      <div className={classes.pinScreenContainer}>
        <img src={Images.soloWhite} />
        <h1>Wallet</h1>
        {isPinWrong ? (
          <h2 style={{ color: Colors.errorBackground }}>Wrong PIN</h2>
        ) : (
          <h2>Enter Your PIN</h2>
        )}
        <PinInput
          length={4}
          initialValue=""
          secret
          ref={n => (n && isPinWrong ? n.clear() : '')}
          focus
          onChange={(v, i) => {}}
          type="numeric"
          onComplete={(v, i) => {
            this.checkPin(v);
          }}
          style={{
            margin: '32px auto',
            width: '40%',
            display: 'flex',
            justifyContent: 'space-between'
          }}
          inputStyle={{
            background: Colors.slabGray,
            borderRadius: 10,
            border: 'none',
            fontSize: 24,
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { pinCode } = state;
  return {
    pinCode: pinCode
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
const styles = theme => ({
  pinScreenContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& img': {
      width: 150,
      marginTop: 32,
      marginBottom: 12,
      objectFit: 'contain'
    },
    '& h1': {
      textAlign: 'center',
      fontSize: 48,
      fontWeight: 300
    },
    '& h2': {
      fontWeight: 300,
      fontSize: 16,
      marginTop: 32
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PinScreen)
);
