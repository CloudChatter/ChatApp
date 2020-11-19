import request from 'supertest';

import app from '../../src/server/server';

const server = 'http://localhost:3000';

let Cookies;

describe('Route integration', () => {
  describe('/', () => {
    describe('GET', () => {
      it('response with 200 status and text/html content type', () => {
        return request(server)
          .get('/')
          .expect(200)
          .expect('Content-Type', /text\/html/);
      });
    });
  });
});

//  /application\/json/
