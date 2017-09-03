/** @babel */
/** @jsx etch.dom */

import {CompositeDisposable} from 'atom'
import etch from 'etch'
import DOMListener from 'dom-listener'
import cx from 'classnames'
import attrs from './attrs'

export default class WatchBannerComponent {
  constructor (props) {
    this.subs = new CompositeDisposable()
    this.assign(props)

    etch.initialize(this)

    this.listener = new DOMListener(this.element)

    this.subs.add(this.listener.add('.input-toggle', 'click', this.toggle.bind(this)))
  }

  render () {
    const toggleText = this.active ? 'stop' : 'start'

    return (
      <p className={cx('fstrace-watch-banner', 'block', {'active': this.active})}>
        <span className='fstrace-path'>{this.rootPath}</span>
        <label className='fstrace-toggle input-label float-right'>
          <input className='input-toggle' type='checkbox' checked={this.active} />
          {toggleText}
        </label>
      </p>
    )
  }

  async destroy () {
    await etch.destroy(this)
    this.subs.dispose()
    this.listener.destroy()
  }

  toggle (event) {
    if (event.target.checked) {
      this.didActivate()
    } else {
      this.didDeactivate()
    }
  }
}

attrs(WatchBannerComponent.prototype, {update: true}, [
  'rootPath', 'active', 'didActivate', 'didDeactivate'
])
