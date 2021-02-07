import { ConfigProvider } from 'terminus-core'

/** @hidden */
export class ClickableLinksConfigProvider extends ConfigProvider {
    defaults = {
        clickableLinks: {
            modifier: null,
        },
    }

    platformDefaults = { }
}
