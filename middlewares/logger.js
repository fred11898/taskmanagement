const logger = (req, res, next) => {
    console.log("Logger middleware");
    next();
}

module.exports = logger;