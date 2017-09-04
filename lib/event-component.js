/** @babel */
/** @jsx etch.dom */

import path from 'path'

import etch from 'etch'
import attrs from './attrs'
import cx from 'classnames'

const ACTION_ICONS = {
  created: 'icon-diff-added',
  modified: 'icon-diff-modified',
  deleted: 'icon-diff-removed',
  renamed: 'icon-diff-renamed'
}

const ACTION_STATUS = {
  created: 'status-added',
  modified: 'status-modified',
  deleted: 'status-removed',
  renamed: 'status-renamed'
}

const KIND_ICONS = {
  directory: 'icon-file-directory',
  file: 'icon-file',
  unknown: 'icon-question'
}

export default class EventComponent {
  constructor (props) {
    this.assign(props)
    etch.initialize(this)
  }

  render () {
    const actionIcon = ACTION_ICONS[this.event.action]
    const actionStatus = ACTION_STATUS[this.event.action]
    const kindIcon = KIND_ICONS[this.event.kind] || KIND_ICONS.unknown

    return (
      <li className='list-item pathwatcher-event'>
        <i className={cx('icon', actionIcon, actionStatus, 'pathwatcher-action-icon')} />
        <span className={cx('pathwatcher-action', this.event.action, actionStatus)}>{this.event.action}</span>
        <i className={cx('icon', kindIcon, 'pathwatcher-kind-icon')} />
        {this.renderOldPath()}
        <span className='pathwatcher-dirname'>{path.dirname(this.event.path)}/</span>
        <span className='pathwatcher-basename'>{path.basename(this.event.path)}</span>
      </li>
    )
  }

  renderOldPath () {
    if (!this.event.oldPath) return null

    return (
      <div>
        <span className='pathwatcher-dirname'>{path.dirname(this.event.oldPath)}</span>
        <span className='pathwatcher-basename'>{path.basename(this.event.oldPath)}</span>
        <i className='icon icon-move-right' />
      </div>
    )
  }

  async destroy () {
    await etch.destroy(this)
    this.subs.dispose()
  }
}

attrs(EventComponent.prototype, {update: true}, ['event'])
