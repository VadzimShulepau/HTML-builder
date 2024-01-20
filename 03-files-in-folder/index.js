const fs = require('fs');
const path = require('path');

const targetFolder = path.resolve(__dirname, 'secret-folder');
fs.readdir(targetFolder, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);

  files.forEach((item) => {
    if (item.isFile()) {
      let file = path.parse(item.name);
      fs.stat(path.resolve(targetFolder, file.base), (err, st) => {
        process.stdout.write(
          `${file.name} - ${file.ext.substring(1, file.ext.length)} - ${(
            st.size / 1024
          ).toFixed(3)}kb\n`,
        );
      });
    }
  });
});
