import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import ScreenHeader from '../components/shared/ScreenHeader';
import terms from '../utils/terms';
import Colors from '../constants/Colors';
import { Radio } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { connect } from 'react-redux';
import storage from 'electron-json-storage';

class TermsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      termsAccepted: false
    };
    this.acceptTerms = this.acceptTerms.bind(this);
  }

  acceptTerms() {
    this.setState({ termsAccepted: true });
    storage.set('terms', { accepted: true }, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { termsAccepted } = this.state;

    return (
      <div>
        <ScreenHeader
          title="Terms & Conditions"
          showSettings={false}
          showBackArrow={false}
        />
        <div className={classes.termsContainer}>
          <p>{terms}</p>
        </div>
        <div className={classes.agreeContainer}>
          <span>
            I have read and agree to the terms and conditions of use as outlined
            above
          </span>
          <Radio
            classes={{ root: classes.radio }}
            onChange={this.acceptTerms}
          />
        </div>
        <div className={classes.btnContainer}>
          <button
            className={classes.nextBtn}
            onClick={() => this.props.history.push('/set-pin-screen')}
            disabled={termsAccepted ? false : true}
          >
            Next <ChevronRight />
          </button>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  termsContainer: {
    height: 340,
    overflow: 'auto',
    width: '90%',
    margin: '24px auto 0',
    '&::-webkit-scrollbar': { background: 'none', width: 2 },
    '&::-webkit-scrollbar-thumb': {
      background: Colors.lightGray,
      borderRadius: 25
    },
    '& p': {
      fontSize: 12,
      lineHeight: 1.5,
      fontWeight: 300,
      paddingRight: 5
    }
  },
  agreeContainer: {
    width: '90%',
    margin: '24px auto 0',
    paddingTop: 16,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTop: '1px solid gray',

    '& span': {
      fontSize: 14,
      fontWeight: 300,
      textAlign: 'right',
      lineHeight: 1.5
    }
  },
  btnContainer: {
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 16,
    '& button': {
      background: Colors.darkRed,
      border: 'none',
      borderRadius: 25,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      fontSize: 14,
      color: 'white',
      cursor: 'pointer',
      marginRight: -8,
      '& svg': {
        fontSize: 16,
        color: 'white'
      },
      '&:disabled': {
        background: Colors.slabGray,
        color: Colors.lightGray,
        '& svg': {
          color: Colors.lightGray
        }
      }
    }
  },
  radio: {
    color: 'white'
  }
});

export default withStyles(styles)(connect(null, null)(TermsScreen));
