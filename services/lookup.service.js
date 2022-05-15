/*******************************************************************************************************
 * Lookups Service currently Loading and Saving Data from Mongo Db file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const Lookup = require('../models/Lookup');
const ApiError = require('../middleware/api.error');

exports.create = async (lookupDto, res, next) => {
  try {
    const newLookup = new Lookup(lookupDto);
    newLookup
      .save()
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Some error occurred while creating the Lookup.'
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.createBatch = async (lookupDtos, res, next) => {
  try {
    Lookup.insertMany(lookupDtos, { ordered: false })
      .then((data) => {
        if (!data) {
          next(ApiError.badRequest('Error Inserting Lookup Batch'));
          return;
        } else {
          res
            .status(201)
            .send({ message: 'Lookups Batch is Added successfully.' });
        }
      })
      .catch((err) => {
        next(ApiError.internalError(err, 'Error Inserting Lookup Batch'));
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.update = async (id, lookupDto, res, next) => {
  try {
    Lookup.findByIdAndUpdate(id, lookupDto, {
      new: true,
      useFindAndModify: false,
    })
      .then((data) => {
        if (!data) {
          next(
            ApiError.badRequest(
              'Cannot update Lookup with id=' +
                id +
                ' Maybe Lookup was not found!'
            )
          );
          return;
        } else {
          res.status(200).send(data);
        }
      })
      .catch((err) => {
        next(
          ApiError.internalError(err, 'Error updating Lookup with id=' + id)
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
    Lookup.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          next(
            ApiError.notFound(
              'Cannot delete Lookup with id=' +
                id +
                ' Maybe Lookup was not found!'
            )
          );
          return;
        } else {
          res.send({
            message: 'Lookup was deleted successfully!',
            lookup: data,
          });
        }
      })
      .catch((err) => {
        next(
          ApiError.internalError(err, 'Could not delete Lookup with id=' + id)
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
    Lookup.findById(id)
      .then((data) => {
        if (!data) {
          next(ApiError.notFound('Not found Lookup with id ' + id));
          return;
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        next(
          ApiError.internalError(err, 'Error retrieving Lookup with id=' + id)
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAll = async (condition, res, next) => {
  try {
    Lookup.find(condition)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Some error occurred while retrieving Lookups.'
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
    await Lookup.paginate(condition, { offset, limit })
      .then((data) => {
        res.send({
          totalItems: data.totalDocs,
          lookups: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
      })
      .catch((err) => {
        next(
          ApiError.internalError(
            err,
            'Some error occurred while retrieving Lookups.'
          )
        );
        return;
      });
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};
