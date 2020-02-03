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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles, Dialog, DialogTitle } from '@material-ui/core';
import { closeModal } from '../../actions/index';
import { CheckCircle, Close } from '@material-ui/icons';
import Colors from '../../constants/Colors';

class Modal extends Component {
  render() {
    const {
      classes,
      title,
      content,
      shouldShow,
      type,
      buttonText,
      onClick
    } = this.props;

    return (
      <Dialog open={shouldShow} classes={{ paper: classes.dialogContainer }}>
        <DialogTitle classes={{ root: classes.dialogTitle }}>
          {title}
        </DialogTitle>
        <div className={classes.modalContent}>
          <p>{content}</p>
          {type === 'success' ? (
            <CheckCircle />
          ) : type === 'error' ? (
            <Close />
          ) : type === 'standard' ? (
            <span />
          ) : (
            ''
          )}
        </div>
        <div className={classes.modalBtn}>
          <button onClick={onClick}>{buttonText.toUpperCase()}</button>
        </div>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      closeModal
    },
    dispatch
  );
}

const styles = theme => ({
  dialogContainer: {
    background: Colors.darkerGray,
    color: 'white'
  },
  dialogTitle: {
    fontWeight: 300
  },
  modalContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    '& p': {
      fontSize: 14,
      width: '60%',
      lineHeight: '20px'
    },
    '& svg': {
      fontSize: 14,
      color: Colors.freshGreen
    }
  },
  modalBtn: {
    padding: '16px 24px',
    borderTop: '1px solid gray',
    display: 'flex',
    justifyContent: 'flex-end',
    '& button': {
      border: 'none',
      background: 'none',
      color: Colors.freshGreen,
      fontSize: 16,
      transition: '.2s',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.7,
        transition: '.2s'
      }
    }
  }
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Modal)
);
