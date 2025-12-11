#!/usr/bin/env bun

/**
 * 数据处理工具脚本
 * 提供数据处理和转换功能，不依赖第三方库
 */

// 显示帮助信息
function showHelp() {
  console.log(`
数据处理工具

用法:
  bun run data <命令> [参数]

命令:
  json <操作> [参数]        - JSON数据处理
  csv <操作> [参数]         - CSV数据处理
  text <操作> [参数]        - 文本数据处理
  encode <格式> <数据>      - 编码数据
  decode <格式> <数据>      - 解码数据
  hash <算法> <数据>        - 计算数据哈希值
  format <类型> <数据>      - 格式化数据
  help                      - 显示帮助信息

JSON操作:
  parse <字符串>            - 解析JSON字符串
  stringify <对象>          - 将对象转换为JSON字符串
  validate <字符串>         - 验证JSON字符串
  minify <字符串>           - 压缩JSON字符串
  beautify <字符串>         - 美化JSON字符串
  merge <文件1> <文件2>     - 合并两个JSON文件
  extract <路径> <JSON字符串> - 从JSON中提取指定路径的值

CSV操作:
  parse <字符串>            - 解析CSV字符串
  stringify <数组>          - 将数组转换为CSV字符串
  tojson <CSV字符串>        - 将CSV转换为JSON
  fromjson <JSON字符串>     - 将JSON转换为CSV

文本操作:
  reverse <字符串>          - 反转字符串
  uppercase <字符串>        - 转换为大写
  lowercase <字符串>        - 转换为小写
  capitalize <字符串>       - 首字母大写
  trim <字符串>             - 去除首尾空格
  split <分隔符> <字符串>   - 分割字符串
  join <分隔符> <数组>      - 连接数组元素为字符串
  replace <模式> <替换> <字符串> - 替换字符串中的模式
  length <字符串>           - 获取字符串长度
  count <子字符串> <字符串> - 计算子字符串出现次数

编码格式:
  base64                    - Base64编码
  url                       - URL编码
  html                      - HTML编码

哈希算法:
  md5                       - MD5哈希
  sha1                      - SHA1哈希
  sha256                    - SHA256哈希

格式化类型:
  currency <数值> [货币]    - 货币格式
  number <数值> [小数位]    - 数字格式
  date <日期字符串> [格式]  - 日期格式
  bytes <字节数>            - 字节格式
`);
}

// JSON处理函数
async function handleJsonCommand(args) {
  if (args.length === 0) {
    console.error('错误: 缺少JSON操作命令');
    process.exit(1);
  }

  const operation = args[0];

  switch (operation) {
    case 'parse':
      if (args.length < 2) {
        console.error('错误: 缺少JSON字符串参数');
        process.exit(1);
      }
      parseJson(args[1]);
      break;

    case 'stringify':
      if (args.length < 2) {
        console.error('错误: 缺少对象参数');
        process.exit(1);
      }
      stringifyJson(args[1]);
      break;

    case 'validate':
      if (args.length < 2) {
        console.error('错误: 缺少JSON字符串参数');
        process.exit(1);
      }
      validateJson(args[1]);
      break;

    case 'minify':
      if (args.length < 2) {
        console.error('错误: 缺少JSON字符串参数');
        process.exit(1);
      }
      minifyJson(args[1]);
      break;

    case 'beautify':
      if (args.length < 2) {
        console.error('错误: 缺少JSON字符串参数');
        process.exit(1);
      }
      beautifyJson(args[1]);
      break;

    case 'merge':
      if (args.length < 3) {
        console.error('错误: 需要两个JSON文件路径参数');
        process.exit(1);
      }
      await mergeJsonFiles(args[1], args[2]);
      break;

    case 'extract':
      if (args.length < 3) {
        console.error('错误: 缺少路径或JSON字符串参数');
        process.exit(1);
      }
      extractFromJson(args[1], args[2]);
      break;

    default:
      console.error(`错误: 未知JSON操作 "${operation}"`);
      process.exit(1);
  }
}

