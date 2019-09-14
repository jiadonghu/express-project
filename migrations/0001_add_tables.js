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
    `,
    add_blog_post_table : `
    CREATE TABLE IF NOT EXISTS blog_post(
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        published tinyint(1) NOT NULL,
        content TEXT,
        PRIMARY KEY (id)
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8;
    `,
    add_tag_table : `
    CREATE TABLE IF NOT EXISTS tag(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8;
    `,
    add_post_tag_table : `
    CREATE TABLE IF NOT EXISTS post_tag(
        id INT NOT NULL AUTO_INCREMENT,
        post_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8;
    `
};

describe('Adding tables:', () => {

    it('Add table user if not exists', async () => {
        await Mysql.query(queries.add_user_table);        
    });
    it('Add table blog_post if not exists', async () => { 
        await Mysql.query(queries.add_blog_post_table);  
    });
    it('Add table tag if not exists', async () => {
        await Mysql.query(queries.add_tag_table);          
    });
    it('Add table post_tag if not exists', async () => {
        await Mysql.query(queries.add_post_tag_table);  
    });

});
