#!/usr/bin/env bun

/**
 * 文件操作工具脚本
 * 提供文件和目录操作功能，不依赖第三方库
 */

// 显示帮助信息
function showHelp() {
  console.log(`
文件操作工具

用法:
  bun run file <命令> [参数]

命令:
  read <文件路径>           - 读取文件内容
  write <文件路径> <内容>    - 写入文件内容
  append <文件路径> <内容>   - 追加内容到文件
  copy <源文件> <目标文件>   - 复制文件
  move <源文件> <目标文件>   - 移动/重命名文件
  delete <文件路径>         - 删除文件
  exists <文件路径>         - 检查文件是否存在
  list <目录路径>           - 列出目录内容
  mkdir <目录路径>          - 创建目录
  rmdir <目录路径>          - 删除目录
  size <文件路径>           - 获取文件大小
  help                     - 显示帮助信息
`);
}

// 读取文件内容
async function readFile(filePath) {
  try {
    const file = Bun.file(filePath);
    const exists = await file.exists();

    if (!exists) {
      console.error(`错误: 文件 "${filePath}" 不存在`);
      process.exit(1);
    }

    const content = await file.text();
    console.log(content);
  } catch (error) {
    console.error(`读取文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 写入文件内容
async function writeFile(filePath, content) {
  try {
    await Bun.write(filePath, content);
    console.log(`成功写入文件: ${filePath}`);
  } catch (error) {
    console.error(`写入文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 追加内容到文件
async function appendFile(filePath, content) {
  try {
    const file = Bun.file(filePath);
    const exists = await file.exists();

    if (exists) {
      const existingContent = await file.text();
      await Bun.write(filePath, existingContent + content);
    } else {
      await Bun.write(filePath, content);
    }

    console.log(`成功追加内容到文件: ${filePath}`);
  } catch (error) {
    console.error(`追加内容失败: ${error.message}`);
    process.exit(1);
  }
}

// 复制文件
async function copyFile(sourcePath, destPath) {
  try {
    const sourceFile = Bun.file(sourcePath);
    const exists = await sourceFile.exists();

    if (!exists) {
      console.error(`错误: 源文件 "${sourcePath}" 不存在`);
      process.exit(1);
    }

    await Bun.write(destPath, sourceFile);
    console.log(`成功复制文件: ${sourcePath} -> ${destPath}`);
  } catch (error) {
    console.error(`复制文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 移动/重命名文件
async function moveFile(sourcePath, destPath) {
  try {
    const sourceFile = Bun.file(sourcePath);
    const exists = await sourceFile.exists();

    if (!exists) {
      console.error(`错误: 源文件 "${sourcePath}" 不存在`);
      process.exit(1);
    }

    await Bun.write(destPath, sourceFile);
    await removeFileOrDirectory(sourcePath);
    console.log(`成功移动文件: ${sourcePath} -> ${destPath}`);
  } catch (error) {
    console.error(`移动文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 删除文件
async function deleteFile(filePath) {
  try {
    await removeFileOrDirectory(filePath);
    console.log(`成功删除文件: ${filePath}`);
  } catch (error) {
    console.error(`删除文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 检查文件是否存在
async function checkFileExists(filePath) {
  try {
    const file = Bun.file(filePath);
    const exists = await file.exists();
    console.log(exists ? `文件存在: ${filePath}` : `文件不存在: ${filePath}`);
  } catch (error) {
    console.error(`检查文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 列出目录内容
async function listDirectory(dirPath) {
  try {
    const files = await Array.fromAsync(Bun.glob(`${dirPath}/*`));

    if (files.length === 0) {
      console.log(`目录为空: ${dirPath}`);
      return;
    }

    console.log(`目录内容: ${dirPath}`);
    for (const file of files) {
      const fileObj = Bun.file(file);
      const stats = await fileObj.exists() ? await fileObj.stats() : null;
      const isDir = stats ? stats.isDirectory : false;
      const size = stats && !isDir ? formatFileSize(stats.size) : '<目录>';
      console.log(`${isDir ? '[DIR]' : '[FILE]'} ${file} (${size})`);
    }
  } catch (error) {
    console.error(`列出目录失败: ${error.message}`);
    process.exit(1);
  }
}

// 创建目录
async function createDirectory(dirPath) {
  try {
    await Bun.$`mkdir -p ${dirPath}`;
    console.log(`成功创建目录: ${dirPath}`);
  } catch (error) {
    console.error(`创建目录失败: ${error.message}`);
    process.exit(1);
  }
}

// 删除目录
async function removeDirectory(dirPath) {
  try {
    await removeFileOrDirectory(dirPath);
    console.log(`成功删除目录: ${dirPath}`);
  } catch (error) {
    console.error(`删除目录失败: ${error.message}`);
    process.exit(1);
  }
}

// 获取文件大小
async function getFileSize(filePath) {
  try {
    const file = Bun.file(filePath);
    const exists = await file.exists();

    if (!exists) {
      console.error(`错误: 文件 "${filePath}" 不存在`);
      process.exit(1);
    }

    const stats = await file.stats();
    const size = formatFileSize(stats.size);
    console.log(`文件大小: ${filePath} - ${size}`);
  } catch (error) {
    console.error(`获取文件大小失败: ${error.message}`);
    process.exit(1);
  }
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 删除文件或目录（递归）
async function removeFileOrDirectory(path) {
  try {
    await Bun.$`rm -rf ${path}`;
  } catch (error) {
    console.error(`删除失败: ${error.message}`);
    throw error;
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

  switch (command) {
    case 'read':
      if (args.length < 2) {
        console.error('错误: 缺少文件路径参数');
        process.exit(1);
      }
      await readFile(args[1]);
      break;

    case 'write':
      if (args.length < 3) {
        console.error('错误: 缺少文件路径或内容参数');
        process.exit(1);
      }
      await writeFile(args[1], args[2]);
      break;

    case 'append':
      if (args.length < 3) {
        console.error('错误: 缺少文件路径或内容参数');
        process.exit(1);
      }
      await appendFile(args[1], args[2]);
      break;

    case 'copy':
      if (args.length < 3) {
        console.error('错误: 缺少源文件或目标文件参数');
        process.exit(1);
      }
      await copyFile(args[1], args[2]);
      break;

    case 'move':
      if (args.length < 3) {
        console.error('错误: 缺少源文件或目标文件参数');
        process.exit(1);
      }
      await moveFile(args[1], args[2]);
      break;

    case 'delete':
      if (args.length < 2) {
        console.error('错误: 缺少文件路径参数');
        process.exit(1);
      }
      await deleteFile(args[1]);
      break;

    case 'exists':
      if (args.length < 2) {
        console.error('错误: 缺少文件路径参数');
        process.exit(1);
      }
      await checkFileExists(args[1]);
      break;

    case 'list':
      if (args.length < 2) {
        console.error('错误: 缺少目录路径参数');
        process.exit(1);
      }
      await listDirectory(args[1]);
      break;

    case 'mkdir':
      if (args.length < 2) {
        console.error('错误: 缺少目录路径参数');
        process.exit(1);
      }
      await createDirectory(args[1]);
      break;

    case 'rmdir':
      if (args.length < 2) {
        console.error('错误: 缺少目录路径参数');
        process.exit(1);
      }
      await removeDirectory(args[1]);
      break;

    case 'size':
      if (args.length < 2) {
        console.error('错误: 缺少文件路径参数');
        process.exit(1);
      }
      await getFileSize(args[1]);
      break;

    default:
      console.error(`错误: 未知命令 "${command}"`);
      showHelp();
      process.exit(1);
  }
}

// 运行主函数
main();
