/** @babel */

import fs from 'fs'
import { CompositeDisposable } from 'atom'
import modeToPermissions from 'mode-to-permissions'
import chmod from 'chmod'

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable
    this.subscriptions.add(
      atom.commands.add(
        'atom-workspace',
        {
          'readonly:toggle': () => this.toggle()
        }
      )
    )
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  toggle() {
    const buffer = atom.workspace.getActiveTextEditor().buffer
    if (buffer.file) {
      const filepath = buffer.file.path
      fs.stat(filepath, (err, stats) => {
        const modes = modeToPermissions(stats.mode)
        if (modes.write.owner) {
          chmod(filepath, {write: false})
          console.log('File is now readonly!')
        } else {
          chmod(filepath, {write: true})
          console.log('File is no longer readonly!')
        }
      })
    } else {
      console.log('The file needs to be saved first before readonly can be toggled!')
    }
  }
}
