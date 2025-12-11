// server.js
const http = require("http");
const url = require("url");

const server = http.createServer(async (req, res) => {
  // 设置 CORS 头
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  // 处理 OPTIONS 请求（CORS 预检）
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // 解析 URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 路由处理
  if (pathname === "/") {
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Welcome to Node.js Server!" }));
    return;
  }

  if (pathname === "/api/users" && req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify({ users: ["Alice", "Bob", "Charlie"] }));
    return;
  }

  if (pathname === "/api/users" && req.method === "POST") {
    // 获取请求体
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const data = JSON.parse(Buffer.concat(chunks).toString());
    console.log("Received user data:", data);

    res.writeHead(200);
    res.end(JSON.stringify({ message: "User created successfully" }));
    return;
  }

  // 404 处理
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not Found" }));
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
