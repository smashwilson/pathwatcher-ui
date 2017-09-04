/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {CompositeDisposable, Disposable, watchPath} from 'atom'

import WatchBannerComponent from './watch-banner-component'
import EventListComponent from './event-list-component'
import attrs from './attrs'

const URI_PREFIX = 'atom://fs-trace/event-panel/at/'

const INACTIVE = Symbol('inactive')
const STARTING = Symbol('starting')
const STOPPING = Symbol('stopping')
const ACTIVE = Symbol('active')

const EVENTS = 5000

export default class EventPanel {
  static opener (uri) {
    if (uri.startsWith(URI_PREFIX)) {
      const rootPath = decodeURIComponent(uri.substring(URI_PREFIX.length))
      return new EventPanel({rootPath, uri, active: true})
    }
  }

  static open (rootPath) {
    const uri = `${URI_PREFIX}${encodeURIComponent(rootPath)}`
    return atom.workspace.open(uri, {searchAllPanes: true})
  }

  constructor (props, children) {
    this.subs = new CompositeDisposable()
    this.watcherSub = new Disposable(() => {})

    this.uri = props.uri

    this.state = INACTIVE
    this.events = []

    this.activate = this.activate.bind(this)
    this.deactivate = this.deactivate.bind(this)
    this.assign(props)

    etch.initialize(this)

    this.activate()
  }

  getTitle () {
    return `Events within ${this.rootPath}`
  }

  render () {
    return (
      <div>
        <WatchBannerComponent
          rootPath={this.rootPath}
          active={this.state === ACTIVE || this.state === STARTING}
          changing={this.state === STARTING || this.state === STOPPING}
          didActivate={this.activate}
          didDeactivate={this.deactivate}
        />
        <EventListComponent
          events={this.events}
        />
      </div>
    )
  }

  async destroy () {
    await etch.destroy(this)
    this.subs.dispose()
  }

  changeState (newState) {
    this.state = newState
    return etch.update(this)
  }

  async activate () {
    if (this.state !== INACTIVE) return
    await this.changeState(STARTING)

    this.watcherSub = await watchPath(this.rootPath, {}, (err, events) => {
      this.acceptEvents(events)
    })
    this.subs.add(this.watcherSub)

    return this.changeState(ACTIVE)
  }

  async deactivate () {
    if (this.state !== ACTIVE) return
    await this.changeState(STOPPING)

    this.watcherSub.dispose()

    await this.changeState(INACTIVE)
    return etch.update(this)
  }

  acceptEvents (events) {
    this.events.push(...events)
    if (this.events.length > EVENTS) {
      this.events.splice(0, this.events.length - EVENTS)
    }
  }
}

attrs(EventPanel.prototype, {update: true}, [
  'rootPath'
])
