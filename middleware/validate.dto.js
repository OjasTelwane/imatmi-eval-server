/*******************************************************************************************************
 * Common Schema Validation file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 15/09/2021 Ojas Telwane	Created
 *******************************************************************************************************/
const ApiError = require('./api.error');

function validateDto(schema, log = false) {
  return async (req, res, next) => {
    try {
      console.log('req.body', req.body);
      const validatedBody = await schema.validate(req.body, {
        abortEarly: false,
      });
      if (log) {
        console.log('validatedBody:==>', validatedBody);
      }
      // replace request body with validated schema body
      // so that default values are applied to the DTO
      req.body = validatedBody;

      next();
    } catch (err) {
      next(ApiError.badRequest(err));
    }
  };
}

function validateParams(schema, log = false) {
  return async (req, res, next) => {
    try {
      console.log('req.query:==>', req.query);
      const validatedQuery = await schema.validate(req.query, {
        stripUnknown: true,
        abortEarly: false,
      });
      if (log) {
        console.log('validatedQuery:==>', validatedQuery);
      }
      // replace request query with validated schema query
      req.query = validatedQuery;
      next();
    } catch (error) {
      next(ApiError.badRequest(error));
    }
  };
}

module.exports = { validateDto, validateParams };
