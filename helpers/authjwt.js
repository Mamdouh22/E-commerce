const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: "/products", methods: ["GET", "OPTIONS"] },
      { url: "/category", methods: ["GET", "OPTIONS"] },
      "/users/register",
      "/users/login",
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    return done(null, true);
  }
  return done();
}
module.exports = authJwt;
