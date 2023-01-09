const _ = require('lodash')
const crypto = require('node:crypto')

module.exports = {
  /* eslint-disable promise/param-names */
  createDeferred () {
    let result, resolve, reject
    return {
      resolve: function (value) {
        if (resolve) {
          resolve(value)
        } else {
          result = result || new Promise(function (r) { r(value) })
        }
      },
      reject: function (reason) {
        if (reject) {
          reject(reason)
        } else {
          result = result || new Promise(function (x, j) { j(reason) })
        }
      },
      promise: new Promise(function (r, j) {
        if (result) {
          r(result)
        } else {
          resolve = r
          reject = j
        }
      })
    }
  },
  /**
   * Decode a tree path
   *
   * @param {string} str String to decode
   * @returns Decoded tree path
   */
  decodeTreePath (str) {
    return str.replaceAll('_', '-').replaceAll('.', '/')
  },
  /**
   * Encode a tree path
   *
   * @param {string} str String to encode
   * @returns Encoded tree path
   */
  encodeTreePath (str) {
    return str?.toLowerCase()?.replaceAll('-', '_')?.replaceAll('/', '.') || ''
  },
  /**
   * Generate SHA-1 Hash of a string
   *
   * @param {string} str String to hash
   * @returns Hashed string
   */
  generateHash (str) {
    return crypto.createHash('sha1').update(str).digest('hex')
  },
  /**
   * Get default value of type
   *
   * @param {any} type primitive type name
   * @returns Default value
   */
  getTypeDefaultValue (type) {
    switch (type.toLowerCase()) {
      case 'string':
        return ''
      case 'number':
        return 0
      case 'boolean':
        return false
    }
  },
  parseModuleProps (props) {
    return _.transform(props, (result, value, key) => {
      let defaultValue = ''
      if (_.isPlainObject(value)) {
        defaultValue = !_.isNil(value.default) ? value.default : this.getTypeDefaultValue(value.type)
      } else {
        defaultValue = this.getTypeDefaultValue(value)
      }
      _.set(result, key, {
        default: defaultValue,
        type: (value.type || value).toLowerCase(),
        title: value.title || _.startCase(key),
        hint: value.hint || '',
        enum: value.enum || false,
        enumDisplay: value.enumDisplay || 'select',
        multiline: value.multiline || false,
        sensitive: value.sensitive || false,
        icon: value.icon || 'rename',
        order: value.order || 100
      })
      return result
    }, {})
  }
}
