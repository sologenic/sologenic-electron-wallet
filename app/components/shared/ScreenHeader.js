import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Settings, ArrowBack } from '@material-ui/icons';
import Colors from '../../constants/Colors.js';
import Images from '../../constants/Images.js';
import routes from '../../constants/routes.js';

class ScreenHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, classes, showSettings } = this.props;

    if (!showSettings) {
      return (
        <div className={classes.headerWrapper}>
          <Link to={routes.HomeScreen} className={classes.link}>
            <ArrowBack />
          </Link>
          <h1>{title}</h1>
          <span />
        </div>
      );
    }

    return (
      <div className={classes.headerWrapper}>
        <img src={Images.solo} alt="solo-icon" />
        <h1>{title}</h1>
        <Link to={routes.SettingsScreen} className={classes.link}>
          <Settings />
        </Link>
      </div>
    );
  }
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
  }
});

export default withStyles(styles)(ScreenHeader);
