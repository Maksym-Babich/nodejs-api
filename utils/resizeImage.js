const Jimp = require('jimp');

const resizeImage = (path) => {
  Jimp.read(path, (err, file) => {
    if (err) throw err;
    file.resize(250, 250).write(path);
  });
};

module.exports = resizeImage;
