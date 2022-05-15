/*******************************************************************************************************
 * selection Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 16/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const selection = yup.object().shape({
  type: yup.string(),
  selection: yup.object(),
});

module.exports = selection;
