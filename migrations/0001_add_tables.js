const { mysql }   = require('../database');

const queries = {
    addUserTable : `
    CREATE TABLE IF NOT EXISTS user(
        id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        password TEXT NOT NULL,
        
        PRIMARY KEY (id)
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8;
    `,
    addPostTable : `
    CREATE TABLE IF NOT EXISTS blog_post(
        id INT NOT NULL AUTO_INCREMENT,
        userId INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        published tinyint(1) NOT NULL,
        content TEXT,
      
        PRIMARY KEY (id)
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8;
    `,
    addTagTable : `
    CREATE TABLE IF NOT EXISTS tag(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        
        PRIMARY KEY (id)
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8;
    `,
    addPostTagTable : `
    CREATE TABLE IF NOT EXISTS post_tag(
        id INT NOT NULL AUTO_INCREMENT,
        postId INT NOT NULL,
        tagId INT NOT NULL,
       
        PRIMARY KEY (id)
    ) ENGINE = InnoDB DEFAULT CHARSET=utf8;
    `
};

describe('Adding tables:', () => {

    it('Add table user if not exists', async () => {
        await mysql.query(queries.addUserTable);        
    });
    it('Add table blog_post if not exists', async () => { 
        await mysql.query(queries.addPostTable);  
    });
    it('Add table tag if not exists', async () => {
        await mysql.query(queries.addTagTable);          
    });
    it('Add table post_tag if not exists', async () => {
        await mysql.query(queries.addPostTagTable);  
    });

});