// 解析JSON字符串
function parseJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    console.log(JSON.stringify(parsed, null, 2));
  } catch (error) {
    console.error(`JSON解析错误: ${error.message}`);
    process.exit(1);
  }
}

// 将对象转换为JSON字符串
function stringifyJson(objString) {
  try {
    // 尝试解析为对象，如果已经是对象则直接使用
    let obj;
    try {
      obj = JSON.parse(objString);
    } catch {
      // 如果解析失败，假设它是一个变量引用
      // 在实际环境中，这可能需要更复杂的处理
      console.error('错误: 无法解析对象参数，请提供有效的JSON字符串或对象引用');
      process.exit(1);
    }

    console.log(JSON.stringify(obj, null, 2));
  } catch (error) {
    console.error(`JSON转换错误: ${error.message}`);
    process.exit(1);
  }
}

// 验证JSON字符串
function validateJson(jsonString) {
  try {
    JSON.parse(jsonString);
    console.log('JSON字符串有效');
  } catch (error) {
    console.error(`JSON字符串无效: ${error.message}`);
    process.exit(1);
  }
}

// 压缩JSON字符串
function minifyJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    console.log(JSON.stringify(parsed));
  } catch (error) {
    console.error(`JSON压缩错误: ${error.message}`);
    process.exit(1);
  }
}

// 美化JSON字符串
function beautifyJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    console.log(JSON.stringify(parsed, null, 2));
  } catch (error) {
    console.error(`JSON美化错误: ${error.message}`);
    process.exit(1);
  }
}

// 合并两个JSON文件
async function mergeJsonFiles(file1, file2) {
  try {
    const f1 = Bun.file(file1);
    const f2 = Bun.file(file2);

    const f1Exists = await f1.exists();
    const f2Exists = await f2.exists();

    if (!f1Exists) {
      console.error(`错误: 文件 "${file1}" 不存在`);
      process.exit(1);
    }

    if (!f2Exists) {
      console.error(`错误: 文件 "${file2}" 不存在`);
      process.exit(1);
    }

    const json1 = await f1.json();
    const json2 = await f2.json();

    // 简单的深度合并函数
    function deepMerge(target, source) {
      const result = { ...target };

      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }

      return result;
    }

    const merged = deepMerge(json1, json2);
    console.log(JSON.stringify(merged, null, 2));
  } catch (error) {
    console.error(`JSON文件合并错误: ${error.message}`);
    process.exit(1);
  }
}

// 从JSON中提取指定路径的值
function extractFromJson(path, jsonString) {
  try {
    const parsed = JSON.parse(jsonString);

    // 将路径如 "a.b.c" 转换为可以访问对象属性的表达式
    const pathParts = path.split('.');
    let result = parsed;

    for (const part of pathParts) {
      if (result && typeof result === 'object' && part in result) {
        result = result[part];
      } else {
        console.error(`错误: 路径 "${path}" 在JSON中不存在`);
        process.exit(1);
      }
    }

    if (typeof result === 'object') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error(`JSON提取错误: ${error.message}`);
    process.exit(1);
  }
}

// CSV处理函数
async function handleCsvCommand(args) {
  if (args.length === 0) {
    console.error('错误: 缺少CSV操作命令');
    process.exit(1);
  }

  const operation = args[0];

  switch (operation) {
    case 'parse':
      if (args.length < 2) {
        console.error('错误: 缺少CSV字符串参数');
        process.exit(1);
      }
      parseCsv(args[1]);
      break;

    case 'stringify':
      if (args.length < 2) {
        console.error('错误: 缺少数组参数');
        process.exit(1);
      }
      stringifyCsv(args[1]);
      break;

    case 'tojson':
      if (args.length < 2) {
        console.error('错误: 缺少CSV字符串参数');
        process.exit(1);
      }
      csvToJson(args[1]);
      break;

    case 'fromjson':
      if (args.length < 2) {
        console.error('错误: 缺少JSON字符串参数');
        process.exit(1);
      }
      jsonToCsv(args[1]);
      break;

    default:
      console.error(`错误: 未知CSV操作 "${operation}"`);
      process.exit(1);
  }
}

