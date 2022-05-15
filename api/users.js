const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const config = require('config');

const userController = require('../controllers/user.controller');

// Company Dto Validation Logic is in middleware Folder and Dto Folder
const { validateDto, validateParams } = require('../middleware/validate.dto');

const {
  userDto,
  userDtos,
  userParamDto,
  userParamPageDto,
} = require('../dtos/user/user.dto');

// Authenticate before we execute the end point
const auth = require('../middleware/auth');

//IMPORTANT: We are enclosing router level function calls inside below function, so even if one forgot to
// trap some error, it will not gos to customer, instead it will go to common error handler
// We can even remove lots of Try and Catch blocks where we return internal server error
// since we repeat this function in all routers we might want to put it in a file
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/users', async (req, res) => {
  try {
    const data = await User.find();
    res.send(data);
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
});

// @route POST api/users
// @desc Register Users
// @access Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('empId', 'Employee ID is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with more than 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, empId, email, password } = req.body;
    try {
      //check if user exists
      let user = await User.findOne({ empId });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      user = new User({
        name,
        empId,
        email,
        password,
      });

      //encrypt password
      const salt = await bcrypt.genSalt(10); // more you have the more secured
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      //return jwt (so the user can log in as soon as they register)
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// POST request to Add User.
// Add auth.verifyUser, after we complete securing our frontend
router.post(
  '/users',
  auth.verifyUser,
  validateDto(userDto),
  use(userController.create)
);

// POST request to Add Users in Batch.
// Add auth.verifyUser, after we complete securing our frontend
router.post(
  '/users/addBatch',
  auth.verifyUser,
  validateDto(userDtos),
  use(userController.createBatch)
);

// auth.verifyUser,

router.post(
  '/updatePassword',
  [
    check('id', 'User ID is required').not().isEmpty(),
    check('oldPassword', 'Old password is required').exists(),
    check('newPassword', 'New password is required').exists(),
  ],
  use(userController.updatePassword)
);

// PUT request to Update Company.
// Add auth.verifyUser, after we complete securing our frontend
router.put(
  '/users/:id',
  auth.verifyUser,
  validateDto(userDto),
  use(userController.update)
);

// DELETE request to delete Company.
// Add auth.verifyAdmin, after we complete securing our frontend
router.delete('/users/:id', auth.verifyUser, use(userController.delete));

// GET request for one Company.
// Add auth.verifyUser, after we complete securing our frontend
router.get('/users/:id', auth.verifyUser, use(userController.find));

//* ******************************************************************************************************************
//* We can Search Companys by company and companyType query parameters
//* ******************************************************************************************************************
// GET request for list of all Companys.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/users',
  auth.verifyUser,
  validateParams(userParamDto),
  use(userController.findAll)
);

//* ******************************************************************************************************************
//* We can Search Companys by company and companyType
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all Companys by Page.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/usersByPage',
  auth.verifyUser,
  validateParams(userParamPageDto),
  use(userController.findAllPaging)
);

module.exports = router;
