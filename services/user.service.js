const User = require('../models/Users');
const ApiError = require('../middleware/api.error');
const bcrypt = require('bcryptjs');
const groupPermissionsService = require('./groupPermissions.service');
const userPermissionsService = require('./userPermissions.service');

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

// exports.signup = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const { name, empId, email, password, companyId } = req.body;
//   try {
//     //check if user exists
//     let user = await User.findOne({ empId, companyId });
//     if (user) {
//       return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
//     }
//     user = new User({
//       name,
//       empId,
//       email,
//       password,
//     });
//     //Get users avatar TODO

//     //encrypt password
//     const salt = await bcrypt.genSalt(10); // more you have the more secured
//     user.password = await bcrypt.hash(password, salt);
//     await user.save();

//     //return jwt (so the user can log in as soon as they register)
//     const payload = {
//       user: {
//         id: user.id,
//       },
//     };
//     jwt.sign(
//       payload,
//       config.get('jwtToken'),
//       { expiresIn: 360000 },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('server error');
//   }
// };

exports.create = async (userDto, res, next, sendData = true) => {
  try {
    //check if user exists
    const empId = userDto.empId;
    const companyId = userDto.companyId;
    let user = await User.findOne({ empId, companyId });
    if (user) {
      if (sendData) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      } else {
        return;
      }
    }
    //encrypt password
    const salt = await bcrypt.genSalt(10); // more you have the more secured
    const password = await bcrypt.hash(userDto.password, salt);
    userDto.password = password;
    const newUser = new User(userDto);
    const data = await newUser.save();

    if (!data) {
      next(ApiError.badRequest('Error in User Insert!'));
      return;
    } else {
      let role = userDto.role;
      if (role === undefined || role.trim().length === 0) {
        role = 'User';
      }
      const condition = {
        role: { $regex: new RegExp(role), $options: 'i' },
      };
      console.log('user.service==Role==>', role);
      console.log('user.service==Condition==>', condition);

      const { limit, offset } = getPagination(0, 2000);
      const groupPermissions = await groupPermissionsService.findAllPaginate(
        condition,
        limit,
        offset,
        res,
        next,
        false
      );
      console.log(
        'user.service==groupPermissions.length==>',
        groupPermissions.length
      );

      if (groupPermissions) {
        const userPermissions = groupPermissions.map((gp) => {
          return {
            userId: newUser._id,
            userName: newUser.name,
            module: gp.module,
            action: gp.action,
            checked: gp.checked,
          };
        });
        console.log(
          'user.service==userPermissions.length==>',
          userPermissions.length
        );

        userPermissionsService.createBatch(userPermissions, res, next, false);
      }
      if (sendData) {
        res.status(201).send(data);
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.update = async (id, userDto, res, next, sendData = true) => {
  try {
    const data = await User.findByIdAndUpdate(id, userDto, {
      useFindAndModify: false,
    });
    if (!data) {
      next(
        ApiError.notFound(
          'Cannot update User with id==' + id + ' Maybe User was not found!'
        )
      );
      return;
    } else {
      if (sendData) {
        res.status(200).send(data);
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.delete = async (id, res, next, sendData = true) => {
  try {
    const data = await User.findByIdAndRemove(id, {
      useFindAndModify: false,
    });
    if (!data) {
      next(
        ApiError.notFound(
          'Cannot delete User with id=' + id + ' Maybe User was not found!'
        )
      );
      return;
    } else {
      if (sendData) {
        res.send({
          message: 'User was deleted successfully!',
          user: data,
        });
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findById = async (id, res, next, sendData = true) => {
  try {
    console.log('findById==>', id);
    const data = await User.findById(id);
    if (data === null) {
      console.log('findById==>before Error return', data);
      next(ApiError.notFound('Not found: User with id=' + id));
      return;
    } else {
      if (sendData) {
        res.send(data);
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAll = async (condition, res, next, sendData = true) => {
  try {
    const data = await User.find(condition);
    if (data === null) {
      console.log('findAll==>before Error return', data);
      next(ApiError.notFound('Not found: User'));
      return;
    } else {
      if (sendData) {
        res.send(data);
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAllPaginate = async (
  condition,
  limit,
  offset,
  res,
  next,
  sendData = true
) => {
  try {
    const data = await User.paginate(condition, { offset, limit });
    if (data === null) {
      console.log('findAllPaginate==>before Error return', data);
      next(ApiError.notFound('Not found: User'));
      return;
    } else {
      console.log('Users==>', data.docs);
      if (sendData) {
        res.send({
          totalItems: data.totalDocs,
          users: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
        return;
      } else {
        return data.docs;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.updatePassword = async (
  id,
  oldPassword,
  newPassword,
  res,
  next,
  sendData = true
) => {
  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid user' }] });
    }
    console.log('updatePassword==userFound');
    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Old Password' }] });
    }
    console.log('updatePassword==password matching');
    const salt = await bcrypt.genSalt(10); // more you have the more secured
    user.password = await bcrypt.hash(newPassword, salt);
    user.isFirstTime = false;
    console.log('updatePassword==Before Update');

    const data = await User.findByIdAndUpdate(id, user, {
      useFindAndModify: false,
    });
    if (!data) {
      next(
        ApiError.notFound(
          'Cannot update User Password with id==' +
            id +
            ' Maybe User was not found!'
        )
      );
      return;
    } else {
      console.log('updatePassword==Success');
      if (sendData) {
        res.status(200).send(data);
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};
