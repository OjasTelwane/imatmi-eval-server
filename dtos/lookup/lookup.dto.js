/*******************************************************************************************************
 * lookup Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const lookupDto = yup.object().shape({
  lookupType: yup.string().required(),
  lookup: yup.string().required(),
  isActive: yup.boolean().default(true),
});

const lookupDtos = yup.array().of(
  yup.object().shape({
    lookupType: yup.string().required(),
    lookup: yup.string().required(),
    isActive: yup.boolean().default(true),
  })
);

const lookupParamDto = yup.object().shape({
  lookup: yup.string(),
  lookupType: yup.string(),
});

const lookupParamPageDto = yup.object().shape({
  lookup: yup.string(),
  lookupType: yup.string(),
  page: yup.number().default(0),
  size: yup.number().default(2),
});

module.exports = { lookupDto, lookupDtos, lookupParamDto, lookupParamPageDto };
