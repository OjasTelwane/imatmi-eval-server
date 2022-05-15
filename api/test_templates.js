/*******************************************************************************************************
 * Test Template Router file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 12/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const express = require('express');
const router = express.Router();
const TestTemplate = require('../models/TestTemplate');

const testTemplateController = require('../controllers/testTemplate.constroller');
const { validateDto, validateParams } = require('../middleware/validate.dto');

const {
  testTemplateDto,
  testTemplatePageParam,
} = require('../dtos/testTemplate/testTemplate.dto');

// Authenticate before we execute the end point
const auth = require('../middleware/auth');

//IMPORTANT: We are enclosing router level function calls inside below function, so even if one forgot to
// trap some error, it will not gos to customer, instead it will go to common error handler
// We can even remove lots of Try and Catch blocks where we return internal server error
// since we repeat this function in all routers we might want to put it in a file
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// POST request to Add Question.
// Add auth.verifyUser, after we complete securing our frontend
router.post(
  '/test-templates',
  auth.verifyUser,
  validateDto(testTemplateDto),
  use(testTemplateController.create)
);

router.post('/test-templates/assign', use(testTemplateController.assignUser));

router.post(
  '/test-templates/assign-many',
  use(testTemplateController.assignUsers)
);

// PUT request to Update Question.
// Add auth.verifyUser, after we complete securing our frontend
router.put(
  '/test-templates/:id',
  auth.verifyUser,
  validateDto(testTemplateDto),
  use(testTemplateController.update)
);

// DELETE request to delete Question.
// Add auth.verifyAdmin, after we complete securing our frontend
router.delete('/test-templates/:id', use(testTemplateController.delete));

// GET request for one Question.
// Add auth.verifyUser, after we complete securing our frontend
router.get('/test-templates/:id', use(testTemplateController.find));

router.get('/test-templates', use(testTemplateController.findAll));

router.get('/test-template-all', (req, res) => {
  TestTemplate.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400);
    });
});

//* ******************************************************************************************************************
//* We can Search Questions by text, tag, optionText, optionTag query parameters
//* we search text in question.ques.text, tag in question.ques.tags
//* optionText in question.options.text and optionTag in question.options.tags.tag respectively
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all Question by Page.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/test-templatesByPage',
  validateParams(testTemplatePageParam),
  use(testTemplateController.findAllPaging)
);

module.exports = router;
