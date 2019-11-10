const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");

let provider = new HDWalletProvider(
  "buyer harbor grocery test latin flip firm grape tag among canoe lunar",
  `https://rinkeby.infura.io/v3/317c4e68fab144b6a81ae91cf84b0e25`,
  0,
  1
);

// web3 = new Web3(
//   "https://rinkeby.infura.io/v3/317c4e68fab144b6a81ae91cf84b0e25"
// );

let web3 = new Web3(provider);

// let account = web3.eth.accounts.privateKeyToAccount(
//   "0x1FCA52EFDAC903C4FAADC691166D2FBA62ABC681E512FBAADF13B9FB0CB68CB7"
// );

// console.log(account);

// let sig = account.sign("This is a message");
// console.log(sig);

// sig = web3.eth.accounts.sign(
//   "This is a message",
//   "1FCA52EFDAC903C4FAADC691166D2FBA62ABC681E512FBAADF13B9FB0CB68CB7"
// );
// console.log(sig);

// === SIGN ORDER === //
(async function signOrder() {
  let accounts = await web3.eth.getAccounts();
  console.log(accounts);
  // let message = web3.utils.soliditySha3("This is a message");
  message = "This is a message";
  console.log(message);

  //Web3 v1

  try {
    let signedMessage = await web3.eth.sign(
      message,
      "0xB29aE9a9BF7CA2984a6a09939e49d9Cf46AB0c1d"
    );

    const jwt = require("jsonwebtoken");

    jwt.sign(
      { id: 1 }, // payload
      "mySecret", // secret
      { expiresIn: 3600 }, // options
      (err, token) => {
        if (err) throw err;
        console.log(token);

        const decoded = jwt.verify(token, "mySecret");
        console.log(decoded);
      }
    );

    console.log("Signed Message: ", signedMessage);
  } catch (e) {
    console.log(e);
  }
})();
