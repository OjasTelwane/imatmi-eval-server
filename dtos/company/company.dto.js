/*******************************************************************************************************
 * company Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const companyDto = yup.object().shape({
  companyName: yup.string().required(),
  companyEmail: yup.string(),
  companyContactNo: yup.string(),
  companyWebsite: yup.string(),
  isActive: yup.boolean().default(true),
});

const companyAdminDto = yup.object().shape({
  companyName: yup.string().required(),
  companyEmail: yup.string(),
  companyContactNo: yup.string(),
  companyWebsite: yup.string(),
  isActive: yup.boolean().default(true),
  name: yup.string().required(),
  empId: yup.string().required(),
  email: yup.string(),
  password: yup.string().required(),
  isAdmin: yup.string().required(),
  role: yup.string().default('Admin'),
});

const companyParamDto = yup.object().shape({
  company: yup.string(),
  companyEmail: yup.string(),
  companyContactNo: yup.string(),
  companyWebsite: yup.string(),
});

const companyParamPageDto = yup.object().shape({
  company: yup.string(),
  companyEmail: yup.string(),
  companyContactNo: yup.string(),
  companyWebsite: yup.string(),
  page: yup.number().default(0),
  size: yup.number().default(2),
});

module.exports = {
  companyDto,
  companyAdminDto,
  companyParamDto,
  companyParamPageDto,
};
