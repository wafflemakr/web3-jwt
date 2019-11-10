const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Web3 = require("web3");
const web3 = new Web3();

const auth = require("../middleware/auth");

// User Model
const User = require("../models/User");

// @route   GET api/users/user
// @desc    Get user data
// @access  Private
router.get("/", async (req, res) => {
  try {
    let users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    res.status(400).json({
      error: "req body should take the form { username, password }"
    });
  }
});

// @route   GET api/users/user
// @desc    Get user data
// @access  Private
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id).then(user => res.json(user));
});

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req, res) => {
  const { email, account, signature } = req.body;

  // Simple validation
  if (!email || !signature || !account) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const sender = await validateSignature(
      signature,
      "Registering to Web3 Auth"
    );

    if (account !== sender)
      return res.status(400).json({ msg: "Invalid signature" });

    // Check for existing user
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({
      email,
      account
    });

    const savedUser = await newUser.save();

    jwt.sign(
      { email: savedUser.email }, // payload
      process.env.JWT_SECRET, // secret
      { expiresIn: 3600 }, // options
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: savedUser.id,
            account: savedUser.account,
            email: savedUser.email
          }
        });
      }
    );

    res.json({
      success: true,
      user: {
        account: savedUser.account,
        email: savedUser.email
      }
    });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// @route   POST api/users/login
// @desc    User login
// @access  Public
router.post("/login", async (req, res) => {
  const { email, signature } = req.body;

  // Simple validation
  if (!email || !signature) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User Does not exist" });

  // Validate Signature sent
  let sender = await validateSignature(signature, "Logging in to Web3 Auth");

  if (sender !== user.account)
    return res.status(400).json({ msg: "Invalid signature" });

  jwt.sign(
    { email: user.email }, // payload
    process.env.JWT_SECRET, // secret
    { expiresIn: 3600 }, // options
    (err, token) => {
      if (err) throw err;
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          account: user.account,
          email: user.email
        }
      });
    }
  );
});

// === VALIDATE SIGNATURE === //
async function validateSignature(signature, message) {
  let sender = await web3.eth.accounts.recover(message, signature);

  return sender;
}
// ======================== //

module.exports = router;
