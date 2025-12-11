// server.js
const server = Bun.serve({
  port: 3001,
  fetch(req) {
    // 获取请求 URL 和方法
    const url = new URL(req.url);
    const method = req.method;

    // 设置响应头
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 处理 OPTIONS 请求（CORS 预检）
    if (method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // 路由处理
    if (url.pathname === "/") {
      return new Response(
        JSON.stringify({ message: "Welcome to Bun Server!" }),
        { headers }
      );
    }

    if (url.pathname === "/api/users" && method === "GET") {
      return new Response(
        JSON.stringify({ users: ["Alice", "Bob", "Charlie"] }),
        { headers }
      );
    }

    if (url.pathname === "/api/users" && method === "POST") {
      // 解析请求体
      req.json().then((data) => {
        console.log("Received user data:", data);
      });
      return new Response(
        JSON.stringify({ message: "User created successfully" }),
        { headers }
      );
    }

    // 404 处理
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers,
    });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
