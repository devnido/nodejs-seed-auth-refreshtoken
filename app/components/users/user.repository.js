const User = require('./user.model');

const repository = {
    findByID: (id) => {
        return new Promise((resolve, reject) => {
            User.findById(id)
                .then((user) => {
                    //quitar  __V 
                    resolve(user)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    authenticate: (email) => {
        return new Promise((resolve, reject) => {


            console.log(email);
            User.findOne({
                email: email
            })
                .then((_user) => {

                    console.log(_user);

                    if (_user) {



                        //   let user = _user.removePassword();

                        resolve(_user)
                    } else {
                        resolve(false)
                    }
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    insert: (userData) => {

        return new Promise((resolve, reject) => {
            new User(userData).save()
                .then((_user) => {

                    let user = _user.removePassword();

                    resolve(user)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    setRefreshToken: (idUser, refreshToken) => new Promise((resolve, reject) => {

        User.findOneAndUpdate({
            _id: idUser
        }, {
            refreshToken: refreshToken
        }, {
            new: true
        }).then((_user) => {


            let user = _user.removePassword();

            resolve(user)
        }).catch((err) => {
            reject(err)
        })
    }),
    delete: (userId) => {
        return new Promise((resolve, reject) => {
            User.findOneAndRemove({
                _id: userId
            })
                .then((result) => {

                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}

module.exports = repository;