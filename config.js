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
        }
    }
};

console.log(process.env.NODE_ENV)

module.exports = config[process.env.NODE_ENV ? process.env.NODE_ENV : 'development'];