/*******************************************************************************************************
 * User Permissions Controller file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

// User Permissions Data Save and Load logic is in services Folder
const userPermissionsService = require('../services/userPermissions.service');
const groupPermissionsService = require('../services/groupPermissions.service');
const ApiError = require('../middleware/api.error');

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

class UserPermissionsController {
  async create(req, res, next) {
    if (!req.body) {
      next(
        ApiError.badRequest('User Permissions Data to Added can not be empty!')
      );
      return;
    }
    try {
      const { userId, userName, module, action, checked } = req.body;
      console.log('userId==>', userId);
      console.log('userName==>', userName);
      console.log('module==>', module);
      console.log('action==>', action);
      console.log('checked==>', checked);
      const userPermissionsDto = {
        userId,
        userName,
        module,
        action,
        checked,
      };
      console.log('userPermissionsDto==>', userPermissionsDto);
      return await userPermissionsService.create(userPermissionsDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async update(req, res, next) {
    if (!req.body) {
      next(
        ApiError.badRequest(
          'User Permissions Data to Updated can not be empty!'
        )
      );
      return;
    }
    try {
      const id = req.params.id;
      const { userId, userName, module, action, checked } = req.body;
      console.log('update User Permissions===>');
      console.log('userId ==>', userId);
      console.log('userName==>', userName);
      console.log('module==>', module);
      console.log('action ==>', action);
      console.log('checked==>', checked);

      const userPermissionsDto = {
        userId,
        userName,
        module,
        action,
        checked,
      };
      console.log('userPermissionsDto==>', userPermissionsDto);
      return await userPermissionsService.update(
        id,
        userPermissionsDto,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async deleteByUserId(req, res, next) {
    try {
      const userId = req.params.id;
      return await userPermissionsService.delete(userId, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      return await userPermissionsService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      console.log('update:params=', req.params);
      const id = req.params.id;
      return await userPermissionsService.findById(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //   //* ******************************************************************************************************************
  //   //* We can Search Companies by companyName, companyEmail, companyContactNo and companyWebsite query parameters
  //   //* ******************************************************************************************************************
  async findAll(req, res, next) {
    try {
      const { userId, userName, module, action } = req.query;
      var condition = {
        userId: { $regex: new RegExp(userId), $options: 'i' },
        userName: { $regex: new RegExp(userName), $options: 'i' },
        module: { $regex: new RegExp(module), $options: 'i' },
        action: { $regex: new RegExp(action), $options: 'i' },
      };
      console.log('findAll condition==>', condition);
      return await userPermissionsService.findAll(condition, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Companies by companyName, companyEmail, companyContactNo and companyWebsite query parameters
  //* We can do Pagination using page and Size query parameter, page no is 0 based
  //* ******************************************************************************************************************
  async findAllPaging(req, res, next) {
    try {
      const { page, size, userId, userName, module, action } = req.query;
      const userIds = [];
      userIds.push(userId);
      const condition = {
        userId: { $in: userIds !== undefined ? userIds : [] },
        // userId: { $regex: new RegExp(userId), $options: 'i' },
        userName: { $regex: new RegExp(userName), $options: 'i' },
        module: { $regex: new RegExp(module), $options: 'i' },
        action: { $regex: new RegExp(action), $options: 'i' },
      };
      console.log('findAll condition==>', condition);
      const { limit, offset } = getPagination(page, size);
      return await userPermissionsService.findAllPaginate(
        condition,
        limit,
        offset,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }
}

module.exports = new UserPermissionsController();
