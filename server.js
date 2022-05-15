const express = require('express');
const compression = require('compression');
const databaseConnection = require('./config/db');
const logger = require('./config/logger');
const http = require('http');
const api = require('./api');
const cors = require('cors');
const apiErrorHandler = require('./middleware/api.error.handler');
const path = require('path');
const config = require('config');
const LOG_DIR = config.get('LOG_DIR');
// Authenticate before we execute the end point
const auth = require('./middleware/auth');
//Included for File Upload Functionality
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Emitter = require('events');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json({ extended: false, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('assets'));
app.use(express.static(__dirname + '/'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    if (
      file.mimetype === 'audio/mp3' ||
      file.mimetype === 'audio/mpeg' ||
      file.mimetype === 'audio/wave'
    ) {
      const dir = 'uploads/songs';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    } else if (
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/wmv' ||
      file.mimetype === 'video/x-flv' ||
      file.mimetype === 'video/flv' ||
      file.mimetype === 'video/avi' ||
      file.mimetype === 'video/mvk' ||
      file.mimetype === 'video/mov'
    ) {
      const dir = 'uploads/videos';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    } else if (
      file.mimetype === 'image/gif' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      const dir = 'uploads/images';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    } else if (
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/pdf'
    ) {
      const dir = 'uploads/documents';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    } else {
      console.log(file.mimetype);
      cb({ error: 'Mime type not supported' });
    }
  },
  filename: (req, file, cb) => {
    let ext = file.mimetype.split('/')[1];
    console.log('file:==>', file);
    if (ext === 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      ext = 'xlsx';
    } else if (
      ext === 'vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      ext = 'docx';
    }
    // use random name with original file extension
    cb(null, uuidv4() + '.' + ext);
  },
});

// const upload = multer({dest:'uploads/images/'});
const upload = multer({ storage: storage });

const uploadController = require('./controllers/upload.controller');
const Logs = require('./models/Logs');
const bigFiveQuestions = require('./models/bigFiveQuestions');
const bigFiveTestTemplates = require('./models/bigFiveTestTemplate');
const bigFiveTests = require('./models/bigFiveTest');

// Event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

databaseConnection();

// Routes
app.use(api);

/* ******************************************************************************************************************************
 * Usage
 * <form action='/file', method='POST' enctype='multipart/form-data' >
 *    <input type='file' name='file' />
 *    <button type='submit'>Upload File</button>
 * </form>
 * 
 *  OR
 * 
 * const [fileData, setFileData] = useState();
 * 
 * const fileChangeHandler = (e) => {
 *  setFileData(e.target.files[0]);
 * }
 * 
 * const onSubmitHandler = (e) => {
 *  e.preventDefault();
 *  
 * // Handle File data fromm the state before sending
 * const data = new FormData();
 * data.append('file', fileData )
 * fetch('http://localhost:3000/file', {
 *    method: 'POST',
 *    body: data,
 * } )
 * .then( (result) => {
 *    console.log('File Sent Successfully')
 * }) 
 * /catch((err) => {
 *    console.log(err.message);
 * })
 * }
 * 
 * return (
 *  <div className='App'>
 *    <h1>React App</h1>
 *    <form onSubmit={onSubmitHandler} >
 *      <input type='file' onChange={fileChangeHandler} />
 *      <br />
 *      <br />
 *      <button type='submit'>Upload File</button>
 *    </form>
 *  </div>
 * );
 * 
// * ******************************************************************************************************************************/
// POST request to upload single file.
//auth.verifyUser,
app.post('/file', upload.single('file'), uploadController.uploadSingle);
app.post('/delete/file', uploadController.deleteFile);

