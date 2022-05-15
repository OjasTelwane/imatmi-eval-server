/*******************************************************************************************************
 * Tests Service currently Loading and Saving Data from Mongo Db file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 27/09/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const Test = require('../models/Test');
const ApiError = require('../middleware/api.error');
const bigFiveTest = require('../models/bigFiveTest');
exports.create = async (testDto, res, next) => {
  try {
    const newTest = new Test(testDto);
    const data = await newTest.save();
    if (!data) {
      next(ApiError.badRequest('Error in Test Insert!'));
      return;
    } else {
      return data;
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.update = async (id, testDto, res, next) => {
  try {
    const data = await Test.findByIdAndUpdate(id, testDto, {
      useFindAndModify: false,
    });

    if (!data) {
      next(
        ApiError.notFound(
          'Cannot update Test with id==' + id + ' Maybe Test was not found!'
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
    const data = await Test.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data) {
      next(
        ApiError.notFound(
          'Cannot delete Test with id=' + id + ' Maybe Test was not found!'
        )
      );
      return;
    } else {
      res.send({
        message: 'Test was deleted successfully!',
        test: data,
      });
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findById = async (id, res, next) => {
  try {
    console.log('findById==>', id);
    const data = await Test.findById(id);
    if (data === null) {
      console.log('findById==>before Error return', data);
      next(ApiError.notFound('Not found: Test with id=' + id));
      return;
    } else {
      res.send(data);
      return data;
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAll = async (condition, res, next) => {
  try {
    const data = await Test.find(condition);
    if (data === null) {
      console.log('findAll==>before Error return', data);
      next(ApiError.notFound('Not found: Test'));
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
    const data = await bigFiveTest.paginate(condition, { offset, limit });
    if (data === null) {
      console.log('findAllPaginate==>before Error return', data);
      next(ApiError.notFound('Not found: Test'));
      return;
    } else {
      res.send({
        totalItems: data.totalDocs,
        tests: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};
