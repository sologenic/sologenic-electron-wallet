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
