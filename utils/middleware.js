const logger = require('./logger')
const { response } = require('../app')

const errorHandler = (err,req,res,next) => {
    logger.error(err.message)

    if (err.name === 'ValidationError') {
        return res.status(400).json({error: err.message})
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({error: 'invalid token'})
    }

    next(err)
}

const tokenExtractor = (req,res,next) => {
    const authorization = req.get('authorization')
    
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7)
    } else {
        req.token = null
    }
    next()
}

module.exports = {
    errorHandler,
    tokenExtractor
}