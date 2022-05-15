/*******************************************************************************************************
 * tag Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 16/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const tag = yup.object().shape({
  tag: yup.string(),
  weightage: yup.number(),
});

module.exports = tag;
