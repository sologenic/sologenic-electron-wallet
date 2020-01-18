import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../constants/Colors';

// ACTIONS
import { setPinCode } from '../actions/index.js';

// APP COMPONENTS
import ScreenHeader from '../components/shared/ScreenHeader.js';

// MUI COMPONENTS
import { withStyles } from '@material-ui/core';

// OTHER COMPONENTS
import PinInput from 'react-pin-input';
import { ArrowBack, Cancel, CheckCircle } from '@material-ui/icons';
import storage from 'electron-json-storage';

class SetPinScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstPin: '',
      firstPinSet: false,
      pinsMatch: '',
      showNotMatch: false,
      showSuccesfulText: false
    };

    this.setFirstPin = this.setFirstPin.bind(this);
    this.setSecondPin = this.setSecondPin.bind(this);
    this.goBackToFirstPin = this.goBackToFirstPin.bind(this);
  }

  setFirstPin(pin) {
    this.setState({
      firstPin: pin,
      firstPinSet: true
    });
    this.pin.clear();
  }

  setSecondPin(pin) {
    let pinsMatch = this.state.firstPin === pin ? true : false;

    if (!pinsMatch) {
      this.setState({
        pinsMatch: false,
        firstPin: '',
        showNotMatch: true,
        firstPinSet: false
      });
    } else {
      this.setState({
        pinsMatch: true,
        showSuccesfulText: true
      });
      this.props.setPinCode(pin);
      storage.set('pincode', { pin: pin }, function(err) {
        if (err) {
          console.log(err);
        }
      });

      setTimeout(() => this.props.history.push('/dashboard'), 3000);
    }
  }

  goBackToFirstPin() {
    this.setState({
      firstPin: '',
      firstPinSet: false,
      showNotMatch: false
    });
  }

  render() {
    const { firstPinSet, showNotMatch, showSuccesfulText } = this.state;
    const { classes, isPinChanging } = this.props;

    if (!firstPinSet) {
      return (
        <div>
          <ScreenHeader
            title="Create a PIN"
            showSettings={false}
            showBackArrow={isPinChanging.changing ? true : false}
          />
          {showNotMatch ? (
            <span className={classes.notMatchError}>
              PINs Did Not Match <Cancel />
            </span>
          ) : (
            ''
          )}
          <PinInput
            length={4}
            initialValue=""
            secret
            focus
            onChange={(v, i) => {
              console.log(v);
            }}
            type="numeric"
            onComplete={(v, i) => {
              this.setFirstPin(v);
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
    } else if (firstPinSet) {
      return (
        <div>
          <div className={classes.headerWrapper}>
            {showSuccesfulText ? (
              <span />
            ) : (
              <ArrowBack
                onClick={this.goBackToFirstPin}
                style={{ cursor: 'pointer' }}
              />
            )}
            <h1>Confirm Your Pin</h1>
            <span />
          </div>
          {showSuccesfulText ? (
            <span className={classes.succesfulText}>
              PIN Succesfully created <CheckCircle />
            </span>
          ) : (
            <PinInput
              length={4}
              initialValue=""
              secret
              focus
              onChange={(v, i) => {}}
              type="numeric"
              onComplete={(v, i) => {
                this.setSecondPin(v);
              }}
              ref={p => (this.pin = p)}
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
          )}
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  const { router } = state;
  return {
    isPinChanging: state.isPinChanging
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setPinCode: setPinCode }, dispatch);
}
const styles = theme => ({
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    background: Colors.headerBackground,
    '& h1': {
      fontSize: 20,
      fontWeight: 300,
      textAlign: 'center',
      width: '50%'
    },
    '& img': {
      width: 20,
      height: 'auto'
    }
  },
  link: {
    color: 'white',
    transition: '.5s',
    '&:hover': {
      color: Colors.lightGray,
      transition: '.5s'
    }
  },
  notMatchError: {
    color: Colors.errorBackground,
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    justifyContent: 'center',
    marginTop: 16,
    '& svg': {
      marginLeft: 5,
      fontSize: 16
    }
  },
  succesfulText: {
    color: Colors.freshGreen,
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    justifyContent: 'center',
    marginTop: 32,
    '& svg': {
      marginLeft: 5,
      fontSize: 16
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(SetPinScreen)
);
