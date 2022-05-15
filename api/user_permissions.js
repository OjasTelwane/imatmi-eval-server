/*******************************************************************************************************
 * UserPermissions Router file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/
const express = require('express');
const router = express.Router();

const UserPermissionsController = require('../controllers/userPermissions.controller');

// userPermissions Dto Validation Logic is in middleware Folder and Dto Folder
const { validateDto, validateParams } = require('../middleware/validate.dto');

const {
  userPermissionsDto,
  userPermissionsParamDto,
  userPermissionsParamPageDto,
} = require('../dtos/userPermissions/userPermissions.dto');

// Authenticate before we execute the end point
const auth = require('../middleware/auth');

//IMPORTANT: We are enclosing router level function calls inside below function, so even if one forgot to
// trap some error, it will not gos to customer, instead it will go to common error handler
// We can even remove lots of Try and Catch blocks where we return internal server error
// since we repeat this function in all routers we might want to put it in a file
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// POST request to Add userPermissions.
// Add auth.verifyUser, after we complete securing our frontend
router.post(
  '/userPermissions',
  validateDto(userPermissionsDto, true),
  use(UserPermissionsController.create)
);

// router.post(
//   '/userPermissions_admin',
//   validateDto(userPermissionsAdminDto),
//   use(userPermissionsController.createuserPermissionsAdmin)
// );

// POST request to Add userPermissions.
// Add auth.verifyAdmin, after we complete securing our frontend
// router.post(
//   '/userPermissions/addBatch',
//   validateDto(userPermissionsDtos),
//   use(userPermissionsController.createBatch)
// );

// PUT request to Update userPermissions.
// Add auth.verifyUser, after we complete securing our frontend
router.put(
  '/userPermissions/:id',
  validateDto(userPermissionsDto),
  use(UserPermissionsController.update)
);

// DELETE request to delete userPermissions.
// Add auth.verifyAdmin, after we complete securing our frontend
// router.delete('/userPermissions/:id', use(UserPermissionsController.delete));

router.delete(
  '/userPermissions/:id',
  use(UserPermissionsController.deleteByUserId)
);

// GET request for one userPermissions.
// Add auth.verifyUser, after we complete securing our frontend
router.get('/userPermissions/:id', use(UserPermissionsController.find));

//* ******************************************************************************************************************
//* We can Search userPermissionss by userPermissions and userPermissionsType query parameters
//* ******************************************************************************************************************
// GET request for list of all userPermissionss.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/userPermissions',
  validateParams(userPermissionsParamDto),
  use(UserPermissionsController.findAll)
);

//* ******************************************************************************************************************
//* We can Search userPermissionss by userPermissions and userPermissionsType
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all userPermissionss by Page.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/userPermissionsByPage',
  validateParams(userPermissionsParamPageDto),
  use(UserPermissionsController.findAllPaging)
);

module.exports = router;
