# Assignment 8 - Study Programme Server

A small Node.js and Express 5 server for a made-up study programme. It serves a browser page, offers a few API routes (text, JSON, errors, a redirect), logs every request and counts the requests it has served.

## How to install and run

```
git clone https://github.com/Zaid-Kall/assignment8.git
cd assignment8
npm install
npm start
```

For development with automatic restart on file changes:

```
npm run dev
```

The server listens on port 3000 by default. To use another port, set the PORT environment variable before starting it.

## File organization

```
assignment8/
  public/
    index.html     the browser page
    styles.css     page styles
    app.js         fetch calls for the buttons
  server.js        Express app, middleware, routes
  package.json
  package-lock.json
  .gitignore
  README.md
```
## curl evidence

### 1. Successful JSON response

```
curl.exe --include -X GET http://localhost:3000/api/courses

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 148
ETag: W/"94-9TigxBlLBtc2uLG3zAQjrZvwpxM"
Date: Sun, 15 Nov 2026 11:14:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Web Programming","credits":6},{"id":2,"title":"Database Systems","credits":6},{"id":3,"title":"Software Engineering","credits":5}]
```

### 2. The 201 response

```
curl.exe --include -X POST http://localhost:3000/api/subscribe

HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Sun, 15 Nov 2026 11:14:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}
```

### 3. The 403 response

```
curl.exe --include -X GET http://localhost:3000/api/admin

HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Sun, 15 Nov 2026 11:14:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}
```

### 4. The redirect

```
curl.exe --include -X GET http://localhost:3000/old-page

HTTP/1.1 302 Found
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Sun, 15 Nov 2026 11:14:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Found. Redirecting to /hello
```

### 5. A 404 on an /api path

```
curl.exe --include -X GET http://localhost:3000/api/nothing

HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Sun, 15 Nov 2026 11:14:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}
```

### 6. A 404 on a non-API path

```
curl.exe --include -X GET http://localhost:3000/nothing

HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 34
ETag: W/"22-PicNZIjC1KLI+8G0jqEJ516vifg"
Date: Sun, 15 Nov 2026 11:14:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

<h1>404</h1><p>Page not found.</p>
```
## Reasoning questions

### 1. Route order

I moved the 404 fallback to the top of server.js. After that, every URL returned 404, even real routes like /hello and /api/courses, and the logger printed nothing. Express checks middleware and routes in the order they were registered. The fallback matches every request and answers it without calling next(), so the request never reached the logger or any real route. This is why the fallback must be registered last.

### 2. Middleware

I removed next() from the logger. The browser kept loading with the spinner and never showed the page. The server printed one log line for GET /hello, but nothing else happened. Because the logger did not call next() and did not send a response, Express never moved on to the next middleware or to the route, so the request hung until it was cancelled.

### 3. Status codes

POST /api/subscribe answers 201 because the request creates something new (a subscription), and 201 Created tells the client that, while 200 only says that the request worked. A missing page is a 404 and not a 200 with an error message because the status code is what browsers, search engines and API clients read first. A 200 would tell them the page exists, even if the body says otherwise.

### 4. Configuration

The server reads its port from process.env.PORT so the port can change without editing the code. Hosting platforms and other developers often have 3000 already in use, or they assign the port themselves through an environment variable. The fallback to 3000 keeps the server easy to run locally.

### 5. Dependencies

node_modules is not committed because it is large, it is generated from package.json and package-lock.json, and it can differ between operating systems. After cloning the repository, a teammate must run npm install to download the packages, and then npm start (or npm run dev) to start the server.

### 6. Same origin

If the page were opened directly from disk, it would load from a file:// address, and the relative URLs like /api/courses would not point to my server. Calling the server by its full address from that page would be a cross-origin request, and the browser blocks it by default. This restriction is called the same-origin policy, and the server would need to allow the request with CORS headers.

## Self-study notes

- **Node version and running time:** the process object has process.version for the Node version and process.uptime() for the seconds since the process started. I used Math.floor() so uptimeSeconds is a whole number.
- **Plain text content type:** res.type("text/plain") sets the Content-Type header before res.send(), otherwise Express sends a string as text/html. I used it for /hello and /robots.txt.
- **Showing JSON neatly:** in the browser page I used JSON.stringify(data, null, 2), where 2 is the indentation, and I show the result inside a pre element.
- **Server working from any folder:** I build the path of the public folder with path.join(import.meta.dirname, "public"), so it does not depend on the folder where the server is started.

## Which requests are counted

The counter middleware counts every request that reaches the server: normal routes, redirects, static files, 404 responses, and requests to /api/stats itself. I placed the logger and the counter before the routes and before express.static, because Express runs middleware in the order it is registered. If they were placed after the routes, a request that was already answered would never reach them.

## Challenges

- **Git setup:** my local branch was called master after git init, and I renamed it to main before the first push.
- **Two terminals:** the dev server keeps the terminal busy, so I needed a second terminal for git and curl commands.
- **Windows curl:** in PowerShell, curl is an alias for another command, so I had to use curl.exe.
- **Leftover port variable:** after I tested PORT=4000, the variable stayed in that terminal session, and the server kept running on 4000 instead of 3000.
- **Request counter:** the counter showed a higher number than my clicks. I found out that the browser also asks for /favicon.ico, and the counter counts that request too.
- **Writing the curl evidence:** my first attempt to write the output into the README failed, so I wrote the file in one step with a script.