const islogin = async (req, res, next) => {
  try {
    if (req.session.userId) {
      next();
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    next(error);
  }
};


const islogout = async (req, res, next) => {
  try {
    if (req.session.userId) {
      res.redirect('back');
      req.session.loggedIn = false;
      req.session.destroy((err) => {
        if (err) {
          next(err);
        } else {
          res.redirect('/login');
        }
      });
    } else {
      next(); // If the user is not logged in, continue to the next middleware/route
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  islogin,
  islogout,
};
