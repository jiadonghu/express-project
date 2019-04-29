const config = {
    development : {
        mysql : {
            username : 'root',
            password : '',
            database : 'development',
            host     : 'localhost',
            dialect  : 'mysql'
        },
        jwt : {
            secret : 'mylittlehonda',
            expire : 86400
        },
        api : {
            port : 3000,
            url  : 'http://localhost:3000/' 
        }
    },
    test : {
        mysql : ({
            username : 'root',
            password : '',
            database : 'test',
            host     : 'localhost',
            dialect  : 'mysql'
        }),
        jwt : {
            secret : 'mylittlehonda',
            expire : 86400
        },
        api : {
            port : 3000,
            url  : 'http://localhost:3000/' 
        }
    }
};

module.exports = config[process.env.NODE_ENV ? process.env.NODE_ENV : 'development'];