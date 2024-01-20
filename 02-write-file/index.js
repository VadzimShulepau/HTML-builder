const fs = require('fs');
const path = require('path');
const readline = require('readline');

const writeStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));
const writeInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

writeInterface.setPrompt('>> Enter text\n');
writeInterface.prompt();
writeInterface
  .on('line', (input) => {
    if (input === 'exit') {
      closeInput();
    }
    writeStream.write(input + '\n');
  })
  .on('SIGINT', () => closeInput());

const closeInput = () => {
  writeInterface.setPrompt('>> Text written\n');
  writeInterface.prompt();
  writeInterface.close();
  process.exit();
};
