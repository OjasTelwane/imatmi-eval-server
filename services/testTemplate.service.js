const TestTemplate = require('../models/TestTemplate');
const ApiError = require('../middleware/api.error');

const testService = require('./test.service');
const testQuestionService = require('./testQuestion.service');
const testTemplateQuestionService = require('./testTemplateQuestion.service');
const logger = require('../config/logger');

exports.create = async (testTemplateDto, res, next) => {
  try {
    const newTestTemplate = new TestTemplate(testTemplateDto);
    const data = await newTestTemplate.save();
    if (!data) {
      logger.log({
        level: 'error',
        message: 'Test create',
        metadata: { user: res.currentUser },
      });

      next(ApiError.badRequest('Error in Template Insert!'));
      return;
    } else {
      res.status(201).send(data);
      logger.log({
        level: 'info',
        message: 'Test create',
        metadata: { user: res.currentUser },
      });
      return data;
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.update = async (id, testTemplateDto, res, next) => {
  try {
    const data = await TestTemplate.findByIdAndUpdate(id, testTemplateDto, {
      useFindAndModify: false,
    });
    if (!data) {
      logger.log({
        level: 'error',
        message: 'Test update',
        metadata: { user: res.currentUser },
      });

      next(
        ApiError.notFound(
          'Cannot update Test Template with id==' +
            id +
            ' Maybe Test Template was not found!'
        )
      );
      return;
    } else {
      res.status(200).send(data);
      logger.log({
        level: 'info',
        message: 'Test update',
        metadata: { user: res.currentUser },
      });

      return data;
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.delete = async (id, res, next) => {
  try {
    const data = await TestTemplate.findByIdAndRemove(id, {
      useFindAndModify: false,
    });
    if (!data) {
      logger.log({
        level: 'error',
        message: 'Test delete',
        metadata: { user: res.currentUser },
      });

      next(
        ApiError.notFound(
          'Cannot delete Test Template with id=' +
            id +
            ' Maybe Test Template was not found!'
        )
      );
      return;
    } else {
      logger.log({
        level: 'info',
        message: 'Test delete',
        metadata: { user: res.currentUser },
      });

      res.send({
        message: 'Test Template was deleted successfully!',
        testTemplate: data,
      });
      const condition = {
        testTemplateId: { id },
      };
      const testTemplateQuestionList =
        await testTemplateQuestionService.findAll(condition, res, next);
      if (testTemplateQuestionList && testTemplateQuestionList.length > 0) {
        testTemplateQuestionList.forEach((tq) => {
          testTemplateQuestionService.delete(tq.id);
        });
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

const getQuestionCountForTag = async (questions, tag) => {
  try {
    if (questions && tag) {
      const filterQuestions = questions.filter((q) => q.tags.includes(tag));
      if (filterQuestions) {
        return filterQuestions.length;
      }
      return 0;
    }
  } catch (error) {
    console.log('getQuestionCountForTag=error==>', error);
    return 0;
  }
};

const processTagsBucket = (tagsBucket, isManual, questionList) => {
  return tagsBucket.map((tb) => {
    return {
      tag: tb.tag,
      count: 0,
      order: tb.order,
      level: tb.level,
      weightage: tb.weightage,
      questionCount: 0,
      answerCount: 0,
      finalWeghtage: 0,
    };
  });
};

exports.assign = async (id, examineeId, examineeName, req, res, next) => {
  try {
    console.log('assign==>', id);
    const testTemplate = await TestTemplate.findById(id);
    console.log('Found Template==>', testTemplate);
    if (testTemplate === null) {
      console.log('Aassign==>before Error return', testTemplate);
      next(ApiError.notFound('Not found: Test Template with id=' + id));
      return;
    } else {
      let testTemplateQuestionList = [];
      let questions = [];
      if (testTemplate.isManual) {
        const condition = {
          testTemplateId: id,
        };
        console.log('Before Find Questions');
        testTemplateQuestionList = await testTemplateQuestionService.findAll(
          condition,
          res,
          next
        );
        questions = testTemplateQuestionList.map((q) => {
          return q.questionIs.toString();
        });
        console.log('After Find Questions');
      }
      const tagsBucket = await processTagsBucket(
        testTemplate.tagsBucket,
        testTemplate.isManual,
        testTemplateQuestionList
      );
      if (questions && questions.length > 0) {
        for (let index = 0; index < tagsBucket.length; index++) {
          tagsBucket[index].questionCount = await getQuestionCountForTag(
            questions,
            tagsBucket[index].tag
          );
        }
      }
      const test = {
        examineeId: examineeId,
        examineeName: examineeName,
        testTemplateId: id,
        status: 'Assigned',
        testName: testTemplate.testName,
        testType: testTemplate.testType,
        testDescription: testTemplate.testDescription,
        testDuration: testTemplate.testDuration,
        testDate: testTemplate.testDate,
        startTime: testTemplate.startTime,
        endTime: testTemplate.endTime,
        maxAttempt: testTemplate.maxAttempt,
        isManual: testTemplate.isManual,
        tags: testTemplate.tags,
        tagsBucket: tagsBucket,
        questions: questions,
        // testAttended: false,
        score: {
          totalQuestions: testTemplate.isManual
            ? testTemplate.questionCount
            : 0,
          totalAnswered: 0,
          totalNotAnswered: testTemplate.isManual
            ? testTemplate.questionCount
            : 0,
          totalMarkedForReview: 0,
          totalCorrectAnswered: 0,
        },
      };
      console.log('Before Creating Test');
      const retTest = await testService.create(test, res, next);
      console.log('After Creating Test==>', retTest);
      const testId = retTest._id;
      if (!testTemplate.isManual) {
        //Emit Event
        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit('onTestAssign', retTest);
      }
      if (testTemplateQuestionList && testTemplateQuestionList.length > 0) {
        console.log(
          'testTemplateQuestionList.length==>',
          testTemplateQuestionList.length
        );
        const testQuestions = testTemplateQuestionList.map((question) => {
          return {
            testId: testId,
            testTemplateId: question.testTemplateId,
            questionId: question.questionId,
            status: 'Assigned',
            questionType: question.questionType,
            text: question.text,
            files: question.files,
            selections: question.selections,
            tags: question.tags,
            tagsBucket: question.tagsBucket,
            tagsExtraBucket: question.tagsExtraBucket,
            options: question.options.map((option) => {
              return {
                setNo: option.setNo,
                orderNo: option.orderNo,
                isCorrect: option.isCorrect,
                text: option.text,
                files: option.files,
                selections: option.selections,
                tags: option.tags,
                selectedOption: false,
                selectedOrderNo: 0,
                isCorrectOption: false,
              };
            }),
          };
        });
        if (testQuestions && testQuestions.length > 0) {
          testQuestionService.createBatch(testQuestions, res, next);
        }
      }
      res.status(200).send(retTest);
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.assignUsers = async (id, examinees, req, res, next) => {
  try {
    console.log('assignUsers==>', id);
    const testTemplate = await TestTemplate.findById(id);
    if (testTemplate === null) {
      console.log('assignUsers==>before Error return', testTemplate);
      next(ApiError.notFound('Not found: Test Template with id=' + id));
      return;
    } else {
      let testTemplateQuestionList = [];
      let questions = [];
      if (testTemplate.isManual) {
        const condition = {
          testTemplateId: id,
        };

        testTemplateQuestionList = await testTemplateQuestionService.findAll(
          condition,
          res,
          next,
          false
        );
        questions = testTemplateQuestionList.map((q) => {
          return q.questionIs.toString();
        });
      }
      const tagsBucket = processTagsBucket(
        testTemplate.tagsBucket,
        testTemplate.isManual,
        testTemplateQuestionList
      );
      if (questions && questions.length > 0) {
        for (let index = 0; index < tagsBucket.length; index++) {
          tagsBucket[index].questionCount = await getQuestionCountForTag(
            questions,
            tagsBucket[index].tag
          );
        }
      }

      const tests = await examinees.map((examinee) => {
        return {
          examineeId: examinee.examineeId,
          examineeName: examinee.examineeName,
          testTemplateId: id,
          testName: testTemplate.testName,
          testType: testTemplate.testType,
          status: 'Assigned',
          testDescription: testTemplate.testDescription,
          testDuration: testTemplate.testDuration,
          testDate: testTemplate.testDate,
          startTime: testTemplate.startTime,
          endTime: testTemplate.endTime,
          tags: testTemplate.tags,
          tagsBucket: tagsBucket,
          questions: questions,
          // testAttended: false,
          score: {
            totalQuestions: testTemplate.isManual
              ? testTemplate.questionCount
              : 0,
            totalAnswered: 0,
            totalNotAnswered: testTemplate.isManual
              ? testTemplate.questionCount
              : 0,
            totalMarkedForReview: 0,
            totalCorrectAnswered: 0,
          },
        };
      });

      console.log('Before Adding tests 3', tests.length);
      for (let index = 0; index < tests.length; index++) {
        const test = tests[index];
        const retTest = await testService.create(test, res, next);
        if (retTest) {
          const testId = retTest._id;
          if (!testTemplate.isManual) {
            //Emit Event
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('onTestAssign', retTest);
          }
          if (testTemplate.isManual) {
            const testQuestions = testTemplateQuestionList.map((question) => {
              return {
                testId: testId,
                testTemplateId: id,
                questionId: question.questionId,
                status: 'Assigned',
                questionType: question.questionType,
                text: question.text,
                files: question.files,
                selections: question.selections,
                tags: question.tags,
                tagsBucket: question.tagsBucket,
                tagsExtraBucket: question.tagsExtraBucket,
                options: question.options.map((option) => {
                  return {
                    setNo: option.setNo,
                    orderNo: option.orderNo,
                    isCorrect: option.isCorrect,
                    text: option.text,
                    files: option.files,
                    selections: option.selections,
                    tags: option.tags,
                    selectedOption: false,
                    selectedOrderNo: 0,
                    isCorrectOption: false,
                  };
                }),
              };
            });
            if (testQuestions && testQuestions.length > 0) {
              console.log('Before Batch Add===>', testQuestions.length);
              testQuestionService.createBatch(testQuestions, res, next);
            }
          }
        }
      }
      res.status(200).send(tests);
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findById = async (id, res, next) => {
  try {
    console.log('findById==>', id);
    const data = await TestTemplate.findById(id).populate('questions');
    if (data === null) {
      console.log('findById==>before Error return', data);
      next(ApiError.notFound('Not found: Test Template with id=' + id));
      return;
    } else {
      res.send(data);
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAllPaginate = async (condition, limit, offset, res, next) => {
  try {
    console.log('testTemplate.service==condition==>', condition);
    TestTemplate.paginate(condition, { populate: 'questions', offset, limit })
      .then((data) => {
        res.send({
          totalItems: data.totalDocs,
          testTemplates: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Some error occurred while retrieving Test Templates'
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};
