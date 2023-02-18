const crypto = require("crypto");
const fs = require("fs");

function generateAccessKeyPair() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(__dirname + "/AdminAccess_publicKey.pem", keyPair.publicKey);
  fs.writeFileSync(__dirname + "/AdminAccess_privateKey.pem", keyPair.privateKey);
}

function generateRefreshKey() {
  const refreshKeyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(
    __dirname + "/AdminRefresh_publicKey.pem",
    refreshKeyPair.publicKey
  );
  fs.writeFileSync(
    __dirname + "/AdminRefresh_privateKey.pem",
    refreshKeyPair.privateKey
  );
}

// generateAccessKeyPair();
generateRefreshKey();
