import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Colors from "../constants/Colors";
import {countWords, getWalletFromMnemonic, getRippleClassisAddressFromXAddress} from "../utils/utils2";
import {createTrustlineRequest, fillNewWallet} from "../actions/index";
import {withStyles, Fade} from "@material-ui/core";


class PassphraseTab extends Component {
    render() {
        const {classes} = this.props;

        return (
        <Fade in>
            <div className={classes.passphraseTab}>
                <p>Enter the 12 word passphrase that was given to you when you created your wallet.</p>
                <p>You should have writte it down in a safe place upon creation as prompted.</p>
                <textarea
                    ref="passphrase"
                    className={classes.phraseTextarea}
                    placeholder="Passphrase"
                ></textarea>
                <button>Add Wallet</button>
            </div>
        </Fade>
      ) 
        
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

const styles = theme => ({
    passphraseTab: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 32,
        '& p': {
          fontWeight: 300,
          marginBottom: 24,
          width: '50%',
          textAlign: 'center'
        },
        '& button': {
          border: 'none',
          background: Colors.darkRed,
          borderRadius: 25,
          color: 'white',
          fontSize: 18,
          cursor: 'pointer',
          transition: '.2s',
          width: 150,
          height: 35,
          '&:hover': {
            opacity: 0.7,
            transition: '.2s'
          }
        }
      },
      phraseTextarea: {
        width: '70%',
        margin: '24px auto',
        background: 'none',
        borderBottom: '2px solid white',
        color: 'white',
        fontSize: 14,
        resize: 'none',
        border: 'none',
        '&:focus': { outline: 'none' },
        '&::placeholder': {
          fontSize: 18
        }
      }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PassphraseTab));