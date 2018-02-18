/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class LoggingComponent {
  constructor (props) {
    this.props = props

    etch.initialize(this)
  }

  render () {
    return (
      <div className='pathwatcher-registry'>
        <h2 className='pathwatcher-dashboard-header'>Logs</h2>
      </div>
    )
  }

  update (newProps) {
    return etch.update(this)
  }

  destroy () {
    return etch.destroy(this)
  }
}
