/*******************************************************************************************************
 * Question Dto and Question Query Parameter Dtos file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 15/09/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const question = require('../common/question.dto');
const selection = require('../common/selection.dto');
const file = require('../common/files.dto');
const option = require('../common/option.dto');
const sort = require('../common/sort.dto');

const questionDto = yup.object().shape({
  question,
  isActive: yup.boolean().default(false),
  isVerified: yup.boolean(),
  verifiedBy: yup.string(),
  createdBy: yup.string(),
  modifiedBy: yup.string(),
  tags: yup.array(),
  tagsBucket: yup.array(),
  files: yup.array().of(file),
  selections: yup.array().of(selection),
  options: yup.array().of(option),
});

const questionDtos = yup.array().of(questionDto);

const questionParam = yup.object().shape({
  questionType: yup.number(),
  text: yup.string(),
  tags: yup.array().of(yup.string()),
  optionText: yup.string(),
  optionTags: yup.array().of(yup.string()),
  sort: yup.array().of(sort),
  excludeIds: yup.array().of(yup.string()),
  includeIds: yup.array().of(yup.string()),
});

const questionPageParam = yup.object().shape({
  questionType: yup.number(),
  text: yup.string(),
  tags: yup.array().of(yup.string()),
  optionText: yup.string(),
  optionTags: yup.array().of(yup.string()),
  sort: yup.array().of(sort),
  excludeIds: yup.array().of(yup.string()),
  includeIds: yup.array().of(yup.string()),
  page: yup.number(),
  size: yup.number(),
});

module.exports = {
  questionDto,
  questionDtos,
  questionParam,
  questionPageParam,
};
