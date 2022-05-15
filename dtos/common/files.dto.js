/*******************************************************************************************************
 * file Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 16/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const file = yup.object().shape({
  src: yup.string(),
  fileContentType: yup.string(),
  type: yup.string(),
});

module.exports = file;
