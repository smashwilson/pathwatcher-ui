/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {CompositeDisposable, Disposable, watchPath} from 'atom'
import RegistryComponent from './registry-component'

const URI = 'atom://fs-trace/dashboard'

export default class DashboardPanel {
  static opener (uri) {
    if (uri === URI) {
      return new DashboardPanel({})
    }
  }

  static open () {
    return atom.workspace.open(URI, {searchAllPanes: true})
  }

  getTitle () {
    return 'watchers'
  }

  getIconName () {
    return 'watch'
  }

  getURI () {
    return URI
  }

  constructor (props) {
    this.props = props
    this.subs = new CompositeDisposable()

    this.subs.add(atom.config.onDidChange('core.fileSystemWatcher', () => this.update({})))

    this.intervalID = setInterval(() => this.update({}), 1000)
    this.subs.add(new Disposable(() => clearInterval(this.intervalID)))

    etch.initialize(this)
  }

  watcherIsAvailable () {
    if (!watchPath) return false
    if (!watchPath.getRegistry) return false
    if (!watchPath.status) return false
    if (!watchPath.configure) return false

    return true
  }

  watcherIsEnabled () {
    const setting = atom.config.get('core.fileSystemWatcher')
    return setting === 'experimental' || setting === 'poll'
  }

  render () {
    if (!this.watcherIsAvailable()) {
      return (
        <div className='pathwatcher-dashboard-panel pathwatcher-unavailable padded'>
          <div className='inset-panel padded'>
            <h1 className='panel-heading icon icon-flame error-messages'>
              Curious, are we?
            </h1>
            <p className='panel-body padded'>
              {"Sorry, but your version of Atom isn't recent enough to use pathwatcher-ui."}
              You need to build the latest version of the <code>aw-watcher</code> branch for
              this package to work correctly.
            </p>
          </div>
        </div>
      )
    }

    if (!this.watcherIsEnabled()) {
      return (
        <div className='pathwatcher-dashboard-panel pathwatcher-unavailable padded'>
          <div className='inset-panel padded'>
            <h1 className='panel-heading icon icon-flame error-messages'>
              Hello there
            </h1>
            <div className='panel-body padded'>
              <p>You need to be using the "experimental" or "poll" watcher implementations to use this package.</p>
              <p>
                <button className='btn btn-lg'>Experimental</button>
                <button className='btn btn-lg'>Polling</button>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className='pathwatcher-dashboard-panel pathwatcher-available padded'>
        <RegistryComponent />
      </div>
    )
  }

  update (newProps) {
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
    this.subs.dispose()
  }

  serialize () {
    return {
      deserializer: 'DashboardPanel'
    }
  }
}
