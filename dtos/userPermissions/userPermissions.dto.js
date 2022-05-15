/*******************************************************************************************************
 * User Permissions Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const userPermissionsDto = yup.object().shape({
  userId: yup.string(),
  userName: yup.string(),
  module: yup.string(),
  action: yup.string(),
  checked: yup.boolean().default(false),
});

const userPermissionsDtos = yup.array().of(userPermissionsDto);

const userPermissionsParamDto = yup.object().shape({
  userId: yup.string(),
  userName: yup.string(),
  module: yup.string(),
  action: yup.string(),
});

const userPermissionsParamPageDto = yup.object().shape({
  userId: yup.string(),
  userName: yup.string(),
  module: yup.string(),
  action: yup.string(),
  page: yup.number().default(0),
  size: yup.number().default(10),
});

module.exports = {
  userPermissionsDto,
  userPermissionsDtos,
  userPermissionsParamDto,
  userPermissionsParamPageDto,
};
