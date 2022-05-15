/*******************************************************************************************************
 * Group Permissions Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const groupPermissionsDto = yup.object().shape({
  role: yup.string(),
  module: yup.string(),
  action: yup.string(),
  checked: yup.boolean(),
});

const groupPermissionsParamDto = yup.object().shape({
  role: yup.string(),
  module: yup.string(),
  action: yup.string(),
});

const groupPermissionsParamPageDto = yup.object().shape({
  role: yup.string(),
  module: yup.string(),
  action: yup.string(),
  page: yup.number().default(0),
  size: yup.number().default(2),
});

module.exports = {
  groupPermissionsDto,
  groupPermissionsParamDto,
  groupPermissionsParamPageDto,
};
