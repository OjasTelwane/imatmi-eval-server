const Question = require('../models/Question');
const ApiError = require('../middleware/api.error');
const logger = require('../config/logger');

exports.create = async (questionDto, res, next) => {
  try {
    const newQuestion = new Question(questionDto);
    newQuestion
      .save()
      .then((data) => {
        if (!data) {
          logger.log({ level: 'error', message: 'Question create' });
          next(ApiError.badRequest('Error in Question Insert!'));
          return;
        } else {
          logger.log({ level: 'info', message: 'Question create' });
          res.status(201).send(data);
        }
      })
      .catch((err) => {
        logger.log({ level: 'error', message: 'Question create' });
        next(
          ApiError.internalError(
            err,
            'Some error occurred while creating the Question'
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.createBatch = async (questionDtos, res, next) => {
  try {
    Question.insertMany(questionDtos, { ordered: false })
      .then((data) => {
        if (!data) {
          logger.log({ level: 'error', message: 'Question create batch' });
          next(ApiError.badRequest('Error in Question Batch Insert!'));
          return;
        } else {
          logger.log({ level: 'info', message: 'Question create batch' });
          res
            .status(201)
            .send({ message: 'Questions Batch is Added successfully.' });
        }
      })
      .catch((err) => {
        logger.log({ level: 'error', message: 'Question create batch' });
        next(ApiError.internalError(err, 'Error Inserting Question Batch'));
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.update = async (id, questionDto, res, next) => {
  try {
    Question.findByIdAndUpdate(id, questionDto, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          logger.log({ level: 'error', message: 'Question update' });
          next(
            ApiError.notFound(
              'Cannot update Question with id==' +
                id +
                ' Maybe Question was not found!'
            )
          );
          return;
        } else {
          logger.log({ level: 'info', message: 'Question update' });
          res.status(200).send(data);
        }
      })
      .catch((err) => {
        logger.log({ level: 'error', message: 'Question Update' });
        next(
          ApiError.internalError(err, 'Error updating Question with id=' + id)
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.delete = async (id, res, next) => {
  try {
    Question.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          logger.log({ level: 'error', message: 'Question delete' });
          next(
            ApiError.notFound(
              'Cannot delete Question with id=' +
                id +
                ' Maybe Question was not found!'
            )
          );
          return;
        } else {
          logger.log({ level: 'info', message: 'Question delete' });
          res.send({
            message: 'Question was deleted successfully!',
            question: data,
          });
        }
      })
      .catch((err) => {
        logger.log({ level: 'error', message: 'Question delete' });
        next(
          ApiError.internalError(err, 'Could not delete Question with id=' + id)
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findById = async (id, res, next) => {
  try {
    console.log('findById==>', id);
    Question.findById(id)
      .then((data) => {
        if (data === null) {
          console.log('findById==>before Error return', data);
          next(ApiError.notFound('Not found: Question with id=' + id));
          return;
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        next(
          ApiError.internalError(err, 'Error retrieving Question with id' + id)
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAll = async (condition, res, next, sendData = true) => {
  try {
    console.log('before find===>');
    const data = await Question.find(condition);
    if (sendData) {
      res.send(data);
      console.log('send===>');
    } else {
      console.log('return data===>');
      return data;
    }
    // Question.find(condition)
    //   .then((data) => {
    //     console.log('found data===>');
    //     if(sendData) {
    //       res.send(data);
    //       console.log('send===>');
    //     }
    //     else  {
    //       console.log('return data===>');
    //       return data;
    //     }
    //   })
    //   .catch((err) => {
    //     next(
    //       ApiError.internalError(
    //         err,
    //         'Some error occurred while retrieving Questions'
    //       )
    //     );
    //     return;
    //   });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAllPaginate = async (
  condition,
  sort,
  limit,
  offset,
  res,
  next,
  sendData = true
) => {
  try {
    const data = await Question.paginate(condition, {
      offset: offset,
      limit: limit,
    });
    if (sendData) {
      res.send({
        totalItems: data.totalDocs,
        questions: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    } else {
      return data.docs;
    }
    // Question.paginate(condition, sort, { offset, limit })
    //   .then((data) => {
    //     if(sendData) {
    //       res.send({
    //         totalItems: data.totalDocs,
    //         questions: data.docs,
    //         totalPages: data.totalPages,
    //         currentPage: data.page - 1,
    //       });
    //     }
    //     else {
    //       return data.docs;
    //     }
    //   })
    //   .catch((err) => {
    //     next(
    //       ApiError.internalError(
    //         err,
    //         'Some error occurred while retrieving Questions'
    //       )
    //     );
    //     return;
    //   });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};
