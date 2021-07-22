/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/register", async (req, res, next) => {
  try {
    const { username } = await User.register(req.body);
    if (!username) {
      throw new ExpressError("Username required", 400);
    }

    let token = jwt.sign({ username }, SECRET_KEY);

    return res.json({ token });
  } catch (e) {
    if (e.code === "23505") {
      return next(
        new ExpressError("Username taken. Please pick another!", 400)
      );
    }
    return next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }

    if (await User.authenticate(username, password)) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ message: `Logged in!`, token });
      }
    }
    throw new ExpressError("Invalid username/password", 400);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
