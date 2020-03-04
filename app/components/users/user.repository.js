const User = require('./user.model');

const repository = {
    existsByEmail: email => User.exists({ email: email }),

    existsById: id => User.exists({ _id: id }),

    existsByValidChangeToken: (changeToken, date) => User.exists({ changeToken, status: 'active', changeTokenExpDate: { $lt: date } }),

    findById: id => User.findById(id, { password: 0, refreshToken: 0, changeToken: 0 }),

    findByEmail: email => User.findOne({ email: email }, { password: 0, refreshToken: 0, changeToken: 0 }),

    findByIdWithRefreshToken: id => User.findById(id, { password: 0, changeToken: 0 }),

    findByEmailWithChangeToken: email => User.findById(id, { password: 0, refreshToken: 0 }),

    findByEmailWithPassword: email => User.findById(id, { changeToken: 0, refreshToken: 0 }),

    findToAuthentication: email => User.findOne({ email }),

    insert: ({ email, password, name, status }) => new User({ email, password, name, status }).save(),

    setRefreshToken: (idUser, refreshToken, refreshTokenExpDate) =>
        User.findOneAndUpdate({ _id: idUser }, { refreshToken, refreshTokenExpDate }, { new: true }),

    setChangeToken: (email, changeToken, changeTokenExpDate) =>
        User.findOneAndUpdate({ email, status: 'active' }, { changeToken, changeTokenExpDate }, { new: true }),

    setNewPassword: (id, password) => User.findOneAndUpdate({ _id: id, status: 'active' }, { password }, { new: true }),

    setNewPasswordAndRemoveChangeToken: (id, password) => User.findOneAndUpdate({ _id: id, status: 'active' }, { password, changeToken: '' }, { new: true }),

    delete: userId => User.findOneAndRemove({ _id: userId })

}

module.exports = repository;