// set env param as test 
process.env.NODE_ENV = 'test';

const Should = require('should');
const Chance = require('chance');
const chance = new Chance();  
const Validations = require('../../utils/validation');
const { validationResult } = require('express-validator');

const run_validation = async (val_array, req) => {
    for (let val_func of val_array) {
        await val_func(req, {}, () => {});
    }
    return validationResult(req).errors.map(err => err.param);
};

describe('Util Validation User', async () => {

    it('User.GetUser should pass', async () => {

        let mock_req = {
            params : {
                id : '1'
            }
        };
        let result = await run_validation(Validations.User.GetUser, mock_req);
        mock_req.params.id.should.equal(1);
        result.length.should.equal(0);

    });

    it('User.GetUser should have error', async () => {

        let mock_req = {
            params : {
                id : false
            }
        };
        let result = await run_validation(Validations.User.GetUser, mock_req);
        result.should.eql(['id']);

    });

    it('User.Login should pass', async () => {

        let mock_req = {
            body : {
                email    : chance.email(),
                password : chance.word({ length: 99 })
            }
        };
        let result = await run_validation(Validations.User.Login, mock_req);
        result.length.should.equal(0);

    });

    it('User.Login should have error', async () => {
        
        let mock_req = {
            body : {
                email    : chance.word({ length: 10 }),
                password : chance.word({ length: 129 })
            }
        };
        let result = await run_validation(Validations.User.Login, mock_req);
        result.should.eql(['email', 'password']);

    });

    it('User.Register should pass', async () => {
        
        let mock_req = {
            body : {
                email    : chance.email(),
                password : chance.word({ length: 99 }),
                name     : chance.word({ length: 99 }),
            }
        };
        let result = await run_validation(Validations.User.Register, mock_req);
        result.length.should.equal(0);

    });
        
    it('User.Register should have error', async () => {
        
        let mock_req = {
            body : {
                email    : chance.word({ length: 10 }),
                password : chance.word({ length: 129 }),
                name     : chance.word({ length: 101 }),
            }
        };
        let result = await run_validation(Validations.User.Register, mock_req);
        result.should.eql(['email', 'password', 'name']);

    });
    
});

describe('Util Validation Tag', async () => {

    it('Tag.CreateTag should pass', async () => {
        let mock_req = {
            body : {
                name : chance.word({ length: 100 })
            }
        };
        let result = await run_validation(Validations.Tag.CreateTag, mock_req);
        result.length.should.equal(0);
    });

    it('Tag.CreateTag should have error', async () => {
        let mock_req = {
            body : {
                name : chance.word({ length: 101 })
            }
        };
        let result = await run_validation(Validations.Tag.CreateTag, mock_req);
        result.should.eql(['name']);
    });

    it('Tag.SearchTags should pass', async () => {
        let mock_req = {
            query : {
                name : chance.word({ length: 100 })
            }
        };
        let result = await run_validation(Validations.Tag.SearchTags, mock_req);
        result.length.should.equal(0);
    });

    it('Tag.SearchTags should pass with minimum params', async () => {
        let mock_req = {
            params : {},
            query  : {}
        };
        let result = await run_validation(Validations.Tag.SearchTags, mock_req);
        result.length.should.equal(0);
    });

    it('Tag.SearchTags should have error', async () => {
        let mock_req = {
            query : {
                name : chance.word({ length: 101 })
            }
        };
        let result = await run_validation(Validations.Tag.SearchTags, mock_req);
        result.should.eql(['name']);
    });

});

