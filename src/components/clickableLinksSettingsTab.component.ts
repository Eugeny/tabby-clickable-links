import { Component } from '@angular/core'
import { ConfigService } from 'terminus-core'

@Component({
    template: require('./clickableLinksSettingsTab.component.pug'),
})
export class ClickableLinksSettingsTabComponent {
    constructor (
        public config: ConfigService,
    ) { }
}
