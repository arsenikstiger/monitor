import { Page, Browser } from "puppeteer";
import IPageManager from "./interfaces/IPageManager";
import DefaultConfiguration from "../models/DefaultConfiguration";
import PageConfiguration from "../models/PageConfiguration";

export default class PageManager implements IPageManager {
  _browser: Browser;
  _pageConfiguration: PageConfiguration;
  _defaultConfiguration: DefaultConfiguration;
  _page: Page;

  constructor(pageConfiguration: PageConfiguration, defaultConfiguration: DefaultConfiguration) {
    this._pageConfiguration = pageConfiguration;
    this._defaultConfiguration = defaultConfiguration;
  }

  async initialize(): Promise<void> {
  }

  async start(browser: Browser): Promise<void> {
    this._browser = browser;

    this._page = await this._browser.newPage();
    await this._page.goto(this._pageConfiguration.pageDefinition.url);
  }

  async update(): Promise<void> {
      await this._page.bringToFront();
      await this.delay(1000 * this._defaultConfiguration.rotationTimeInSeconds)
  }

  async dispose(): Promise<void> {
    await this._page.close();

    this._pageConfiguration = null;
  }

  //#region private

  async log(msg: string, params: any): Promise<void> {
    console.log(msg, params);
  }

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //#endregion
}