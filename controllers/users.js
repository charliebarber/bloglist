const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const body = req.body

    if (!body.password) {
        return res.status(400).json({error: 'password is required'})
    } else if (body.password.length < 3) {
        return res.status(400).json({error: 'password must be longer than 3 characters'})
    } else {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()

        res.json(savedUser)
    }

})

usersRouter.get('/', async (req,res) => {
    const allUsers = await User.find({}).populate('blogs')
    res.json(allUsers)
})

module.exports = usersRouter