// 解析CSV字符串
function parseCsv(csvString) {
  try {
    const lines = csvString.split('\n');
    const result = [];

    // 假设第一行是标题
    const headers = lines[0].split(',').map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;

      const values = lines[i].split(',').map(value => value.trim());
      const entry = {};

      for (let j = 0; j < headers.length; j++) {
        entry[headers[j]] = values[j] || '';
      }

      result.push(entry);
    }

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(`CSV解析错误: ${error.message}`);
    process.exit(1);
  }
}

// 将数组转换为CSV字符串
function stringifyCsv(arrayString) {
  try {
    let array;

    try {
      array = JSON.parse(arrayString);
    } catch {
      console.error('错误: 无效的数组参数');
      process.exit(1);
    }

    if (!Array.isArray(array) || array.length === 0) {
      console.error('错误: 参数必须是非空数组');
      process.exit(1);
    }

    // 获取所有可能的键
    const keys = new Set();
    for (const item of array) {
      if (item && typeof item === 'object') {
        for (const key in item) {
          keys.add(key);
        }
      }
    }

    const headers = Array.from(keys);

    // 创建CSV行
    let csv = headers.join(',') + '\n';

    for (const item of array) {
      if (item && typeof item === 'object') {
        const row = headers.map(header => item[header] || '').join(',');
        csv += row + '\n';
      }
    }

    console.log(csv);
  } catch (error) {
    console.error(`CSV转换错误: ${error.message}`);
    process.exit(1);
  }
}

// 将CSV转换为JSON
function csvToJson(csvString) {
  parseCsv(csvString);
}

// 将JSON转换为CSV
function jsonToCsv(jsonString) {
  stringifyCsv(jsonString);
}

// 文本处理函数
function handleTextCommand(args) {
  if (args.length === 0) {
    console.error('错误: 缺少文本操作命令');
    process.exit(1);
  }

  const operation = args[0];

  switch (operation) {
    case 'reverse':
      if (args.length < 2) {
        console.error('错误: 缺少字符串参数');
        process.exit(1);
      }
      reverseString(args[1]);
      break;

    case 'uppercase':
      if (args.length < 2) {
        console.error('错误: 缺少字符串参数');
        process.exit(1);
      }
      uppercaseString(args[1]);
      break;

    case 'lowercase':
      if (args.length < 2) {
        console.error('错误: 缺少字符串参数');
        process.exit(1);
      }
      lowercaseString(args[1]);
      break;

    case 'capitalize':
      if (args.length < 2) {
        console.error('错误: 缺少字符串参数');
        process.exit(1);
      }
      capitalizeString(args[1]);
      break;

    case 'trim':
      if (args.length < 2) {
        console.error('错误: 缺少字符串参数');
        process.exit(1);
      }
      trimString(args[1]);
      break;

    case 'split':
      if (args.length < 3) {
        console.error('错误: 缺少分隔符或字符串参数');
        process.exit(1);
      }
      splitString(args[1], args[2]);
      break;

    case 'join':
      if (args.length < 3) {
        console.error('错误: 缺少分隔符或数组参数');
        process.exit(1);
      }
      joinArray(args[1], args[2]);
      break;

    case 'replace':
      if (args.length < 4) {
        console.error('错误: 缺少模式、替换或字符串参数');
        process.exit(1);
      }
      replaceString(args[1], args[2], args[3]);
      break;

    case 'length':
      if (args.length < 2) {
        console.error('错误: 缺少字符串参数');
        process.exit(1);
      }
      stringLength(args[1]);
      break;

    case 'count':
      if (args.length < 3) {
        console.error('错误: 缺少子字符串或字符串参数');
        process.exit(1);
      }
      countSubstring(args[1], args[2]);
      break;

    default:
      console.error(`错误: 未知文本操作 "${operation}"`);
      process.exit(1);
  }
}

