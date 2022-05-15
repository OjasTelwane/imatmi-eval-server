/*******************************************************************************************************
 * Company Controller file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 15/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

// Company Data Save and Load logic is in services Folder
const companyService = require('../services/company.service');
const ApiError = require('../middleware/api.error');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

class CompanyController {
  async create(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Company Data to Added can not be empty!'));
      return;
    }
    try {
      const {
        companyName,
        companyEmail,
        companyContactNo,
        companyWebsite,
        isActive,
      } = req.body;
      const companyDto = {
        companyName,
        companyEmail,
        companyContactNo,
        companyWebsite,
        isActive,
      };
      return await companyService.create(companyDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async createCompanyAdmin(req, res, next) {
    if (!req.body) {
      next(
        ApiError.badRequest('Company Admin Data to Added can not be empty!')
      );
      return;
    }
    try {
      console.log('in company.controller.js createCompanyAdmin==>');
      const {
        companyName,
        companyEmail,
        companyContactNo,
        companyWebsite,
        isActive,
        name,
        empId,
        email,
        password,
        role,
        isAdmin,
      } = req.body;
      const companyAdminDto = {
        companyName,
        companyEmail,
        companyContactNo,
        companyWebsite,
        isActive,
        name,
        empId,
        email,
        password,
        role,
        isAdmin,
      };
      console.log('going to company.service.js from createCompanyAdmin==>');
      return await companyService.createCompanyAdmin(
        companyAdminDto,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async update(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Company Data to Updated can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const {
        companyName,
        companyEmail,
        companyContactNo,
        companyWebsite,
        isActive,
      } = req.body;
      const companyDto = {
        companyName,
        companyEmail,
        companyContactNo,
        companyWebsite,
        isActive,
      };
      return await companyService.update(id, companyDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      return await companyService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      console.log('update:params=', req.params);
      const id = req.params.id;
      return await companyService.findById(id, res, next);
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
      const {
        companyName,
        companyEmail,
        companyContactNo,
        companyWebsite,
        isActive,
      } = req.query;
      let condition = {
        companyName: { $regex: new RegExp(companyName), $options: 'i' },
        companyEmail: { $regex: new RegExp(companyEmail), $options: 'i' },
        companyContactNo: {
          $regex: new RegExp(companyContactNo),
          $options: 'i',
        },
        companyWebsite: { $regex: new RegExp(companyWebsite), $options: 'i' },
      };

      return await companyService.findAll(condition, res, next);
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
      const {
        page,
        size,
        companyName,
        companyEmail,
        companyContactNo,
        companyWebsite,
        isActive,
      } = req.query;
      const condition = {
        companyName: { $regex: new RegExp(companyName), $options: 'i' },
        companyEmail: { $regex: new RegExp(companyEmail), $options: 'i' },
        companyContactNo: {
          $regex: new RegExp(companyContactNo),
          $options: 'i',
        },
        companyWebsite: { $regex: new RegExp(companyWebsite), $options: 'i' },
      };
      const { limit, offset } = getPagination(page, size);
      return await companyService.findAllPaginate(
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

module.exports = new CompanyController();
