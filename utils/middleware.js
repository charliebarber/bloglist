const logger = require('./logger')

const errorHandler = (err,req,res,next) => {
    logger.error(err.message)

    if (err.name === 'ValidationError') {
        return res.status(400).json({error: err.message})
    }

    next(error)
}

module.exports = {
    errorHandler
}