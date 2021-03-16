process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const dbConnection = require('../db/dbConnection');

beforeEach(() => dbConnection.seed.run())
afterAll(() => dbConnection.destroy());

describe('ALL endPoints - /api', () => {
  describe("/api", () => {
    it('200: GET - responds with JSON object with all the available routes', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body))
        });
    });
  });
  describe('/topics', () => {
    describe('GET - /topics', () => {
      it('200: GET - returns an array of topic objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(Array.isArray(topics)).toBe(true);
            expect(topics).toHaveLength(3)
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
    });
    describe('POST - /topics', () => {
      it('201: responds with 201 for a successful post topic request', () => {
        const input = {
          slug: 'Parrots',
          description: 'They talk a lot!'
        }
        return request(app)
          .post('/api/topics')
          .send(input)
          .expect(201)
          .then(({ body: { newTopic } }) => {
            expect(newTopic).toMatchObject({
              slug: 'Parrots',
              description: 'They talk a lot!'
            })
          })
      });
    });
      it('400: POST - invalid key', () => {
        const input = {
          slugs: 'dogs',
          description: 'Not penguin!'
        }
        return request(app)
          .post('/api/topics')
          .send(input)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad Request!')
          })
      });
      it('400: POST - existing topic', () => {
        const input = {
          slug: 'paperLOL',
          description: 'what books are made of'
        }
        return request(app)
          .post('/api/topics')
          .send(input)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad Request!')
          })
      });
    it('405: responds with status 405 for invalid methods', () => {
      const notAllowedMethods = ['patch', 'put', 'delete'];
      const methodPromises = notAllowedMethods.map(method => {
        return request(app)
        [method]('/api/topics')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Method not allowed!')
          })
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/users', () => {
    describe('GET - /users', () => {
      it('200: responds with users details', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(Array.isArray(users)).toEqual(true)
            users.forEach(user => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  avatar_url: expect.any(String),
                  name: expect.any(String)
                })
              )
            })
        })
      });
    });
    describe('POST - /users', () => {
      it('201: responds with 201 for a successful post user request', () => {
        const input = {
          username: "MrBee",
          avatar_url: "http://clipart-library.com/img1/775402.png",
          name: "Bee",
        };
        return request(app)
          .post('/api/users')
          .send(input)
          .expect(201)
          .then(({ body: { newUser } }) => {
            expect(newUser).toMatchObject({
              username: "MrBee",
              avatar_url: "http://clipart-library.com/img1/775402.png",
              name: "Bee",
            })
        })
      });
    });
    describe('ERROR Handling', () => {
      it('400: invalid keys', () => {
        const input = {
          username: "MrBee",
          avatar_urls: "http://clipart-library.com/img1/775402.png",
          namez: "Bee",
        };
        return request(app)
          .post('/api/users')
          .send(input)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual('Bad Request!')
        })
      });
      it('400: user already exists', () => {
        const input =   {
          username: 'lurkerLOL',
          name: 'do_nothing',
          avatar_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        };
        return request(app)
          .post('/api/users')
          .send(input)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual('Bad Request!')
        })
      });
      it('405: invalid methods', () => {
        const notAllowedMethods = ['patch', 'put', 'delete'];
        const methodPromises = notAllowedMethods.map(method => {
          return request(app)
          [method]('/api/users')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Method not allowed!')
            })
        });
        return Promise.all(methodPromises);
      });
    });
    describe('GET - /users/:username', () => {
      it('200: GET - return a successful request for username with the correct user details', () => {
        return request(app)
          .get('/api/users/lurkerLOL')
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              avatar_url: expect.any(String),
              name: expect.any(String)
            });
          });
      });
      describe('ERROR Handling', () => {
        it('405: invalid methods', () => {
          const notAllowedMethods = ['post', 'patch', 'put', 'delete'];
          const methodPromises = notAllowedMethods.map(method => {
            return request(app)
            [method]('/api/users/lurkerLOL')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed!')
              })
          });
          return Promise.all(methodPromises);
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
    });
  });
  describe('/articles', () => {
    describe('GET - /articles', () => {
      it('200: GET - returns an array of articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles, total_count } }) => {
            expect(articles).toHaveLength(10);
            expect(total_count).toBe(10);
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
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy('created_at');
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
        it('200: filters the results of articles by topic', () => {
          return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(10);
              expect(Array.isArray(articles)).toBe(true)
              articles.forEach((article) => {
                expect(article.topic).toBe('mitch');
              })
            });
        });
        it('200: filters the results of articles by author', () => {
          return request(app)
            .get('/api/articles?author=icellusedkars')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(6);
              expect(Array.isArray(articles)).toBe(true)
              articles.forEach((article) => {
                expect(article.author).toBe('icellusedkars');
              })
            });
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
                expect(article).toHaveProperty('topic', 'cats', 'author', 'rogersop')
              })
            });
        });
        it('200: responds for a successful limit query', () => {
          return request(app)
            .get('/api/articles?limit=5')
            .expect(200)
            .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(5)
          })
        });
        it('200: responds for a successful page query', () => {
          return request(app)
            .get('/api/articles?p=2')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(2);
            });
        });
        it('200: responds for a successful limit and page query', () => {
          return request(app)
            .get('/api/articles?limit=9&p=3')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(3);
            });
        });
        it('200 - ignores invalid query', () => {
          return request(app)
            .get('/api/articles?blue=sky')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(Array.isArray(articles)).toBe(true);
              articles.forEach(article => {
                expect(article).toEqual(
                  expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    votes: expect.any(Number),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    comment_count: expect.any(String)
                  })
                )
              })
            });
        });
        describe('ERROR Handling', () => {
          it('400: invalid input for sort_by', () => {
            return request(app)
              .get('/api/articles?sort_by=banana')
              .expect(400)
              .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request!')
            })
          });
          it('400: invalid input for order', () => {
            return request(app)
              .get('/api/articles?order=LOL')
              .expect(400)
              .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request!')
            })
          });
          it('404: valid topic but does not exist', () => {
            return request(app)
              .get('/api/articles?topic=apples')
              .expect(404)
              .then(({ body: { msg } }) => {
              expect(msg).toBe('Topic apples not found!')
            })
          });
          it('404: valid author but does not exist', () => {
            return request(app)
              .get('/api/articles?author=shambolic')
              .expect(404)
              .then(({ body: { msg } }) => {
              expect(msg).toBe('Author shambolic not found!')
            })
          });
          it('404: valid user with no article', () => {
            return request(app)
              .get('/api/articles?author=lurkerLOL')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('No articles found for lurkerLOL!');
              });
          });
          it('404: valid topic has no valid article', () => {
            return request(app)
              .get('/api/articles?topic=paperLOL')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('No articles found for paperLOL!');
              });
          });
          it('Status 400: Sort by invalid column name', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=pigeon')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Bad Request!');
              });
          });
          it('405: invalid method', () => {
            return request(app)
              .delete('/api/articles')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed!')
              });
          });
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
          };
          return request(app)
            .post('/api/articles')
            .send(input)
            .expect(201)
            .then(({ body: { article } }) => {
              expect(article).toEqual(expected);
            })
        });
        describe('POST - ERROR Handling', () => {
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
              expect(msg).toBe('Bad Request!')
            })
          });
        });
      });
    });
    describe('/articles/:article_id', () => {
      describe('GET - /articles/:article_id', () => {
        it('200: GET - returns a successful request for articleId with the relevant article details', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2018-11-15T12:21:54.171Z',
                votes: 100,
                comment_count: '13',
              });
            })
        });
        describe('ERROR Handling', () => {
          it('400: GET - responds with 400 for invalid article Id request', () => {
            return request(app)
              .get('/api/articles/starLink')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Article ID starLink is invalid!')
              })
          });
          it('404: GET - responds with 404 for article id that does not exist yet', () => {
            return request(app)
              .get('/api/articles/3333')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Article ID 3333 not found!')
              })
          });
          it('405: invalid methods', () => {
            const invalidMethods = ['post', 'put'];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]('/api/articles/1')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Method not allowed!');
                });
            });
            return Promise.all(methodPromises);
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
        describe('ERROR Handling', () => {
          it('404: PATCH - Not found; with none-existing article ID', () => {
            return request(app)
              .patch('/api/articles/1111')
              .send({ inc_votes: 1111 })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Article ID 1111 not found!')
              })
          });
          it('400: PATCH - Bad request with invalid article ID', () => {
            return request(app)
              .patch('/api/articles/LOL')
              .send({ in_votes: 20 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Article ID LOL is invalid!')
              })
          });
          it('400: PATCH - Bad request with invalid key', () => {
            return request(app)
              .patch('/api/articles/5')
              .send({ in_v: 20 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Could not update. Check the spelling of the key fields!')
              })
          });
          it('400: PATCH - Bad request with with invalid inc_votes value', () => {
            return request(app)
              .patch('/api/articles/5')
              .send({ inc_votes: ':D' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request!')
              })
          });
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
                expect(msg).toBe('Bad Request!');
              });
          });
        });
      });
    });
  });
  describe('/comments', () => {
    describe('GET - /articles/:article_id/comments', () => {
      it('200: GET - responds with an array of comments for a given article Id and accepts default limit of 10', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(10)
            comments.forEach(comment => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  body: expect.any(String)
                })
              )
            })
            expect(comments).toBeSortedBy('created_at', {
              descending: true,
            })
          });
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
        it('200: GET - returns comments in default descending order and default sorted by created_at', () => {
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
        })
        it('200: GET responds successfully for a query limit', () => {
          return request(app)
            .get('/api/articles/9/comments?limit=3')
            .expect(200)
            .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(2)
          })
        });
        it('200: GET responds successfully for a query page', () => {
          return request(app)
            .get('/api/articles/1/comments?p=3')
            .expect(200)
            .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(3)
          })
        });
        it('200: GET responds successfully for a query limit', () => {
          return request(app)
            .get('/api/articles/9/comments?limit=1&p=2')
            .expect(200)
            .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(1)
          })
        });
      });
      describe('ERROR Handling', () => {
        it('400: GET - responds with 400 and message of Invalid article_id type', () => {
          return request(app)
            .get('/api/articles/pigeon/comments')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Article ID pigeon is invalid!');
            });
        });
        it('405: DELETE - method not allowed', () => {
          return request(app)
            .delete('/api/articles/1/comments')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Method not allowed!');
            });
        });
        it('404: GET - responds with 404 and msg for none existing article', () => {
          return request(app)
            .get('/api/articles/20/comments')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Article ID 20 not found!')
            })
        });
        it('400: responds with 400 for invalid order input', () => {
          return request(app)
            .get('/api/articles/2/comments?order=UP')
            .expect(400)
            .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad Request!')
          })
        });
        it('400: responds with 400 for invalid sort by input', () => {
          return request(app)
            .get('/api/articles/9/comments?sort_by=david')
            .expect(400)
            .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad Request!')
          })
        });
        it('405: invalid methods', () => {
          const invalidMethods = ['post', 'put'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/comments/2')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed!');
              });
          });
          return Promise.all(methodPromises);
        });
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
          .then(({ body: { newComment } }) => {
            expect(newComment).toMatchObject(expected);
          });
      });
      describe('ERROR Handling', () => {
        it('400: responds with 400 for invalid article ID', () => {
          const input = { body: 'Sunday Refactor!', username: 'butter_bridge' }
          return request(app)
            .post('/api/articles/XXX/comments')
            .send(input)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Article ID XXX is invalid!')
            })
        });
        it('405: invalid methods', () => {
          const invalidMethods = ['patch', 'put', 'delete'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/articles/2/comments')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed!');
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
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
        it('404: responds with non-existing comment ID', () => {
          return request(app)
            .patch('/api/comments/200')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                'Comment ID 200 does not exist!'
              );
            });
        });
        it('404: responds with 404 status when given invalid key', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ include_votes: 1 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                'Could not update. Please check the spelling of the key fields!'
              );
            });
        });
        it('400: invalid comment ID', () => {
          return request(app)
            .patch('/api/comments/xBlack')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Comment ID xBlack is invalid!');
            });
        });
        it('405: invalid methods', () => {
          const invalidMethods = ['get', 'post', 'put'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/comments/2')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed!');
              });
          });
          return Promise.all(methodPromises);
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
        it('404: DELETE - invalid comment id', () => {
          return request(app)
            .delete('/api/comments/cats')
            .expect(400)
            .then(({ body: { msg } }) => {
            expect(msg).toBe('Comment ID cats is invalid!')
          })
        });
        it('404: DELETE - valid but comment id does not exists', () => {
          return request(app)
            .delete('/api/comments/400')
            .expect(404)
            .then(({ body: { msg } }) => {
            expect(msg).toBe('Comment ID 400 does not exist!')
          })
        });
        it('405: invalid methods', () => {
          const invalidMethods = ['get', 'post', 'put'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/comments/2')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed!');
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});