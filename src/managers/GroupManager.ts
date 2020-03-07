import { Browser } from "puppeteer";
import GroupConfiguration from "../models/GroupConfiguration";
import DefaultConfiguration from "../models/DefaultConfiguration";
import IGroupManager from "./interfaces/IGroupManager";
import IPageManager from "./interfaces/IPageManager";
import PageManager from "./PageManager";
import PageConfiguration from "../models/PageConfiguration";

export default class GroupManager implements IGroupManager {
  _browser: Browser;
  _groupConfiguration: GroupConfiguration;
  _defaultConfiguration: DefaultConfiguration;
  _pageManagers: IPageManager[];

  constructor(groupConfiguration: GroupConfiguration, defaultConfiguration: DefaultConfiguration) {
    this._groupConfiguration = groupConfiguration;
    this._defaultConfiguration = defaultConfiguration;
  }

  async initialize(): Promise<void> {
    this._pageManagers = new Array<IPageManager>();

    // create pages
    for (const pageConfiguration of this._groupConfiguration.pages) {
      let pageManager: IPageManager = await this.createPageManager(pageConfiguration)
      this._pageManagers.push(pageManager);
    }

    // initialize pages
    for (const pageManager of this._pageManagers) {
      await pageManager.initialize();
    }
  }

  async start(browser: Browser): Promise<void> {
    this._browser = browser;

    // start pages
    for (const pageManager of this._pageManagers) {
      await pageManager.start(this._browser);
    }
  }

  async update(): Promise<void> {
    // update pages
    for (const pageManager of this._pageManagers) {
      await pageManager.update();
    }
  }

  async dispose(): Promise<void> {
    // dispose pages
    for (const pageManager of this._pageManagers) {
      await pageManager.dispose();
    }

    this._pageManagers = null;
  }

  //#region private

  async createPageManager(pageConfiguration: PageConfiguration): Promise<IPageManager> {
    let pageManager: IPageManager = new PageManager(pageConfiguration, this._defaultConfiguration);
    return pageManager;
  }

  async log(msg: string, params: any): Promise<void> {
    console.log(msg, params);
  }

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //#endregion
}