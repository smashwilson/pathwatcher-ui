/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import attrs from './attrs'

import EventComponent from './event-component'

export default class EventListComponent {
  constructor (props) {
    this.assign(props)
    etch.initialize(this)
  }

  render () {
    return (
      <ul className='pathwatcher-event-list list-group'>
        {this.events.map(event => {
          return <EventComponent key={event.key} event={event} />
        })}
      </ul>
    )
  }

  update (newProps) {
    this.assign(newProps)
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
  }
}

attrs(EventListComponent.prototype, {update: false}, ['events'])
