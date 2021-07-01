import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'

import { ClickableLinksSettingsTabComponent } from './components/clickableLinksSettingsTab.component'

@Injectable()
export class ClickableLinksSettingsTabProvider extends SettingsTabProvider {
    id = 'clickable-links'
    icon = 'hand-pointer'
    title = 'Clickable Links'

    getComponentType (): any {
        return ClickableLinksSettingsTabComponent
    }
}
