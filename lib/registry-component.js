/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {watchPath, CompositeDisposable} from 'atom'
import DOMListener from 'dom-listener'
import path from 'path'
import EventPanel from './event-panel'

const ROOT = process.platform === 'win32' ? '' : '/'

export default class RegistryComponent {
  constructor (props) {
    this.props = props
    this.subs = new CompositeDisposable()

    this.callbackMap = {
      DirectoryNode: this.renderIntermediateNode.bind(this),
      NonrecursiveWatcherNode: this.renderIntermediateNode.bind(this),
      RecursiveWatcherNode: this.renderLeafNode.bind(this)
    }

    etch.initialize(this)

    const listener = new DOMListener(this.element)
    this.subs.add(listener.add('.pathwatcher-leaf', 'click', this.didClickLeaf.bind(this)))
  }

  render () {
    const registry = watchPath.getRegistry()

    return (
      <div className='pathwatcher-registry'>
        <h2 className='pathwatcher-dashboard-header'>Watched paths</h2>

        <ul className='list-tree has-collapsable-children'>
          {this.renderNode(ROOT, [], registry.tree.getRoot())}
        </ul>
      </div>
    )
  }

  renderNode (pathSegment, parentSegments, node) {
    const callback = this.callbackMap[node.constructor.name]
    if (!callback) {
      return (
        <ul className='list-tree'>
          <span className='icon icon-file-directory'>
            {pathSegment}
          </span>

          <li className='icon icon-flame'>
            <span className='icon icon-flame'>
              Unexpected registry node of type {node.constructor.name} encountered
            </span>
          </li>
        </ul>
      )
    }

    return callback(pathSegment, parentSegments, node)
  }

  renderIntermediateNode (pathSegment, parentSegments, node) {
    const collapsedSegments = []
    let current = node
    while (current.constructor.name === 'DirectoryNode' && Object.keys(current.children).length === 1) {
      const segment = Object.keys(current.children)[0]
      collapsedSegments.push(segment)
      current = current.children[segment]
    }
    const inheritedSegments = parentSegments.concat(collapsedSegments)
    const collapsed = path.join(pathSegment, ...collapsedSegments)

    const renderMultipleChildren = () => {
      return (
        <ul className='list-tree'>
          {Object.keys(current.children).map(childPath => {
            return this.renderNode(childPath, inheritedSegments, current.children[childPath])
          })}
        </ul>
      )
    }

    if (current.constructor.name === 'NonrecursiveWatcherNode') {
      return (
        <li className='list-nested-item'>
          <div className='list-item'>
            <span className='icon icon-eye'>
              {collapsed}
            </span>
            <span className='text-subtle'> (non-recursively)</span>
          </div>
          {renderMultipleChildren()}
        </li>
      )
    }

    if (current.constructor.name !== 'DirectoryNode') {
      return this.renderNode(collapsed, inheritedSegments, current)
    }

    return (
      <li className='list-nested-item'>
        <div className='list-item'>
          <span className='icon icon-file-directory'>{collapsed}</span>
        </div>
        {renderMultipleChildren()}
      </li>
    )
  }

  renderLeafNode (pathSegment, parentSegments, node) {
    let fullPath = path.join(...parentSegments)
    if (process.platform !== 'win32') {
      fullPath = ROOT + fullPath
    }

    let text = pathSegment
    const listenerCount = node.nativeWatcher.emitter.listenerCountForEventName('did-change')
    text += ` ${listenerCount} listener${listenerCount !== 1 ? 's' : ''}`
    if (node.adopted.size > 0) {
      text += ` +${node.adopted.size} child paths`
    }

    const attributes = {'data-path': fullPath}

    return (
      <li className='list-item'>
        <span className='icon icon-eye pathwatcher-leaf' attributes={attributes}>{text}</span>
      </li>
    )
  }

  didClickLeaf (event) {
    const fullPath = event.target.getAttribute('data-path')
    EventPanel.open(fullPath)
  }

  update (newProps) {
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
  }
}
