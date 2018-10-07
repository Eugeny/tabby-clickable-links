import * as fs from 'fs'
const untildify = require('untildify')
import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { ElectronService } from 'terminus-core'

import { LinkHandler } from './api'

@Injectable()
export class URLHandler extends LinkHandler {
    regex = 'http(s)?://[^\\s;\'"]+[^,;\\s]'

    constructor (private electron: ElectronService) {
        super()
    }

    handle (uri: string) {
        this.electron.shell.openExternal(uri)
    }
}

@Injectable()
export class UnixFileHandler extends LinkHandler {
    regex = '[~/][^\\s,;\'"]+'

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
    regex = '\\w:[^\\s,;/\'"]+'

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
