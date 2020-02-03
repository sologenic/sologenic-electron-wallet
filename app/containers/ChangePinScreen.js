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
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import Colors from '../constants/Colors.js';
import Images from '../constants/Images';
import { withStyles } from '@material-ui/core';
import ScreenHeader from '../components/shared/ScreenHeader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PinInput from 'react-pin-input';
import { changingPin } from '../actions/index';

class ChangePinScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { isPinWrong: false };
    this.checkPin = this.checkPin.bind(this);
  }

  checkPin(pin) {
    const { pinCode } = this.props;
    if (pinCode.pin !== pin) {
      this.setState({
        isPinWrong: true
      });
      this.pin.clear();
    } else {
      this.props.changingPin(true);
      this.props.history.push('/set-pin-screen');
    }
  }

  render() {
    const { isPinWrong } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.changePinScreenContainer}>
        <ScreenHeader
          title="Change Pin"
          showSettings={false}
          showBackArrow={true}
        />
        <h2>{isPinWrong ? 'Wrong PIN' : 'Enter Your Current PIN'}</h2>
        <PinInput
          length={4}
          initialValue=""
          secret
          focus
          onChange={(v, i) => {}}
          type="numeric"
          onComplete={(v, i) => {
            this.checkPin(v);
          }}
          ref={p => (this.pin = p)}
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
  return {
    pinCode: state.pinCode
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changingPin: changingPin }, dispatch);
}

const styles = theme => ({
  changePinScreenContainer: {
    '& h2': {
      textAlign: 'center',
      fontWeight: 300,
      fontSize: 18,
      marginTop: 32
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ChangePinScreen)
);
