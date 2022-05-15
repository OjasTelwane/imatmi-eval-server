/*******************************************************************************************************
  Test Template Question Controller file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 12/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

// Test Question Data Save and Load logic is in services Folder
const testTemplateQuestionService = require('../services/testTemplateQuestion.service');
const ApiError = require('../middleware/api.error');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

class TestTemplateQuestionController {
  async create(req, res, next, emit = false) {
    if (!req.body) {
      next(
        ApiError.badRequest(
          'testTemplate Question Data to Add can not be empty!'
        )
      );
      return;
    }

    try {
      var {
        testTemplateId,
        questionId,
        questionType,
        text,
        files,
        selections,
        tags,
        tagsBucket,
        tagsExtraBucket,
        options,
      } = req.body;
      const status = 'Assigned';
      const testTemplateQuestionDto = {
        testTemplateId,
        questionId,
        questionType,
        text,
        files,
        selections,
        tags,
        tagsBucket,
        tagsExtraBucket,
        options,
      };
      const testTemplateQuestion = await testTemplateQuestionService.create(
        testTemplateQuestionDto,
        res,
        next
      );
      res.status(201).send(testTemplateQuestion);
      return testTemplateQuestion;
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async add(req, res, next) {
    return create(req, res, next, true);
  }

  async update(req, res, next) {
    if (!req.body) {
      next(
        ApiError.badRequest(
          'testTemplate Question Data to update can not be empty!'
        )
      );
      return;
    }
    try {
      const id = req.params.id;
      const {
        testTemplateId,
        questionId,
        questionType,
        text,
        files,
        selections,
        tags,
        tagsBucket,
        tagsExtraBucket,
        options,
      } = req.body;

      const testTemplateQuestionDto = {
        testTemplateId,
        questionId,
        questionType,
        text,
        files,
        selections,
        tags,
        tagsBucket,
        tagsExtraBucket,
        options,
      };
      const testTemplateQuestion = await testQuestionService.update(
        id,
        testTemplateQuestionDto,
        res,
        next
      );
      res.status(200).send(testTemplateQuestion);
      return testTemplateQuestionDto;
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      return await testTemplateQuestionService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      const id = req.params.id;
      return await testTemplateQuestionService.findById(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async findAll(req, res, next) {
    try {
      const { testTemplateId, tags } = req.query;
      const condition = {
        testTemplateId: { testTemplateId },
        'tagsBucket.tag': { $in: tags !== undefined ? tags : new RegExp('') },
      };
      return await testTemplateQuestionService.findAll(condition, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async countQuestionFrequency(req, res, next) {
    try {
      console.log('req.querry ====>', req.query);
      const { questionId } = req.query;
      return await testTemplateQuestionService.countQuestionFrequency(
        questionId,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async findAllPaging(req, res, next) {
    try {
      const { page, size, testTemplateId, tags, sort } = req.query;
      let srt;
      if (sort && sort.length > 0) {
        const newSort = [];
        sort.forEach((srt) => {
          const s = ` "${srt.field}": ${srt.order} `;
          newSort.push(s);
        });
        const nNewSort = `{ ${newSort} }`.toString();
        srt = JSON.parse(nNewSort);
        // console.log('srt==>', srt);
      }
      const mySort = {
        $sort: srt !== undefined ? srt : {},
      };
      console.log('mySort==>', mySort);

      const condition = {
        testTemplateId: testTemplateId,
        'tagsBucket.tag': { $in: tags !== undefined ? tags : new RegExp('') },
      };
      console.log('condition==>', condition);

      const { limit, offset } = getPagination(page, size);

      return await testTemplateQuestionService.findAllPaginate(
        condition,
        mySort,
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

module.exports = new TestTemplateQuestionController();
