const crypto = require("crypto");
const fs = require("fs");
require('dotenv').config();

function generateKeypair() {
  const keypair = crypto.generateKeyPair(
    "rsa",
    {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: process.env.SECRET,
      },
    },
    (err, publicKey, privateKey) => {
      fs.writeFileSync(__dirname + "/id_rsa_pub.pem", publicKey);
      fs.writeFileSync(__dirname + "/id_rsa_priv.pem", privateKey);
    }
  );
}

generateKeypair();