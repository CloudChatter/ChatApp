// import supertest from 'supertest';
// const request = supertest(app);
// import server as app from '../../src/server/server';

import request from 'supertest';
const server = 'http://localhost:3000';

let Cookies;
const authUser = { email: 'test@test', password: 'pass' };
const unauthUser = { email: 'test', password: 'badpass' };
const goodRes = { isAuth: true, username: 'test' };

describe('Route integration', () => {
  describe('/', () => {
    describe('GET', () => {
      it('response with 200 status and text/html content type', () => {
        return request(server)
          .get('/')
          .expect(200)
          .expect('Content-Type', /text\/html/);
      });
      it('redirects to /chat if user is authenticated (active session)', () => {
        return request(server)
          .post('/api/login')
          .send(authUser)
          .then((res) => {
            Cookies = res.header['set-cookie'];
            return request(server)
              .get('/')
              .set('Cookie', Cookies)
              .expect(302)
              .expect('location', '/chat');
          });
      });
    });
  });

  describe('/build', () => {
    describe('GET', () => {
      it('return the bundle.js', () => {
        return request(server)
          .get('/bundle/bundle.js')
          .expect(302)
          .expect('Content-Type', 'text/plain; charset=utf-8');
      });
    });
  });

  describe('/chat', () => {
    describe('GET unauthenticated', () => {
      it('redirects to / if user is unauthenticated', () => {
        return request(server).get('/chat').expect(302).expect('location', '/');
      });
    });

    describe('GET authenticated', () => {
      it('response with 200 status and  and text/html content type', () => {
        return request(server)
          .post('/api/login')
          .send(authUser)
          .then((res) => {
            Cookies = res.header['set-cookie'];
            return request(server)
              .get('/chat')
              .set('Cookie', Cookies)
              .expect(200)
              .expect('Content-Type', /text\/html/);
          });
      });
    });
  });

  describe('/api/login', () => {
    describe('POST with correct username/password', () => {
      it('response with 200 status and body {isAuth: true, username: "test"}', () => {
        return request(server)
          .post('/api/login')
          .send(authUser)
          .expect(200, goodRes);
      });
    });
    describe('POST with incorrect username/password', () => {
      it('response with 401 unauthorized status code', () => {
        return request(server).post('/api/login').send(unauthUser).expect(401);
      });
    });
  });

  describe('/api/logout', () => {
    describe('GET', () => {
      it('response with 200 status and body {isAuth: false}', () => {
        return request(server)
          .post('/api/login')
          .send(authUser)
          .then((res) => {
            Cookies = res.header['set-cookie'];
            return request(server)
              .get('/api/logout')
              .set('Cookie', Cookies)
              .expect(200, { isAuth: false });
          });
      });
    });
  });

  describe('/api/login/success', () => {
    describe('GET with authUser', () => {
      it('response with 200 status and body {isAuth: true, username: "test"}', () => {
        return request(server)
          .post('/api/login')
          .send(authUser)
          .then((res) => {
            Cookies = res.header['set-cookie'];
            return request(server)
              .get('/api/login/success')
              .set('Cookie', Cookies)
              .expect(200, { isAuth: true, username: 'test' });
          });
      });
    });
    describe('GET with unauthUser', () => {
      it('response with 401 unauthorized status code', () => {
        return request(server).post('/api/login').send(unauthUser).expect(401);
      });
    });
  });

  describe('/auth/google', () => {
    describe('GET', () => {
      it('redirect to google OAuth', () => {
        return request(server).get('/auth/google').send(authUser).expect(302);
        // can't do expect without exposing our google clientID
        // is there a way to slice the result?
      });
    });
  });

  describe('/auth/facebook', () => {
    describe('GET', () => {
      it('redirect to facebook OAuth', () => {
        return request(server).get('/auth/facebook').send(authUser).expect(302);
      });
    });
  });
});
