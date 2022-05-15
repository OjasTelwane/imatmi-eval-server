/*******************************************************************************************************
 * User Controller file
 * @user : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

// User Data Save and Load logic is in services Folder
const userService = require('../services/user.service');
const ApiError = require('../middleware/api.error');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

class UserController {
  async create(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('User Data to Added can not be empty!'));
      return;
    }
    try {
      console.log('create-user');

      const { name, empId, email, password, isActive, role } = req.body;
      const companyId = req.user.companyId;
      const userDto = {
        companyId,
        name,
        empId,
        email,
        password,
        role,
        isActive,
        isFirstTime: true,
      };
      console.log('create-user===>', userDto);
      return await userService.create(userDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }
  async createBatch(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('User Data to Added can not be empty!'));
      return;
    }
    try {
      console.log('create-user');

      const { name, empId, email, password, isActive, role } = req.body;
      const companyId = req.user.companyId;
      const userDto = {
        companyId,
        name,
        empId,
        email,
        password,
        role,
        isActive,
        isFirstTime: true,
      };
      console.log('create-user===>', userDto);
      return await userService.create(userDtos, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async update(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('User Data to Updated can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const companyId = req.user.companyId;
      const { name, empId, email, password, role, isActive } = req.body;
      const userDto = {
        companyId,
        name,
        empId,
        email,
        password,
        role,
        isActive,
      };
      return await userService.update(id, userDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      return await userService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      console.log('update:params=', req.params);
      const id = req.params.id;
      return await userService.findById(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Companies by userName, userEmail, userContactNo and userWebsite query parameters
  //* ******************************************************************************************************************
  async findAll(req, res, next) {
    try {
      const { name, empId, email, isAdmin, isActive } = req.query;
      const companyId = req.user.companyId;
      const companyIds = [];
      if (companyId) {
        companyIds.push(companyId);
      }
      var condition = {
        companyId: { $in: companyIds !== undefined ? companyIds : [] },
        name: { $regex: new RegExp(name), $options: 'i' },
        empId: { $regex: new RegExp(empId), $options: 'i' },
        email: { $regex: new RegExp(email), $options: 'i' },
      };

      return await userService.findAll(condition, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Companies by userName, userEmail, userContactNo and userWebsite query parameters
  //* We can do Pagination using page and Size query parameter, page no is 0 based
  //* ******************************************************************************************************************
  async findAllPaging(req, res, next) {
    try {
      const { page, size, name, empId, email, isAdmin, isActive } = req.query;
      const companyId = req.user.companyId;
      const companyIds = [];
      if (companyId) {
        companyIds.push(companyId);
      }
      const condition = {
        companyId: { $in: companyIds !== undefined ? companyIds : [] },
        name: { $regex: new RegExp(name), $options: 'i' },
        empId: { $regex: new RegExp(empId), $options: 'i' },
        email: { $regex: new RegExp(email), $options: 'i' },
      };
      const { limit, offset } = getPagination(page, size);
      return await userService.findAllPaginate(
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

  async updatePassword(req, res, next, sendData = true) {
    if (!req.body) {
      next(ApiError.badRequest('User Info can not be empty!'));
      return;
    }
    try {
      // const id = req.params.id;
      // const oldPassword = req.params.oldPassword;
      // const newPassword = req.params.newPassword;
      const { id, oldPassword, newPassword } = req.body;
      console.log('updatePassword==>', id, oldPassword, newPassword);
      return await userService.updatePassword(
        id,
        oldPassword,
        newPassword,
        res,
        next,
        sendData
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }
}

module.exports = new UserController();
