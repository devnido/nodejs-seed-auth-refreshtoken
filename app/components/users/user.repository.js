const repository = ({ User }) => ({

    existsByEmail: email => User.exists({ email: email }),

    existsById: id => User.exists({ _id: id }),

    existsByValidResetPassToken: (resetPassToken, date) => User.exists({ resetPassToken, status: 'active', resetPassTokenExpDate: { $gt: date } }),

    getById: id => User.findById(id, { password: 0, refreshToken: 0, resetPassToken: 0 }),

    getByEmail: email => User.findOne({ email }, { password: 0, refreshToken: 0, resetPassToken: 0 }),

    getByIdWithRefreshToken: (id, date) => User.findOne({ _id: id, refreshTokenExpDate: { $gt: date } }, { password: 0, resetPassToken: 0 }),

    getByResetPassToken: (resetPassToken, date) => User.findOne({ resetPassToken, status: 'active', resetPassTokenExpDate: { $gt: date } }, { password: 0, refreshToken: 0 }),

    getToAuthenticate: email => User.findOne({ email }),

    insert: ({ email, password, name, status }) => new User({ email, password, name, status }).save(),

    setRefreshToken: (idUser, refreshToken, refreshTokenExpDate) =>
        User.updateOne({ _id: idUser }, { refreshToken, refreshTokenExpDate }),

    setResetPassToken: (idUser, resetPassToken, resetPassTokenExpDate) =>
        User.updateOne({ _id: idUser, status: 'active' }, { resetPassToken, resetPassTokenExpDate }),

    setNewPassword: (id, password) => User.updateOne({ _id: id, status: 'active' }, { password }),

    removeResetPassToken: id => User.updateOne({ _id: id, status: 'active' }, { resetPassToken: '', resetPassTokenExpDate: Date.now() }),

    removeRefreshToken: id => User.updateOne({ _id: id, status: 'active' }, { refreshToken: '', refreshTokenExpDate: Date.now() }),

    delete: userId => User.deleteOne({ _id: userId })

})

module.exports = repository;