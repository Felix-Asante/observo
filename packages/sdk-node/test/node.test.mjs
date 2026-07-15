import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { observo } from '../dist/index.js'

describe('@getobservo/node', () => {
  it('exposes init as the primary API', () => {
    assert.equal(typeof observo.init, 'function')
    assert.equal(observo.init, observo.createLogger)
  })
})
