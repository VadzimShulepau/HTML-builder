const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, 'styles');
const targetPath = path.resolve(__dirname, 'project-dist');

const ws = fs.createWriteStream(path.resolve(targetPath, 'bundle.css'));

fs.readdir(sourcePath, { writeFilesTypes: true }, (err, files) => {
  if (err) return new Error('Failed readdir');

  files.forEach((file) => {
    if (path.extname(file) === '.css') {
      const rs = fs.createReadStream(path.resolve(sourcePath, file), 'utf-8');
      rs.on('data', (data) => {
        ws.write(data);
      });
    }
  });
});
