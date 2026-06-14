async function TMastData_DataDirectory(): Promise<string> {
  // TODO(rnc): verify that the data directory path resolution matches the original Pascal logic
  // and that the DATA folder exists at the expected location relative to the application root
  
  // In Next.js/Node.js context, we need to resolve the data directory relative to the project
  // Since we don't have ParamStr(0) equivalent, we'll use process.cwd() or __dirname
  // and construct the path as per the original logic: going up two directories then to DATA/
  
  const path = require('path');
  const currentDir = process.cwd();
  const dataDir = path.resolve(currentDir, '..', '..', 'DATA');
  
  return dataDir;
}