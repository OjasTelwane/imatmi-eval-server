/*******************************************************************************************************
 * Test Template Dto and Test Template Query Parameter Dtos file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 12/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const testTemplateDto = yup.object().shape({
  isVerified: yup.string(),
  verifiedBy: yup.string(),
  createdBy: yup.string(),
  modifiedBy: yup.string(),
  testName: yup.string(),
  testType: yup.string(),
  testDescription: yup.string(),
  testDuration: yup.number(),
  testDate: yup.date(),
  startTime: yup.date(),
  endTime: yup.date(),
  maxAttempt: yup.number(),
  isManual: yup.boolean().default(false),
  tags: yup.array(),
  tagsBucket: yup.array().of(
    yup.object().shape({
      tag: yup.string(),
      order: yup.number().default(1),
      level: yup.number().default(1),
      weightage: yup.number().default(0),
    })
  ),
  questions: yup.array(),
  questionCount: yup.number(),
});

const testTemplatePageParam = yup.object().shape({
  testName: yup.string(),
  testType: yup.string(),
  testDescription: yup.string(),
  testDate: yup.string(),
  tag: yup.string(),
  page: yup.number(),
  size: yup.number(),
});

module.exports = {
  testTemplateDto,
  testTemplatePageParam,
};
