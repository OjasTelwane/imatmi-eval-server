/*******************************************************************************************************
 * Lookups Router file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/
const express = require('express');
const router = express.Router();

const lookupController = require('../controllers/lookup.controller');

// Lookup Dto Validation Logic is in middleware Folder and Dto Folder
const { validateDto, validateParams } = require('../middleware/validate.dto');

const {
  lookupDto,
  lookupDtos,
  lookupParamDto,
  lookupParamPageDto,
} = require('../dtos/lookup/lookup.dto');

// Authenticate before we execute the end point
const auth = require('../middleware/auth');

//IMPORTANT: We are enclosing router level function calls inside below function, so even if one forgot to
// trap some error, it will not gos to customer, instead it will go to common error handler
// We can even remove lots of Try and Catch blocks where we return internal server error
// since we repeat this function in all routers we might want to put it in a file
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// POST request to Add Lookup.
// Add auth.verifyUser, after we complete securing our frontend
router.post('/lookups', validateDto(lookupDto), use(lookupController.create));

// POST request to Add Lookup.
// Add auth.verifyAdmin, after we complete securing our frontend
router.post(
  '/lookups/addBatch',
  validateDto(lookupDtos),
  use(lookupController.createBatch)
);

// PUT request to Update Lookup.
// Add auth.verifyUser, after we complete securing our frontend
router.put(
  '/lookups/:id',
  validateDto(lookupDto),
  use(lookupController.update)
);

// DELETE request to delete Lookup.
// Add auth.verifyAdmin, after we complete securing our frontend
router.delete('/lookups/:id', use(lookupController.delete));

// GET request for one Lookup.
// Add auth.verifyUser, after we complete securing our frontend
router.get('/lookups/:id', use(lookupController.find));

//* ******************************************************************************************************************
//* We can Search Lookups by lookup and lookupType query parameters
//* ******************************************************************************************************************
// GET request for list of all Lookups.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/lookups',
  validateParams(lookupParamDto),
  use(lookupController.findAll)
);

//* ******************************************************************************************************************
//* We can Search Lookups by lookup and lookupType
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all Lookups by Page.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/lookupsByPage',
  validateParams(lookupParamPageDto),
  use(lookupController.findAllPaging)
);

module.exports = router;
