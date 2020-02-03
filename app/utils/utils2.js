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

import qrcode from 'qrcode-generator';
import Colors from '../constants/Colors';
import { Wallet, Utils } from 'xpring-common-js';
import * as s from 'sologenic-xrpl-stream-js';
import numbro from 'numbro';
import configVars from './config';

export const countWords = words => {
  const arrayOfWords = words
    .trim()
    .split(' ')
    .filter(item => item.lenght !== 0);
  return arrayOfWords.length === 12 ? true : false;
};

export const generateQRCode = data => {
  const typeNumber = 0;
  const errorCorrectionLevel = 'L';
  const QRCode = qrcode(typeNumber, errorCorrectionLevel);
  QRCode.addData(data);
  QRCode.make();
  const uri = QRCode.createDataURL(2, 4);
  return uri;
};

export const genereateRandomNumbers = () => {
  const randoms = [];
  for (let i = 0; i < 3; i += 1) {
    while (true) {
      const tmp = Math.floor(Math.random() * 12) + 1;
      if (!randoms.includes(tmp)) {
        randoms.push(tmp);
        break;
      }
    }
  }
  return randoms;
};

export const getPriceChange = (tickerLast, tickerOpen) => {
  return tickerLast - tickerOpen === 0
    ? '0%'
    : `${(((tickerLast - tickerOpen) / tickerOpen) * 100).toFixed(2)}%`;
};

export const getPriceColor = priceChange => {
  return priceChange.substring(0, 1) === '-'
    ? Colors.errorBackground
    : Colors.freshGreen;
};

export const createSevensObj = arr => {
  let sevensObj = {};
  arr.map(item => {
    sevensObj[item.market] = item.seven;
  });
  return sevensObj;
};

// Generate a random wallet.
export const generateNewRandomWallet = () => {
  const result = Wallet.generateRandomWallet();
  return result;
};

// Generate a mnemonic array
export const generateMnemonicArray = input => {
  const result = input.trim().split(' ');
  return result;
};

// Get an address from generated random wallet
export const getAddress = input => {
  const wallet = input.wallet;
  const address = wallet.getAddress();
  return address;
};

// Get wallet from mnemonic
export const getWalletFromMnemonic = mnemonic => {
  const wallet = Wallet.generateWalletFromMnemonic(mnemonic);
  return wallet;
};

// Encode an X-Address
export const getXAddressFromRippleClassicAddress = (
  rippleClassicAddress,
  tag
) => {
  const xAddress = Utils.encodeXAddress(rippleClassicAddress, tag);
  return xAddress;
};

//Decode an X-Address
export const getRippleClassicAddressFromXAddress = xAddress => {
  const classicAddress = Utils.decodeXAddress(xAddress);
  return classicAddress.address;
};

//Validate ripple address or not
//bitcoin address returns false
export const isValidRippleAddress = address => {
  return address ? Utils.isValidAddress(address) : false;
};

//Validate ripple XAddress or not
//XAddress only returns true
export const isValidXAddress = address => {
  return address ? Utils.isValidXAddress(address) : false;
};

//Validate ripple classic address,'r' is the first letter, or not
//classic address only returns true
export const isValidClassicAddress = address => {
  return address ? Utils.isValidClassicAddress(address) : false;
};

export const sologenic = new s.SologenicTxHandler(
  // RippleAPI Options
  {
    // server: 'wss://s1.ripple.com' // Kudos to Wietse Wind
    server: 'wss://testnet.xrpl-labs.com'
  },
  // Sologenic Options, hash or redis
  {
    queueType: 'hash',
    hash: {}
    // queueType: 'redis',
    // redis: {
    //   host: '127.0.0.1',
    //   port: 6380
    // }
  }
);

export const isValidSecret = secret => {
  const rippleApi = sologenic.getRippleApi();
  return secret ? rippleApi.isValidSecret(secret) : false;
};

// export const rippleApi = new RippleAPI({
//   server: "wss://s.altnet.rippletest.net:51233"
// });

// export const rippleApi = sologenic.getRippleApi();

// export const getAccountInfo = address => {
//   return rippleApi.getAccountInfo(address);
// };

