import * as fs from 'fs'
const untildify = require('untildify')
import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { ElectronService } from 'terminus-core'

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

@Injectable()
export class UnixFileHandler extends LinkHandler {
    // Only absolute and home paths
    regex = /(\/|~)+(\.|)[\w\/-]+(\.[\w]+|)/

    constructor (
        private toastr: ToastrService,
        private electron: ElectronService,
    ) {
        super()
    }

    convert (uri: string): string {
        return untildify(uri)
    }

    handle (uri: string) {
        if (!fs.existsSync(uri)) {
            this.toastr.error('This path does not exist')
            return
        }
        this.electron.shell.openExternal('file://' + uri)
    }
}


@Injectable()
export class WindowsFileHandler extends LinkHandler {
    // Only absolute and home paths
    regex = /(([a-zA-Z]:|\\|~)\\[\w\-()\\\.]+|"([a-zA-Z]:|\\)\\[\w\s\-()\\\.]+")/

    constructor (
        private toastr: ToastrService,
        private electron: ElectronService,
    ) {
        super()
    }

    convert (uri: string): string {
        const sanitizedUri = uri.replace(/"/g, '')
        return untildify(sanitizedUri)
    }

    handle (uri: string) {
        if (!fs.existsSync(uri)) {
            this.toastr.error('This path does not exist')
            return
        }
        this.electron.shell.openExternal('file://' + uri)
    }
}
