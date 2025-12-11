#!/usr/bin/env bun

/**
 * 网络请求工具脚本
 * 提供HTTP请求功能，不依赖第三方库
 */

// 显示帮助信息
function showHelp() {
  console.log(`
网络请求工具

用法:
  bun run network <命令> [参数]

命令:
  get <URL>               - 发送GET请求
  post <URL> <数据>        - 发送POST请求
  put <URL> <数据>         - 发送PUT请求
  delete <URL>             - 发送DELETE请求
  download <URL> <保存路径> - 下载文件
  status <URL>             - 检查URL状态
  help                     - 显示帮助信息

选项:
  --headers <JSON字符串>   - 设置请求头 (例如: '{"Content-Type": "application/json"}')
  --output <文件路径>       - 将响应输出到文件
  --verbose                - 显示详细请求信息
`);
}

// 解析命令行参数
function parseArgs(args) {
  const options = {
    headers: {},
    outputFile: null,
    verbose: false
  };

  const cleanArgs = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--headers') {
      i++;
      try {
        options.headers = JSON.parse(args[i]);
      } catch (e) {
        console.error('错误: 无效的JSON格式请求头');
        process.exit(1);
      }
    } else if (arg === '--output') {
      i++;
      options.outputFile = args[i];
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else {
      cleanArgs.push(arg);
    }
  }

  return { options, cleanArgs };
}

// 发送HTTP请求
async function sendRequest(method, url, data = null, options = {}) {
  try {
    if (options.verbose) {
      console.log(`发送 ${method} 请求到: ${url}`);
      if (options.headers && Object.keys(options.headers).length > 0) {
        console.log('请求头:', JSON.stringify(options.headers, null, 2));
      }
      if (data) {
        console.log('请求体:', data);
      }
    }

    const requestOptions = {
      method,
      headers: options.headers
    };

    if (data) {
      requestOptions.body = data;
    }

    const response = await fetch(url, requestOptions);

    if (options.verbose) {
      console.log(`响应状态: ${response.status} ${response.statusText}`);
      console.log('响应头:', Object.fromEntries(response.headers.entries()));
    }

    let responseData;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      console.error(`请求失败: ${response.status} ${response.statusText}`);
      if (typeof responseData === 'string') {
        console.error(responseData);
      } else {
        console.error(JSON.stringify(responseData, null, 2));
      }
      process.exit(1);
    }

    return responseData;
  } catch (error) {
    console.error(`请求错误: ${error.message}`);
    process.exit(1);
  }
}

// GET请求
async function getRequest(url, options) {
  const response = await sendRequest('GET', url, null, options);

  if (options.outputFile) {
    await Bun.write(options.outputFile, typeof response === 'string' ? response : JSON.stringify(response, null, 2));
    console.log(`响应已保存到: ${options.outputFile}`);
  } else {
    if (typeof response === 'string') {
      console.log(response);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  }
}

// POST请求
async function postRequest(url, data, options) {
  const response = await sendRequest('POST', url, data, options);

  if (options.outputFile) {
    await Bun.write(options.outputFile, typeof response === 'string' ? response : JSON.stringify(response, null, 2));
    console.log(`响应已保存到: ${options.outputFile}`);
  } else {
    if (typeof response === 'string') {
      console.log(response);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  }
}

// PUT请求
async function putRequest(url, data, options) {
  const response = await sendRequest('PUT', url, data, options);

  if (options.outputFile) {
    await Bun.write(options.outputFile, typeof response === 'string' ? response : JSON.stringify(response, null, 2));
    console.log(`响应已保存到: ${options.outputFile}`);
  } else {
    if (typeof response === 'string') {
      console.log(response);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  }
}

// DELETE请求
async function deleteRequest(url, options) {
  const response = await sendRequest('DELETE', url, null, options);

  if (options.outputFile) {
    await Bun.write(options.outputFile, typeof response === 'string' ? response : JSON.stringify(response, null, 2));
    console.log(`响应已保存到: ${options.outputFile}`);
  } else {
    if (typeof response === 'string') {
      console.log(response);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  }
}

// 下载文件
async function downloadFile(url, filePath, options) {
  try {
    if (options.verbose) {
      console.log(`下载文件从: ${url}`);
      console.log(`保存到: ${filePath}`);
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`下载失败: ${response.status} ${response.statusText}`);
      process.exit(1);
    }

    const buffer = await response.arrayBuffer();
    await Bun.write(filePath, buffer);

    console.log(`文件已下载: ${filePath}`);
  } catch (error) {
    console.error(`下载错误: ${error.message}`);
    process.exit(1);
  }
}

// 检查URL状态
async function checkUrlStatus(url, options) {
  try {
    if (options.verbose) {
      console.log(`检查URL状态: ${url}`);
    }

    const response = await fetch(url, { method: 'HEAD' });

    console.log(`URL: ${url}`);
    console.log(`状态: ${response.status} ${response.statusText}`);
    console.log(`内容类型: ${response.headers.get('content-type') || '未知'}`);
    console.log(`内容长度: ${response.headers.get('content-length') || '未知'}`);
  } catch (error) {
    console.error(`检查URL状态错误: ${error.message}`);
    process.exit(1);
  }
}

// 主函数
async function main() {
  const { options, cleanArgs } = parseArgs(process.argv.slice(2));

  if (cleanArgs.length === 0 || cleanArgs[0] === 'help') {
    showHelp();
    return;
  }

  const command = cleanArgs[0];

  switch (command) {
    case 'get':
      if (cleanArgs.length < 2) {
        console.error('错误: 缺少URL参数');
        process.exit(1);
      }
      await getRequest(cleanArgs[1], options);
      break;

    case 'post':
      if (cleanArgs.length < 3) {
        console.error('错误: 缺少URL或数据参数');
        process.exit(1);
      }
      await postRequest(cleanArgs[1], cleanArgs[2], options);
      break;

    case 'put':
      if (cleanArgs.length < 3) {
        console.error('错误: 缺少URL或数据参数');
        process.exit(1);
      }
      await putRequest(cleanArgs[1], cleanArgs[2], options);
      break;

    case 'delete':
      if (cleanArgs.length < 2) {
        console.error('错误: 缺少URL参数');
        process.exit(1);
      }
      await deleteRequest(cleanArgs[1], options);
      break;

    case 'download':
      if (cleanArgs.length < 3) {
        console.error('错误: 缺少URL或保存路径参数');
        process.exit(1);
      }
      await downloadFile(cleanArgs[1], cleanArgs[2], options);
      break;

    case 'status':
      if (cleanArgs.length < 2) {
        console.error('错误: 缺少URL参数');
        process.exit(1);
      }
      await checkUrlStatus(cleanArgs[1], options);
      break;

    default:
      console.error(`错误: 未知命令 "${command}"`);
      showHelp();
      process.exit(1);
  }
}

// 运行主函数
main();
