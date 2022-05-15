/*******************************************************************************************************
 * Common Api Error Handler Middleware
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 15/09/2021 Ojas Telwane	Created 
  *******************************************************************************************************/

const ApiError = require('./api.error');

function apiErrorHandler(err, req, res, next) {
  //in Production environment disable this console log
  console.error(err);
  // If error is our trapped error
  if (err instanceof ApiError) {
   res.status(err.code).json(err.message);
   return;
  }
  //else for un-trapped errors
  res.status(500).json('something went wrong');
}

module.exports = apiErrorHandler;
