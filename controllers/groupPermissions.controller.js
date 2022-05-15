/*******************************************************************************************************
 * Group Permissions Controller file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

// Group Permissions Data Save and Load logic is in services Folder
const groupPermissionsService = require('../services/groupPermissions.service');
const ApiError = require('../middleware/api.error');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

class GroupPermissionsController {
  async init(req, res, next) {
    try {
      return await groupPermissionsService.init(res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async create(req, res, next) {
    if (!req.body) {
      next(
        ApiError.badRequest('Group Permissions Data to Added can not be empty!')
      );
      return;
    }
    try {
      const { role, module, action } = req.body;
      const groupPermissionsDto = {
        role,
        module,
        action,
      };
      console.log('create GroupPermissionsController==>');
      return await groupPermissionsService.create(
        groupPermissionsDto,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  // async createCompanyAdmin(req, res, next) {
  //   if (!req.body) {
  //     next(
  //       ApiError.badRequest('Company Admin Data to Added can not be empty!')
  //     );
  //     return;
  //   }
  //   try {
  //     console.log('in company.controller.js createCompanyAdmin==>');
  //     const {
  //       companyName,
  //       companyEmail,
  //       companyContactNo,
  //       companyWebsite,
  //       isActive,
  //       name,
  //       empId,
  //       email,
  //       password,
  //       isAdmin,
  //     } = req.body;
  //     const companyAdminDto = {
  //       companyName,
  //       companyEmail,
  //       companyContactNo,
  //       companyWebsite,
  //       isActive,
  //       name,
  //       empId,
  //       email,
  //       password,
  //       isAdmin,
  //     };
  //     console.log('going to company.service.js from createCompanyAdmin==>');
  //     return await companyService.createCompanyAdmin(
  //       companyAdminDto,
  //       res,
  //       next
  //     );
  //   } catch (err) {
  //     next(ApiError.internalError(err));
  //     return;
  //   }
  // }

  async update(req, res, next) {
    if (!req.body) {
      next(
        ApiError.badRequest(
          'Group Permissions Data to Updated can not be empty!'
        )
      );
      return;
    }
    try {
      console.log('update GroupPermissionsController==>');
      const id = req.params.id;
      const { role, module, action } = req.body;
      const groupPermissionsDto = {
        role,
        module,
        action,
      };
      console.log('groupPermissionsDto==>', groupPermissionsDto);
      return await groupPermissionsService.update(
        id,
        groupPermissionsDto,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      console.log('delete GroupPermissionsController==>');
      const id = req.params.id;
      return await groupPermissionsService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      console.log('find GroupPermissionsController==>');
      console.log('update:params=', req.params);
      const id = req.params.id;
      return await groupPermissionsService.findById(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Companies by companyName, companyEmail, companyContactNo and companyWebsite query parameters
  //* ******************************************************************************************************************
  async findAll(req, res, next) {
    try {
      console.log('findALL GroupPermissionsController==>');
      const { role, module, action } = req.query;
      var condition = {
        role: { $regex: new RegExp(role), $options: 'i' },
        module: { $regex: new RegExp(module), $options: 'i' },
        action: { $regex: new RegExp(action), $options: 'i' },
      };
      console.log('condition==>', condition);
      return await groupPermissionsService.findAll(condition, res, next, true);
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
      console.log('findAllPaging GroupPermissionsController==>');
      let { page, size, role, module, action } = req.query;
      console.log('page==>', page);
      console.log('size==>', size);
      console.log('role==>', role);
      console.log('module==>', module);
      console.log('action==>', action);
      const condition = {
        role: { $regex: new RegExp(role), $options: 'i' },
        module: { $regex: new RegExp(module), $options: 'i' },
        // action: { $regex: new RegExp(action), $options: 'i' },
      };
      const { limit, offset } = getPagination(page, size);
      return await groupPermissionsService.findAllPaginate(
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

module.exports = new GroupPermissionsController();
