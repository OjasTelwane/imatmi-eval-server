const questionService = require('../services/question.service');
const ApiError = require('../middleware/api.error');
const Users = require('../models/Users');
const { ObjectId } = require('mongodb');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

// const joinWithoutDupes = (A, B) => {
//   const a = new Set(A.map((x) => x.item));
//   const b = new Set(B.map((x) => x.item));
//   return [
//     ...A.filter((x) => !b.has(x.item)),
//     ...B.filter((x) => !a.has(x.item)),
//   ];
// }

const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

class QuestionController {
  async create(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Question Data to Add can not be empty!'));
      return;
    }
    try {
      var {
        questionType,
        isActive,
        isVerified,
        verifiedBy,
        createdBy,
        modifiedBy,
        text,
        files,
        fileContentType,
        selections,
        options,
      } = req.body;

      const tagList = [];
      for (var i = 0; i < options.length; i++) {
        const option = options[i];
        option.tags.forEach((t) => {
          tagList.push(t);
        });
      }
      const optionTagList = tagList.map((t) => {
        return t.tag;
      });

      // console.log('tagList-In===> :', tagList);
      const newTagList = tagList.filter(
        (tag, index, self) => index === self.findIndex((t) => t.tag === tag.tag)
      );
      // console.log('tagList-Out===> :', newTagList);
      const tags = newTagList.map((tag) => {
        return tag.tag;
      });
      const tagsBucket = newTagList.map((tag) => {
        return {
          tag: tag.tag,
          count: countOccurrences(optionTagList, tag.tag),
        };
      });
      // console.log('tags===> :', tags);

      console.log('req.body :', req.body);
      console.log('req.user', req.user);
      const userId = req.user.id;
      console.log('userId', userId);
      if (userId) {
        verifiedBy = userId;
        createdBy = userId;
        modifiedBy = userId;
      }
      const questionDto = {
        questionType,
        isActive,
        isVerified,
        verifiedBy,
        createdBy,
        modifiedBy,
        text,
        files,
        fileContentType,
        selections,
        tags,
        tagsBucket,
        options,
      };

      return await questionService.create(questionDto, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async createBatch(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Question Data to Add can not be empty!'));
      return;
    }
    try {
      const data = req.body;
      // Create a Array of questionDto objects
      const questionsDtos = [];
      data.forEach((row) => {
        const tagList = [];
        for (var i = 0; i < row.options.length; i++) {
          const option = options[i];
          option.tags.forEach((t) => {
            tagList.push(t);
          });
        }
        const optionTagList = tagList.map((t) => {
          return t.tag;
        });

        // let newTagList = tagList.filter((c, index) => {
        //   return tagList.indexOf(c) === index;
        // });

        // console.log('tagList-In===> :', tagList);
        const newTagList = tagList.filter(
          (tag, index, self) =>
            index === self.findIndex((t) => t.tag === tag.tag)
        );

        // console.log('tagList-Out===> :', newTagList);
        const tags = newTagList.map((tag) => {
          return tag.tag;
        });
        const tagsBucket = newTagList.map((tag) => {
          return {
            tag: tag.tag,
            count: countOccurrences(optionTagList, tag.tag),
          };
        });
        // console.log('tags===> :', tags);
        console.log('NewTagList===> :', newTagList);

        // let tagList = [{}];
        // row.options.forEach((option) => {
        //   tagList = joinWithoutDupes(tagList, option.tags);
        // });
        // console.log('tagList===> :', tagList);

        questionsDtos.push({
          questionType: row.questionType,
          isActive: row.isActive,
          isVerified: row.isVerified,
          verifiedBy: row.verifiedBy,
          createdBy: row.createdBy,
          modifiedBy: row.modifiedBy,
          text: row.text,
          files: row.files,
          fileContentType: row.fileContentType,
          selections: row.selections,
          tags: tags,
          tagsBucket: tagsBucket,
          options: row.options,
        });
      });
      return await questionService.createBatch(questionsDtos, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async update(req, res, next) {
    if (!req.body) {
      next(ApiError.badRequest('Question Data to update can not be empty!'));
      return;
    }
    try {
      const id = req.params.id;
      const {
        questionType,
        isActive,
        isVerified,
        verifiedBy,
        createdBy,
        modifiedBy,
        text,
        files,
        fileContentType,
        selections,
        options,
      } = req.body;

      const tagList = [];
      for (var i = 0; i < options.length; i++) {
        const option = options[i];
        // console.log('option.tags===>', option.tags);
        option.tags.forEach((t) => {
          tagList.push(t);
        });
      }
      // console.log('tagList-In===> :', tagList);
      const optionTagList = tagList.map((t) => {
        return t.tag;
      });

      const newTagList = tagList.filter(
        (tag, index, self) => index === self.findIndex((t) => t.tag === tag.tag)
      );

      // console.log('newTagList===> :', newTagList);

      // console.log('tagList-Out===> :', newTagList);
      const tags = newTagList.map((tag) => {
        return tag.tag;
      });
      const tagsBucket = newTagList.map((tag) => {
        // console.log('tagsBucket=tag==>', tag);
        return {
          tag: tag.tag,
          count: countOccurrences(optionTagList, tag.tag),
        };
      });
      // console.log('tags===> :', tags);

      const questionDto = {
        questionType,
        isActive,
        isVerified,
        verifiedBy,
        createdBy,
        modifiedBy,
        text,
        files,
        fileContentType,
        selections,
        tags,
        tagsBucket,
        options,
      };
      // (res.currentUser) = req.user;

      return await questionService.update(id, questionDto, res, next);
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
      return await questionService.delete(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  async find(req, res, next) {
    try {
      const id = req.params.id;
      return await questionService.findById(id, res, next);
    } catch (err) {
      next(ApiError.internalError(err));
      return;
    }
  }

  //* ******************************************************************************************************************
  //* We can Search Questions by text, tag, optionText, optionTag query parameters
  //* we search text in question.ques.text, tag in question.ques.tags
  //* optionText in question.options.text and optionTag in question.options.tags.tag respectively
  //* ******************************************************************************************************************
  async findAll(req, res, next) {
    try {
      let {
        questionType,
        text,
        tags,
        optionText,
        optionTags,
        excludeIds,
        includeIds,
      } = req.query;
      const condition = {
        questionType: {
          $in: questionType !== undefined ? questionType : [0, 1, 2, 3],
        },
        text: { $regex: new RegExp(text), $options: 'i' },
        'options.text': { $regex: new RegExp(optionText), $options: 'i' },
        _id: {
          $nin: excludeIds !== undefined ? excludeIds : [],
          $in: includeIds !== undefined ? includeIds : [],
        },
        tags: { $in: tags !== undefined ? tags : new RegExp('') },
        // _id: { $nin: excludeIds !== undefined ?  excludeIds : [] },
        // _id: { $in: includeIds !== undefined ?  includeIds : [] },
        // $or: [
        //   { tags: { $in: tags !== undefined ? tags : new RegExp('') } },
        // {
        //   'options.tags.tag': {
        //     $in: optionTags !== undefined ? optionTags : new RegExp(''),
        //   },
        // },
        // ],
      };
      return await questionService.findAll(condition, res, next);
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
      // console.log('req ====>', req.query);
      let {
        page,
        size,
        questionType,
        text,
        tags,
        optionText,
        optionTags,
        sort,
        excludeIds,
        includeIds,
      } = req.query;

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
        questionType: {
          $in: questionType !== undefined ? questionType : [0, 1, 2, 3],
        },
        text: { $regex: new RegExp(text), $options: 'i' },
        'options.text': { $regex: new RegExp(optionText), $options: 'i' },
        _id: { $nin: excludeIds !== undefined ? excludeIds : [] },
        tags: { $in: tags !== undefined ? tags : new RegExp('') },
        // _id: { $in: includeIds !== undefined ?  includeIds : [] },
        // _id: { $nin: excludeIds !== undefined ?  excludeIds : [], $in: includeIds !== undefined ?  includeIds : []},
        // $or: [
        //   { tags: { $in: tags !== undefined ? tags : new RegExp('') } },
        // {
        //   'options.tags.tag': {
        //     $in: optionTags !== undefined ? optionTags : new RegExp(''),
        //   },
        // },
        // ],
      };
      const { limit, offset } = getPagination(page, size);
      console.log('limit==>', limit);
      console.log('condition==>', condition);
      return await questionService.findAllPaginate(
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

module.exports = new QuestionController();
