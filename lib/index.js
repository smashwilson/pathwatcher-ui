/** @babel */

import {CompositeDisposable} from 'atom'
import EventPanel from './event-panel'

export default {
  subs: null,

  activate (state) {
    this.subs = new CompositeDisposable()

    this.subs.add(atom.workspace.addOpener(EventPanel.opener))
    this.subs.add(atom.commands.add('atom-workspace', {
      'pathwatcher-ui:watch-directory': this.watchDirectory
    }))
  },

  deactivate () {
    this.subs.dispose()
  },

  serialize () {
    return {}
  },

  watchDirectory () {
    atom.pickFolder(folders => {
      for (const folder of folders) {
        EventPanel.open(folder)
      }
    })
  }

}
