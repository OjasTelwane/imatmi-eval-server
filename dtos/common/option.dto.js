/*******************************************************************************************************
 * opion Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 16/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const yup = require('yup');

const selection = require('./selection.dto');
const file = require('./files.dto');
const tag = require('./tag.dto');

const option = yup.object().shape({
  setNo: yup.number().default(1),
  orderNo: yup.number().default(1),
  isCorrect: yup.boolean().default(false),
  text: yup.string(),
  files: yup.array().of(file),
  selections: yup.array().of(selection),
  tags: yup.array().of(tag),
});

module.exports = option;
