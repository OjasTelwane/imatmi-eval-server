const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const logger = require('./logger');

const databaseConnection = async () => {
  try {
    await mongoose.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
    logger.log('info', 'MongoDB connected');
    logger.log('info', 'app begin');
    console.log('MongoDB connected');
  } catch (err) {
    logger.error(err.message);
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = databaseConnection;