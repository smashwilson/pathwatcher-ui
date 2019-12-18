/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

/*
{
  "pendingCallbackCount": 2,
  "channelCallbackCount": 1,
  "workerThreadState": "running",
  "workerThreadOk": "ok",
  "workerInSize": 0,
  "workerInOk": "ok",
  "workerOutSize": 0,
  "workerOutOk": "ok",
  "workerSubscriptionCount": 1,
  "workerRenameBufferSize": 0,
  "workerRecentFileCacheSize": 4096,
  "pollingThreadState": "stopped",
  "pollingThreadOk": "ok",
  "pollingInSize": 0,
  "pollingInOk": "ok",
  "pollingOutSize": 0,
  "pollingOutOk": "ok",
  "pollingRootCount": 0,
  "pollingEntryCount": 0
}*/

export default class StatusComponent {
  constructor (props) {
    this.props = props

    etch.initialize(this)
  }

  render () {
    return (
      <div className='pathwatcher-registry'>
        <h2 className='pathwatcher-dashboard-header'>Status</h2>

        <div className='pathwatcher-status-section'>
          <h3 className='pathwatcher-status-header'>Event loop thread</h3>
          {this.renderCountEntry('pendingCallbackCount', 'Pending callback count')}
          {this.renderCountEntry('channelCallbackCount', 'Channel callback count')}
        </div>

        <div className='pathwatcher-status-section'>
          <h3 className='pathwatcher-status-header'>Worker thread</h3>
        </div>

        <div className='pathwatcher-status-section'>
          <h3 className='pathwatcher-status-header'>Polling thread</h3>
        </div>
      </div>
    )
  }

  renderCountEntry (statusKey, displayKey) {
    return (
      <p className='pathwatcher-status-entry'>
        <span className='pathwatcher-status-key'>{displayKey}</span>
        <span className='pathwatcher-status-value'>{this.props.status[key]}</span>
      </p>
    )
  }

  renderThreadStateEntry (statusKey, displayKey) {
    return (
      <p className='pathwatcher-status-entry'>
        <span className='pathwatcher-status-key'>{displayKey}</span>
        <span className='pathwatcher-status-value'>{this.props.status[key]}</span>
      </p>
    )
  }

  renderErrableEntry (statusKey, displayKey) {
    return (
      <p className='pathwatcher-status-entry'>
        <span className='pathwatcher-status-key'>{displayKey}</span>
        <span className='pathwatcher-status-value'>{this.props.status[key]}</span>
      </p>
    )
  }

  update (newProps) {
    return etch.update(this)
  }

  destroy () {
    return etch.destroy(this)
  }
}
