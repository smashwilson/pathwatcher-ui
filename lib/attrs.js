/** @babel */

import etch from 'etch'

export default function (proto, options, attrNames) {
  proto.assign = function (newProps) {
    let changed = false

    for (const attr of attrNames) {
      if (this[attr] !== newProps[attr]) {
        changed = true
        this[attr] = newProps[attr]
      }
    }

    return changed
  }

  if (options.update) {
    proto.update = function (newProps) {
      if (this.assign(newProps)) {
        return etch.update(this)
      }
    }
  }
}
