/*******************************************************************************************************
 * Questions ApiError used by CommonApi  Error Handler Middleware
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 15/09/2021 Ojas Telwane	Created 
  *******************************************************************************************************/

class ApiError {
  constructor(code, message) {
   this.message = message;
    this.code = code;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static notFound(msg) {
    return new ApiError(404, msg);
  }

  static notAuthorized(msg) {
    return new ApiError(401, msg);
  }

  static internalError(err, msg) {
    if (err) {
      console.error(err.message);
    }
    if(!msg) {
      msg = 'Server Error';
    }
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;
