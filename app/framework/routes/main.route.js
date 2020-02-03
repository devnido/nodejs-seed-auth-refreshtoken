const routeAuth = require('../../components/auth/auth.route');
const config = require('../config/env');

var route = {

    init: (express, app) => {

        var router = express.Router();

        /* routes list */
        routeAuth.init(router);

        const prefixApiUrl = config.app.urlApiPrefix; /* api/ */
        const prefixVersionApi = config.app.urlVersionPrefix; /* v1/ */

        const prefix = `${prefixApiUrl}${prefixVersionApi}`; /* api/v1/ */

        /* http://localhost:3000/api/v1/ */
        app.use(prefix, router);

    }
}

module.exports = route