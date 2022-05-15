/*******************************************************************************************************
 * Test Question Router file
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

const testTemplateQuestionController = require('../controllers/testTemplateQuestion.controller');
const TestTemplateQuestion = require('../models/TestTemplateQuestion');

const { validateDto, validateParams } = require('../middleware/validate.dto');

const {
  testTemplateQuestionDto,
  testTemplateQuestionParam,
  testTemplateQuestionPageParam,
} = require('../dtos/testTemplateQuestion/testTemplateQuestion.dto');

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
  '/testTemplateQuestions',
  auth.verifyUser,
  validateDto(testTemplateQuestionDto),
  use(testTemplateQuestionController.create)
);

// POST request to Add Question.
// Add auth.verifyUser, after we complete securing our frontend
router.post(
  '/testTemplateQuestions/add',
  validateDto(testTemplateQuestionDto),
  use(testTemplateQuestionController.add)
);

// PUT request to Update Question.
// Add auth.verifyUser, after we complete securing our frontend
router.put(
  '/testTemplateQuestions/:id',
  auth.verifyUser,
  validateDto(testTemplateQuestionDto),
  use(testTemplateQuestionController.update)
);

// DELETE request to delete Question.
// Add auth.verifyAdmin, after we complete securing our frontend
router.delete(
  '/testTemplateQuestions/:id',
  auth.verifyUser,
  use(testTemplateQuestionController.delete)
);

// GET request for one Question.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/testTemplateQuestions/:id',
  use(testTemplateQuestionController.find)
);

//  router.get('/all-test-template-questions', (req, res) => {
//    TestTemplateQuestion.find()
//      .then((data) => {
//        res.status(200).send(data);
//      })
//      .catch((err) => {
//        res.status(400);
//      });
//  });
//* ******************************************************************************************************************
//* We can Search Questions by text, tag, optionText, optionTag query parameters
//* we search text in question.ques.text, tag in question.ques.tags
//* optionText in question.options.text and optionTag in question.options.tags.tag respectively
//* ******************************************************************************************************************
// GET request for list of all Question.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/testTemplateQuestions',
  validateParams(testTemplateQuestionParam),
  use(testTemplateQuestionController.findAll)
);

router.get(
  '/testTemplateQuestionFrequency',
  use(testTemplateQuestionController.countQuestionFrequency)
);

//* ******************************************************************************************************************
//* We can Search Questions by text, tag, optionText, optionTag query parameters
//* we search text in question.ques.text, tag in question.ques.tags
//* optionText in question.options.text and optionTag in question.options.tags.tag respectively
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all Question by Page.
// Add auth.verifyUser, after we complete securing our frontend
router.get(
  '/testTemplateQuestionsByPage',
  validateParams(testTemplateQuestionPageParam),
  use(testTemplateQuestionController.findAllPaging)
);

module.exports = router;
