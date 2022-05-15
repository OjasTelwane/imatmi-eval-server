/*******************************************************************************************************
 * Tests Router file
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
const Test = require('../models/Test');

const testController = require('../controllers/test.controller');
const { validateDto, validateParams } = require('../middleware/validate.dto');

const { testDto, testPageParam } = require('../dtos/test.dto/test.dto');

// Authenticate before we execute the end point
const auth = require('../middleware/auth');

//IMPORTANT: We are enclosing router level function calls inside below function, so even if one forgot to
// trap some error, it will not gos to customer, instead it will go to common error handler
// We can even remove lots of Try and Catch blocks where we return internal server error
// since we repeat this function in all routers we might want to put it in a file
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// POST request to Submit Test.
// Add auth.verifyUser, after we complete securing our frontend
router.post(
  '/tests',
  auth.verifyUser,
  validateDto(testDto, true),
  use(testController.create)
);

// PUT request to Update Question.
// Add auth.verifyUser, after we complete securing our frontend
router.put(
  '/tests/:id',
  auth.verifyUser,
  validateDto(testDto),
  use(testController.update)
);

router.put(
  '/tests/start/:id',
  auth.verifyUser,
  validateDto(testDto, true),
  use(testController.start)
);

router.put(
  '/tests/end/:id',
  auth.verifyUser,
  validateDto(testDto, true),
  use(testController.end)
);

router.put(
  '/tests/progress/:id',
  auth.verifyUser,
  validateDto(testDto, true),
  use(testController.progress)
);

router.put(
  '/tests/reAssign/:id',
  auth.verifyUser,
  validateDto(testDto, true),
  use(testController.reAssign)
);

router.get('/tests-all', (req, res) => {
  Test.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400);
    });
});
// DELETE request to delete Test.
// Add auth.verifyAdmin, after we complete securing our frontend
// router.delete('/tests/:id', use(testController.delete));

// GET request for one Question.
// Add auth.verifyUser, after we complete securing our frontend
router.get('/tests/:id', use(testController.find));

//* ******************************************************************************************************************
//* We can Search Questions by text, tag, optionText, optionTag query parameters
//* we search text in question.ques.text, tag in question.ques.tags
//* optionText in question.options.text and optionTag in question.options.tags.tag respectively
//* ******************************************************************************************************************
// GET request for list of all Question.
// Add auth.verifyUser, after we complete securing our frontend
// router.get(
//   '/tests',
//   validateParams(testParam, true),
//   use(testController.findAll)
// );

//* ******************************************************************************************************************
//* We can Search Questions by text, tag, optionText, optionTag query parameters
//* we search text in question.ques.text, tag in question.ques.tags
//* optionText in question.options.text and optionTag in question.options.tags.tag respectively
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all Question by Page.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/testsByPage',
  validateParams(testPageParam),
  use(testController.findAllPaging)
);

module.exports = router;
