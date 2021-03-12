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
          expect(msg).toBe('Method not allowed!')
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
    it('204: DELETE - responds with 204 for successful remove of an article by ID', () => {
      return request(app)
        .delete('/api/articles/1')
        .expect(204)
    });
    describe('ERROR Handling', () => {
      it('404: DELETE - article id not found', () => {
        return request(app)
          .delete('/api/articles/111')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('This article NOT found!');
          });
      });
      it('400: DELETE - invalid article id', () => {
        return request(app)
          .delete('/api/articles/Hi')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('The ID you inputted is INVALID!');
          });
      });
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
          expect(msg).toBe('The ID you inputted is INVALID!')
        })
    });
    it('404: GET - responds with 404 for article id that does not exist yet', () => {
      return request(app)
        .get('/api/articles/3333')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Article 3333 does not exist. Please try different article Id!')
        })
    });
  });
  describe('POST - /articles/:article_id/comments', () => {
    it('201: POST - responds with 201 for successful request with new comment', () => {
      const input = { username: 'rogersop', body: 'NEW - Do not forget to commit regularly!' };
      const expected = {
        comment_id: 19,
        body: 'NEW - Do not forget to commit regularly!',
        article_id: 5,
        author: 'rogersop',
        votes: 0,
        created_at: expect.any(String),
      };
      return request(app)
        .post('/api/articles/5/comments')
        .send(input)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject(expected);
        });
    });
  });
  describe('GET - /articles/:article_id/comments', () => {
    it('200: GET - responds with an array of comments for a given article Id', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(13)
          expect(comments[3]).toEqual({
            comment_id: 5,
            author: 'icellusedkars',
            article_id: 1,
            votes: 0,
            created_at: '2013-11-23T12:36:03.389Z',
            body: 'I hate streaming noses'
          });
        })
    });
    it('200: GET - article_id has no comments', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(0);
        });
    });
    describe('GET - Queries', () => {
      it('200: GET - returns comments in order of created_at by default', () => {
        return request(app)
          .get('/api/articles/9/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      });
      it('200: GET - returns comments sorted by column specified by user', () => {
        return request(app)
          .get('/api/articles/9/comments?sort_by=votes')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toBeSortedBy('votes', {
              descending: true,
            });
          });
      });
      it('200: GET - returns comments in ascending order', () => {
        return request(app)
          .get('/api/articles/9/comments?order=asc')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toBeSortedBy('created_at');
          });
      });
      it('200: GET - returns comments sorted by order and column specified by user', () => {
        return request(app)
          .get('/api/articles/9/comments?sort_by=votes&order=asc')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toBeSortedBy('votes');
          });
      });
    });
  });
    
    
  it('400: GET - responds with 400 and message of Invalid article_id type', () => {
    return request(app)
      .get('/api/articles/pigeon/comments')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('The ID you inputted is INVALID!');
      });
  });
  xit('405: DELETE - method not allowed', () => {
    return request(app)
      .delete('/api/articles/1/comments')
      .expect(405)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Method not allowed!');
      });
  });
  // not working having conflict with below test!
  xit('404: GET - returns a 404 and message if an article has no comments', () => {
    return request(app)
      .get('/api/articles/4/comments')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          `There are no comments for article 4 yet. Be the first to add your comments!`
        );
      });
  });
  it('404: GET - responds with 404 and msg for none existing article', () => {
    return request(app)
      .get('/api/articles/20/comments')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('There is no article 20 yet!')
      })
  });
  describe('GET - /articles', () => {
    it('200: GET - returns an array of articles', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          expect(articles).toEqual(expect.any(Array));
          articles.forEach(article => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(String)
              })
            );
          });
        });
    });
    describe('Queries', () => {
      it('200: GET - sort_by queries default to created_at', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      });
      it('200: GET - order queries defaults to descending unless specified', () => {
        return request(app)
          .get('/api/articles?sorted_by=votes&order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('votes')
          })
      });
      it('200: filters the results of articles by author', () => {
        return request(app)
          .get('/api/articles?topic=cats&author=rogersop')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(1);
            articles.forEach((article) => {
              expect(article.topic).toBe('cats');
              expect(article.author).toBe('rogersop');
            })
          });
      });
    });
    it('404: responds with 404 when inputting invalid path request', () => {
      return request(app)
        .get('/api/articlez')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('The path you are trying to reach not found')
        })
    });
    xit('Status 400: Sort by invalid column name', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=pigeon')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid type');
        });
    });
    describe('POST - /articles', () => {
      it('201: POST - responds with 201 for successful request with a new article', () => {
        const input = {
          title: "Video of cat singing",
          body: "Here's a great vid of a cat belting out some tunes",
          votes: 0,
          topic: "cats",
          author: "rogersop",
          created_at: new Date(),
        };
        const expected = {
          article_id: 13,
          title: "Video of cat singing",
          body: "Here's a great vid of a cat belting out some tunes",
          votes: 0,
          topic: "cats",
          author: "rogersop",
          created_at: expect.any(String),
        }
        return request(app)
          .post('/api/articles')
          .send(input)
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).toEqual(expected);
          })
      });
      xdescribe('POST - ERROR Handling', () => {
        it('400: POST responds with status 400 for post request with incorrect keys', () => {
          const input = {
            title: "Video of cat singing",
            body: "Here's a great vid of a cat belting out some tunes",
            votez: 0,
            topic: "cats",
            aothur: "rogersop",
            created_at: new Date(),
          };
          return request(app)
            .post('/api/articles')
            .send(input)
            .expect(400)
            .then(({ body: { msg } }) => {
              console.log(body)
            expect(msg).toBe('Your request rejected! check for invalid properties')
          })
        });
      });
    });
  });
  describe('/comments', () => {
    describe('PATCH - /comments/:comments_id', () => {
      it('200: PATCH - returns an object of updated comment by incrementing the current votes for valid comment Id', () => {
        const input = { inc_votes: 55 };
        const expected = {
          comment_id: 5,
          body: 'I hate streaming noses',
          author: 'icellusedkars',
          article_id: 1,
          votes: 55,
          created_at: expect.any(String)
        }
        return request(app)
          .patch('/api/comments/5')
          .send(input)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toHaveProperty('votes')
            expect(comment).toHaveProperty('author')
            expect(comment).toHaveProperty('article_id')
            expect(comment).toEqual(expected)
          });
      });
      it('200: PATCH - returns an object of updated comment by decrementing the current votes for valid comment Id', () => {
        const input = { inc_votes: -55 };
        const expected = {
          comment_id: 10,
          body: 'git push origin master',
          author: 'icellusedkars',
          article_id: 1,
          votes: -55,
          created_at: expect.any(String)
        }
        return request(app)
          .patch('/api/comments/10')
          .send(input)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toHaveProperty('votes')
            expect(comment).toHaveProperty('author')
            expect(comment).toHaveProperty('article_id')
            expect(comment).toEqual(expected)
          });
      });
      describe('PATCH - ERROR Handling', () => {
        it('404: PATCH responds with 404 status when given invalid key', () => {
          return request(app)
            .patch('/api/comments/20')
            .send({ include_votes: 1 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                'Sorry - the comment you have asked to update does not exist!'
              );
            });
        });
        it('404: PATCH responds with 404 status when given invalid key', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ include_votes: 1 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                'Could not update. Please check the spelling of the key fields!'
              );
            });
        });
      });
    });
    describe('DELETE - /comments/comment_id', () => {
      it('204: DELETE - responds with 204 for successful delete of a comment by its id', () => {
        return request(app)
          .delete('/api/comments/4')
          .expect(204)
      });
      describe('DELETE - ERROR Handling', () => {
        it('404: DELETE - valid but comment id does not exists', () => {
          return request(app)
            .delete('/api/comments/400')
            .expect(404)
            .then(({ body: { msg } }) => {
            expect(msg).toBe('No comments found!')
          })
        });
        it('404: DELETE - invalid comment id', () => {
          return request(app)
            .delete('/api/comments/cats')
            .expect(400)
            .then(({ body: { msg } }) => {
            expect(msg).toBe('The ID you inputted is INVALID!')
          })
        });
      });
    });
  });
});