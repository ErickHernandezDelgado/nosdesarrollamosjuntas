module.exports = {
    hasSession: (req, res, next) => {
        if(!req.session.usuario){
            return res.redirect("/inicio_sesion");
        }
        next();
    }
}