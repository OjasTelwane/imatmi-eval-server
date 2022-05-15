/*******************************************************************************************************
 * Test Questions Service currently Loading and Saving Data from Mongo Db file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 12/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const TestQuestion = require('../models/TestQuestion');
const ApiError = require('../middleware/api.error');

exports.create = async (testQuestionDto, res, next) => {
  try {
    const newTestQuestion = new TestQuestion(testQuestionDto);
    const data = await newTestQuestion.save();
    if (!data) {
      next(ApiError.badRequest('Error in Test Question Insert!'));
      return;
    } else {
      return data;
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.createBatch = async (testQuestionDtos, res, next) => {
  try {
    const data = await TestQuestion.insertMany(testQuestionDtos, {
      ordered: false,
    });
    if (!data) {
      next(ApiError.badRequest('Error in Test Questions Batch Insert!'));
      return;
    } else {
      return data;
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.update = async (id, testQuestionDto, res, next) => {
  try {
    const data = await TestQuestion.findByIdAndUpdate(id, testQuestionDto, {
      useFindAndModify: false,
    });
    if (!data) {
      next(
        ApiError.notFound(
          'Cannot update Test Question with id==' +
            id +
            ' Maybe Test Question was not found!'
        )
      );
      return;
    } else {
      // res.status(200).send(data);
      return data;
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.delete = async (id, res, next) => {
  try {
    TestQuestion.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          next(
            ApiError.notFound(
              'Cannot delete Test Question with id=' +
                id +
                ' Maybe Test Question was not found!'
            )
          );
          return;
        } else {
          res.send({
            message: 'Test Question was deleted successfully!',
            testQuestion: data,
          });
        }
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Could not delete Test Question with id=' + id
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findById = async (id, res, next, sendData = true) => {
  try {
    console.log('findById==>', id);

    const data = await TestQuestion.findById(id);
    if (!data) {
      console.log('findById==>before Error return', data);
      if (sendData) {
        next(ApiError.notFound('Not found: Test Question with id=' + id));
      }
      return;
    }
    if (sendData) {
      res.send(data);
      return;
    }
    return data;
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAll = async (condition, res, next) => {
  try {
    TestQuestion.find(condition)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Some error occurred while retrieving Test Questions'
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.countQuestionFrequency = async (
  questionId,
  res,
  next,
  sendData = true
) => {
  try {
    await TestQuestion.countDocuments(
      { questionId: questionId },
      (err, count) => {
        if (err) {
          console.log(err);
        } else {
          // console.log('Count is', count);
          const questionCount = count.toString();
          res.status(200).send(questionCount);
        }
      }
    );
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.maxTimeToAnswerQuestion = async (
  questionId,
  res,
  next,
  sendData = true
) => {
  try {
    const response = await TestQuestion.aggregate([
      { $group: { _id: questionId, maxTime: { $max: '$duration' } } },
      { $project: { _id: 0, maxTime: 1 } },
    ]);

    console.log(response);
    res.status(200).send(response);

    //   await TestQuestion.countDocuments(
    //     { questionId: questionId },
    //     (err, count) => {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         // console.log('Count is', count);
    //         const questionCount = count.toString();
    //         res.status(200).send(questionCount);
    //       }
    //     }
    //   );
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.minTimeToAnswerQuestion = async (
  questionId,
  res,
  next,
  sendData = true
) => {
  try {
    const response = await TestQuestion.aggregate([
      { $group: { _id: questionId, minTime: { $min: '$duration' } } },
      { $project: { _id: 0, minTime: 1 } },
    ]);

    console.log(response);
    res.status(200).send(response);
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.countQuestionFrequency = async (
  questionId,
  res,
  next,
  sendData = true
) => {
  try {
    await TestQuestion.countDocuments(
      { questionId: questionId },
      (err, count) => {
        if (err) {
          console.log(err);
        } else {
          // console.log('Count is', count);
          const questionCount = count.toString();
          res.status(200).send(questionCount);
        }
      }
    );
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAllPaginate = async (condition, sort, limit, offset, res, next) => {
  try {
    TestQuestion.paginate(condition, sort, { offset, limit })
      .then((data) => {
        res.send({
          totalItems: data.totalDocs,
          questions: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Some error occurred while retrieving Test Questions'
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};
