const Mysql = require('../database').mysql;

const queries = {
    add_user_table : `
        CREATE TABLE IF NOT EXISTS user(
            id INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            password TEXT NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE = InnoDB DEFAULT CHARSET=utf8;
    `
};

describe('Migrating user table:', () => {

    it('Add table user if not exists', async () => {

        await Mysql.query(queries.add_user_table);        
        
    });
});
