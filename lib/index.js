/** @babel */

import {CompositeDisposable} from 'atom'
import EventPanel from './event-panel'

export default {
  subs: null,

  activate (state) {
    this.subs = new CompositeDisposable()

    this.subs.add(atom.workspace.addOpener(EventPanel.opener))
    this.subs.add(atom.commands.add('atom-workspace', {
      'fs-trace:events': this.startTrace
    }))
  },

  deactivate () {
    this.subs.dispose()
  },

  serialize () {
    return {}
  },

  startTrace () {
    atom.pickFolder(folders => {
      for (const folder of folders) {
        EventPanel.open(folder)
      }
    })
  }

}
