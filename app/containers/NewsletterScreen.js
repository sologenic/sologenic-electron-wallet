import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { joinNewsletter } from '../actions/index';
import { withStyles } from '@material-ui/core';
import Colors from '../constants/Colors';
import { ChevronRight } from '@material-ui/icons';
import ScreenHeader from '../components/shared/ScreenHeader';
import { Link } from 'react-router-dom';
import * as EmailValidator from 'email-validator';

class NewsletterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailSent: false,
      validEmail: true,
      emailInput: ''
    };

    this.sendToNewsletter = this.sendToNewsletter.bind(this);
    this.focusOnInput = this.focusOnInput.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange() {
    let email = this.refs.emailForNewsletter.value.trim();

    this.setState({
      emailInput: email
    });
  }

  focusOnInput() {
    this.refs.emailForNewsletter.focus();
  }

  async sendToNewsletter() {
    const email = this.refs.emailForNewsletter.value.trim();

    const isValidEmail = EmailValidator.validate(email);

    if (isValidEmail) {
      await this.props.joinNewsletter(email);
    } else {
      this.refs.emailForNewsletter.value = '';

      this.setState({
        validEmail: false
      });
    }
  }

  render() {
    const { classes, emailResponse } = this.props;
    const { validEmail, emailInput } = this.state;

    return (
      <div>
        <ScreenHeader title="Receive Email Updates?" />
        <div className={classes.newsLetterWrapper}>
          {emailResponse.added ? (
            <div className={classes.thankYouDiv}>
              <h1>Thank you!</h1>
              <Link to="/set-pin-screen">Continue</Link>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <p className={classes.enterEmailP}>
                Enter your email and receive the latest updates and airdrops
                from Sologenic.
              </p>
              <div className={classes.emailInput} onClick={this.focusOnInput}>
                <label
                  style={{
                    color: validEmail ? 'white' : Colors.errorBackground
                  }}
                >
                  {validEmail
                    ? 'Enter your Email Address'
                    : 'Please, enter a valid email'}
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={this.handleEmailChange}
                  ref="emailForNewsletter"
                />
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: Colors.freshGreen,
                  alignSelf: 'flex-start',
                  marginTop: 5
                }}
              >
                Optional
              </span>
              <p className={classes.acceptPrivacyPolicy}>
                By entering your email address, you confirm that you agree with
                the{' '}
                <a
                  href="https://www.sologenic.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy
                </a>
                .
              </p>
              <button
                onClick={this.sendToNewsletter}
                className={classes.submitEmail}
                disabled={emailInput === '' ? true : false}
              >
                Submit
              </button>
              <Link to="/set-pin-screen" className={classes.skipLink}>
                Skip this step <ChevronRight />
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    emailResponse: state.emailResponse
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ joinNewsletter }, dispatch);
}

const styles = theme => ({
  newsLetterWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '65%',
    margin: '0 auto'
  },
  enterEmailP: {
    textAlign: 'center',
    margin: '32px auto'
  },
  acceptPrivacyPolicy: {
    margin: '32px auto',
    color: Colors.lightGray,
    '& a': {
      color: Colors.darkRed
    }
  },
  emailInput: {
    padding: '12px 14px',
    borderRadius: 25,
    background: Colors.darkGray,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '& label': {
      color: Colors.lightGray,
      fontSize: 12
    },
    '& input': {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: 14,
      width: '100%',
      marginTop: 5
    }
  },
  submitEmail: {
    border: 'none',
    borderRadius: 15,
    background: Colors.darkRed,
    color: 'white',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: '.2s',
    fontSize: 16,
    '&:hover': {
      opacity: 0.7,
      transition: '.2s'
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
      background: Colors.gray
    }
  },
  thankYouDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& h1': {
      textAlign: 'center',
      margin: '32px 0',
      fontSize: 32
    },
    '& a': {
      border: 'none',
      borderRadius: 15,
      background: Colors.darkRed,
      color: 'white',
      padding: '6px 12px',
      textDecoration: 'none'
    }
  },
  skipLink: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    marginTop: '40%'
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(NewsletterScreen)
);
