import { Mode, Renderer } from './embed';
/**
 * Open editor url in a new window, and pass a message.
 */
export declare function post(window: Window, url: string, data: {
    mode: Mode;
    renderer: Renderer;
    spec: string;
}): void;