// 反转字符串
function reverseString(str) {
  console.log(str.split('').reverse().join(''));
}

// 转换为大写
function uppercaseString(str) {
  console.log(str.toUpperCase());
}

// 转换为小写
function lowercaseString(str) {
  console.log(str.toLowerCase());
}

// 首字母大写
function capitalizeString(str) {
  console.log(str.charAt(0).toUpperCase() + str.slice(1));
}

// 去除首尾空格
function trimString(str) {
  console.log(str.trim());
}

// 分割字符串
function splitString(separator, str) {
  console.log(JSON.stringify(str.split(separator)));
}

// 连接数组元素为字符串
function joinArray(separator, arrayString) {
  try {
    const array = JSON.parse(arrayString);
    if (!Array.isArray(array)) {
      console.error('错误: 参数必须是数组');
      process.exit(1);
    }
    console.log(array.join(separator));
  } catch (error) {
    console.error(`数组连接错误: ${error.message}`);
    process.exit(1);
  }
}

// 替换字符串中的模式
function replaceString(pattern, replacement, str) {
  try {
    const regex = new RegExp(pattern, 'g');
    console.log(str.replace(regex, replacement));
  } catch (error) {
    console.error(`字符串替换错误: ${error.message}`);
    process.exit(1);
  }
}

// 获取字符串长度
function stringLength(str) {
  console.log(str.length);
}

// 计算子字符串出现次数
function countSubstring(substring, str) {
  const regex = new RegExp(substring.replace(/[.*+?^${}()|[\]\\]/g, '\\\$&'), 'g');
  const matches = str.match(regex);
  console.log(matches ? matches.length : 0);
}

// 编码函数
function handleEncodeCommand(args) {
  if (args.length < 2) {
    console.error('错误: 缺少编码格式或数据参数');
    process.exit(1);
  }

  const format = args[0];
  const data = args[1];

  switch (format) {
    case 'base64':
      console.log(btoa(data));
      break;

    case 'url':
      console.log(encodeURIComponent(data));
      break;

    case 'html':
      console.log(data
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;'));
      break;

    default:
      console.error(`错误: 未知编码格式 "${format}"`);
      process.exit(1);
  }
}

// 解码函数
function handleDecodeCommand(args) {
  if (args.length < 2) {
    console.error('错误: 缺少解码格式或数据参数');
    process.exit(1);
  }

  const format = args[0];
  const data = args[1];

  switch (format) {
    case 'base64':
      console.log(atob(data));
      break;

    case 'url':
      console.log(decodeURIComponent(data));
      break;

    case 'html':
      console.log(data
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&'));
      break;

    default:
      console.error(`错误: 未知解码格式 "${format}"`);
      process.exit(1);
  }
}

// 哈希函数
async function handleHashCommand(args) {
  if (args.length < 2) {
    console.error('错误: 缺少哈希算法或数据参数');
    process.exit(1);
  }

  const algorithm = args[0];
  const data = args[1];

  try {
    let hash;

    switch (algorithm) {
      case 'md5':
        hash = await Bun.hash(data);
        break;

      case 'sha1':
        hash = await Bun.hash(data, "sha1");
        break;

      case 'sha256':
        hash = await Bun.hash(data, "sha256");
        break;

      default:
        console.error(`错误: 未知哈希算法 "${algorithm}"`);
        process.exit(1);
    }

    console.log(hash.toString('hex'));
  } catch (error) {
    console.error(`哈希计算错误: ${error.message}`);
    process.exit(1);
  }
}

// 格式化函数
function handleFormatCommand(args) {
  if (args.length < 2) {
    console.error('错误: 缺少格式类型或数据参数');
    process.exit(1);
  }

  const type = args[0];

  switch (type) {
    case 'currency':
      if (args.length < 2) {
        console.error('错误: 缺少数值参数');
        process.exit(1);
      }
      formatCurrency(args[1], args[2]);
      break;

    case 'number':
      if (args.length < 2) {
        console.error('错误: 缺少数值参数');
        process.exit(1);
      }
      formatNumber(args[1], args[2]);
      break;

    case 'date':
      if (args.length < 2) {
        console.error('错误: 缺少日期字符串参数');
        process.exit(1);
      }
      formatDate(args[1], args[2]);
      break;

    case 'bytes':
      if (args.length < 2) {
        console.error('错误: 缺少字节数参数');
        process.exit(1);
      }
      formatBytes(args[1]);
      break;

    default:
      console.error(`错误: 未知格式类型 "${type}"`);
      process.exit(1);
  }
}

// 格式化货币
function formatCurrency(value, currency = 'USD') {
  try {
    const num = parseFloat(value);
    if (isNaN(num)) {
      console.error('错误: 无效的数值参数');
      process.exit(1);
    }

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    });

    console.log(formatter.format(num));
  } catch (error) {
    console.error(`货币格式化错误: ${error.message}`);
    process.exit(1);
  }
}

