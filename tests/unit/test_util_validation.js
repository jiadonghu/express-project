// set env param as test 
process.env.NODE_ENV = 'test';

const should = require('should');
const Chance = require('chance');
const chance = new Chance();  
const validations = require('../../utils/validation');
const { validationResult } = require('express-validator');

const runValidation = async (valArray, req) => {
    for (let valFunc of valArray) {
        await valFunc(req, {}, () => {});
    }
    return validationResult(req).errors.map(err => err.param);
};

describe('Util Validation User', async () => {

    it('user.getUser should pass', async () => {

        let mockReq = {
            params : {
                id : '1'
            }
        };
        let result = await runValidation(validations.user.getUser, mockReq);
        mockReq.params.id.should.equal(1);
        result.length.should.equal(0);

    });

    it('user.getUser should have error', async () => {

        let mockReq = {
            params : {
                id : false
            }
        };
        let result = await runValidation(validations.user.getUser, mockReq);
        result.should.eql(['id']);

    });

    it('user.login should pass', async () => {

        let mockReq = {
            body : {
                email    : chance.email(),
                password : chance.word({ length: 99 })
            }
        };
        let result = await runValidation(validations.user.login, mockReq);
        result.length.should.equal(0);

    });

    it('user.login should have error', async () => {
        
        let mockReq = {
            body : {
                email    : chance.word({ length: 10 }),
                password : chance.word({ length: 129 })
            }
        };
        let result = await runValidation(validations.user.login, mockReq);
        result.should.eql(['email', 'password']);

    });

    it('user.register should pass', async () => {
        
        let mockReq = {
            body : {
                email    : chance.email(),
                password : chance.word({ length: 99 }),
                name     : chance.word({ length: 99 }),
            }
        };
        let result = await runValidation(validations.user.register, mockReq);
        result.length.should.equal(0);

    });
        
    it('user.register should have error', async () => {
        
        let mockReq = {
            body : {
                email    : chance.word({ length: 10 }),
                password : chance.word({ length: 129 }),
                name     : chance.word({ length: 101 }),
            }
        };
        let result = await runValidation(validations.user.register, mockReq);
        result.should.eql(['email', 'password', 'name']);

    });
    
});

describe('Util Validation Tag', async () => {

    it('tag.createTag should pass', async () => {
        let mockReq = {
            body : {
                name : chance.word({ length: 100 })
            }
        };
        let result = await runValidation(validations.tag.createTag, mockReq);
        result.length.should.equal(0);
    });

    it('tag.createTag should have error', async () => {
        let mockReq = {
            body : {
                name : chance.word({ length: 101 })
            }
        };
        let result = await runValidation(validations.tag.createTag, mockReq);
        result.should.eql(['name']);
    });

    it('tag.searchTags should pass', async () => {
        let mockReq = {
            query : {
                name : chance.word({ length: 100 })
            }
        };
        let result = await runValidation(validations.tag.searchTags, mockReq);
        result.length.should.equal(0);
    });

    it('tag.searchTags should pass with minimum params', async () => {
        let mockReq = {
            params : {},
            query  : {}
        };
        let result = await runValidation(validations.tag.searchTags, mockReq);
        result.length.should.equal(0);
    });

    it('tag.searchTags should have error', async () => {
        let mockReq = {
            query : {
                name : chance.word({ length: 101 })
            }
        };
        let result = await runValidation(validations.tag.searchTags, mockReq);
        result.should.eql(['name']);
    });

});

