const user = require("../model/user");

const homeview = async (req, res, next) => {
 try {
  res.render('user/home')
 } catch (error) {
  next(error)
 }
};

module.exports = {
  homeview,
};

