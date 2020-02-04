//     Sologenic Wallet, Decentralized Wallet. Copyright (C) 2020 Sologenic

//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Settings, ArrowBack, MoreVert } from '@material-ui/icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../../constants/Colors.js';
import Images from '../../constants/Images.js';
import routes from '../../constants/routes.js';
import { openOptions, closeOptions } from '../../actions/index';

class ScreenHeader extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.openOptionsModal = this.openOptionsModal.bind(this);
    this.closeOptionsModal = this.closeOptionsModal.bind(this);
  }

  async goBack() {
    await this.props.closeOptions();

    this.props.history.goBack();
  }

  openOptionsModal() {
    this.props.openOptions();
  }

  closeOptionsModal(e) {
    e.stopPropagation();
    this.props.closeOptions();
  }

  render() {
    const {
      title,
      classes,
      showSettings,
      history,
      showBackArrow,
      dark,
      showWalletOptions,
      walletOptions,
      fixed
    } = this.props;

    // if (!showSettings) {
    return (
      <div
        className={`${classes.headerWrapper} ${
          fixed ? classes.fixedHeader : ''
        }`}
        style={{
          background: dark ? Colors.darkerGray : Colors.headerBackground
        }}
      >
        {showBackArrow ? (
          <ArrowBack onClick={this.goBack} style={{ cursor: 'pointer' }} />
        ) : (
          <img src={Images.solo} alt="solo-icon" style={{ opacity: 0 }} />
        )}
        <h1>{title}</h1>
        {showSettings ? (
          <Link to={routes.SettingsScreen} className={classes.link}>
            <Settings />
          </Link>
        ) : showWalletOptions ? (
          <MoreVert
            onClick={
              walletOptions.isOpen
                ? e => this.closeOptionsModal(e)
                : this.openOptionsModal
            }
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
  const { walletOptions } = state;

  return { walletOptions };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      openOptions,
      closeOptions
    },
    dispatch
  );
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
      width: '65%',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
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
  fixedHeader: {
    position: 'fixed',
    width: '95%',
    top: 0,
    zIndex: 999999
  },
  optionsLink: {
    cursor: 'pointer'
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(ScreenHeader))
);