describe('Util Validation Post', async () => {

    it('post.getPost should pass', async () => {
        let mockReq = {
            params : {
                userId : '1',
                id     : '1'
            }
        };
        let result = await runValidation(validations.post.getPost, mockReq);
        mockReq.params.userId.should.equal(1);
        mockReq.params.id.should.equal(1);
        result.length.should.equal(0);
    });

    it('post.getPost should have error', async () => {
        let mockReq = {
            params : {
                userId : chance.word({ length: 5 }),
                id     : chance.word({ length: 5 })
            }
        };
        let result = await runValidation(validations.post.getPost, mockReq);
        result.should.eql(['id', 'userId']);
    });

    it('post.createPost should pass', async () => {
        let mockReq = {
            params : {
                userId : '1',
            },
            body : {
                title     : chance.word({ length: 5 }),
                content   : chance.word({ length: 100 }),
                tags      : ['1', '2'],
                image     : chance.url({ protocol: 'https', extensions: ['gif', 'jpg', 'png'] }),
                published : 'false'
            }
        };
        let result = await runValidation(validations.post.createPost, mockReq);
        mockReq.params.userId.should.equal(1);
        mockReq.body.tags.should.eql([1, 2]);
        result.length.should.equal(0);
    });

    it('post.createPost should pass with minimum params', async () => {
        let mockReq = {
            params : {
                userId : 1,
            },
            body : {
                title : chance.word({ length: 5 })
            }
        };
        let result = await runValidation(validations.post.createPost, mockReq);
        result.length.should.equal(0);
    });

    it('post.createPost should have error', async () => {
        let mockReq = {
            params : {
                userId : chance.word({ length: 5 }),
            },
            body : {
                title     : chance.word({ length: 101 }),
                content   : { empty: '' },
                tags      : 1,
                image     : chance.url({ extensions: ['html'] }),
                published : chance.word({ length: 1 })
            }
        };
        let result = await runValidation(validations.post.createPost, mockReq);
    
        result.should.eql(['userId', 'title', 'content', 'tags', 'image', 'published']);
    });

    it('post.updatePost should pass', async () => {
        let mockReq = {
            params : {
                userId : '1',
                id     : '1'
            },
            body : {
                title     : chance.word({ length: 5 }),
                content   : chance.word({ length: 100 }),
                tags      : ['1', '2'],
                image     : chance.url({ protocol: 'https', extensions: ['gif', 'jpg', 'png'] }),
                published : 'false'
            }
        };
        let result = await runValidation(validations.post.updatePost, mockReq);
        mockReq.params.userId.should.equal(1);
        mockReq.params.id.should.equal(1);        
        mockReq.body.tags.should.eql([1, 2]);
        result.length.should.equal(0);
    });

    it('post.updatePost should pass with minimum params', async () => {
        let mockReq = {
            params : {
                userId : '1',
                id     : '1'
            },
            body : {
                title : chance.word({ length: 5 })
            }
        };
        let result = await runValidation(validations.post.updatePost, mockReq);
        result.length.should.equal(0);
    });

    it('post.updatePost should have error', async () => {
        let mockReq = {
            params : {
                userId  : chance.word({ length: 5 }),
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
        let result = await runValidation(validations.post.updatePost, mockReq);
    
        result.should.eql([ 'id', 'userId', 'title', 'content', 'tags', 'image', 'published']);
    });

    it('post.deletePost should pass', async () => {
        let mockReq = {
            params : {
                userId : '1',
                id      : '1'
            }
        };
        let result = await runValidation(validations.post.deletePost, mockReq);
        mockReq.params.userId.should.equal(1);
        mockReq.params.id.should.equal(1);
        result.length.should.equal(0);
    });

    it('post.deletePost should have error', async () => {
        let mockReq = {
            params : {
                userId : chance.word({ length: 5 }),
                id      : chance.word({ length: 5 })
            }
        };
        let result = await runValidation(validations.post.deletePost, mockReq);   
        result.should.eql(['id', 'userId']);
    });

    it('post.searchPosts should pass', async () => {
        let mockReq = {
            params : {
                userId : '1'
            },
            query : {
                tags      : ['1', '2'],
                published : 'true'
            }
        };
        let result = await runValidation(validations.post.searchPosts, mockReq);
        mockReq.params.userId.should.equal(1);
        mockReq.query.tags.should.eql([1, 2]);
        mockReq.query.published.should.equal(true);
        result.length.should.equal(0);
    });

    it('post.searchPosts should pass with minimum params ', async () => {
        let mockReq = {
            params : {
                userId : '1'
            }
        };
        let result = await runValidation(validations.post.searchPosts, mockReq);
        result.length.should.equal(0);
    });

    it('post.searchPosts should have error', async () => {
        let mockReq = {
            params : {
                userId : chance.word({ length: 5 })
            },
            query : {
                tags      : [chance.word({ length: 5 })],
                published : chance.word({ length: 5 })
            }
        };
        let result = await runValidation(validations.post.searchPosts, mockReq);
        result.should.eql(['userId', 'tags', 'published']);
    });

});
