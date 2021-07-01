import { Component } from '@angular/core'
import { ConfigService } from 'tabby-core'

@Component({
    template: require('./clickableLinksSettingsTab.component.pug'),
})
export class ClickableLinksSettingsTabComponent {
    constructor (
        public config: ConfigService,
    ) { }
}
