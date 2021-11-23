function errorHandling(err, req, res, next) {
  if (err) {
    // return res.status(401).json("user not authorized");
    return res.status(500).json(err);
  }
}

module.exports = errorHandling;
