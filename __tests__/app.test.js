process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const dbConnection = require('../db/dbConnection');

beforeEach(() => dbConnection.seed.run())
afterAll(() => dbConnection.destroy());

describe('/api', () => {
  describe('/topics', () => {
    it('GET - status 200: returns an array of topic objects', () => {
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
  });
});