// 格式化数字
function formatNumber(value, decimals) {
  try {
    const num = parseFloat(value);
    if (isNaN(num)) {
      console.error('错误: 无效的数值参数');
      process.exit(1);
    }

    const decimalPlaces = decimals !== undefined ? parseInt(decimals) : 2;

    console.log(num.toFixed(decimalPlaces));
  } catch (error) {
    console.error(`数字格式化错误: ${error.message}`);
    process.exit(1);
  }
}

// 格式化日期
function formatDate(dateString, format) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('错误: 无效的日期参数');
      process.exit(1);
    }

    if (!format) {
      console.log(date.toISOString());
      return;
    }

    // 简单的日期格式化
    let formatted = format;

    formatted = formatted.replace('YYYY', date.getFullYear().toString());
    formatted = formatted.replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'));
    formatted = formatted.replace('DD', date.getDate().toString().padStart(2, '0'));
    formatted = formatted.replace('HH', date.getHours().toString().padStart(2, '0'));
    formatted = formatted.replace('mm', date.getMinutes().toString().padStart(2, '0'));
    formatted = formatted.replace('ss', date.getSeconds().toString().padStart(2, '0'));

    console.log(formatted);
  } catch (error) {
    console.error(`日期格式化错误: ${error.message}`);
    process.exit(1);
  }
}

// 格式化字节数
function formatBytes(bytes) {
  try {
    const num = parseInt(bytes);
    if (isNaN(num)) {
      console.error('错误: 无效的字节数参数');
      process.exit(1);
    }

    if (num === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(num) / Math.log(k));

    console.log(parseFloat((num / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]);
  } catch (error) {
    console.error(`字节格式化错误: ${error.message}`);
    process.exit(1);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help') {
    showHelp();
    return;
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  switch (command) {
    case 'json':
      await handleJsonCommand(commandArgs);
      break;

    case 'csv':
      await handleCsvCommand(commandArgs);
      break;

    case 'text':
      handleTextCommand(commandArgs);
      break;

    case 'encode':
      handleEncodeCommand(commandArgs);
      break;

    case 'decode':
      handleDecodeCommand(commandArgs);
      break;

    case 'hash':
      await handleHashCommand(commandArgs);
      break;

    case 'format':
      handleFormatCommand(commandArgs);
      break;

    default:
      console.error(`错误: 未知命令 "${command}"`);
      showHelp();
      process.exit(1);
  }
}

// 运行主函数
main();
