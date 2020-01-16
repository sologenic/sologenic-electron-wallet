import React, { Component, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
// import ScreeHeader from '../components/shared/ScreenHeader.js';

class OrientationScreen extends Component {
  render() {
    return <Carousel showThumbs={false} showArrows={false}></Carousel>;
  }
}

const styles = theme => ({});

export default withStyles(styles)(OrientationScreen);
