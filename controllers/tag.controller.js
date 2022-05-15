/*******************************************************************************************************
 * Tag Controller file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 15/09/2021 Ojas Telwane	Created
 *******************************************************************************************************/

// Tag Data Save and Load logic is in services Folder
const tagService = require('../services/tag.service');
const ApiError = require('../middleware/api.error');

const getPagination = (page, size) => {
  const limit = size ? +size : 500;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

class TagController {
  async create(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Tag Data to Added can not be empty!'));
      return;
    }
    try {
      const { tag, tagType, isVerified } = req.body;
      const tagDto = { tag, tagType, isVerified };
      return await tagService.create(tagDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async createBatch(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Tag Data to Added can not be empty!'));
      return;
    }
    try {
      let data = req.body;
      // Create a Array of tagDto objects
      const tagDtos = [];
      data.forEach((row) => {
        tagDtos.push({
          tag: row.tag,
          tagType: row.tagType,
          isVerified: row.isVerified,
        });
      });

      return await tagService.createBatch(tagDtos, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async update(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Tag Data to Updated can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const { tag, tagType, isVerified } = req.body;
      const tagDto = { tag, tagType, isVerified };
      return await tagService.update(id, tagDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      return await tagService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      console.log('update:params=', req.params);
      const id = req.params.id;
      return await tagService.findById(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Tags by tag and tagType query parameters
  //* ******************************************************************************************************************
  async findAll(req, res, next) {
    try {
      const { tag, tagType } = req.query;
      var condition = {
        tag: { $regex: new RegExp(tag), $options: 'i' },
        tagType: { $regex: new RegExp(tagType), $options: 'i' },
      };

      return await tagService.findAll(condition, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Tags by tag and tagType
  //* We can do Pagination using page and Size query parameter, page no is 0 based
  //* ******************************************************************************************************************
  async findAllPaging(req, res, next) {
    try {
      const { page, size, tag, tagType } = req.query;

      const condition = {
        tag: { $regex: new RegExp(tag), $options: 'i' },
        tagType: { $regex: new RegExp(tagType), $options: 'i' },
      };
      const { limit, offset } = getPagination(page, size);
      return await tagService.findAllPaginate(
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

module.exports = new TagController();
