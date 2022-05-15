/*******************************************************************************************************
 * sort Dto file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 03/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

 const yup = require('yup');

 const sort = yup.object().shape({
   field: yup.string(),
   order: yup.number(),
 });
 
 module.exports = sort;
 