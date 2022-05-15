/*******************************************************************************************************
 * question Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 16/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const question = yup.object().shape({
  questionType: yup.number().default(0),
  text: yup.string(),
});

module.exports = question;
