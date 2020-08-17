const fs = require('fs');
const path = require('path');
const readline = require('readline');
// 创建 一个用于读取流的接口实例
const rl = readline.createInterface({
    input: process.stdin, // 监听可读流,
    output: process.stdout, // 可写流
    prompt: '文件名  >'  //提示字符串
    // historySize //保留的最大历史记录行数。要禁用历史记录，请将此值设置为 0。
    // completer // 用于 Tab 自动补全的可选函数。
})

readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);

// 无有效输入时使用的默认内容
const defAnswer = {
  fileName: 'template',
  filePath: '/_posts/',
  codeType: 'md'
};

// 问题步长记录，每次符合确认内容时则 + 1
let stepQuestion = 0;

const welcomeText = `
------------------------------
    欢迎使用 cli 快速创建模板
------------------------------
`;
console.log(welcomeText);

// 设定输入内容样式
console.log('\x1B[36m');

rl.on('line', (line) => {
    // on 函数是为需要监听的指令
    // line 是能接受到当前命令行中的输入流信息，通过函数回调的方式返回处理过的字符串。
    const line2str = line.trim();
    let answer = {};
    answer.fileName = line2str || defAnswer.fileName;
    answer.path = path.join('/_posts/', answer.fileName);

    // 将光标移入上一次步骤的位置，可以造成用户已经选择完成的效果。
    readline.cursorTo(process.stdout, 0, stepQuestion);
    // 清理之前的输入内容。
    readline.clearScreenDown(process.stdout);
    // 选择完成后输出选择后的结果信息。
    console.log(`\x1B[32m?\x1B[97m \x1B[36m%s`, answer);
    // 重置控制台样式。
    console.log('\x1B[0m');

    process.exit(0);
}).on('close', () => {
    console.log('\x1B[0m');
    console.log('【信息】您已中断模板创建任务，感谢您的使用再见!');
    process.exit(0);
});
