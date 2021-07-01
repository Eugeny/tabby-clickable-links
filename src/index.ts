import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ToastrModule } from 'ngx-toastr'
import { ConfigProvider } from 'tabby-core'
import { TerminalDecorator } from 'tabby-terminal'
import { SettingsTabProvider } from 'tabby-settings'

import { LinkHandler } from './api'
import { UnixFileHandler, WindowsFileHandler, URLHandler, IPHandler } from './handlers'
import { LinkHighlighterDecorator } from './decorator'
import { ClickableLinksConfigProvider } from './config'
import { ClickableLinksSettingsTabComponent } from './components/clickableLinksSettingsTab.component'
import { ClickableLinksSettingsTabProvider } from './settings'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ToastrModule,
    ],
    providers: [
        { provide: LinkHandler, useClass: URLHandler, multi: true },
        { provide: LinkHandler, useClass: IPHandler, multi: true },
        { provide: LinkHandler, useClass: UnixFileHandler, multi: true },
        { provide: LinkHandler, useClass: WindowsFileHandler, multi: true },
        { provide: TerminalDecorator, useClass: LinkHighlighterDecorator, multi: true },
        { provide: ConfigProvider, useClass: ClickableLinksConfigProvider, multi: true },
        { provide: SettingsTabProvider, useClass: ClickableLinksSettingsTabProvider, multi: true },
    ],
    entryComponents: [
        ClickableLinksSettingsTabComponent,
    ],
    declarations: [
        ClickableLinksSettingsTabComponent,
    ],
})
export default class LinkHighlighterModule { }

export * from './api'
