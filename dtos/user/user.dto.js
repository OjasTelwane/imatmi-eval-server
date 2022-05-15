/*******************************************************************************************************
 * user Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const userDto = yup.object().shape({
  companyId: yup.string(),
  empId: yup.string(),
  role: yup.string(),
  name: yup.string().required(),
  email: yup.string(),
  password: yup.string(),
  isActive: yup.boolean().default(true),
  isFirstTime: yup.boolean().default(true),
  userPermissions: yup.array(),
});

const userDtos = yup.array().of(userDto);

const userParamDto = yup.object().shape({
  name: yup.string(),
  empId: yup.string(),
  email: yup.string(),
  companyId: yup.string(),
  role: yup.string(),
});

const userParamPageDto = yup.object().shape({
  name: yup.string(),
  empId: yup.string(),
  email: yup.string(),
  companyId: yup.string(),
  role: yup.string(),
  page: yup.number().default(0),
  size: yup.number().default(2),
});

module.exports = {
  userDto,
  userDtos,
  userParamDto,
  userParamPageDto,
};
