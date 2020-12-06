require('ag-psd/initialize-canvas');
const { getConfigPaths, getFilesName,getOutputNameFromPath,  getImageFileName, createNameFromSequence, parseFileName, getImagesFromPath, getImageDimensions, createFullCanvas, createCanvasFromImage, generatePsd } = require(
  './helpers');

const { PATH_CARS, PATH_BACKGROUND, PATH_SHADOW, PATH_OUTPUT } = getConfigPaths();

const createPSDs = async () => {
  const carFolders = getFilesName(PATH_CARS);
  const outputName = getOutputNameFromPath(PATH_CARS);
  carFolders.forEach((carFolder) => {
    const carImages = getImageFileName(`${PATH_CARS}/${carFolder}`);
    carImages.forEach((carImageFile) => {
      const { extension, sequence, prefixNum, name } = parseFileName(carImageFile);
      const backgroundPath = `${PATH_BACKGROUND}`;
      const shadowPath = `${PATH_SHADOW}/${createNameFromSequence('SHADOW', sequence, extension, 2)}`;
      const carPath = `${PATH_CARS}/${carFolder}/${carImageFile}`;
      const imagesPathLayer = [backgroundPath, shadowPath, carPath];
      const parsedImages = getImagesFromPath(imagesPathLayer);
      const imageDimension = getImageDimensions(parsedImages);
      const fullCanvas = createFullCanvas(parsedImages, imageDimension);
      const [backgroundImage, shadowImage, carImage] = parsedImages;
      const {width, height} = imageDimension;
      const psd = {
        width,
        height,
        children: [
          {
            name: 'Background',
            canvas: createCanvasFromImage(backgroundImage),
            'opacity': 1
          },
          {
            name: 'Shadow',
            canvas: createCanvasFromImage(shadowImage),
            'opacity': 1
          },
          {
            name: 'Car',
            canvas: createCanvasFromImage(carImage),
            'opacity': 1
          }
        ],
        canvas: fullCanvas
      };
      const outputFile = `${outputName}${carFolder}_${sequence}.psd`;
      console.log(`File: ${outputFile} generated`);
      const outputPath = `${PATH_OUTPUT}/${outputFile}`;
      generatePsd(psd, outputPath)
    });
  });
};

createPSDs();
