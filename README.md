# High Concurrency Node.js Application with Nginx and Docker

Handling 1,000,000 concurrent requests requires careful consideration of various aspects such as load balancing, optimizing Node.js performance, and configuring Nginx for high concurrency.
Additionally, Docker can be used to containerize and scale the application.
Here's a basic setup to get you started:

## 1. Node.js Application:

Create a [simple Node.js application](services/index.js) that can handle HTTP requests. Ensure that your application is optimized for high concurrency.

Create a [Dockerfile](services/Dockerfile)

## 2. Nginx Configuration:

Create an [Nginx configuration file](nginx/nginx.conf) to proxy requests to the Node.js application.

Create a [Dockerfile](nginx/Dockerfile)


## 3. Build and Run:
Build and run the Docker containers.

```
docker-compose up --scale nodeapp=3
```

<details>
<summary>Logs</summary>
<pre>
[+] Running 5/0
 ⠿ Container backend-example-for-millions-request-nodeapp-2   Created                            0.0s
 ⠿ Container backend-example-for-millions-request-postgres-1  Created                            0.0s
 ⠿ Container backend-example-for-millions-request-nodeapp-3   Created                            0.0s
 ⠿ Container backend-example-for-millions-request-nodeapp-1   Created                            0.0s
 ⠿ Container backend-example-for-millions-request-nginx-1     Created                            0.0s
Attaching to backend-example-for-millions-request-nginx-1, backend-example-for-millions-request-nodeapp-1, backend-example-for-millions-request-nodeapp-2, backend-example-for-millions-request-nodeapp-3, backend-example-for-millions-request-postgres-1
backend-example-for-millions-request-nginx-1     | /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
backend-example-for-millions-request-nginx-1     | /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
backend-example-for-millions-request-nginx-1     | /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
backend-example-for-millions-request-nginx-1     | 10-listen-on-ipv6-by-default.sh: info: IPv6 listen already enabled
backend-example-for-millions-request-nginx-1     | /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
backend-example-for-millions-request-nginx-1     | /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
backend-example-for-millions-request-nginx-1     | /docker-entrypoint.sh: Configuration complete; ready for start up
backend-example-for-millions-request-postgres-1  | The files belonging to this database system will be owned by user "postgres".
backend-example-for-millions-request-postgres-1  | This user must also own the server process.
backend-example-for-millions-request-postgres-1  | 
backend-example-for-millions-request-postgres-1  | The database cluster will be initialized with locale "en_US.utf8".
backend-example-for-millions-request-postgres-1  | The default database encoding has accordingly been set to "UTF8".
backend-example-for-millions-request-postgres-1  | The default text search configuration will be set to "english".
backend-example-for-millions-request-postgres-1  | 
backend-example-for-millions-request-postgres-1  | Data page checksums are disabled.
backend-example-for-millions-request-postgres-1  | 
backend-example-for-millions-request-postgres-1  | fixing permissions on existing directory /var/lib/postgresql/data ... ok
backend-example-for-millions-request-postgres-1  | creating subdirectories ... ok
backend-example-for-millions-request-postgres-1  | selecting dynamic shared memory implementation ... posix
backend-example-for-millions-request-nodeapp-2   | 
backend-example-for-millions-request-nodeapp-2   | > simple-http-server@1.0.0 start
backend-example-for-millions-request-nodeapp-2   | > node index.js
backend-example-for-millions-request-nodeapp-2   | 
backend-example-for-millions-request-postgres-1  | selecting default max_connections ... 100
backend-example-for-millions-request-nodeapp-2   | Server is running on port 3000-fa5121f4dce2
backend-example-for-millions-request-postgres-1  | selecting default shared_buffers ... 128MB
backend-example-for-millions-request-postgres-1  | selecting default time zone ... Etc/UTC
backend-example-for-millions-request-postgres-1  | creating configuration files ... ok
backend-example-for-millions-request-nodeapp-3   | 
backend-example-for-millions-request-nodeapp-3   | > simple-http-server@1.0.0 start
backend-example-for-millions-request-nodeapp-3   | > node index.js
backend-example-for-millions-request-nodeapp-3   | 
backend-example-for-millions-request-nodeapp-3   | Server is running on port 3000-ffd15c440e9f
backend-example-for-millions-request-nodeapp-1   | 
backend-example-for-millions-request-nodeapp-1   | > simple-http-server@1.0.0 start
backend-example-for-millions-request-nodeapp-1   | > node index.js
backend-example-for-millions-request-nodeapp-1   | 
backend-example-for-millions-request-nodeapp-1   | Server is running on port 3000-3e1f1d23187a
backend-example-for-millions-request-postgres-1  | running bootstrap script ... ok
backend-example-for-millions-request-postgres-1  | performing post-bootstrap initialization ... ok
backend-example-for-millions-request-postgres-1  | initdb: warning: enabling "trust" authentication for local connections
backend-example-for-millions-request-postgres-1  | You can change this by editing pg_hba.conf or using the option -A, or
backend-example-for-millions-request-postgres-1  | --auth-local and --auth-host, the next time you run initdb.
backend-example-for-millions-request-postgres-1  | syncing data to disk ... ok
backend-example-for-millions-request-postgres-1  | 
backend-example-for-millions-request-postgres-1  | 
backend-example-for-millions-request-postgres-1  | Success. You can now start the database server using:
backend-example-for-millions-request-postgres-1  | 
backend-example-for-millions-request-postgres-1  |     pg_ctl -D /var/lib/postgresql/data -l logfile start
backend-example-for-millions-request-postgres-1  | 
backend-example-for-millions-request-postgres-1  | 2024-01-24 04:16:56.560 GMT [44] LOG:  unrecognized configuration parameter "wal_keep_segments" in file "/etc/postgresql/postgresql.conf" line 5
backend-example-for-millions-request-postgres-1  | 2024-01-24 04:16:56.560 GMT [44] FATAL:  configuration file "/etc/postgresql/postgresql.conf" contains errors
backend-example-for-millions-request-postgres-1 exited with code 1
</pre>
 </details>

## 4. How to test
Simulate making multiple requests to a local host.

```
for i in {1..100}; do
  curl http://localhost:54000
done
```

Notes: replace with your actual URL, in this case, it is port `54000`

<details>
<summary>Logs</summary>
<pre>
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
Hello, World ffd15c440e9f!
Hello, World fa5121f4dce2!
...
</pre>
 </details>

Notes: For more information, Refer [Handling a large number of requests in a Node.js and PostgreSQL](services/README.md)