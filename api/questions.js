/*******************************************************************************************************
 * Questions Router file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 13/09/2021 Ojas Telwane	Created
 * 14/09/2021 Ojas Telwane	Added Authentication to prevent unauthorized usage
 *******************************************************************************************************/

const express = require('express');
const router = express.Router();

const questionController = require('../controllers/question.controller');
const Question = require('../models/Question');
const { validateDto, validateParams } = require('../middleware/validate.dto');

const {
  questionDto,
  questionDtos,
  questionParam,
  questionPageParam,
} = require('../dtos/question/question.dto');

// Authenticate before we execute the end point
const auth = require('../middleware/auth');

//IMPORTANT: We are enclosing router level function calls inside below function, so even if one forgot to
// trap some error, it will not gos to customer, instead it will go to common error handler
// We can even remove lots of Try and Catch blocks where we return internal server error
// since we repeat this function in all routers we might want to put it in a file
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// POST request to Add Question.
// Add auth.verifyUser,  after we complete securing our frontend
router.post(
  '/questions',
  auth.verifyUser,
  validateDto(questionDto, true),
  use(questionController.create)
);

// POST request to Add Questions in Batch.
// Add auth.verifyAdmin, after we complete securing our frontend
router.post(
  '/questions/addBatch',
  auth.verifyUser,
  validateDto(questionDtos),
  use(questionController.createBatch)
);

// PUT request to Update Question.
// Add auth.verifyUser,  after we complete securing our frontend
router.put(
  '/questions/:id',
  auth.verifyUser,
  validateDto(questionDto),
  use(questionController.update)
);

router.get('/all-questions', async (req, res) => {
  Question.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// DELETE request to delete Question.
// Add auth.verifyAdmin, after we complete securing our frontend
router.delete('/questions/:id', use(questionController.delete));

// GET request for one Question.
// Add auth.verifyUser,  after we complete securing our frontend
router.get('/questions/:id', use(questionController.find));

//* ******************************************************************************************************************
//* We can Search Questions by text, tag, optionText, optionTag query parameters
//* we search text in question.ques.text, tag in question.ques.tags
//* optionText in question.options.text and optionTag in question.options.tags.tag respectively
//* ******************************************************************************************************************
// GET request for list of all Question.
// Add auth.verifyUser,  after we complete securing our frontend
router.get(
  '/questions',
  validateParams(questionParam, true),
  use(questionController.findAll)
);

//* ******************************************************************************************************************
//* We can Search Questions by text, tag, optionText, optionTag query parameters
//* we search text in question.ques.text, tag in question.ques.tags
//* optionText in question.options.text and optionTag in question.options.tags.tag respectively
//* We can do Pagination using page and Size query parameter, page no is 0 based
//* ******************************************************************************************************************
// GET request for list of all Question by Page.
// Add auth.verifyUser,  after we complete securing our frontend
router.get(
  '/questionsByPage',
  validateParams(questionPageParam, true),
  use(questionController.findAllPaging)
);

module.exports = router;
