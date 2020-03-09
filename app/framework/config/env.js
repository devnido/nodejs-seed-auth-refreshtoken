const config = {
    app: {
        name: process.env.APP_NAME,
        env: process.env.NODE_ENV,
        ip: process.env.APP_LOCAL_IP,
        port: process.env.APP_LOCAL_PORT,
        urlApiPrefix: process.env.APP_PREFIX_API_URL,
        urlVersionPrefix: process.env.APP_VERSION_API,
        baseUrl: process.env.APP_BASE_URL,
        baseUrlAuth: process.env.APP_AUTH_BASE_URL,
        baseUrlApi: process.env.APP_RESOURCE_BASE_URL,
        secretAuth: process.env.APP_TOKEN_AUTH_SECRET,
        secretApi: process.env.APP_TOKEN_API_SECRET,
        passwordSalt: process.env.APP_SETTINGS_PASS_SALT
    },
    db: {
        auth: {
            driver: process.env.DB_AUTH_DRIVER,
            host: process.env.DB_AUTH_HOST,
            port: process.env.DB_AUTH_PORT,
            user: process.env.DB_AUTH_USERNAME,
            pass: process.env.DB_AUTH_PASSWORD,
            database: process.env.DB_AUTH_DATABASE
        }
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        name: process.env.EMAIL_NAME,
        from: process.env.EMAIL_FROM,
        user: process.env.EMAIL_AUTH,
        pass: process.env.EMAIL_AUTH_PASS,
    },
    seed: {
        user: {
            email: process.env.EMAIL_SEED_USER,
            pass: process.env.PASS_SEED_USER,
            name: process.env.NAME_SEED_USER
        }

    }
}

module.exports = config