const endOfDay = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');

const testTemplateService = require('../services/testTemplate.service');
const testTemplateQuestionService = require('../services/testTemplateQuestion.service');
const questionService = require('../services/question.service');
const ApiError = require('../middleware/api.error');
const Users = require('../models/Users');
const { ObjectId } = require('mongodb');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getTag = (tags, tag) => {
  const retTag = tags.filter((t) => t.tag === tag);
  return retTag[0];
};

const getOrder = (tags, tag) => {
  const retTag = tags.filter((t) => t.tag === tag);
  console.log('getLevel==retTag==>', retTag);
  return retTag[0].level;
};

const getLevel = (tags, tag) => {
  const retTag = tags.filter((t) => t.tag === tag);
  console.log('getLevel==retTag==>', retTag);
  return retTag[0].level;
};

const getWeightage = (tags, tag) => {
  const retTag = tags.filter((t) => t.tag === tag);
  console.log('getWeightage==retTag==>', retTag);
  return retTag[0].weightage;
};

class TestTemplateController {
  async create(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Test Template Data to Add can not be empty!'));
      return;
    }
    try {
      var {
        testName,
        testType,
        testDescription,
        testDuration,
        testDate,
        startTime,
        endTime,
        maxAttempt,
        isManual,
        isVerified,
        verifiedBy,
        tags,
        tagsBucket,
        questions,
        createdBy,
        modifiedBy,
      } = req.body;

      // console.log('req.user', req.user);
      const userId = req.user.id;
      // console.log('userId', userId);
      if (userId) {
        verifiedBy = userId;
        createdBy = userId;
        modifiedBy = userId;
      }
      // console.log('create==tags==>', tags);
      // console.log('create==tagsBucket==>', tagsBucket);
      // if(req.user ) {
      //   Users.find({_id : req.user.id}).then((response) => {
      //       // console.log('User======>', response);
      //       res.currentUser = response;
      //   }).catch((err) => {
      //       console.log(err);
      //   });
      // }
      const testTemplateTags = tagsBucket.map((t) => {
        return t.tag;
      });
      // console.log('testTemplateTags===>', testTemplateTags);

      let questionList = questions;
      // console.log('isManual===>', isManual);
      if (!isManual) {
        console.log('Inside isManual1===>');
        const condition = {
          tags: {
            $in:
              testTemplateTags !== undefined
                ? testTemplateTags
                : new RegExp(''),
          },
        };
        // console.log('condition===>', condition);
        const retQuestionList = await questionService.findAllPaginate(
          condition,
          undefined,
          2000,
          0,
          res,
          next,
          false
        );
        questionList = retQuestionList;
      }
      const questionCount = questionList ? questionList.length : 0;
      const testTemplateDto = {
        testName,
        testType,
        testDescription,
        testDuration,
        testDate,
        startTime,
        endTime,
        maxAttempt,
        isManual,
        isVerified,
        verifiedBy,
        createdBy,
        modifiedBy,
        tags,
        tagsBucket,
        questionCount,
      };

      const retTestTemplate = await testTemplateService.create(
        testTemplateDto,
        res,
        next
      );
      // console.log('testTemplate==>', retTestTemplate);
      if (retTestTemplate) {
        // console.log('testTemplate-Created==>', retTestTemplate);
        const testTemplateId = retTestTemplate.id;
        // console.log('Manual=questions===>', questions);
        // console.log('Before Adding Questions==>', questionList);
        if (questionList && questionList.length > 0) {
          console.log('Adding Questions=length==>', questionList.length);
          const newTemplateQuestions = questionList.map((q) => {
            // console.log('q.tags==>', q.tags);
            // console.log('testTemplateTags===>', testTemplateTags);

            const questionFilterTags = q.tagsBucket.filter((el) => {
              return testTemplateTags.find((element) => {
                return element === el.tag;
              });
            });
            const questionTagsExtraBucket = q.tagsBucket.filter(
              (qTag) => !testTemplateTags.some((tag) => qTag.tag === tag)
            );
            // const questionTagsExtraBucket = q.tagsBucket.filter((el) => {
            //   return testTemplateTags.find((element) => {
            //     return element !== el.tag;
            //   });
            // });
            // const questionFilterTags = q.tags.filter((qt) =>
            //   testTemplateTags.some((t) => qt.tag === t)
            // );
            // console.log('questionFilterTags==>', questionFilterTags);
            console.log('questionTagsExtraBucket==>', questionTagsExtraBucket);
            const questionTagsBucket = questionFilterTags.map((t) => {
              // console.log('tagsBucket====tags==t', tagsBucket, t);
              const tag = getTag(tagsBucket, t.tag);
              return {
                tag: t.tag,
                count: t.count,
                order: tag.order,
                level: tag.level,
                weightage: tag.weightage,
                finalWeightage: tag.weightage * t.count,
              };
            });
            console.log('question-tagsBucket==>', questionTagsBucket);
            return {
              testTemplateId: testTemplateId,
              questionId: q.id,
              questionType: q.questionType,
              text: q.text,
              files: q.files,
              selections: q.selections,
              tags: q.tags,
              tagsBucket: questionTagsBucket,
              tagsExtraBucket: questionTagsExtraBucket,
              options: q.options,
            };
          });
          console.log(
            'newTemplateQuestions Bef Batch Add==>',
            newTemplateQuestions
          );
          testTemplateQuestionService.createBatch(
            newTemplateQuestions,
            res,
            next
          );
        }
        res.status(200).send(retTestTemplate);
      }
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async assignUser(req, res, next) {
    if (!req.body) {
      next(
        ApiError.badRequest('Test Template Data to Assign can not be empty!')
      );
      return;
    }
    try {
      const id = req.body.id;
      const examineeId = req.body.examineeId;
      const examineeName = req.body.examineeName;
      console.log('testId===>', id);
      return await testTemplateService.assign(
        id,
        examineeId,
        examineeName,
        req,
        res,
        next
      );
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async assignUsers(req, res, next) {
    if (!req.body) {
      next(
        ApiError.badRequest('Test Template Data to Assign can not be empty!')
      );
      return;
    }
    try {
      console.log('req.body==>', req.body);
      const id = req.body.id;
      const examinees = req.body.examinees;
      console.log('testId===>', id);
      return await testTemplateService.assignUsers(
        id,
        examinees,
        req,
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
      next(
        ApiError.badRequest('Test Template Data to update can not be empty!')
      );
      return;
    }
    try {
      const id = req.params.id;
      const {
        testName,
        testType,
        testDescription,
        testDuration,
        testDate,
        startTime,
        endTime,
        isManual,
        isVerified,
        verifiedBy,
        tags,
        questions,
      } = req.body;

      console.log('req.user', req.user);
      const userId = req.user.id;
      console.log('userId', userId);
      if (userId) {
        modifiedBy = userId;
      }

      const testTemplateDto = {
        testName,
        testType,
        testDescription,
        testDuration,
        testDate,
        startTime,
        endTime,
        isManual,
        isVerified,
        verifiedBy,
        modifiedBy,
        tags,
      };
      // if(req.user ) {
      //   Users.find({_id : req.user.id}).then((response) => {
      //       // console.log('User======>', response);
      //       res.currentUser = response;
      //   }).catch((err) => {
      //       console.log(err);
      //   });
      // }
      //TODO save questions too
      return await testTemplateService.update(id, testTemplateDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      if (req.user) {
        Users.find({ _id: req.user.id })
          .then((response) => {
            // console.log('User======>', response);
            res.currentUser = response;
          })
          .catch((err) => {
            console.log(err);
          });
      }
      return await testTemplateService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      const id = req.params.id;
      return await testTemplateService.findById(id, res, next);
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
  // async findAll(req, res, next) {
  //   try {
  //     const { testName, testType, testDescription } = req.query;
  //     const condition = {
  //       testName: { $regex: new RegExp(testName), $options: 'i' },
  //       testType: { $regex: new RegExp(testType), $options: 'i' },
  //       testDescription: { $regex: new RegExp(testDescription), $options: 'i' },
  //     };
  //     return await testTemplateService.findAll(condition, res, next);
  //   } catch (err) {
  //     next(ApiError.internalError(err));
  //     return;
  //   }
  // }

  async findAll(req, res, next) {
    try {
      const { testName, testType, testDescription, testDate } = req.query;
      const condition = {
        testName: { $regex: new RegExp(testName), $options: 'i' },
        testType: { $regex: new RegExp(testType), $options: 'i' },
        testDescription: { $regex: new RegExp(testDescription), $options: 'i' },
        testDate: {
          $gte: startOfDay(new Date(testDate)),
          $lte: endOfDay(new Date(testDate)),
        },
      };
      return await testTemplateService.findAll(condition, res, next);
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
  //   async findAllPaging(req, res, next) {
  //     try {
  //       const { page, size, testName, testType, testDescription, testDate } = req.query;
  //       const condition = {
  //         testName: { $regex: new RegExp(testName), $options: 'i' },
  //         testType: { $regex: new RegExp(testType), $options: 'i' },
  //         testDescription: { $regex: new RegExp(testDescription), $options: 'i' },
  //         testDate: {
  //           $gte: startOfDay(new Date(testDate)),
  //           $lte: endOfDay(new Date(testDate)),
  //         },
  //       };
  //       const { limit, offset } = getPagination(page, size);
  //       return await testTemplateService.findAllPaginate(
  //         condition,
  //         limit,
  //         offset,
  //         res,
  //         next
  //       );
  //     } catch (err) {
  //       next(ApiError.internalError(err));
  //       return;
  //     }
  //   }
  // }

  async findAllPaging(req, res, next) {
    try {
      const { page, size, testType, testName, tags, sort } = req.query;
      console.log('findAllPaging==page==>', page);
      console.log('findAllPaging==size==>', size);
      console.log('findAllPaging==testType==>', testType);
      console.log('findAllPaging==testName==>', testName);
      console.log('findAllPaging==tags==>', tags);
      console.log('findAllPaging==sort==>', sort);

      let srt;
      if (sort && sort.length > 0) {
        const newSort = [];
        sort.forEach((srt) => {
          const s = ` "${srt.field}": ${srt.order} `;
          // console.log('s==>', s);
          newSort.push(s);
        });
        // console.log('newSort==>', newSort);
        const nNewSort = `{ ${newSort} }`.toString();
        srt = JSON.parse(nNewSort);
        // console.log('srt==>', srt);
      }
      const mySort = {
        $sort: srt !== undefined ? srt : {},
      };
      console.log('mySort==>', mySort);

      const condition = {
        testName: { $regex: new RegExp(testName), $options: 'i' },
        testType: { $regex: new RegExp(testType), $options: 'i' },
        // testDescription: { $regex: new RegExp(testDescription), $options: 'i' },
        tags: { $in: tags !== undefined ? tags : new RegExp('') },
        // testDate: {
        //   $gte: startOfDay(new Date(testDate)),
        //   $lte: endOfDay(new Date(testDate)),
        // },
      };
      console.log('findAllPaging==condition==>', condition);
      const { limit, offset } = getPagination(page, size);
      return await testTemplateService.findAllPaginate(
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

module.exports = new TestTemplateController();
