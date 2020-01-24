import React, { Component } from 'react';
import { withStyles, Dialog } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import ScreenHeader from '../components/shared/ScreenHeader';
import { transferXRP } from '../actions/index';

class TransferXRPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: 0,
      amountInFiat: 0,
      openValidationModal: false
    };
    this.calculateFiat = this.calculateFiat.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.startSending = this.startSending.bind(this);
    this.closeValidationModal = this.closeValidationModal.bind(this);
  }

  startSending() {
    const amount = this.state.userInput;
    const destination = this.refs.destinationAddress.value.trim();
    const tag = this.refs.destinationTag.value.trim();

    console.log('SEND XRP', this.props.location.state.wallet);

    if (amount === '' || destination === '') {
      this.setState({
        openValidationModal: true
      });
    } else {
      // console.log('SENDING');
      const { wallet } = this.props.location.state;
      const keypair = {
        privateKey: wallet.details.wallet.privateKey,
        publicKey: wallet.details.wallet.publicKey
      };
      this.props.transferXRP({
        account: wallet.walletAddress,
        keypair,
        destination: destination,
        value: amount
      });
    }
  }

  closeValidationModal() {
    this.setState({
      openValidationModal: false
    });
  }

  calculateFiat(e) {
    const text = e.currentTarget.value.trim();

    var t = text.replace(/[^0-9.]/g, '');

    const fiatPrice = Number(t) * this.props.marketData.market.last;

    console.log(fiatPrice);

    this.setState({
      userInput: t,
      amountInFiat: fiatPrice
    });
  }

  onFocus(e) {
    e.target.select();
  }

  render() {
    const { classes, location, defaultFiat } = this.props;
    const { wallet } = location.state;
    const { userInput, amountInFiat, openValidationModal } = this.state;

    return (
      <div>
        <ScreenHeader
          title="Send XRP"
          dark
          showSettings={false}
          showBackArrow
        />
        <div className={classes.balanceHeader}>
          <img src={Images.xrp} />
          <p>{wallet.balance.xrp} XRP</p>
        </div>
        <div className={classes.inputsContainer}>
          <div
            className={`${classes.amountToSend} ${classes.sendInputWrapper}`}
          >
            <label>Amount to Send</label>
            <input
              type="text"
              value={userInput}
              ref="amountToSend"
              onChange={e => this.calculateFiat(e)}
              onFocus={e => this.onFocus(e)}
            />
            <span className={classes.inputAdornment}>XRP</span>
          </div>
          <p className={classes.amountInFiat}>
            <em>~{defaultFiat.symbol}</em>
            {amountInFiat.toFixed(2)}{' '}
            <b>{defaultFiat.currency.toUpperCase()}</b>
          </p>
          <div
            className={`${classes.destinationAddress} ${classes.sendInputWrapper}`}
          >
            <label>Destination Address</label>
            <input type="text" ref="destinationAddress" />
          </div>
          <div
            className={`${classes.destinationTag} ${classes.sendInputWrapper}`}
          >
            <label>Destination Tag</label>
            <input type="text" ref="destinationTag" />
          </div>
          <div className={classes.optionalDiv}>
            <span style={{ color: Colors.freshGreen }}>Optional</span>
          </div>
        </div>
        <div className={classes.sendBtn}>
          <button onClick={this.startSending}>SEND</button>
        </div>
        <Dialog
          open={openValidationModal}
          classes={{ paper: classes.validationModal }}
        >
          <div className={classes.validationMessage}>
            <h1>Error</h1>
            <p>"Amount to Send" or "Destination Address" cannot be empty!</p>
          </div>
          <div className={classes.dismissBtn}>
            <button onClick={this.closeValidationModal}>DISMISS</button>
          </div>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    defaultFiat: state.defaultFiat,
    marketData: state.marketData
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ transferXRP }, dispatch);
}

const styles = theme => ({
  validationModal: {
    background: Colors.darkGray
  },
  validationMessage: {
    '& h1': {
      fontSize: 32,
      fontWeight: 300,
      color: 'white',
      padding: 12
    },
    '& p': {
      fontSize: 16,
      color: 'white',
      padding: 12
    }
  },
  dismissBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    borderTop: `1px solid ${Colors.gray}`,
    padding: '12px 0',
    '& button': {
      background: 'none',
      border: 'none',
      fontSize: 20,
      color: Colors.lightGray,
      marginRight: 12
    }
  },
  sendBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '70%',
    margin: '24px auto 0',
    '& button': {
      background: Colors.darkRed,
      color: 'white',
      fontSize: 20,
      borderRadius: 25,
      border: 'none',
      width: 150,
      padding: '12px 0',
      cursor: 'pointer',
      transition: '.2s',
      '&:hover': {
        opacity: 0.7,
        transition: '.2s'
      }
    }
  },
  amountInFiat: {
    width: '65%',
    margin: '12px auto 18px',
    paddingBottom: 8,
    color: Colors.gray,
    borderBottom: `3px solid ${Colors.gray}`,
    fontSize: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    '& b': {
      marginLeft: 'auto'
    },
    '& em': {
      fontStyle: 'normal'
    }
  },

  balanceHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    '& img': {
      marginRight: 10,
      width: 35,
      height: 'auto'
    },
    '& p': {
      fontSize: 28
    }
  },
  optionalDiv: {
    width: '70%',
    margin: '12px auto 0',
    '& span': {
      paddingLeft: 12
    }
  },
  sendInputWrapper: {
    background: Colors.darkGray,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
    margin: '0 auto 12px',
    padding: '16px 12px',
    borderRadius: 50,

    '& label': {
      color: Colors.lightGray,
      fontSize: 14,
      marginBottom: 10,
      paddingLeft: 12
    },
    '& input': {
      color: 'white',
      border: 'none',
      background: 'none',
      fontSize: 20,
      paddingLeft: 12,
      '&:focus': {
        outline: 'none'
      }
    },
    '& span': {
      position: 'absolute',
      top: '50%',
      right: 30,
      transform: 'translateY(-50%)',
      color: 'white',
      fontSize: 20
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(TransferXRPScreen)
);
