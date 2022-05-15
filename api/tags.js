/*******************************************************************************************************
 * Tags Router file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 13/09/2021 Ojas Telwane	Created
 * 14/09/2021 		""				Added Authentication to prevent un authorized usage
 *******************************************************************************************************/
const express = require('express');
const router = express.Router();

const tagController = require('../controllers/tag.controller');

// Tag Dto Validation Logic is in middleware Folder and Dto Folder
const { validateDto, validateParams } = require('../middleware/validate.dto');

const {
  tagDto,
  tagDtos,
  tagParamDto,
  tagParamPageDto,
} = require('../dtos/tag/tag.dto');

// Authenticate before we execute the end point
const auth = require('../middleware/auth');

//IMPORTANT: We are enclosing router level function calls inside below function, so even if one forgot to
// trap some error, it will not gos to customer, instead it will go to common error handler
// We can even remove lots of Try and Catch blocks where we return internal server error
// since we repeat this function in all routers we might want to put it in a file
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// POST request to Add Tag.
// Add auth.verifyUser, after we complete securing our frontend
router.post('/tags', validateDto(tagDto), use(tagController.create));

// POST request to Add Tag.
// Add auth.verifyAdmin, after we complete securing our frontend
router.post(
  '/tags/addBatch',
  validateDto(tagDtos),
  use(tagController.createBatch)
);

// PUT request to Update Tag.
// Add auth.verifyUser, after we complete securing our frontend
router.put('/tags/:id', validateDto(tagDto), use(tagController.update));

// DELETE request to delete Tag.
// Add auth.verifyAdmin, after we complete securing our frontend
router.delete('/tags/:id', use(tagController.delete));

// GET request for one Tag.
// Add auth.verifyUser, after we complete securing our frontend
router.get('/tags/:id', use(tagController.find));

//* ******************************************************************************************************************
//* We can Search Tags by tag and tagType query parameters
//* ******************************************************************************************************************
// GET request for list of all Tags.
// Add auth.verifyUser, after we complete securing our frontend
router.get('/tags', validateParams(tagParamDto), use(tagController.findAll));

//* ******************************************************************************************************************
//* We can Search Tags by tag and tagType
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all Tags by Page.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/tagsByPage',
  validateParams(tagParamPageDto),
  use(tagController.findAllPaging)
);

module.exports = router;
