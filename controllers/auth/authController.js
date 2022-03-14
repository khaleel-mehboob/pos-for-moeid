const { promisify } = require('util');
const db = require("../../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const changedPasswordAfter = function(passwordChangedAt, JWTTimeStamp) {
  if(passwordChangedAt) {
    const changedTimeStamp = parseInt(passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};
 
exports.login = catchAsync(async (req, res, next) => {

  const { username, password } = req.body;

  // Check if username and password exist
  if(!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }

  // Check if user exists and password is correct
  const user = await db.users.findOne({ where: { username, status: 'active'}});

  if(!user || !(await bcrypt.compare(password, user.dataValues.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  const token = signToken(user.dataValues.id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  };
  // Use below option if deploying on https
  // x-forwarded-proto is heroku specific
  
  res.cookie('jwt', token, cookieOptions);

  // Remove the password from the output
  user.password = undefined;
  
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });

});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10  * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
}

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if(req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if(!token) {
    return next(new AppError('You are not logged in! Please login to get access.', 401));
  }
  // 2) Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
  // 3) Check if user still exists 
  const currentUser = await db.users.findByPk(decoded.id);
  if(!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist', 401));
  }

  // 4) Check if user changed password after the token was issued
  if(changedPasswordAfter(currentUser.passwordChangedAt, decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  };

  // Grant access to the protected route
  currentUser.password = undefined;
  req.user = currentUser;
  return next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  // 1) Getting token and check if it's there
  if(req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt, 
        process.env.JWT_SECRET
      );
      
      // 2) Check if user still exists 
      const currentUser = await db.users.findByPk(decoded.id);
      if(!currentUser) {
        return next();
      }
    
      // 3) Check if user changed password after the token was issued
      if(changedPasswordAfter(currentUser.passwordChangedAt, decoded.iat)) {
        return next();
      };
    
      // THERE IS A LOGGED IN USER
      currentUser.password = undefined;
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  return next();
};

exports.restrictTo = (...userRoles) => {
  return (req, res, next) => {
    if(!userRoles.includes(req.user.userRole)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    return next();
  }
}

exports.getAllUsers = catchAsync(async (req, res, next) => {

  const users = await db.users.findAll({attributes: {exclude: 'password'}});

  res.status(201).json(
    {
      status: 'success',
      data: {
        users
      }
    }
  );
});
