import BrowserManager from "./managers/BrowserManager";
import GlobalConfiguration from "./models/GlobalConfiguration";
import fs = require('fs') ;
import path = require('path');
import { promisify } from 'util';

(async () => {
  let globalConfiguration: GlobalConfiguration = await getGlobalConfiguration();;
  let manager = new BrowserManager(globalConfiguration);

  try {
    await manager.initialize();
    await manager.start();
    await manager.update();
  } catch (e) {
    console.log("An error occured:", e);
  } finally {
    await manager.dispose();
  }
})();

async function getGlobalConfiguration(): Promise<GlobalConfiguration> {
  const isPkg = !process.execPath.endsWith("node.exe");

  let confPath = isPkg ? path.join(path.dirname(process.execPath), 'conf.json') : '.\\conf\\conf.json';
  const readFileAsync = promisify(fs.readFile);

  try {
    const jsonString = await readFileAsync(confPath, { encoding: 'utf8' });
    const configuration = JSON.parse(jsonString);
    return configuration as GlobalConfiguration;
  } catch (err) {
    console.log("File read failed:", err)
  }
}