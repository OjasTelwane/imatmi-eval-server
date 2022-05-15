/*******************************************************************************************************
 * Lookup Controller file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

// Lookup Data Save and Load logic is in services Folder
const lookupService = require('../services/lookup.service');
const ApiError = require('../middleware/api.error');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

class LookupController {
  async create(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Lookup Data to Added can not be empty!'));
      return;
    }
    try {
      const { lookupType, lookup, isActive } = req.body;
      const lookupDto = { lookupType, lookup, isActive };
      return await lookupService.create(lookupDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async createBatch(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Lookup Data to Added can not be empty!'));
      return;
    }
    try {
      let data = req.body;
      // Create a Array of lookupDto objects
      const lookupDtos = [];
      data.forEach((row) => {
        lookupDtos.push({
          lookupType: row.lookupType,
          lookup: row.lookup,
          isActive: row.isActive,
        });
      });

      return await lookupService.createBatch(lookupDtos, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async update(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Lookup Data to Updated can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const { lookupType, lookup, isActive } = req.body;
      const lookupDto = { lookupType, lookup, isActive };
      return await lookupService.update(id, lookupDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      return await lookupService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      console.log('update:params=', req.params);
      const id = req.params.id;
      return await lookupService.findById(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Lookups by lookup and lookupType query parameters
  //* ******************************************************************************************************************
  async findAll(req, res, next) {
    try {
      const { lookupType, lookup } = req.query;
      var condition = {
        lookupType: { $regex: new RegExp(lookupType), $options: 'i' },
        lookup: { $regex: new RegExp(lookup), $options: 'i' },
      };
      return await lookupService.findAll(condition, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Lookups by lookup and lookupType
  //* We can do Pagination using page and Size query parameter, page no is 0 based
  //* ******************************************************************************************************************
  async findAllPaging(req, res, next) {
    try {
      const { page, size, lookupType, lookup } = req.query;
      const condition = {
        lookupType: { $regex: new RegExp(lookupType), $options: 'i' },
        lookup: { $regex: new RegExp(lookup), $options: 'i' },
      };

      const { limit, offset } = getPagination(page, size);
      return await lookupService.findAllPaginate(
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

module.exports = new LookupController();
