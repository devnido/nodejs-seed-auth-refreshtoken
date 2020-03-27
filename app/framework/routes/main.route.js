const routes = ({ config, authRoute }) => ({

    init: (express, app) => {

        const router = express.Router();

        /* routes list */
        authRoute.init(router);

        const prefixApiUrl = config.app.urlApiPrefix; /* api/ */
        const prefixVersionApi = config.app.urlVersionPrefix; /* v1/ */

        const prefix = `${prefixApiUrl}${prefixVersionApi}`; /* api/v1/ */

        /* http://localhost:3000/api/v1/ */
        app.use(prefix, router);

    }
})

module.exports = routes