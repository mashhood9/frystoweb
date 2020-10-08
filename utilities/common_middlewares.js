  
async function checkLocals (req, res, next) {
    req.params = {...req.params, ...res.locals};
    next();
}

module.exports = { checkLocals }