// export const setAccount = (address, secret, keypair) => {
//   return sologenic.setAccount({
//     address,
//     secret: secret ? secret : '',
//     keypair: keypair ? keypair : ''
//   });
// };

// export const transferSolo = (issuer, account, destination, value) => {
//   const valueSendMax = value + 1;
//   const valueAmount = value;
//   const solo = '534F4C4F00000000000000000000000000000000';

//   return sologenic.submit({
//     TransactionType: 'Payment',
//     Account: account,
//     Destination: destination,
//     SendMax: {
//       currency: solo,
//       issuer: 'rEFgkRo5BTxXJiLVYMdEnQQ9J9Kj1F3Yvi',
//       value: `${valueSendMax}`
//     },
//     Amount: {
//       currency: solo,
//       issuer: 'rEFgkRo5BTxXJiLVYMdEnQQ9J9Kj1F3Yvi',
//       value: `${valueAmount}`
//     }
//   });
// };
// Create a trustline linking the account (a certain address) with issuer
// export const createTrustline = account => {
//   const solo = '534F4C4F00000000000000000000000000000000';
//   return sologenic.submit({
//     TransactionType: 'TrustSet',
//     Account: account,
//     LimitAmount: {
//       currency: solo,
//       issuer: 'rEFgkRo5BTxXJiLVYMdEnQQ9J9Kj1F3Yvi', //this is a test issuer for solo which is generated by sologenic-issuarance
//       value: '400000000'
//     },
//     Flags: 0x00020000
//   });
// };

// export const transferXrp = (account, destination, value) => {
//   const valueAmount = value / 0.000001;

//   return sologenic.submit({
//     TransactionType: 'Payment',
//     Account: account,
//     Destination: destination,
//     Amount: `${valueAmount}`
//   });
// };

function getPositionOfLeadingZeros(data) {
  var a = data.split('.');

  if (typeof a[1] === 'undefined') {
    return 0;
  }
  a = a[1];
  a = a.split('');
  a.shift();
  a.shift();
  a.reverse();
  var position = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== '0') {
      break;
    }
    position++;
  }
  var result = data.length - position;
  if (position > 7) {
    return a.length - 7;
  } else {
    return result;
  }
}

export function format(value, precision) {
  var p = '0,0.';
  for (var i = 0; i < precision; i++) {
    p += '0';
  }

  var styledVolume = numbro(value).format(p);
  var position = getPositionOfLeadingZeros(styledVolume);
  var a = styledVolume.substring(0, position);
  var b = styledVolume.substring(position);

  if (a === '') {
    return 0;
  }

  a = a.split('.');

  return a[0] + '.' + a[1].replace('.', '');
}

export const filterTransactions = (transactions, currentLedger) => {
  let xrpTransactions = [];
  let soloTransactions = [];
  transactions.filter(item => {
    if (item.type === 'payment' && item.outcome.result === 'tesSUCCESS') {
      if (item.outcome.deliveredAmount.currency === configVars.soloHash) {
        soloTransactions.push({
          ...item,
          outcome: {
            ...item.outcome,
            ledgerVersion: currentLedger - item.outcome.ledgerVersion
          }
        });
      } else {
        xrpTransactions.push({
          ...item,
          outcome: {
            ...item.outcome,
            ledgerVersion: currentLedger - item.outcome.ledgerVersion
          }
        });
      }
    } else {
      if (item.outcome.result === 'tecUNFUNDED_PAYMENT') {
        // console.log(item.specification.source.maxAmount);
        if (
          item.specification.source.maxAmount.currency === configVars.soloHash
        ) {
          soloTransactions.push({
            ...item,
            outcome: {
              ...item.outcome,
              ledgerVersion: currentLedger - item.outcome.ledgerVersion
            }
          });
        } else if (item.specification.source.maxAmount.currency === 'XRP') {
          xrpTransactions.push({
            ...item,
            outcome: {
              ...item.outcome,
              ledgerVersion: currentLedger - item.outcome.ledgerVersion
            }
          });
        }
      }
    }
  });
  return {
    xrpTransactions,
    soloTransactions
  };
};
