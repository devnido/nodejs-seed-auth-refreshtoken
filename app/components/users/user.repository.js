const User = require('./user.model');

const repository = {
    existsByEmail: email => User.exists({ email: email }),

    existsById: id => User.exists({ _id: id }),

    existsByValidResetPassToken: (resetPassToken, date) => User.exists({ resetPassToken, status: 'active', resetPassTokenExpDate: { $lt: date } }),

    findById: id => User.findById(id, { password: 0, refreshToken: 0, resetPassToken: 0 }),

    findByEmail: email => User.findOne({ email: email }, { password: 0, refreshToken: 0, resetPassToken: 0 }),

    findByIdWithRefreshToken: id => User.findById(id, { password: 0, resetPassToken: 0 }),

    findByEmailWithResetPassToken: email => User.findById(id, { password: 0, refreshToken: 0 }),

    findByEmailWithPassword: email => User.findById(id, { resetPassToken: 0, refreshToken: 0 }),

    findToAuthentication: email => User.findOne({ email }),

    insert: ({ email, password, name, status }) => new User({ email, password, name, status }).save(),

    setRefreshToken: (idUser, refreshToken, refreshTokenExpDate) =>
        User.findOneAndUpdate({ _id: idUser }, { refreshToken, refreshTokenExpDate }, { new: true }),

    setResetPassToken: (email, resetPassToken, resetPassTokenExpDate) =>
        User.findOneAndUpdate({ email, status: 'active' }, { resetPassToken, resetPassTokenExpDate }, { new: true }),

    setNewPassword: (id, password) => User.findOneAndUpdate({ _id: id, status: 'active' }, { password }, { new: true }),

    removeResetPassToken: id => User.findOneAndUpdate({ _id: id, status: 'active' }, { resetPassToken: '' }, { new: true }),

    delete: userId => User.findOneAndRemove({ _id: userId })

}

module.exports = repository;