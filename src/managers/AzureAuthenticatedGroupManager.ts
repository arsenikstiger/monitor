import { Browser } from "puppeteer";
import GroupConfiguration from "../models/GroupConfiguration";
import DefaultConfiguration from "../models/DefaultConfiguration";
import GroupManager from "./GroupManager";

export default class AzureAuthenticatedGroupManager extends GroupManager {
    public constructor(groupConfiguration: GroupConfiguration, defaultConfiguration: DefaultConfiguration) {
        super(groupConfiguration, defaultConfiguration)
    }

    async start(browser: Browser): Promise<void> {
        this._browser = browser;

        let loginPage = await this._browser.newPage();
        await loginPage.goto(this._groupConfiguration.login.url);

        // Avoids redirect wall
        await this.delay(1000 * this._defaultConfiguration.redirectWallTimeInSeconds);

        await loginPage.waitForSelector(this._groupConfiguration.login.userSelector);
        await loginPage.type(this._groupConfiguration.login.userSelector, this._groupConfiguration.login.user);
        await loginPage.click(this._groupConfiguration.login.formButtonSelector);

        // Avoids redirect wall
        await this.delay(1000 * this._defaultConfiguration.redirectWallTimeInSeconds);

        await loginPage.waitForSelector(this._groupConfiguration.login.passwordSelector);
        await loginPage.type(this._groupConfiguration.login.passwordSelector, this._groupConfiguration.login.password);
        await loginPage.click(this._groupConfiguration.login.formButtonSelector);

        await super.start(this._browser);

        await loginPage.close();
    }
}