describe('Util Validation Post', async () => {

    it('Post.GetPost should pass', async () => {
        let mock_req = {
            params : {
                user_id : '1',
                id      : '1'
            }
        };
        let result = await run_validation(Validations.Post.GetPost, mock_req);
        mock_req.params.user_id.should.equal(1);
        mock_req.params.id.should.equal(1);
        result.length.should.equal(0);
    });

    it('Post.GetPost should have error', async () => {
        let mock_req = {
            params : {
                user_id : chance.word({ length: 5 }),
                id      : chance.word({ length: 5 })
            }
        };
        let result = await run_validation(Validations.Post.GetPost, mock_req);
        result.should.eql(['id', 'user_id']);
    });

    it('Post.CreatePost should pass', async () => {
        let mock_req = {
            params : {
                user_id : '1',
            },
            body : {
                title     : chance.word({ length: 5 }),
                content   : chance.word({ length: 100 }),
                tags      : ['1', '2'],
                image     : chance.url({ protocol: 'https', extensions: ['gif', 'jpg', 'png'] }),
                published : 'false'
            }
        };
        let result = await run_validation(Validations.Post.CreatePost, mock_req);
        mock_req.params.user_id.should.equal(1);
        mock_req.body.tags.should.eql([1, 2]);
        result.length.should.equal(0);
    });

    it('Post.CreatePost should pass with minimum params', async () => {
        let mock_req = {
            params : {
                user_id : 1,
            },
            body : {
                title : chance.word({ length: 5 })
            }
        };
        let result = await run_validation(Validations.Post.CreatePost, mock_req);
        result.length.should.equal(0);
    });

    it('Post.CreatePost should have error', async () => {
        let mock_req = {
            params : {
                user_id : chance.word({ length: 5 }),
            },
            body : {
                title     : chance.word({ length: 101 }),
                content   : { empty: '' },
                tags      : 1,
                image     : chance.url({ extensions: ['html'] }),
                published : chance.word({ length: 1 })
            }
        };
        let result = await run_validation(Validations.Post.CreatePost, mock_req);
    
        result.should.eql(['user_id', 'title', 'content', 'tags', 'image', 'published']);
    });

    it('Post.UpdatePost should pass', async () => {
        let mock_req = {
            params : {
                user_id : '1',
                id      : '1'
            },
            body : {
                title     : chance.word({ length: 5 }),
                content   : chance.word({ length: 100 }),
                tags      : ['1', '2'],
                image     : chance.url({ protocol: 'https', extensions: ['gif', 'jpg', 'png'] }),
                published : 'false'
            }
        };
        let result = await run_validation(Validations.Post.UpdatePost, mock_req);
        mock_req.params.user_id.should.equal(1);
        mock_req.params.id.should.equal(1);        
        mock_req.body.tags.should.eql([1, 2]);
        result.length.should.equal(0);
    });

    it('Post.UpdatePost should pass with minimum params', async () => {
        let mock_req = {
            params : {
                user_id : '1',
                id      : '1'
            },
            body : {
                title : chance.word({ length: 5 })
            }
        };
        let result = await run_validation(Validations.Post.UpdatePost, mock_req);
        result.length.should.equal(0);
    });

    it('Post.UpdatePost should have error', async () => {
        let mock_req = {
            params : {
                user_id : chance.word({ length: 5 }),
                id      : chance.word({ length: 5 })
            },
            body : {
                title     : chance.word({ length: 101 }),
                content   : { empty: '' },
                tags      : 1,
                image     : chance.url({ extensions: ['html'] }),
                published : chance.word({ length: 1 })
            }
        };
        let result = await run_validation(Validations.Post.UpdatePost, mock_req);
    
        result.should.eql([ 'id', 'user_id', 'title', 'content', 'tags', 'image', 'published']);
    });

    it('Post.DeletePost should pass', async () => {
        let mock_req = {
            params : {
                user_id : '1',
                id      : '1'
            }
        };
        let result = await run_validation(Validations.Post.DeletePost, mock_req);
        mock_req.params.user_id.should.equal(1);
        mock_req.params.id.should.equal(1);
        result.length.should.equal(0);
    });

    it('Post.DeletePost should have error', async () => {
        let mock_req = {
            params : {
                user_id : chance.word({ length: 5 }),
                id      : chance.word({ length: 5 })
            }
        };
        let result = await run_validation(Validations.Post.DeletePost, mock_req);   
        result.should.eql(['id', 'user_id']);
    });

    it('Post.SearchPosts should pass', async () => {
        let mock_req = {
            params : {
                user_id : '1'
            },
            query : {
                tags      : ['1', '2'],
                published : 'true'
            }
        };
        let result = await run_validation(Validations.Post.SearchPosts, mock_req);
        mock_req.params.user_id.should.equal(1);
        mock_req.query.tags.should.eql([1, 2]);
        mock_req.query.published.should.equal(true);
        result.length.should.equal(0);
    });

    it('Post.SearchPosts should pass with minimum params ', async () => {
        let mock_req = {
            params : {
                user_id : '1'
            }
        };
        let result = await run_validation(Validations.Post.SearchPosts, mock_req);
        result.length.should.equal(0);
    });

    it('Post.SearchPosts should have error', async () => {
        let mock_req = {
            params : {
                user_id : chance.word({ length: 5 })
            },
            query : {
                tags      : [chance.word({ length: 5 })],
                published : chance.word({ length: 5 })
            }
        };
        let result = await run_validation(Validations.Post.SearchPosts, mock_req);
        result.should.eql(['user_id', 'tags', 'published']);
    });

});
