import DefaultConfiguration from "./DefaultConfiguration";
import GroupConfiguration from "./GroupConfiguration";
import { LaunchOptions } from "puppeteer";

export default class GlobalConfiguration {
    defaults: DefaultConfiguration;
    browserOption: LaunchOptions;
    groups: GroupConfiguration[];
}