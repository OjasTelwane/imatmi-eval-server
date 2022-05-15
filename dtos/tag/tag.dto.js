/*******************************************************************************************************
 * tag Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 15/09/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const tagDto = yup.object().shape({
  tag: yup.string().required(),
  tagType: yup.string().default('Quality'),
  isVerified: yup.boolean().default(false),
});

const tagDtos = yup.array().of(
  yup.object().shape({
    tag: yup.string().required(),
    tagType: yup.string().default('Quality'),
    isVerified: yup.boolean().default(false),
  })
);

const tagParamDto = yup.object().shape({
  tag: yup.string(),
  tagType: yup.string(),
});

const tagParamPageDto = yup.object().shape({
  tag: yup.string(),
  tagType: yup.string(),
  page: yup.number().default(0),
  size: yup.number().default(2),
});

module.exports = { tagDto, tagDtos, tagParamDto, tagParamPageDto };