app.post(
  '/images',
  auth.verifyUser,
  upload.array('images', 10),
  uploadController.uploadMulti
);
app.get('/logs', (req, res) => {
  Logs.find()
    .sort({ timestamp: -1 })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ---- LOG FILES OPERATIONS START
app.get('/app-logs/:monthId/:dayId', (req, res) => {
  // const dir = 'logs';
  const file = path.resolve(`${LOG_DIR}/${monthId}/${dayId}`);
  try {
    res.download(file);
    logger.info('Log file download');
  } catch {
    logger.error('log file download');
  }
});

app.get('/log-files', (req, res) => {
  let AllFiles = [];
  const months_dir = fs.readdirSync(LOG_DIR);
  // console.log(months_dir);
  months_dir.map((month) => {
    const files = fs.readdirSync(`${LOG_DIR}/${month}`);
    AllFiles.push({
      month,
      files,
    });
  });
  res.status(200).send(AllFiles);
});
// ---- LOG FILES OPERATIONS END

// ----- Big Five APIs START
app.post('/getQuestions/add', (req, res) => {
  console.log('added five');
  const newQuestion = req.body;
  console.log('from add' + newQuestion);
  try {
    const question = new bigFiveQuestions(newQuestion);
    question.save();
    res.status(200).send('success');
  } catch (err) {
    res.status(500).send('server error');
  }
});

app.get('/getQuestions', (req, res) => {
  bigFiveQuestions
    .find()
    .then((data) => {
      console.log(data);
      res.send({
        totalItems: data.length,
        questions: data,
        totalPages: 5,
        currentPage: 1,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/getQuestions/:id', (req, res) => {
  bigFiveQuestions
    .findById(req.params.id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.put('/getQuestions/:id', (req, res) => {
  const id = req.params.id;
  const {
    questionType,
    isActive,
    isVerified,
    verifiedBy,
    createdBy,
    modifiedBy,
    text,
    files,
    fileContentType,
    selections,
    options,
  } = req.body;

  const tagList = [];
  for (var i = 0; i < options.length; i++) {
    const option = options[i];
    option.tags.forEach((t) => {
      tagList.push(t);
    });
  }
  // console.log('tagList-In===> :', tagList);
  const optionTagList = tagList.map((t) => {
    return t.tag;
  });

  const newTagList = tagList.filter(
    (tag, index, self) => index === self.findIndex((t) => t.tag === tag.tag)
  );
  const tags = newTagList.map((tag) => {
    return tag.tag;
  });
  const questionDto = {
    questionType,
    isActive,
    isVerified,
    verifiedBy,
    createdBy,
    modifiedBy,
    text,
    files,
    fileContentType,
    selections,
    tags,
    options,
    selected_option_id: 'Agree',
  };
  console.log(id, questionDto);
  bigFiveQuestions
    .findByIdAndUpdate(id, questionDto, { useFindAndModify: false })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get('/getTests', (req, res) => {
  bigFiveTestTemplates
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/getTests/add', (req, res) => {
  const newTest = req.body;
  try {
    const test = new bigFiveTestTemplates(newTest);
    test.save();
    res.status(200).send('success');
  } catch (err) {
    res.status(500).send('server error');
  }
});
const editOptionsName = (questions) =>
  questions.map((question) => {
    question.selected_option_id = '';
    return questions;
  });
app.post('/getTests/assign', async (req, res) => {
  const newTest = req.body;
  try {
    const testTemplate = await bigFiveTestTemplates.findById(newTest.id);
    for (var i = 0; i < testTemplate.questions.length; i++) {
      testTemplate.questions[i].selected_option_id = '';
    }
    const examinees = newTest.examinees;
    const tests = await examinees.map((examinee) => {
      return {
        examineeId: examinee.examineeId,
        examineeName: examinee.examineeName,
        testTemplateId: newTest.id,
        testName: testTemplate.testName,
        testType: testTemplate.testType,
        status: 'Assigned',
        testDescription: testTemplate.testDescription,
        testDuration: testTemplate.testDuration,
        testDate: testTemplate.testDate,
        startTime: testTemplate.startTime,
        endTime: testTemplate.endTime,
        tags: testTemplate.tags,
        questions: testTemplate.questions,
        score: {
          totalQuestions: testTemplate.questions.length,
          totalAnswered: 0,
          totalNotAnswered: testTemplate.questions.length,
          totalMarkedForReview: 0,
          totalCorrectAnswered: 0,
        },
      };
    });
    tests.map((test) => {
      const Test = new bigFiveTests(test);
      Test.save();
    });
    res.status(200).send('success');
  } catch (err) {
    res.status(500).send('server error');
  }
});
app.get('/getTests/:id', (req, res) => {
  bigFiveTests
    .findById(req.params.id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get('/getTestsAll', (req, res) => {
  bigFiveTests
    .find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.put('/getTests/start/:id', (req, res) => {
  bigFiveTests.findById(req.params.id).then((data) => {
    const id = req.params.id;
    const { testDate, startTime } = req.body;
    data.status = 'Progress';
    data.maxAttempt = data.maxAttempt - 1;
    bigFiveTests
      .findByIdAndUpdate(req.params.id, data, { useFindAndModify: false })
      .then((data) => {
        res.status(200).send('start test updaated successfully');
      })
      .catch((err) => {
        res.status(500).send('Error');
      });
  });
});
const getResult = async (answers) => {
  try {
    return await axios.post('http://localhost:5000/predict_api', [answers]);
  } catch (error) {
    console.error(error);
  }
};
app.put('/getTests/end/:id', async (req, res) => {
  bigFiveTests.findById(req.params.id).then(async (data) => {
    const id = req.params.id;
    const { endTime, questions } = req.body;
    data.status = 'Completed';
    data.endTime = endTime;
    data.questions = questions;
    data.score.totalAnswered = 50;
    data.score.totalNotAnswered = 0;
    var personalityScore = {
      Openness: 0,
      Conscientiousness: 0,
      Extraversion: 0,
      Agreeableness: 0,
      Neuroticism: 0,
    };
    var jobFitnessScore = {
      CEO: 0,
      Manager: 0,
      TechLead: 0,
      TeamLeader: 0,
      SeniorDeveloper: 0,
      Freshie: 0,
    };

    questions.map((q) => {
      let score = 0;
      if (q.selected_option_id == 'Agree') score = 0.5;
      else if (q.selected_option_id == 'Neutral') score = 0.3;
      else score = 0.1;
      personalityScore[q.tags[0]] += score;
    });
    data.personalityScore = personalityScore;
    data.personalityScore.Openness =
      Math.round(personalityScore.Openness * 10) / 10;
    data.personalityScore.Conscientiousness =
      Math.round(personalityScore.Conscientiousness * 10) / 10;
    data.personalityScore.Extraversion =
      Math.round(personalityScore.Extraversion * 10) / 10;
    data.personalityScore.Agreeableness =
      Math.round(personalityScore.Agreeableness * 10) / 10;
    data.personalityScore.Neuroticism =
      Math.round(personalityScore.Neuroticism * 10) / 10;
    const questionEXTData = [];
    for (let i = 0; i < 50; i++) {
      if (questions[i].selected_option_id == 'Agree') questionEXTData[i] = 5;
      else if (questions[i].selected_option_id == 'Neutral')
        questionEXTData[i] = 3;
      else questionEXTData[i] = 1;
    }
    let i = 0;
    let answers = {
      EXT1: 3,
      EXT2: 3,
      EXT3: 3,
      EXT4: 3,
      EXT5: 3,
      EXT6: 3,
      EXT7: 3,
      EXT8: 3,
      EXT9: 3,
      EXT10: 3,
      EST1: 3,
      EST2: 3,
      EST3: 3,
      EST4: 3,
      EST5: 3,
      EST6: 3,
      EST7: 3,
      EST8: 3,
      EST9: 3,
      EST10: 3,
      AGR1: 3,
      AGR2: 3,
      AGR3: 3,
      AGR4: 3,
      AGR5: 3,
      AGR6: 3,
      AGR7: 3,
      AGR8: 3,
      AGR9: 3,
      AGR10: 3,
      CSN1: 3,
      CSN2: 3,
      CSN3: 3,
      CSN4: 3,
      CSN5: 3,
      CSN6: 3,
      CSN7: 3,
      CSN8: 3,
      CSN9: 3,
      CSN10: 3,
      OPN1: 3,
      OPN2: 3,
      OPN3: 3,
      OPN4: 3,
      OPN5: 3,
      OPN6: 3,
      OPN7: 3,
      OPN8: 3,
      OPN9: 3,
      OPN10: 3,
    };
    for (const ans in answers) {
      answers[ans] = questionEXTData[i++];
    }
    let finalResult = getResult(answers);
    finalResult.then((d) => {
      // console.log(d.data[0]);
      data.finalResult = d.data[0];
      bigFiveTests
        .findByIdAndUpdate(req.params.id, data, { useFindAndModify: false })
        .then((data) => {
          res.status(200).send('Completed SucessFully');
        })
        .catch((err) => {
          res.status(500).send('Error');
        });
    });
  });
});

app.put('/getTests/progress/:id', (req, res) => {
  bigFiveTests.findById(req.params.id).then((data) => {
    const id = req.params.id;
    const { remaining, questions, currentIndex } = req.body;
    data.status = 'Progress';
    data.score.totalAnswered = currentIndex;
    data.score.totalNotAnswered = data.score.totalQuestions - currentIndex;
    data.questions = questions;
    data.testDuration = remaining;
    console.log(remaining);
    bigFiveTests
      .findByIdAndUpdate(req.params.id, data, { useFindAndModify: false })
      .then((data) => {
        res.status(200).send('Completed SucessFully');
      })
      .catch((err) => {
        res.status(500).send('Error');
      });
  });
});
// ---- BIG FIVE APIs END
app.get('/files/:key', uploadController.getFile);

//middleware where we handle all errors, trapped and un-trapped
// Always call this Error Handler at the last
app.use(apiErrorHandler);

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8081',
    ], //,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  //Join
  // console.log('connect socket.id===>', socket.id);
  socket.on('join', (testId) => {
    try {
      //Join
      socket.join(testId);
      // console.log('join testId===>', testId);
    } catch (error) {
      console.log('socket.join===>', error);
    }
  });
  socket.on('joinServer', (serverId) => {
    //Join
    socket.join('TestEngine');
    // console.log('join serverId===>', serverId);
  });

  //receive from Test Server
  socket.on('onNewQuestion', (newQuestion) => {
    try {
      console.log('onNewQuestion=received===>', newQuestion);
      //redirect it to client
      const question = { ...newQuestion };
      io.to(`test_${newQuestion.testId}`).emit('onNewQuestion', question);
    } catch (error) {
      console.log('socket.onNewQuestion===>', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('disconnect socket.id===>', socket.id);
  });
});

io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

eventEmitter.on('onNewQuestion', (newQuestion) => {
  try {
    console.log('eventEmitter===onNewQuestion', newQuestion);
    io.to(`test_${newQuestion.testId}`).emit('onNewQuestion', newQuestion);
  } catch (error) {
    console.log('eventEmitter.onNewQuestion===>', error);
  }
});

eventEmitter.on('onQuestionUpdate', (updateQuestion) => {
  try {
    io.to('TestEngine').emit('onQuestionUpdate', updateQuestion);
  } catch (error) {
    console.log('eventEmitter.onQuestionUpdate===>', error);
  }
});

eventEmitter.on('onFinishTest', (updateQuestion) => {
  try {
    io.to('TestEngine').emit('onFinishTest', updateQuestion);
  } catch (error) {
    console.log('eventEmitter.onFinishTest===>', error);
  }
});

eventEmitter.on('onTestAssign', (test) => {
  try {
    io.to('TestEngine').emit('onTestAssign', test);
  } catch (error) {
    console.log('eventEmitter.onTestAssign===>', error);
  }
});

// Start Server
server.listen(port, () => {
  // logger.log({level : 'info', message : 'S S', metadata : {user : 'XYZ'}});
  console.log(`Server started on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Server is deployed on Heroku and is running successfully');
});

module.exports = server;
