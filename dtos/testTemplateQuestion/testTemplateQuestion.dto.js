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

const file = require('../common/files.dto');
const selection = require('../common/selection.dto');
const option = require('../common/option.dto');
const sort = require('../common/sort.dto');

const testTemplateQuestionDto = yup.object().shape({
  testTemplateId: yup.string().required(),
  questionId: yup.string(),
  questionType: yup.number().default(0),
  text: yup.string(),
  files: yup.array().of(file),
  selections: yup.array().of(selection),
  tags: yup.array(),
  tagsBucket: yup.array().of(
    yup.object().shape({
      tag: yup.string(),
      count: yup.number().default(0),
      order: yup.number().default(0),
      level: yup.number().default(0),
      weightage: yup.number().default(0),
      finalWeightage: yup.number().default(0),
    })
  ),
  tagsExtraBucket: yup.array().of(
    yup.object().shape({
      tag: yup.string(),
      count: yup.number().default(0),
    })
  ),
  options: yup.array().of(option),
});

const testTemplateQuestionParam = yup.object().shape({
  testTemplateId: yup.string().required(),
  tags: yup.array().of(yup.string()),
  sort: yup.array().of(sort),
});

const testTemplateQuestionPageParam = yup.object().shape({
  testTemplateId: yup.string().required(),
  tags: yup.array().of(yup.string()),
  sort: yup.array().of(sort),
  page: yup.number(),
  size: yup.number(),
});

module.exports = {
  testTemplateQuestionDto,
  testTemplateQuestionParam,
  testTemplateQuestionPageParam,
};
