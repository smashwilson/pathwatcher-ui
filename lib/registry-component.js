/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {watchPath} from 'atom'
import path from 'path'

const ROOT = process.platform === 'win32' ? '' : '/'

export default class RegistryComponent {
  constructor (props) {
    this.props = props

    this.callbackMap = {
      DirectoryNode: this.renderIntermediateNode.bind(this),
      NonrecursiveWatcherNode: this.renderIntermediateNode.bind(this),
      RecursiveWatcherNode: this.renderLeafNode.bind(this)
    }

    etch.initialize(this)
  }

  render () {
    const registry = watchPath.getRegistry()

    return (
      <div className='pathwatcher-registry'>
        <h2 className='pathwatcher-dashboard-header'>Watched paths</h2>

        <ul className='list-tree has-collapsable-children'>
          {this.renderNode(ROOT, registry.tree.getRoot())}
        </ul>
      </div>
    )
  }

  renderNode (pathSegment, node) {
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

    return callback(pathSegment, node)
  }

  renderIntermediateNode (pathSegment, node) {
    const collapsedSegments = []
    let current = node
    while (current.constructor.name === 'DirectoryNode' && Object.keys(current.children).length === 1) {
      const segment = Object.keys(current.children)[0]
      collapsedSegments.push(segment)
      current = current.children[segment]
    }
    collapsedSegments.unshift(pathSegment)
    const collapsed = path.join(...collapsedSegments)

    const renderMultipleChildren = () => {
      return (
        <ul className='list-tree'>
          {Object.keys(current.children).map(childPath => {
            return this.renderNode(childPath, current.children[childPath])
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
      return this.renderNode(collapsed, current)
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

  renderLeafNode (pathSegment, node) {
    return (
      <li className='list-item'>
        <span className='icon icon-eye'>{pathSegment}</span>
      </li>
    )
  }

  update (newProps) {
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
  }
}
