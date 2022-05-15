// Test Data Save and Load logic is in services Folder
const testService = require('../services/test.service');
const ApiError = require('../middleware/api.error');
const endOfDay = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

class TestController {
  async create(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Test Data to Add can not be empty!'));
      return;
    }

    try {
      var {
        examineeId,
        examineeName,
        testTemplateId,
        testName,
        testType,
        testDescription,
        testDuration,
        testDate,
        startTime,
        endTime,
        status,
        maxAttempt,
        isManual,
        score,
        tags,
        tagsBucket,
        tagsExtraBucket,
        questions,
      } = req.body;

      const testDto = {
        examineeId,
        examineeName,
        testTemplateId,
        testName,
        testType,
        testDescription,
        testDuration,
        testDate,
        startTime,
        endTime,
        status,
        maxAttempt,
        isManual,
        score,
        tags,
        tagsBucket,
        tagsExtraBucket,
        questions,
      };
      return await testService.create(testDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async update(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Test Data to update can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const {
        examineeId,
        examineeName,
        testTemplateId,
        testName,
        testType,
        testDescription,
        testDuration,
        testDate,
        startTime,
        endTime,
        status,
        maxAttempt,
        isManual,
        score,
        tagsBucket,
        tagsExtraBucket,
        questions,
      } = req.body;
      const testDto = {
        examineeId,
        examineeName,
        testTemplateId,
        testName,
        testType,
        testDescription,
        testDuration,
        testDate,
        startTime,
        endTime,
        status,
        maxAttempt,
        isManual,
        score,
        tagsBucket,
        tagsExtraBucket,
        questions,
      };
      return await testService.update(id, testDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async start(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Test Data to update can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const { testDate, startTime } = req.body;

      const test = await testService.findById(id, res, next);
      if (test) {
        test.status = 'Start';
        test.testDate = testDate;
        test.startTime = startTime;
        test.endTime = startTime;
        test.maxAttempt = test.maxAttempt - 1;
      }
      return await testService.update(id, test, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async end(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Test Data to update can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const { endTime } = req.body;

      const test = await testService.findById(id, res, next);
      if (test) {
        test.status = 'Complete';
        test.endTime = endTime;
        test.maxAttempt = test.maxAttempt - 1;
      }
      return await testService.update(id, test, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async progress(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Test Data to update can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const { endTime } = req.body;

      const test = await testService.findById(id, res, next);
      if (test) {
        test.status = 'Progress';
        test.endTime = endTime;
      }
      return await testService.update(id, test, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async reAssign(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Test Data to update can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const { testDate, startTime, endTime } = req.body;

      const test = await testService.findById(id, res, next);
      if (test.status !== 'Completed') {
        next(
          ApiError.badRequest(
            'Test can not be Re-assigned as it is NOT Complate!'
          )
        );
        return;
      }
      const newTest = { id, score, questions, ...test };
      // console.log('newTest===>', newTest);
      if (newTest) {
        newTest.status = 'Assigned';
        newTest.testDate = testDate;
        newTest.startTime = startTime;
        newTest.endTime = endTime;
      }
      // console.log('newTest To add===>', newTest);
      const retTest = await testService.create(newTest, res, next);
      // const retTest;
      // console.log('retTest===>', retTest);
      if (retTest) {
        test.maxAttempt = 0;
        return await testService.update(id, test, res, next);
      }
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      return await testService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      const id = req.params.id;
      return await testService.findById(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Tests by text, tag, optionText, optionTag query parameters
  //* we search text in question.ques.text, tag in question.ques.tags
  //* optionText in question.options.text and optionTag in question.options.tags.tag respectively
  //* ******************************************************************************************************************
  async findAll(req, res, next) {
    try {
      const {
        // examineeId,
        testName,
        testType,
        testDescription,
        testAttended,
        testDate,
      } = req.query;
      console.log('examineeID in findAll===> ', req.query);
      const condition = {
        // examineeId: { examineeId },
        testName: { $regex: new RegExp(testName), $options: 'i' },
        testType: { $regex: new RegExp(testType), $options: 'i' },
        testDescription: { $regex: new RegExp(testDescription), $options: 'i' },
        testAttended: { testAttended },
        testDate: {
          $gte: startOfDay(new Date(testDate)),
          $lte: endOfDay(new Date(testDate).addDays(1)),
        },
      };
      return await testService.findAll(condition, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Questions by text, tag, optionText, optionTag query parameters
  //* we search text in question.ques.text, tag in question.ques.tags
  //* optionText in question.options.text and optionTag in question.options.tags.tag respectively
  //* We can do Pagination using page and Size query parameter, page no is 0 based
  //* ******************************************************************************************************************
  async findAllPaging(req, res, next) {
    try {
      let {
        page,
        size,
        examineeId,
        testType,
        testDate,
        testName,
        tags,
        examineeName,
        status,
        sort,
      } = req.query;

      // let srt;
      // if (sort && sort.length > 0) {
      //   const newSort = [];
      //   sort.forEach((srt) => {
      //     const s = ` "${srt.field}": ${srt.order} `;
      //     // console.log('s==>', s);
      //     newSort.push(s);
      //   });
      //   // console.log('newSort==>', newSort);
      //   const nNewSort = `{ ${newSort} }`.toString();
      //   srt = JSON.parse(nNewSort);
      //   // console.log('srt==>', srt);
      // }
      // const mySort = {
      //   $sort: srt !== undefined ? srt : {},
      // };
      console.log('Test Type==>', testType);
      console.log('Test Date==>', testDate);
      console.log('Test Name==>', testName);
      console.log('tags==>', tags);
      console.log('status==>', status);
      // console.log('mySort==>', mySort);

      const condition = {
        examineeId: { $regex: new RegExp(examineeId), $options: 'i' },
        // testType: {
        //   $in: testType !== undefined ? testType : [0, 1, 2, 3],
        // },
        testDate: { $regex: new RegExp(testDate), $options: 'i' },
        testName: { $regex: new RegExp(testName), $options: 'i' },
        status: { $regex: new RegExp(status), $options: 'i' },
        tags: { $in: tags !== undefined ? tags : new RegExp('') },
        examineeName: { $regex: new RegExp(examineeName), $options: 'i' },
      };
      const { limit, offset } = getPagination(page, size);
      return await testService.findAllPaginate(
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

module.exports = new TestController();
