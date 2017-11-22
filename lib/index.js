/** @babel */

import {CompositeDisposable} from 'atom'
import EventPanel from './event-panel'
import DashboardPanel from './dashboard-panel'

export default {
  subs: null,

  activate (state) {
    this.subs = new CompositeDisposable()

    this.subs.add(atom.workspace.addOpener(EventPanel.opener))
    this.subs.add(atom.workspace.addOpener(DashboardPanel.opener))

    this.subs.add(atom.commands.add('atom-workspace', {
      'pathwatcher-ui:watch-directory': this.watchDirectory,
      'pathwatcher-ui:open-dashboard': DashboardPanel.open
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
  },

  deserializeEventPanel ({uri}) {
    return EventPanel.opener(uri)
  },

  deserializeDashboardPanel () {
    return DashboardPanel.opener()
  }
}
