


class AuthsController {

    // [GET] /Login
    authGetLogin(req, res, next) {
        res.render('auth/login');
    }

    // [GET] /Register
    authGetRegister(req, res, next) {
        res.render('auth/register');
    }

    // [POST] /Register
    authPostRegister(req, res, next) {
        res.json(req.body);
    }


}

module.exports = new AuthsController();