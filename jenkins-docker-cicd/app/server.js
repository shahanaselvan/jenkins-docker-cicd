const http = require('http');

const PORT = process.env.PORT || 3000;

function handler(req, res) {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      message: 'Hello from a Jenkins + Docker CI/CD pipeline!',
      build: process.env.BUILD_NUMBER || 'local',
    })
  );
}

const server = http.createServer(handler);

if (require.main === module) {
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

module.exports = { server, handler };
