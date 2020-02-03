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

var forge = require('node-forge');
const crypto = require('crypto');

exports.encrypt = encrypt = (string, salt, address, passphrase) => {
  var cipher = forge.cipher.createCipher('AES-CBC', 'FdlPhVMO4Ho_Pb9a');
  cipher.start({
    iv: crypto
      .createHmac('sha256', salt + passphrase)
      .update(address)
      .digest('hex')
  });
  cipher.update(forge.util.createBuffer(string));
  cipher.finish();
  var encrypted = cipher.output;
  var encodedB64 = forge.util.encode64(encrypted.data);
  return encodedB64;
};
exports.decrypt = decrypt = (encrypted, salt, address, passphrase) => {
  var decipher = forge.cipher.createDecipher('AES-CBC', 'FdlPhVMO4Ho_Pb9a');
  decipher.start({
    iv: crypto
      .createHmac('sha256', salt + passphrase)
      .update(address)
      .digest('hex')
  });
  decipher.update(forge.util.createBuffer(forge.util.decode64(encrypted)));
  decipher.finish();
  return decipher.output.data;
};

const salt = Math.random()
  .toString(36)
  .slice(2);
