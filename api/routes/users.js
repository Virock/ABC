const { Router } = require('express')
const User = require('../../models/User');
var createError = require('http-errors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../secret');
const fs = require('fs');
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
var upload = multer({
  dest: 'tmp/'
});

const router = Router()

// Mock Users
const users = [
  { name: 'Alexandre' },
  { name: 'Pooya' },
  { name: 'Sébastien' }
]

/* GET users listing. */
router.get('/users', function (req, res, next) {
  res.json(users)
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})

//Login User
router.post('/login', async function (req, res, next) {
  try {
    //Make sure valid details were sent
    if (!req.body.email || !req.body.password)
      throw new Error("Incomplete request");

    const email = sanitize(req.body.email);
    const password = req.body.password;

    if (!email || !password)
      throw new Error("Incomplete request");
    //Get enabled user with this email
    const user = await User.findOne({ email: email, enabled: true });
    //If not exists
    //Return error
    if (!user)
      throw new Error("Invalid email/password combination");
    //Else
    //Check if password matches
    const result = await bcrypt.compare(password, user.password)
    //If not, return error
    if (!result)
      throw new Error("Invalid email/password combination");
    //If all goes well
    //Create JWT
    const payload = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      roles: user.roles
    }
    const user_token = jwt.sign(payload, process.env.SECRET_KEY, secret.signOptions);
    //Insert this JWT into a cookie (Exists for one hour)
    res.cookie('token', user_token, { maxAge: 3600000 })
    //Insert the refresh token as well (Exists for a year)
    res.cookie('refresh_token', user.refresh_token, {
      maxAge: 31536000000
    })
    // //Redirect to homepage
    // res.redirect('/');
    //Return jwt and refresh token
    res.json({ token: user_token, refresh_token: user.refresh_token });
  } catch (err) {
    next(createError(400, err.message))
  }
})

// Register User
router.post('/register', upload.single('file'), async function (req, res, next) {
  try {
    //If the user is already logged in, give error
    if (req.user)
      throw new Error("You must not be logged in to access this endpoint");
    if (req.file)
      req.body.profile_picture = './tmp/' + req.file.filename
    let user = await User.initialize(req.body);
    await user.save();
    await user.sendVerificationEmail();
    await user.save();
    user = user.toObject();
    delete user.password;
    // res.redirect('/verify_account');
    res.json(user);
  } catch (err) {
    next(createError(400, err.message))
  }
  finally {
    //Delete uploaded file
    if (req.file)
      fs.unlinkSync(req.body.profile_picture);
  }
})

module.exports = router
