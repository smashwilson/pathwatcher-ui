/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {CompositeDisposable} from 'atom'

import WatchBannerComponent from './watch-banner-component'
import attrs from './attrs'

const URI_PREFIX = 'atom://fs-trace/event-panel/at/'

export default class EventPanel {
  static opener (uri) {
    if (uri.startsWith(URI_PREFIX)) {
      const rootPath = decodeURIComponent(uri.substring(URI_PREFIX.length))
      return new EventPanel({rootPath, active: true})
    }
  }

  static open (rootPath) {
    const uri = `${URI_PREFIX}${encodeURIComponent(rootPath)}`
    return atom.workspace.open(uri, {searchAllPanes: true})
  }

  constructor (props, children) {
    this.subs = new CompositeDisposable()
    this.active = false

    this.activate = this.activate.bind(this)
    this.deactivate = this.deactivate.bind(this)
    this.assign(props)

    etch.initialize(this)
  }

  getTitle () {
    return 'Filesystem Events'
  }

  render () {
    return (
      <div>
        <WatchBannerComponent
          rootPath={this.rootPath}
          active={this.active}
          didActivate={this.activate}
          didDeactivate={this.deactivate}
        />
      </div>
    )
  }

  async destroy () {
    await etch.destroy(this)
    this.subs.dispose()
  }

  activate () {
    this.active = true
    return etch.update(this)
  }

  deactivate () {
    this.active = false
    return etch.update(this)
  }
}

attrs(EventPanel.prototype, {update: true}, [
  'rootPath'
])
