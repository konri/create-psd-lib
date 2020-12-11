const { createCanvas, Image } = require('canvas');
const fs = require('fs');
const pathLib = require('path');
const SUPPORT_IMAGE_EXTENSIONS = ['.png'];
const { writePsdBuffer, readPsd,  initializeCanvas } = require('ag-psd');


exports.getConfigPaths = function() {
  const configurationFile = fs.readFileSync(`${__dirname}/../configuration.txt`, 'utf8')
    .split('\n')
    .filter((str) => str != '')
    .map((configRecord) => {
      const [key, value] = configRecord.split('=');
      return {
        key,
        value
      };
    });
  return configurationFile
    .reduce((acc, val) => ({
      ...acc,
      [val.key]: val.value
    }), {});
};

exports.getFilesName = function(path) {
  return fs.readdirSync(path);
};

exports.getImageFileName = function(path) {
  return fs.readdirSync(path)
    .filter((fileName) => SUPPORT_IMAGE_EXTENSIONS.includes(pathLib.extname(fileName)));
};

exports.parseFileName = function(fileName) {
  const [imageFile, extension] = fileName.split('.');
  const num = imageFile.match(/\d+/g);
  const letr = imageFile.match(/[a-zA-Z]+/g);

  if (num.length === 1) {
    return {
      extension,
      sequence: num[0],
      name: letr[0]
    };
  } else if (num.length === 2) {
    return {
      extension,
      sequence: num[1],
      prefixNum: num[0],
      name: letr[0]
    };
  }
  throw new Error('No sequence number');
};

exports.getOutputNameFromPath = function(path) {
  const split = path.split('/');
  // const split = path.split('\\');  //windows
  return split[split.length - 1]
};

exports.createNameFromSequence = function(name, sequence, extension, prefixNum = '') {
  return `${prefixNum}${name}${sequence}.${extension}`;
};

exports.getImagesFromPath = function(filePaths) {
  return filePaths.map((filePath) => {
    const img = new Image();
    img.src = fs.readFileSync(filePath);
    return img;
  });
};

exports.getImageDimensions = function(images) {
  if (images.length === 0) {
    throw new Error('empty images');
  }
  const [{ width, height }] = images;
  for (let i = 1; i < images.length; i++) {
    if (images[i].width !== width || images[i].height !== height) {
      throw new Error('Images has different size');
    }
  }
  return {
    width,
    height
  };
};

exports.createFullCanvas = function(images, dimension) {
  const canvas = createCanvas(dimension.width, dimension.height);
  images.forEach((img) => canvas.getContext('2d').drawImage(img, 0, 0));
  return canvas;
};

exports.createCanvasFromImage = function(img) {
  const canvas = createCanvas(img.width, img.height);
  canvas.getContext('2d').drawImage(img, 0, 0);
  return canvas;
};

exports.generatePsd = function(psdConfig) {
  return writePsdBuffer(psdConfig);
};

exports.readPsdFile = function(psdConfig) {
  return readPsd(psdConfig);
};

exports.generateAndSavePsdFromConfig = function(psdConfig, outputPath) {
  const buffer = writePsdBuffer(psdConfig);
  fs.writeFileSync(outputPath, buffer);
};

exports.generateAndSavePsdFromBuffer = function(buffer, outputPath) {
  fs.writeFileSync(outputPath, buffer);
};
