const userService = require('../users/user.service');
const jwtService = require('../../framework/services/jsonwebtoken.service');

const controller = {
    register: (email, name, password) => {

        return userService.register(email, name, password);

    },
    loginAndGenerateTokens: (email, password) => new Promise((resolve, reject) => {

        let userData = '';
        let refreshToken = '';

        userService.authenticate(email, password)
            .then(user => {
                if (user) {

                    userData = user;

                    return jwtService.generateRefreshToken()

                } else {
                    resolve(false);
                }
            })
            .then(_refreshToken => {

                refreshToken = _refreshToken;

                return userService.storeResfreshToken(userData._id, _refreshToken);
            })
            .then(userWithRefreshToken => {

                userData = userWithRefreshToken;

                return jwtService.generateJwt(userData._id)

            })
            .then(jwt => {

                resolve({
                    user: userData,
                    refreshToken: refreshToken,
                    jwt: jwt
                })

            })
            .catch(error => reject(error))

    }),
    refreshTheToken: (idUser, bearer, refreshToken) => new Promise((resolve, reject) => {

        const jwt = bearer.split(' ')[1];

        let uid = '';
        let status = '';
        let belongsToIdUser = '';

        jwtService.decode(jwt)
            .then(jwtDecoded => {

                uid = jwtDecoded.uid;
                status = jwtDecoded.status;
                return userService.hasRefreshToken(uid, refreshToken)
            })
            .then(result => {

                belongsToIdUser = result;

                if (status == 'expired') {


                    if (belongsToIdUser) {
                        if (uid == idUser)
                            return tokenService.generateJwt(uid);
                        else
                            throw 'El usuario es un impostor';
                    } else {
                        throw 'Refresh token no pertenece al usuario';
                    }
                } else {
                    throw 'El token no ha expirado';
                }

            })
            .then(newJwt => {
                resolve({
                    newJwt: newJwt
                });
            })
            .catch(err => {
                reject(err);
            });
    }),
    verifyUser: (idUser, refreshToken) => new Promise((resolve, reject) => {

        userService.hasRefreshToken(idUser, refreshToken)
            .then(result => {

                const belongs = result;

                if (belongs) {
                    resolve({
                        status: 'active'
                    })
                } else {
                    resolve({
                        status: 'inactive'
                    })
                }

            })
            .catch(err => {
                reject(err);
            });
    })

}

module.exports = controller;