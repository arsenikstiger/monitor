import { Browser } from "puppeteer";

export default interface IPageManager {
    initialize(): Promise<void>;
    start(browser: Browser): Promise<void>;
    update(): Promise<void>;
    dispose(): Promise<void>;
}