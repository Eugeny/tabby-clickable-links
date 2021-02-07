import { Inject, Injectable } from '@angular/core'
import { ConfigService, ElectronService } from 'terminus-core'
import { TerminalDecorator, TerminalTabComponent } from 'terminus-terminal'

import { LinkHandler } from './api'

@Injectable()
export class LinkHighlighterDecorator extends TerminalDecorator {
    constructor (
        private config: ConfigService,
        private electron: ElectronService,
        @Inject(LinkHandler) private handlers: LinkHandler[],
    ) {
        super()
    }

    attach (tab: TerminalTabComponent): void {
        if (!(tab.frontend as any).xterm) {
            // not hterm
            return
        }

        for (let handler of this.handlers) {
            const getLink = async uri => handler.convert(uri, tab)
            const openLink = async uri => handler.handle(await getLink(uri), tab)

            ;(tab.frontend as any).xterm.registerLinkMatcher(
                handler.regex,
                (event: MouseEvent, uri: string) => {
                    if (!this.willHandleEvent(event)) {
                        return
                    }
                    openLink(uri)
                },
                {
                    priority: handler.priority,
                    validationCallback: async (uri: string, callback: (isValid: boolean) => void) => {
                        callback(await handler.verify(await handler.convert(uri, tab), tab))
                    },
                    willLinkActivate: (event: MouseEvent, uri: string) => {
                        if (event.button === 2) {
                            this.electron.Menu.buildFromTemplate([
                                {
                                    click: () => openLink(uri),
                                    label: 'Open',
                                },
                                {
                                    click: async () => {
                                        this.electron.clipboard.writeText(await getLink(uri))
                                    },
                                    label: 'Copy',
                                },
                            ]).popup()
                            return false
                        }
                        return this.willHandleEvent(event)
                    },
                }
            )
        }
    }

    private willHandleEvent (event: MouseEvent) {
        const modifier = this.config.store.clickableLinks.modifier
        return !modifier || event[modifier]
    }
}
