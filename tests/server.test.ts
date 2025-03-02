import request from 'supertest';
import { Server } from '../src/core/server';

describe('Server Tests', () => {
  let app: Server;
  let server: any;

  beforeAll((done) => {
    try {
      app = new Server();
      app.get('/test', (req, res) => {
        res.json({ message: 'Test route works!' });
      });
      server = app.listen(5001, () => {
        console.log('Test server started on port 5001');
        done();
      });
    } catch (error) {
      console.error('Error starting test server:', error);
      done(error);
    }
  });

  afterAll((done) => {
    try {
      if (server && server.close) {
        server.close((err: NodeJS.ErrnoException) => {
          if (err) {
            console.error('Error closing server:', err);
            done(err);
          } else {
            console.log('Test server closed');
            done();
          }
        });
      } else {
        console.log('No server to close');
        done();
      }
    } catch (error) {
      console.error('Error in afterAll:', error);
      done(error);
    }
  });

  test('GET /test should return a JSON response', async () => {
    const res = await request('http://localhost:5001').get('/test');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Test route works!' });
  });

  test('GET /not-found should return 404', async () => {
    const res = await request('http://localhost:5001').get('/not-found');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not Found' });
  });
});
