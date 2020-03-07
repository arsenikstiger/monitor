import { Page } from "puppeteer";
import GroupConfiguration from "./GroupConfiguration";

export default class GroupModel {
    Page: Page;
    GroupConfiguration: GroupConfiguration;

    constructor(page: Page, groupConfiguration: GroupConfiguration) {
        this.Page = page;
        this.GroupConfiguration = groupConfiguration;
    }
}