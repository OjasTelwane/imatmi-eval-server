/*******************************************************************************************************
 * User Permissions Service currently Loading and Saving Data from Mongo Db file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const UserPermissions = require('../models/UserPermissions');
const ApiError = require('../middleware/api.error');
// const userService = require('./user.service');
const logger = require('../config/logger');

exports.create = async (userPermissionsDto, res, next, sendData = true) => {
  try {
    console.log('userPermissionsDto===>', userPermissionsDto);
    console.log('create=Before Create=>', userPermissionsDto);
    const newUserPermissions = new UserPermissions(userPermissionsDto);
    const data = await newUserPermissions.save();
    console.log('data==>', data);
    if (!data) {
      next(ApiError.badRequest('Error in User Permissions Insert!'));
      return;
    } else {
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

exports.createBatch = async (
  userPermissionsDtos,
  res,
  next,
  sendData = true
) => {
  try {
    UserPermissions.insertMany(userPermissionsDtos, { ordered: false })
      .then((data) => {
        if (!data) {
          logger.log({
            level: 'error',
            message: 'User Permissions create batch',
            metadata: { user: res.currentUser },
          });
          if (sendData) {
            next(
              ApiError.badRequest('Error in User Permissions Batch Insert!')
            );
          }
          console.log('Error in User Permissions Batch Insert!');
          return;
        } else {
          logger.log({
            level: 'info',
            message: 'User Permissions create batch',
            metadata: { user: res.currentUser },
          });
          if (sendData) {
            res.status(201).send({
              message: 'User Permissions Batch is Added successfully.',
            });
          } else {
            return;
          }
          console.log('User Permissions Batch is Added successfully');
        }
      })
      .catch((err) => {
        logger.log({
          level: 'error',
          message: 'User Permissions create batch',
          metadata: { user: res.currentUser },
        });
        if (sendData) {
          next(
            ApiError.internalError(
              err,
              'Error Inserting User Permissions Batch'
            )
          );
        }
        console.log('Error Inserting User Permissions Batch');
        return;
      });
  } catch (err) {
    if (sendData) {
      next(ApiError.internalError(err));
    }
    console.log('catch==>', err);
    return;
  }
};

exports.update = async (id, userPermissionsDto, res, next, sendData = true) => {
  try {
    console.log('userPermissionsDto===>', userPermissionsDto);
    const data = await UserPermissions.findByIdAndUpdate(
      id,
      userPermissionsDto,
      {
        useFindAndModify: false,
      }
    );
    console.log('data===>', data);
    if (!data) {
      next(
        ApiError.notFound(
          'Cannot update User Permissions with id==' +
            id +
            ' Maybe User Permissions was not found!'
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
    // const data = await UserPermissions.findByIdAndRemove(id, {
    //   useFindAndModify: false,
    // });
    const data = await UserPermissions.remove({ userId: 'id' });
    console.log('data==>', data);
    if (!data) {
      next(
        ApiError.notFound(
          'Cannot delete User Permissions with id=' +
            id +
            ' Maybe User Permissions was not found!'
        )
      );
      return;
    } else {
      if (sendData) {
        res.send({
          message: 'User Permissions was deleted successfully!',
          userPermissions: data,
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
    const data = await UserPermissions.findById(id);
    if (data === null) {
      console.log('findById==>before Error return', data);
      next(ApiError.notFound('Not found: Company with id=' + id));
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
    const data = await UserPermissions.find(condition);
    if (data === null) {
      console.log('findAll==>before Error return', data);
      next(ApiError.notFound('Not found: Company'));
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
    const data = await UserPermissions.paginate(condition, { offset, limit });
    if (data === null) {
      console.log('findAllPaginate==>before Error return', data);
      next(ApiError.notFound('Not found: User Permissions'));
      return;
    } else {
      if (sendData) {
        res.send({
          totalItems: data.totalDocs,
          userPermissions: data.docs,
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
