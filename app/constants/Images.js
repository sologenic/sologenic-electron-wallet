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

const images = {
  smallErrIcon: './dist/images/icons/smallErrIcon.png',
  help: './dist/images/icons/help.png',
  solo: './dist/images/icons/solo@3x.png',
  xrp: './dist/images/icons/xrp@3x.png',
  soloSmall: './dist/images/icons/solo_small.png',
  xrpSmall: './dist/images/icons/xrp_small.png',
  tokenizedAsset: './dist/images/icons/tokenized_asset@3x.png',
  soloWhite: './dist/images/solo-whitelogo.png',
  oS1: './dist/images/orientation/bg1.png',
  oS2: './dist/images/orientation/bg2.png',
  oS3: './dist/images/orientation/bg3.png',
  oS4: './dist/images/orientation/bg4.png',
  oSimg1: './dist/images/orientation/img1.png',
  oSimg2: './dist/images/orientation/img2.png',
  oSimg3: './dist/images/orientation/img3.png',
  oSimg4: './dist/images/orientation/img4.png',
  qricon: './dist/images/icons/qricon.png'
};

export default images;
export const imagesArray = Object.keys(images).map(k => images[k]);
