import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Settings, ArrowBack, MoreVert } from '@material-ui/icons';
import { connect } from 'react-redux';
import Colors from '../../constants/Colors.js';
import Images from '../../constants/Images.js';
import routes from '../../constants/routes.js';

class ScreenHeader extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const {
      title,
      classes,
      showSettings,
      history,
      showBackArrow,
      dark,
      showWalletOptions
    } = this.props;

    // if (!showSettings) {
    return (
      <div
        className={classes.headerWrapper}
        style={{
          background: dark ? 'transparent' : Colors.headerBackground
        }}
      >
        {showBackArrow ? (
          <ArrowBack onClick={this.goBack} style={{ cursor: 'pointer' }} />
        ) : (
          <img src={Images.solo} alt="solo-icon" />
        )}
        <h1>{title}</h1>
        {showSettings ? (
          <Link to={routes.SettingsScreen} className={classes.link}>
            <Settings />
          </Link>
        ) : showWalletOptions ? (
          <MoreVert
            onClick={() => console.log('Options clicked!')}
            classes={{ root: classes.optionsLink }}
          />
        ) : (
          <span />
        )}
      </div>
    );
    // }

    // return (
    //   <div className={classes.headerWrapper}>
    //     <img src={Images.solo} alt="solo-icon" />
    //     <h1>{title}</h1>
    //
    //   </div>
    // );
  }
}

function mapStateToProps(state) {
  const { router } = state;

  return { history: router };
}

const styles = theme => ({
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    // background: Colors.headerBackground,
    '& h1': {
      fontSize: 20,
      fontWeight: 300,
      textAlign: 'center',
      width: '65%'
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
  optionsLink: {
    cursor: 'pointer'
  }
});

export default withStyles(styles)(withRouter(ScreenHeader));
