import React, { Component } from 'react';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import { Error } from '@material-ui/icons';
import ScreenHeader from '../components/shared/ScreenHeader';
import { withStyles, Fade } from '@material-ui/core';
import { generateQRCode } from '../utils/utils2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FileCopy } from '@material-ui/icons';

class ReceiveScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: '',
      showCopyNotification: false
    };
  }

  componentDidMount() {
    const uri = generateQRCode(this.props.location.state.wallet.walletAddress);
    this.setState({
      uri
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showCopyNotification !== this.state.showCopyNotification) {
      if (this.state.showCopyNotification) {
        setTimeout(
          function() {
            this.setState({
              showCopyNotification: false
            });
          }.bind(this),
          1500
        );
      }
    }
  }

  render() {
    const { location, classes } = this.props;
    const { uri, showCopyNotification } = this.state;
    const { wallet } = location.state;

    const img =
      location.state.currency === 'xrp'
        ? Images.xrp
        : location.state.currency === 'solo'
        ? Images.solo
        : Images.tokenizedAsset;

    return (
      <Fade in>
        <div>
          <ScreenHeader
            title={`Receive ${location.state.currency.toUpperCase()}`}
            showBackArrow
          />
          <div className={classes.walletBalanceContainer}>
            <img src={img} />
            <div className={classes.walletBalance}>
              <p>
                {wallet.balance[location.state.currency]}{' '}
                {location.state.currency.toUpperCase()}
              </p>
            </div>
          </div>
          <div className={classes.qrCodeContainer}>
            <img src={uri} />
          </div>
          <div className={classes.walletAddress}>
            <div className={classes.walletAddressContainer}>
              <label>Wallet Address</label>
              <input
                type="text"
                readOnly
                value={location.state.wallet.walletAddress}
              />
            </div>
            <CopyToClipboard
              text={location.state.wallet.walletAddress}
              onCopy={() => this.setState({ showCopyNotification: true })}
            >
              <FileCopy />
            </CopyToClipboard>
          </div>
          <div className={classes.warningContainer}>
            <Error />
            <p>
              Sending {location.state.currency.toUpperCase()} to any other
              address than the one shown will result in your{' '}
              {location.state.currency.toUpperCase()} to be lost forever.
              Please, make sure you double-check the copied address.
            </p>
          </div>
          {showCopyNotification ? (
            <Fade in>
              <p
                style={{
                  padding: '24px 0',
                  borderRadius: 5,
                  background: 'white',
                  boxShadow: '0 0 15px black',
                  color: 'black',
                  position: 'absolute',
                  width: 150,
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center'
                }}
              >
                Address Copied!
              </p>
            </Fade>
          ) : (
            ''
          )}
        </div>
      </Fade>
    );
  }
}

const styles = theme => ({
  walletBalanceContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    margin: '32px 0',
    '& img': {
      width: 40,
      height: 40
    },
    '& p': {
      fontSize: 20,
      marginLeft: 5
    }
  },
  qrCodeContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '24px 0',
    '& img': {
      width: 140,
      height: 140
    }
  },
  walletAddress: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

    '& svg': {
      fontSize: 14,
      color: 'white',
      marginLeft: 5
    }
  },
  walletAddressContainer: {
    border: `1px solid ${Colors.gray}`,
    borderRadius: 25,
    padding: '12px',
    width: 350,
    '& label': {
      fontSize: 12,
      color: Colors.gray
    },
    '& input': {
      color: 'white',
      fontSize: 14,
      background: 'none',
      border: 'none',
      width: '100%'
    }
  },
  warningContainer: {
    width: '70%',
    margin: '32px auto 0',
    display: 'flex',
    '& svg': {
      fontSize: 14,
      marginRight: 5
    },
    '& p': {
      fontSize: 14,
      lineHeight: '20px'
    }
  }
});

export default withStyles(styles)(ReceiveScreen);
