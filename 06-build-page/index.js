// const { fs.stat } = require('fs');
const fs = require('fs');
const { resolve } = require('path');

const componentsFolderPath = resolve(__dirname, 'components');
const stylesFolderPath = resolve(__dirname, 'styles');
const distFolderPath = resolve(__dirname, 'project-dist');
const assetsFolderPath = resolve(__dirname, 'assets');
const assetsDestFolder = resolve(distFolderPath, 'assets');

async function createDest() {
  fs.stat(distFolderPath, async (err) => {
    // if (err) return;
    await removeFolder(distFolderPath);
    await copyAssetsFolderInDest(assetsFolderPath, assetsDestFolder);
    await replaceTemplateTags();
    await collectsSingleStylesFile();
  });
}
createDest();

async function readFileFromFolder(path, element) {
  return await fs.promises.readFile(resolve(path, element), 'utf-8');
}

async function writeFileInFolder(path, data) {
  await fs.promises.writeFile(path, data);
}

async function getFilesFromFolder(path) {
  return await fs.promises.readdir(path, { withFileTypes: true });
}

async function copyFilesInDest(source, destination) {
  await fs.promises.copyFile(source, destination);
}

async function createFolder(path) {
  return await fs.promises.mkdir(path, { recursive: true });
}

async function removeFolder(path) {
  await fs.promises.rm(path, { recursive: true, force: true });
}

async function getComponentFiles() {
  const componentsFiles = {};
  const components = await getFilesFromFolder(componentsFolderPath);

  for (let component of components) {
    const componentText = await readFileFromFolder(
      componentsFolderPath,
      component.name,
    );
    const arr = component.name.split('.');

    componentsFiles[arr[0]] = componentText;
  }

  return componentsFiles;
}

async function getListComponentFiles() {
  const list = await getFilesFromFolder(componentsFolderPath);
  return list.map((item) => {
    const i = item.name.split('.');
    return (item = i[0]);
  });
}

async function replaceTemplateTags() {
  let template = await readFileFromFolder(__dirname, 'template.html');
  const componentsFiles = await getComponentFiles();
  const componentsList = await getListComponentFiles();

  for (let com of componentsList) {
    // const tagIndex = template.indexOf(`{{${com}}}`);
    template = template.toString().replace(`{{${com}}}`, componentsFiles[com]);
  }

  await createFolder(distFolderPath);
  await writeFileInFolder(resolve(distFolderPath, 'index.html'), template);
}

async function collectsSingleStylesFile() {
  const stylesList = await getFilesFromFolder(stylesFolderPath);
  let style = '';
  for (let stl of stylesList) {
    const strText = await readFileFromFolder(stylesFolderPath, stl.name);
    style += strText;
  }
  await createFolder(distFolderPath);
  await writeFileInFolder(resolve(distFolderPath, 'style.css'), style);
}

async function copyAssetsFolderInDest(source, destination) {
  // await removeFolder(destination);
  const assetsFolders = await getFilesFromFolder(source);
  await createFolder(destination);
  const filesPath = [];

  for (let item of assetsFolders) {
    const src = resolve(source, item.name);
    const dest = resolve(destination, item.name);

    if (item.isDirectory()) {
      await copyAssetsFolderInDest(src, dest);
    }

    if (item.isFile()) {
      // await copyFilesInDest(src, dest);
      filesPath.push([src, dest]);
    }
  }

  for (let path of filesPath) {
    await copyFilesInDest(path[0], path[1]);
  }
}
