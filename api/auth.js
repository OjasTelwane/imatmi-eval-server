const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Users = require('../models/Users');
const UserPermission = require('../models/UserPermissions');

const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
// @route GET api/auth
// @desc  verify user
// @access Public
router.get('/authenticate', auth.verifyUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('-password');
    if (user) {
      const userId = user._id;
      const userPermissions = await UserPermission.find({ userId });
      console.log('userPermissions.length===>', userPermissions.length);
      user.userPermissions = userPermissions.map((up) => {
        return {
          module: up.module,
          action: up.action,
          checked: up.checked,
        };
      });
      // console.log('user.userPermissions===>', user.userPermissions);
      // console.log('auth.api==user==>', user);
    }
    res.json(user);
    // console.log('auth get user==>', user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error in api/authentication');
  }
});
// @route POST api/auth
// @desc  verify user
// @access Public
router.post(
  '/login',
  [
    check('empId', 'Employee ID is required').not().isEmpty(),
    check('password', 'Please enter a password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { empId, password } = req.body;
    try {
      //find user
      let user = await Users.findOne({ empId });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      //Match id and password
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      console.log('user data===>', user);
      const payload = {
        user: {
          id: user.id,
          empId: user.empId,
          companyId: user.companyId,
          isFirstTime: user.isFirstTime,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token: token,
            empId: +empId,
            isFirstTime: +user.isFirstTime,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
