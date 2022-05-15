const jwt = require('jsonwebtoken');
const config = require('config');

exports.verifyUser = (req, res, next) => {
  //get token from header
  const token = req?.headers?.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      msg: 'Auth denied'
    });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtToken'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      msg: 'Token is not valid'
    });
  }
};

exports.verifyAdmin = (req, res, next) => {
	if (req.user.isAdmin) {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		next();
	} else {
		err = new Error('You are not authorized to perform this operation!');
		err.statusCode = 403;
		next(err);
	}
};