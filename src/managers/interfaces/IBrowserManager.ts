export default interface IBrowserManager {
    initialize(): Promise<void>;
    start(): Promise<void>;
    update(): Promise<void>;
    dispose(): Promise<void>;
}