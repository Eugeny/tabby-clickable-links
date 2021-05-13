import * as fs from 'fs/promises'
import * as path from 'path'
import * as untildify from 'untildify'
import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { ElectronService } from 'terminus-core'
import { BaseTerminalTabComponent } from 'terminus-terminal'

import { LinkHandler } from './api'

@Injectable()
export class URLHandler extends LinkHandler {
    // From https://daringfireball.net/2010/07/improved_regex_for_matching_urls
    // See : https://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript
    regex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?«»“”‘’]))/

    priority = 5

    constructor (private electron: ElectronService) {
        super()
    }

    handle (uri: string) {
        this.electron.shell.openExternal(uri)
    }
}

export class BaseFileHandler extends LinkHandler {
    constructor (
        protected toastr: ToastrService,
        protected electron: ElectronService,
    ) {
        super()
    }

    handle (uri: string) {
        this.electron.shell.openExternal('file://' + uri).catch(err => {
            this.toastr.error(err.toString())
        })
    }

    async verify (uri: string): Promise<boolean> {
        try {
            await fs.access(uri)
            return true
        } catch {
            return false
        }
    }

    async convert (uri: string, tab?: BaseTerminalTabComponent): Promise<string> {
        let p = untildify(uri)
        if (!path.isAbsolute(p) && tab) {
            const cwd = await tab.session?.getWorkingDirectory()
            if (cwd) {
                p = path.resolve(cwd, p)
            }
        }
        return p
    }
}

@Injectable()
export class UnixFileHandler extends BaseFileHandler {
    // Only absolute and home paths
    regex = /[~]?(\/[\w\d.~-]{1,100})+/

    constructor (
        protected toastr: ToastrService,
        protected electron: ElectronService,
    ) {
        super(toastr, electron)
    }
}


@Injectable()
export class WindowsFileHandler extends BaseFileHandler {
    regex = /(([a-zA-Z]:|\\|~)\\[\w\-()\\\.]{1,1024}|"([a-zA-Z]:|\\)\\[\w\s\-()\\\.]{1,1024}")/

    constructor (
        protected toastr: ToastrService,
        protected electron: ElectronService,
    ) {
        super(toastr, electron)
    }

    convert (uri: string, tab?: BaseTerminalTabComponent): Promise<string> {
        const sanitizedUri = uri.replace(/"/g, '')
        return super.convert(sanitizedUri, tab)
    }
}
