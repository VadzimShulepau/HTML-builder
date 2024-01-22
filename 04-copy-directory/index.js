const fs = require('fs');
const path = require('path');

const filesFolder = path.resolve(__dirname, 'files');
const filesCopyFolder = path.resolve(__dirname, 'files-copy');

fs.access(filesCopyFolder, async (err) => {
  if (err) {
    fs.promises.mkdir(filesCopyFolder, (err) => {
      if (err) console.log(err);
    });
  }

  await fs.promises.rm(filesCopyFolder, { recursive: true, force: true });
  await fs.promises.mkdir(filesCopyFolder, { recursive: true });

  const files = await fs.promises.readdir(filesFolder, { writingMode: true });
  for (let file of files) {
    fs.copyFile(
      path.resolve(filesFolder, file),
      path.resolve(filesCopyFolder, file),
      (err) => {
        if (err) return new Error('coping failed');
      },
    );
  }
});
