// Import the 'http' module for creating an HTTP server
const http = require('http');

// Import the 'os' module for getting the hostname
const os = require('os');

const { Pool } = require('pg');

const express = require('express');

const redis = require('redis');

const app = express();

app.use(express.json()); // Parse JSON in the request body


// Create a connection pool
const pool = new Pool({
  user: 'myuser',
  host: 'postgresql',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
});

// Create a Redis client
const redisClient = redis.createClient({
  host: 'redis',
  port: 6379,
}).on('error', err => console.error('Redis Client Error', err))

// Use the environment variable 'HOSTNAME' if available, otherwise use the system hostname
// Use to detect which host is called
const IDENTIFIER = process.env.HOSTNAME || os.hostname();

// Use the environment variable 'PORT' if available, otherwise use the default port 3000
const PORT = process.env.PORT || 3000;

// Create an HTTP server that responds with a simple message
const server = http.createServer(app);

// Middleware to check Redis cache before querying the database
const cacheMiddleware = (req, res, next) => {
  const cacheKey = req.url;

  // Check if the data is in the cache
  redisClient.get(cacheKey, (err, cachedData) => {
    if (err) {
      console.error('Error checking cache:', err);
      next(); // Continue to the next middleware or route handler
    } else if (cachedData) {
      // If data is found in the cache, send it as the response
      console.log('Data found in cache');
      res.json(JSON.parse(cachedData));
    } else {
      // If data is not in the cache, proceed to the next middleware or route handler
      next();
    }
  });
};

// Start the server and listen on the specified port
server.listen(PORT, () => {
  // Log a message indicating that the server is running and on which identifier and port
  console.log(`Server is running on ${IDENTIFIER}:${PORT}`);
});

// Root path
app.get('/', (req, res) => {
  // Set the response header with status code 200 and content type 'text/plain'
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send the response with a Hello, World message including the identifier (hostname)
  res.end(`Hello, World ${IDENTIFIER}!\n`);
});

// Define a route for querying the database
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// curl --location 'http://localhost:54000/batchInsertUsers' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "users": [
//         {
//             "username": "user3",
//             "email": "user3@example.com"
//         },
//         {
//             "username": "user4",
//             "email": "user4@example.com"
//         }
//     ]
// }'
// Define a route for batch inserting users into the database
app.post('/batchInsertUsers', async (req, res) => {
  try {
    // Example: Receive an array of users from the request body
    const usersToInsert = req.body.users; // You should handle this according to your actual use case

    // Validate that usersToInsert is an array of objects with the required fields

    // Perform batch insert asynchronously
    const result = await batchInsertUsers(usersToInsert);

    res.status(201).json({ message: 'Batch insert successful', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example route using caching middleware
app.get('/cachedData', cacheMiddleware, async (req, res) => {
  // Simulate fetching data from the database  
  const result = await pool.query('SELECT * FROM users');

  // Save the fetched data to the Redis cache
  const cacheKey = req.url;
  redisClient.setex(cacheKey, 10, JSON.stringify({ users: result.rows })); // Cache for 10 sec

  // Send the fetched data as the response
  res.json(dataFromDatabase);
});


//help function
// Function to batch insert users asynchronously using the existing connection pool
async function batchInsertUsers(users) {
  try {
    console.log('Connected to PostgreSQL for batch insert');

    // Begin a transaction using pool.query
    await pool.query('BEGIN');

    // Batch insert users
    for (const user of users) {
      const queryText = 'INSERT INTO users(username, email) VALUES($1, $2)';
      const values = [user.username, user.email];

      await pool.query(queryText, values);
    }

    // Commit the transaction using pool.query
    await pool.query('COMMIT');
    console.log('Batch insert successful');
  } catch (error) {
    // Rollback the transaction using pool.query in case of an error
    await pool.query('ROLLBACK');
    console.error('Error inserting users:', error);
    throw error; // Re-throw the error to be caught in the calling function
  } finally {
    console.log('Connection released after batch insert');
  }
}

