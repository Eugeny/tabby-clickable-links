import { Inject, Injectable } from '@angular/core'
import { TerminalDecorator, TerminalTabComponent } from 'terminus-terminal'

import { LinkHandler } from './api'

@Injectable()
export class LinkHighlighterDecorator extends TerminalDecorator {
    constructor (@Inject(LinkHandler) private handlers: LinkHandler[]) {
        super()
    }

    attach (tab: TerminalTabComponent): void {
        if (!(tab.frontend as any).xterm) {
            // not hterm
            return
        }
        for (let handler of this.handlers) {
            (tab.frontend as any).xterm.registerLinkMatcher(
                handler.regex,
                async (_, uri: string) => {
                    handler.handle(await handler.convert(uri, tab), tab)
                },
                {
                    priority: handler.priority,
                    validationCallback: async (uri: string, callback: (isValid: boolean) => void) => {
                        callback(await handler.verify(await handler.convert(uri, tab), tab))
                    }
                }
            )
        }
    }
}
