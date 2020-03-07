import * as puppeteer from 'puppeteer';
import GlobalConfiguration from '../models/GlobalConfiguration';
import GroupConfiguration from '../models/GroupConfiguration';
import IBrowserManager from './interfaces/IBrowserManager';
import { Browser } from 'puppeteer';
import IGroupManager from './interfaces/IGroupManager';
import GroupManager from './GroupManager';
import AuthenticatedGroupManager from './AuthenticatedGroupManager';
import AzureAuthenticatedGroupManager from './AzureAuthenticatedGroupManager';
import path = require('path');

export default class BrowserManager implements IBrowserManager {
  _browser: Browser;
  _globalConfiguration: GlobalConfiguration;
  _groupManagers: IGroupManager[];

  constructor(globalConfiguration: GlobalConfiguration) {
    this._globalConfiguration = globalConfiguration;
  }

  async initialize(): Promise<void> {
    this._groupManagers = new Array<GroupManager>();

    //init pupeeter
    this.initializePupeeter();

    // Create groups
    for (const groupConfiguration of this._globalConfiguration.groups) {
      let groupManager: IGroupManager = await this.createGroupManager(groupConfiguration)
      this._groupManagers.push(groupManager);
    }

    // Initialize groups
    for (const groupManager of this._groupManagers) {
      await groupManager.initialize();
    }
  }

  async start() {
    // start browser
    this._browser = await puppeteer.launch(this._globalConfiguration.browserOption);

    // start groups
    for (const groupManager of this._groupManagers) {
      await groupManager.start(this._browser);
    }
  }

  async update(): Promise<void> {
    while(this._browser.isConnected) {
      // update groups
      for (const groupManager of this._groupManagers) {
        await groupManager.update();
      }
    }
  }

  async dispose(): Promise<void> {
    // dispose groups
    for (const groupManager of this._groupManagers) {
      await groupManager.dispose();
    }

    await this._browser.close();
    this._groupManagers = null;
    this._globalConfiguration = null;
  }

  //#region private

  initializePupeeter() {
    const isPkg = !process.execPath.endsWith("node.exe");

    //mac/linux path replace
    let chromiumExecutablePath = (isPkg ?
      puppeteer.executablePath().replace(
        /^.*?\/node_modules\/puppeteer\/\.local-chromium/,
        path.join(path.dirname(process.execPath), 'chromium')
      ) :
      puppeteer.executablePath()
    );

    //check win32
    if (process.platform == 'win32') {
      chromiumExecutablePath = (isPkg ?
        puppeteer.executablePath().replace(
          /^.*?\\node_modules\\puppeteer\\\.local-chromium/,
          path.join(path.dirname(process.execPath), 'chromium')
        ) :
        puppeteer.executablePath()
      );
    }

    this._globalConfiguration.browserOption.executablePath = chromiumExecutablePath;
  }

  async createGroupManager(groupConfiguration: GroupConfiguration): Promise<IGroupManager> {
    let groupManager: IGroupManager;
    
    switch (groupConfiguration.groupDefinition.manager) {
      // TODO: Add Elastic Search auth
      case "AuthenticatedGroupManager":
        groupManager = new AuthenticatedGroupManager(groupConfiguration, this._globalConfiguration.defaults);
        break;
      case "AzureAuthenticatedGroupManager":
        groupManager = new AzureAuthenticatedGroupManager(groupConfiguration, this._globalConfiguration.defaults);
        break;
      case "GroupManager":
      default:
        groupManager = new GroupManager(groupConfiguration, this._globalConfiguration.defaults);
        break;
    }

    return groupManager;
  }

  //#endregion
}