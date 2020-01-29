import React, { Component, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { connect } from 'react-redux';
import { ChevronRight } from '@material-ui/icons';

const labels = {
  1: 'Decentralized SOLO, XRP & Tokenized Assets Wallet',
  2: 'Add, Activate & Manage Multiple Wallets',
  3: 'Live Market Prices, Recent Transactions & More',
  4: 'Hold and Transfer all your Digital Assets from a Single Wallet'
};

class OrientationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1
    };
    this.changeStep = this.changeStep.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
  }

  changeStep() {
    let step = this.state.step;
    step++;
    if (step === 5) {
      return;
    }

    this.setState({
      step: step
    });
  }

  changeSlide(slide) {
    this.setState({
      step: slide
    });
  }

  componentDidMount() {
    const isPinSet = this.props.pinCode.pin === '' ? false : true;

    if (isPinSet) {
      this.props.history.push('/pin-screen');
    }

    // if (isPinSet) {
    //   this.props.history.push('/terms-screen');
    // }
  }

  render() {
    let { step } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.orientationScreenContainer}>
        <img
          className={`${classes.mainImg} ${step > 1 ? classes.mainImg2 : ''} ${
            step === 4 ? classes.mainImg4 : ''
          }`}
          src={`./dist/images/orientation/img${step}.png`}
        />
        <div className={classes.bottomDiv}>
          <p>{labels[step]}</p>
          <div className={classes.dotContainer}>
            <div
              className={step === 1 ? classes.activeDot : classes.notActiveDot}
              onClick={() => this.changeSlide(1)}
            ></div>
            <div
              className={step === 2 ? classes.activeDot : classes.notActiveDot}
              onClick={() => this.changeSlide(2)}
            ></div>
            <div
              className={step === 3 ? classes.activeDot : classes.notActiveDot}
              onClick={() => this.changeSlide(3)}
            ></div>
            <div
              className={step === 4 ? classes.activeDot : classes.notActiveDot}
              onClick={() => this.changeSlide(4)}
            ></div>
          </div>
          <div className={classes.getStarted}>
            <button
              className={classes.getStartedBtn}
              onClick={() => {
                this.props.history.push('/terms-conditions');
              }}
              disabled={step === 4 ? false : true}
            >
              Get Started
            </button>
            {step === 4 ? (
              ''
            ) : (
              <button onClick={this.changeStep} className={classes.nextBtn}>
                Next <ChevronRight />
              </button>
            )}
          </div>
        </div>
        <img
          className={classes.imgBg}
          src={`./dist/images/orientation/bg${step}.png`}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

const styles = theme => ({
  orientationScreenContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '100vh'
  },
  bottomDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 0 38px',
    margin: '0 auto',
    width: '60%',
    '& p': {
      textAlign: 'center',
      fontSize: 20,
      marginBottom: 20,
      width: '90%',
      lineHeight: 1.5
    }
  },
  dotContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '20%'
  },
  getStarted: {
    marginTop: 16,
    position: 'relative',
    width: '90%',
    display: 'flex',
    justifyContent: 'center'
  },
  getStartedBtn: {
    background: 'white',
    color: Colors.darkRed,
    padding: '8px 16px',
    borderRadius: 20,
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    '&:disabled': {
      opacity: 0.5
    }
  },
  nextBtn: {
    position: 'absolute',
    right: 0,
    bottom: 8,
    background: 'none',
    color: 'white',
    border: 'none',
    display: 'flex',
    fontSize: 14,
    alignItems: 'center',
    textDecoration: 'underline',
    cursor: 'pointer',
    '& svg': {
      fontSize: 14
    }
  },
  imgBg: {
    width: '100%',
    height: 'auto',
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
    left: 0
  },
  mainImg: {
    width: '40%',
    height: 'auto',
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)'
  },
  mainImg2: {
    width: '30%',
    top: 16
  },
  mainImg4: {
    width: '40%',
    top: 32
  },
  notActiveDot: {
    height: 8,
    width: 8,
    borderRadius: '50%',
    border: '1px solid white',
    background: 'none',
    cursor: 'pointer'
  },
  activeDot: {
    height: 8,
    width: 8,
    borderRadius: '50%',
    border: '1px solid white',
    background: 'white',
    cursor: 'pointer'
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, null)(OrientationScreen)
);
