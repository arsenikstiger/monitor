import { Page } from "puppeteer";
import LoginConfiguration from "./LoginConfiguration";

export default class LoginPageModel {
    Page: Page;
    LoginConfiguration: LoginConfiguration;

    constructor(page: Page, loginConfiguration: LoginConfiguration) {
        this.Page = page;
        this.LoginConfiguration = loginConfiguration;
    }
}