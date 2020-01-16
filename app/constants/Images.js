const images = {
  face: './assets/images/icons/face.png',
  faceRed: './assets/images/icons/faceRed.png',
  faceGreen: './assets/images/icons/faceGreen.png',
  fingerPrint: './assets/images/icons/fingerPrint.png',
  fingerPrintGreen: './assets/images/icons/fingerPrintGreen.png',
  fingerPrintRed: './assets/images/icons/fingerPrintRed.png',
  smallErrIcon: './assets/images/icons/smallErrIcon.png',
  help: './assets/images/icons/help.png',
  solo: './assets/images/icons/solo.png',
  xrp: './assets/images/icons/xrp.png',
  soloSmall: './assets/images/icons/solo_small.png',
  xrpSmall: './assets/images/icons/xrp_small.png',
  tokenizedAsset: './assets/images/icons/tokenized_asset.png'
};

export default images;
export const imagesArray = Object.keys(images).map(k => images[k]);
