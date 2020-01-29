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

console.log(
  this.encrypt(
    'PRIVATE KEY123',
    salt,
    'rGfRVfHBdAiwveepHTy1vJbqugUfmdYMSP',
    'aB123456'
  )
);

console.log(
  this.decrypt(
    'rBuyaAXf8G9uqVxpHdVSBg==',
    salt,
    'rGfRVfHBdAiwveepHTy1vJbqugUfmdYMSP',
    'aB123456'
  )
);
