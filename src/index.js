require('ag-psd/initialize-canvas');
const { getConfigPaths, getFilesName, getOutputNameFromPath, getImageFileName, createNameFromSequence, parseFileName, getImagesFromPath, getImageDimensions, createFullCanvas, createCanvasFromImage, generateAndSavePsdFromConfig } = require(
  './helpers');
const express = require('express');
const bodyParser = require('body-parser');

const createPSDs = async ({ mainPath, output, layers }) => {
  const mainPathFolers = getFilesName(mainPath);
  const outputName = getOutputNameFromPath(mainPath);
  mainPathFolers.forEach((folderName) => {
    const mainImages = getImageFileName(`${mainPath}/${folderName}`);
    mainImages.forEach((mainImageFile) => {
      const { extension, sequence, prefixNum, name } = parseFileName(mainImageFile);
      const imagesPathLayer = layers.map(({type, path, sequenceName}) => {
        switch(type) {
          case "single":
            return path;
          case "sequence":
            return `${path}/${createNameFromSequence(sequenceName, sequence, extension)}`;
          case "main":
            return `${path}/${folderName}/${mainImageFile}`;
        }
      });
      const parsedImages = getImagesFromPath(imagesPathLayer);
      const imageDimension = getImageDimensions(parsedImages);
      const fullCanvas = createFullCanvas(parsedImages, imageDimension);
      const { width, height } = imageDimension;
      const children = layers.map((layer, index) => {
        const {name, opacity, blendMode} = layer;
        return {
          name,
          canvas: createCanvasFromImage(parsedImages[index]),
          opacity,
          blendMode
        }
      });
      const psd = {
        width,
        height,
        children,
        canvas: fullCanvas
      };
      const outputFile = `${outputName}${folderName}_${sequence}.psd`;
      console.log(`File: ${outputFile} generated`);
      const outputPath = `${output}/${outputFile}`;
      generateAndSavePsdFromConfig(psd, outputPath);
    });
  });
};

// createPSDs();

const app = express();
const port = 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true
}));

app.post('/generate', (req, res) => {
  const { output, layers } = req.body;
  const mainSequence = layers.find((layer) => layer.type === 'main');
  const configuration = {
    output,
    layers,
    mainPath: mainSequence.path
  };
  createPSDs(configuration);
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
