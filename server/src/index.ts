import { createApiServer } from './server.js';

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new RangeError('PORT must be an integer between 0 and 65535');
}

const server = createApiServer();
server.listen(port, () => {
  console.log(`Calvin Ratings mock API listening on port ${port}`);
});