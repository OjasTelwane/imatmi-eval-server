/*******************************************************************************************************
 * UploadController file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/09/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const { uploadFileToS3, getFileStreamS3 } = require('../config/s3.js');
const ApiError = require('../middleware/api.error');

const fs = require('fs');
const util = require('util');

const unlinkFile = util.promisify(fs.unlink);

const useS3 = false;

class UploadController {
  async uploadSingle(req, res, next) {
    const file = req.file;
    if (file) {
      let filePath = `${file.destination}/${file.filename}`;
      if (useS3) {
        console.log('useS3');
        const results = await uploadFileToS3(file);
        console.log('uploadFileToS3 Results:', results);
        await unlinkFile(file.path);
      }
      res.send({
        src: filePath,
        fileContentType: file.mimetype.split('/')[0],
        type: file.mimetype,
      });
    } else {
      next(ApiError.badRequest('No File Attached!'));
    }
  }

  async deleteFile(req, res, next) {
    await unlinkFile(req.body.path);
    res.send('Delete COMPLETED!');
  }
  async uploadMulti(req, res, next) {
    console.log(req.files);
    res.send('Files Uploaded Successfully');
  }

  async getFile(req, res, next) {
    const key = req.params.key;
    console.log('key:', key);

    if (useS3) {
      const readStream = getFileStreamS3(key);
      readStream.pipe(res);
    } else {
      let ext = key.split('.')[1];
      let dir = './uploads/images/';
      if (ext === 'mp3' || ext === 'mpeg') {
        dir = './uploads/songs/';
      } else if (
        ext === 'mp4' ||
        ext === 'wmv' ||
        ext === 'x-flv' ||
        ext === 'flv' ||
        ext === 'avi' ||
        ext === 'mvk' ||
        ext === 'mov'
      ) {
        dir = './uploads/videos/';
      } else if (
        ext === 'gif' ||
        ext === 'jpeg' ||
        ext === 'jpg' ||
        ext === 'png'
      ) {
        dir = './uploads/images/';
      } else if (ext === 'docx' || ext === 'xlsx' || ext === 'pdf') {
        dir = './uploads/documents/';
      }
      const filename = dir + key;
      console.log('filename:', filename);
      const readStream = fs.createReadStream(filename);
      readStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        readStream.pipe(res);
      });
      // This catches any errors that happen while creating the readable stream (usually invalid names)
      readStream.on('error', function (err) {
        next(ApiError.badRequest('Bad File name!' + err.message));
      });
    }
  }
}

module.exports = new UploadController();
