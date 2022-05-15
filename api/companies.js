/*******************************************************************************************************
 * Companys Router file
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

const companyController = require('../controllers/company.controller');

// Company Dto Validation Logic is in middleware Folder and Dto Folder
const { validateDto, validateParams } = require('../middleware/validate.dto');

const {
  companyDto,
  companyAdminDto,
  companyParamDto,
  companyParamPageDto,
} = require('../dtos/company/company.dto');

// Authenticate before we execute the end point
const auth = require('../middleware/auth');

//IMPORTANT: We are enclosing router level function calls inside below function, so even if one forgot to
// trap some error, it will not gos to customer, instead it will go to common error handler
// We can even remove lots of Try and Catch blocks where we return internal server error
// since we repeat this function in all routers we might want to put it in a file
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// POST request to Add Company.
// Add auth.verifyUser, after we complete securing our frontend
router.post(
  '/companies',
  validateDto(companyDto),
  use(companyController.create)
);

router.post(
  '/company_admin',
  validateDto(companyAdminDto),
  use(companyController.createCompanyAdmin)
);

// POST request to Add Company.
// Add auth.verifyAdmin, after we complete securing our frontend
// router.post(
//   '/companies/addBatch',
//   validateDto(companyDtos),
//   use(companyController.createBatch)
// );

// PUT request to Update Company.
// Add auth.verifyUser, after we complete securing our frontend
router.put(
  '/companies/:id',
  validateDto(companyDto),
  use(companyController.update)
);

// DELETE request to delete Company.
// Add auth.verifyAdmin, after we complete securing our frontend
router.delete('/companies/:id', use(companyController.delete));

// GET request for one Company.
// Add auth.verifyUser, after we complete securing our frontend
router.get('/companies/:id', use(companyController.find));

//* ******************************************************************************************************************
//* We can Search Companys by company and companyType query parameters
//* ******************************************************************************************************************
// GET request for list of all Companys.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/companies',
  validateParams(companyParamDto),
  use(companyController.findAll)
);

//* ******************************************************************************************************************
//* We can Search Companys by company and companyType
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all Companys by Page.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/companiesByPage',
  validateParams(companyParamPageDto),
  use(companyController.findAllPaging)
);

module.exports = router;
