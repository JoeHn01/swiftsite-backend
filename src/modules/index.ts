import * as fs from 'fs';
import * as path from 'path';

// Function to get all folders in the current directory (siblings of index.ts)
function getFolders(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// Function to load a module from a folder and create a DynamicModule
function loadModule(folderName: string) {
  const modulePath = path.join(__dirname, folderName, `${folderName}.module.js`); // Use .js for compiled files
  try {
    const module = require(modulePath);
    const importedModule = module.default || module[`${folderName.charAt(0).toUpperCase() + folderName.slice(1)}Module`];
    const fileName = path.basename(modulePath);
    console.log(`Successfully loaded module: ${fileName}`);
    if (typeof importedModule === 'function') {
      return { module: importedModule };
    } else {
      console.error(`Error: The module at ${modulePath} is not a constructor.`);
      return undefined;
    }
  } catch (err) {
    console.error(`Error loading module from folder: ${folderName}`, err);
    return undefined;
  }
}

// Create an array to store DynamicModule objects
const loadedModules = getFolders(__dirname)
  .map(loadModule)
  .filter((dynamicModule) => dynamicModule !== undefined);

// Export the loaded modules as an array
export const modules = loadedModules;
