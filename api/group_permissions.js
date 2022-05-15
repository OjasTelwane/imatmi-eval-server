/*******************************************************************************************************
 * GroupPermissions Router file
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

const GroupPermissionsController = require('../controllers/groupPermissions.controller');

// groupPermissions Dto Validation Logic is in middleware Folder and Dto Folder
const { validateDto, validateParams } = require('../middleware/validate.dto');

const {
  groupPermissionsDto,
  groupPermissionsParamDto,
  groupPermissionsParamPageDto,
} = require('../dtos/groupPermissions/groupPermissions.dto');

// Authenticate before we execute the end point
const auth = require('../middleware/auth');

//IMPORTANT: We are enclosing router level function calls inside below function, so even if one forgot to
// trap some error, it will not gos to customer, instead it will go to common error handler
// We can even remove lots of Try and Catch blocks where we return internal server error
// since we repeat this function in all routers we might want to put it in a file
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/groupPermissionsInit', use(GroupPermissionsController.init));

// POST request to Add groupPermissions.
// Add auth.verifyUser, after we complete securing our frontend
router.post(
  '/groupPermissions',
  validateDto(groupPermissionsDto, true),
  use(GroupPermissionsController.create)
);

// router.post(
//   '/groupPermissions_admin',
//   validateDto(groupPermissionsAdminDto),
//   use(groupPermissionsController.creategroupPermissionsAdmin)
// );

// POST request to Add groupPermissions.
// Add auth.verifyAdmin, after we complete securing our frontend
// router.post(
//   '/groupPermissions/addBatch',
//   validateDto(groupPermissionsDtos),
//   use(groupPermissionsController.createBatch)
// );

// PUT request to Update groupPermissions.
// Add auth.verifyUser, after we complete securing our frontend
router.put(
  '/groupPermissions/:id',
  validateDto(groupPermissionsDto),
  use(GroupPermissionsController.update)
);

// DELETE request to delete groupPermissions.
// Add auth.verifyAdmin, after we complete securing our frontend
router.delete('/groupPermissions/:id', use(GroupPermissionsController.delete));

// GET request for one groupPermissions.
// Add auth.verifyUser, after we complete securing our frontend
router.get('/groupPermissions/:id', use(GroupPermissionsController.find));

//* ******************************************************************************************************************
//* We can Search groupPermissionss by groupPermissions and groupPermissionsType query parameters
//* ******************************************************************************************************************
// GET request for list of all groupPermissionss.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/groupPermissions',
  validateParams(groupPermissionsParamDto),
  use(GroupPermissionsController.findAll)
);

//* ******************************************************************************************************************
//* We can Search groupPermissionss by groupPermissions and groupPermissionsType
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all groupPermissionss by Page.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/groupPermissionsByPage',
  validateParams(groupPermissionsParamPageDto, true),
  use(GroupPermissionsController.findAllPaging)
);

module.exports = router;
