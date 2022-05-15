/*******************************************************************************************************
  Test Question Controller file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 12/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

// Test Question Data Save and Load logic is in services Folder
const testQuestionService = require('../services/testQuestion.service');
const ApiError = require('../middleware/api.error');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

class TestQuestionController {
  async create(req, res, next, emit = false) {
    if (!req.body) {
      next(ApiError.badRequest('test Question Data to Add can not be empty!'));
      return;
    }
    try {
      const {
        testId,
        duration,
        absentDuration,
        absentTimes,
        // status,
        isCorrect,
        numberOfAttempts,
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
      const testQuestionDto = {
        testId,
        duration,
        absentDuration,
        absentTimes,
        status,
        isCorrect,
        numberOfAttempts,
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
      const testQuestion = await testQuestionService.create(
        testQuestionDto,
        res,
        next
      );
      res.status(201).send(testQuestion);
      if (emit) {
        //Emit Event
        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit('onNewQuestion', testQuestion);
      }
      return testQuestion;
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
        ApiError.badRequest('Test Question Data to update can not be empty!')
      );
      return;
    }
    try {
      const id = req.params.id;
      let {
        testId,
        duration,
        absentDuration,
        absentTimes,
        // status
        // isCorrect,
        numberOfAttempts,
        questionId,
        questionType,
        text,
        files,
        selections,
        tags,
        tagsBucket,
        tagsExtraBucket,
        options,
        finish,
      } = req.body;
      console.log('before find old question===>', id);
      const oldQuestion = await testQuestionService.findById(
        id,
        res,
        next,
        false
      );
      console.log('found old question===>', oldQuestion);
      const status = 'Attempted';
      let isCorrect = false;
      const tagList = [];
      if (questionType === 0) {
        isCorrect = true;
        // Single Option
        options.forEach((o) => {
          o.isCorrectOption = false;
          if (o.selectedOption === o.isCorrect) {
            o.isCorrectOption = true;
            o.tags.forEach((t) => {
              tagList.push(t.tag);
            });
          } else {
            isCorrect = false;
          }
        });
      } else if (questionType === 1) {
        // Multi Option
        isCorrect = true;
        options.forEach((o) => {
          o.isCorrectOption = false;
          if (o.selectedOption === o.isCorrect) {
            o.isCorrectOption = true;
            o.tags.forEach((t) => {
              tagList.push(t.tag);
            });
          } else {
            isCorrect = false;
            tagList.splice(0, tagList.length);
          }
        });
      } else if (questionType === 2) {
        // Reorder Option
        isCorrect = true;
        options.forEach((o) => {
          o.isCorrectOption = false;
          if (o.orderNo === o.selectedOrderNo) {
            o.isCorrectOption = true;
            o.tags.forEach((t) => {
              tagList.push(t.tag);
            });
          } else {
            isCorrect = false;
            tagList.splice(0, tagList.length);
          }
        });
      } else {
        // Evaluation Option
        isCorrect = true;
        options.forEach((o) => {
          isCorrect = true;
          options.forEach((o) => {
            o.isCorrectOption = false;
            if (o.selectedOption === true) {
              o.isCorrectOption = true;
              o.tags.forEach((t) => {
                tagList.push(t.tag);
              });
            }
          });
        });
      }

      // Get Unique Tags
      tags = tagList.filter(
        (tag, index, self) => index === self.findIndex((t) => t === tag)
      );
      // tagsBucket
      //   tag
      //   count
      //   order
      //   level
      //   weightage
      //   finalWeightage
      tagsBucket = tags.map((u) => {
        return {
          tag: u,
          count: countOccurrences(tagList, u),
          weightage: 0,
        };
      });
      numberOfAttempts = oldQuestion.numberOfAttempts + 1;
      const testQuestionDto = {
        testId,
        duration,
        absentDuration,
        absentTimes,
        status,
        isCorrect,
        numberOfAttempts,
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
      console.log('Before question Update===>', testQuestionDto);
      const testQuestion = await testQuestionService.update(
        id,
        testQuestionDto,
        res,
        next
      );
      console.log('After question Update===>', testQuestion);
      // res.status(200).send(testQuestion);

      // copy old data following fields not present in DTO
      testQuestionDto.oldTagsBucket = [...oldQuestion.tagsBucket];
      testQuestionDto.oldIsCorrect = oldQuestion.isCorrect;
      //Emit Event
      const eventEmitter = req.app.get('eventEmitter');
      if (finish) {
        eventEmitter.emit('onFinishTest', testQuestionDto);
        console.log('eventEmitter======After onFinishTest===>');
      } else {
        eventEmitter.emit('onQuestionUpdate', testQuestionDto);
        console.log('eventEmitter======After onQuestionUpdate===>');
      }
      return testQuestionDto;
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      return await testQuestionService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      const id = req.params.id;
      return await testQuestionService.findById(id, res, next);
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
      const { testId } = req.query;
      const condition = {
        testId: { testId },
      };
      return await testQuestionService.findAll(condition, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async countQuestionFrequency(req, res, next) {
    try {
      console.log('req.querry ====>', req.query);
      const { questionId } = req.query;
      return await testQuestionService.countQuestionFrequency(
        questionId,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async maxTimeToAnswerQuestion(req, res, next) {
    try {
      console.log('req.querry ====>', req.query);
      const { questionId } = req.query;
      return await testQuestionService.maxTimeToAnswerQuestion(
        questionId,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async minTimeToAnswerQuestion(req, res, next) {
    try {
      console.log('req.querry ====>', req.query);
      const { questionId } = req.query;
      return await testQuestionService.minTimeToAnswerQuestion(
        questionId,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async avgTimeToAnswerQuestion(req, res, next) {
    try {
      console.log('req.querry ====>', req.query);
      const { questionId } = req.query;
      return await testQuestionService.minTimeToAnswerQuestion(
        questionId,
        res,
        next
      );
      console.log('Hello');
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
      const { page, size, testId, sort } = req.query;
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
        testId: testId,
      };
      const { limit, offset } = getPagination(page, size);

      return await testQuestionService.findAllPaginate(
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

module.exports = new TestQuestionController();
