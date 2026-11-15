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
