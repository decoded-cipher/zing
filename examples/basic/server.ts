import { Server } from '../../src/core/server';

const app = new Server();

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(4000, () => {
  console.log('Example server running on http://localhost:4000');
});
