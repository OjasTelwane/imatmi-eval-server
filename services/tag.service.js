/*******************************************************************************************************
 * Tags Service currently Loading and Saving Data from Mongo Db file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 14/09/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const Tag = require('../models/Tag');
const ApiError = require('../middleware/api.error');

exports.create = async (tagDto, res, next) => {
  try {
    const newTag = new Tag(tagDto);
    newTag
      .save()
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Some error occurred while creating the Tag.'
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.createBatch = async (tagDtos, res, next) => {
  try {
    Tag.insertMany(tagDtos, { ordered: false })
      .then((data) => {
        if (!data) {
          next(ApiError.badRequest('Error Inserting Tag Batch'));
          return;
        } else {
          res
            .status(201)
            .send({ message: 'Tags Batch is Added successfully.' });
        }
      })
      .catch((err) => {
        next(ApiError.internalError(err, 'Error Inserting Tag Batch'));
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.update = async (id, tagDto, res, next) => {
  try {
    Tag.findByIdAndUpdate(id, tagDto, { new: true, useFindAndModify: false })
      .then((data) => {
        if (!data) {
          next(
            ApiError.badRequest(
              'Cannot update Tag with id=' + id + ' Maybe Tag was not found!'
            )
          );
          return;
        } else {
          res.status(200).send(data);
        }
      })
      .catch((err) => {
        next(ApiError.internalError(err, 'Error updating Tag with id=' + id));
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.delete = async (id, res, next) => {
  try {
    Tag.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          next(
            ApiError.notFound(
              'Cannot delete Tag with id=' + id + ' Maybe Tag was not found!'
            )
          );
          return;
        } else {
          res.send({
            message: 'Tag was deleted successfully!',
            tag: data,
          });
        }
      })
      .catch((err) => {
        next(ApiError.internalError(err, 'Could not delete Tag with id=' + id));
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findById = async (id, res, next) => {
  try {
    Tag.findById(id)
      .then((data) => {
        if (!data) {
          next(ApiError.notFound('Not found Tag with id ' + id));
          return;
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        next(ApiError.internalError(err, 'Error retrieving Tag with id=' + id));
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAll = async (condition, res, next) => {
  try {
    Tag.find(condition)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Some error occurred while retrieving Tags.'
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAllPaginate = async (condition, limit, offset, res, next) => {
  try {
    await Tag.paginate(condition, { offset, limit })
      .then((data) => {
        res.send({
          totalItems: data.totalDocs,
          tags: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Some error occurred while retrieving Tags.'
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};
