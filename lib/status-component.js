/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class StatusComponent {
  constructor (props) {
    this.props = props

    etch.initialize(this)
  }

  render () {
    return (
      <div className='pathwatcher-registry'>
        <h2 className='pathwatcher-dashboard-header'>Status</h2>
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
