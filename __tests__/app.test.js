process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const dbConnection = require('../db/dbConnection');

beforeEach(() => dbConnection.seed.run())
afterAll(() => dbConnection.destroy());

describe('/api', () => {
  describe('/topics', () => {
    it('200: GET - returns an array of topic objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          //console.log(topics)
          expect(topics.length).toBe(3)
          topics.forEach(topic => {
            expect(topic).toEqual(
              expect.objectContaining(
                {
                  slug: expect.any(String),
                  description: expect.any(String)
                }
              )
            )
          })
                    
        })
    });
    it('405: POST - responds with status 405 for post request with message', () => {
      return request(app)
        .post('/api/topics')
        .send({
          slug: "testing for not allowed method",
          description: "testing for not allowed method",
        })
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Method Not Allowed!')
        })
    });
  });
  describe('GET - /users/:username', () => {
    it('200: GET - return a successful request for username with the correct user details', () => {
      return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String)
          });
        });
    });
    it('404: GET - responds with 404 if user does not exist', () => {
      return request(app)
        .get('/api/users/xXx')
        .expect(404)
        .then(({ body: { msg } }) => {
        expect(msg).toBe('This user NOT found, TRY AGAIN!')
      })
    });
  });
  describe('DELETE - /articles/:article_id', () => {
    xit('204: DELETE - responds with 204 for successful remove of an article by ID', () => {
      return request(app)
        .delete('/api/articles/1')
      .expect(204)
    });
  });
  describe('PATCH - /articles/:articles.article_id', () => {
    it('200: PATCH - responds with an updated article object', () => {
      return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body:
              'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: "2014-11-16T12:21:54.171Z",
            votes: 10
          })
        })
    });
    it('404: PATCH - responds with 404 for patch request with invalid key', () => {
      return request(app)
        .patch('/api/articles/5')
        .send({ in_v: 20 })
        .expect(404)
        .then(({ body: { msg } }) => {
        expect(msg).toBe('ERROR: could not update. Please check the spelling of the key fields!')
      })
    });
  });
  describe('GET - /articles/:article_id', () => {
    it('200: GET - returns a successful request for articleId with the relevant article details', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
      })
    });
    it('400: GET - responds with 400 for invalid article Id request', () => {
      return request(app)
        .get('/api/articles/starLink')
        .expect(400)
        .then(({ body: { msg } }) => {
        expect(msg).toBe('The article ID you inputted is INVALID!')
      })
    });
    it('404: GET - responds with 404 for article id that does not exist yet', () => {
      return request(app)
        .get('/api/articles/3333')
        .expect(404)
        .then(({ body: { msg } }) => {
        expect(msg).toBe('This article does not exist. Please try different article Id!')
      })
    });
  });
  describe('POST - /articles/:article_id/comments', () => {
    it('201: POST - responds with 201 for successful request with new comment', () => {
      return request(app)
        .post('/api/articles/10/comments')
        .send({
          username: 'xXx',
          body: 'NEW - Do not forget to commit regularly!'
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          console.log(comment)
          //19
          expect(comment).toEqual({
            comment_id: 19,
            body: 'NEW - Do not forget to commit regularly!',
            article_id: 10,
            author: 'rogersop',
            votes: 50,
            created_at: new Date(1615420163389),
          });
        });
    });
  });
});

/*
return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({body:{article}}) => {
              expect(article.comment_count).toBe('13')
              expect(article).toEqual({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                votes: 100,
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2018-11-15T12:21:54.171Z',
                comment_count: '13'
              })
            })

*/