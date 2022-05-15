const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
const path = require('path')
require('winston-daily-rotate-file');
// require('winston-mongodb');
// const config = require('config');
// const mongoURI = config.get('mongoURI');


const LogFormat = printf(({ level, message, timestamp, stack, err }) => {
  return `${timestamp} : [${level.toUpperCase()}] ${stack || message}`;
});

var Logtransport = new transports.DailyRotateFile({
    filename: path.resolve(`./app-logs/${new Date().getFullYear().toString()}-${new Date().getMonth()+1}/%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    timestamp : new Date(),
    format : combine(
        timestamp(),
        format.errors({stack : true}),
        LogFormat)
  });


const logger = createLogger({
    transports : [
        Logtransport
        // new transports.File({
        //     filename : 'app.log',
        //     level : 'info',
        //     format : combine(
        //         // colorize(), 
        //         timestamp(),
        //         format.errors({stack : true}),
        //         LogFormat)
        // }),
        // new transports.Console({
        //     // filename : 'app.log',
        //     level : 'info',
        //     format : combine(colorize(), timestamp(),myFormat)
        // }),
        // new transports.MongoDB({
        //     db : mongoURI,
        //     options : { useUnifiedTopology: true },
        //     format : format.combine(format.timestamp(), format.json()),
        //     collection : 'logs',
        //     tryReconnect : true
        // })
    ]
});

module.exports = logger;