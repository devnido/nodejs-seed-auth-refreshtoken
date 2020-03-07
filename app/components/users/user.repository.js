const User = require('./user.model');

const repository = {
    existsByEmail: email => User.exists({ email: email }),

    existsById: id => User.exists({ _id: id }),

    existsByValidResetPassToken: (resetPassToken, date) => User.exists({ resetPassToken, status: 'active', resetPassTokenExpDate: { $lt: date } }),

    findById: id => User.findById(id, { password: 0, refreshToken: 0, resetPassToken: 0 }),

    findByEmail: email => User.findOne({ email: email }, { password: 0, refreshToken: 0, resetPassToken: 0 }),

    findByIdWithRefreshToken: id => User.findById(id, { password: 0, resetPassToken: 0 }),

    getByResetPassToken: resetPassToken => User.findOne({ resetPassToken: resetPassToken, status: 'active', resetPassTokenExpDate: { $lt: date } }, { password: 0, refreshToken: 0 }),

    findByEmailWithPassword: email => User.findById(id, { resetPassToken: 0, refreshToken: 0 }),

    findToAuthentication: email => User.findOne({ email }),

    insert: ({ email, password, name, status }) => new User({ email, password, name, status }).save(),

    setRefreshToken: (idUser, refreshToken, refreshTokenExpDate) =>
        User.updateOne({ _id: idUser }, { refreshToken, refreshTokenExpDate }),

    setResetPassToken: (idUser, resetPassToken, resetPassTokenExpDate) =>
        User.updateOne({ _id: idUser, status: 'active' }, { resetPassToken, resetPassTokenExpDate }),

    setNewPassword: (id, password) => User.updateOne({ _id: id, status: 'active' }, { password }),

    removeResetPassToken: id => User.updateOne({ _id: id, status: 'active' }, { resetPassToken: '' }, { new: true }),

    delete: userId => User.findOneAndRemove({ _id: userId })

}

module.exports = repository;