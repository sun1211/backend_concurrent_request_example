// Import the 'http' module for creating an HTTP server
const http = require('http');

// Import the 'os' module for getting the hostname
const os = require('os');

// Use the environment variable 'HOSTNAME' if available, otherwise use the system hostname
// Use to detect which host is called
const IDENTIFIER = process.env.HOSTNAME || os.hostname();

// Use the environment variable 'PORT' if available, otherwise use the default port 3000
const PORT = process.env.PORT || 3000;

// Create an HTTP server that responds with a simple message
const server = http.createServer((req, res) => {
  // Set the response header with status code 200 and content type 'text/plain'
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send the response with a Hello, World message including the identifier (hostname)
  res.end(`Hello, World ${IDENTIFIER}!\n`);
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  // Log a message indicating that the server is running and on which identifier and port
  console.log(`Server is running on ${IDENTIFIER}:${PORT}`);
});
