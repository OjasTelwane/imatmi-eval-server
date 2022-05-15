/*******************************************************************************************************
 * Test Question Dto and Test Question Query Parameter Dtos file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 12/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const question = require('../common/question.dto');
const file = require('../common/files.dto');
const option = require('../common/option.dto');
const selection = require('../common/selection.dto');
const sort = require('../common/sort.dto');

const testQuestionDto = yup.object().shape({
  testId: yup.string().required(),
  duration: yup.number(),
  absentDuration: yup.number(),
  absentTimes: yup.number(),
  status: yup.string(),
  isCorrect: yup.boolean().default(false),
  finish: yup.boolean(false),
  numberOfAttempts: yup.number().default(0),
  questionId: yup.string(),
  question,
  files: yup.array().of(file),
  selections: yup.array().of(selection),
  tags: yup.array(),
  tagsBucket: yup.array().of(
    yup.object().shape({
      tag: yup.string(),
      count: yup.number(),
      order: yup.number(),
      level: yup.number(),
      weightage: yup.number(),
      finalWeightage: yup.number(),
    })
  ),
  tagsExtraBucket: yup.array().of(
    yup.object().shape({
      tag: yup.string(),
      count: yup.number().default(0),
    })
  ),
  options: yup.array().of(
    yup.object().shape({
      setNo: yup.number().default(1),
      orderNo: yup.number().default(1),
      selectedOrderNo: yup.number(),
      isCorrect: yup.boolean().default(false),
      selectedOption: yup.boolean(),
      text: yup.string(),
      isCorrectOption: yup.boolean().default(false),
      files: yup.array().of(file),
      selections: yup.array().of(selection),
      tags: yup.array().of(
        yup.object().shape({
          tag: yup.string(),
          count: yup.number().default(0),
          weightage: yup.number(),
        })
      ),
    })
  ),
});

const testQuestionParam = yup.object().shape({
  testId: yup.string().required(),
  status: yup.string(),
  sort: yup.array().of(sort),
});

const testQuestionPageParam = yup.object().shape({
  testId: yup.string().required(),
  status: yup.string(),
  sort: yup.array().of(sort),
  page: yup.number(),
  size: yup.number(),
});

module.exports = { testQuestionDto, testQuestionParam, testQuestionPageParam };
