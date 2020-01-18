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
        <h2>{isPinWrong ? 'Wrong PIN' : 'Enter Your PIN'}</h2>
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
          style={{
            margin: '32px auto',
            width: '70%',
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
