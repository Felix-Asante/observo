import assert from 'node:assert/strict'
import { describe, it, mock } from 'node:test'

import { ObservoClient } from '../dist/client.js'

function createMockTransport(send = async () => undefined) {
  return { send: mock.fn(send) }
}

describe('ObservoClient', () => {
  it('requires apiKey and baseUrl', () => {
    assert.throws(
      () =>
        new ObservoClient({
          apiKey: '',
          baseUrl: 'http://localhost/api/v1',
        }),
      /apiKey/,
    )
    assert.throws(
      () =>
        new ObservoClient({
          apiKey: 'obs_test',
          baseUrl: '',
        }),
      /baseUrl/,
    )
  })

  it('flushes when flushAt is reached', async () => {
    const transport = createMockTransport()
    const client = new ObservoClient(
      {
        apiKey: 'obs_test',
        baseUrl: 'http://example.test/api/v1',
        flushAt: 2,
        flushIntervalMs: 60_000,
      },
      transport,
    )

    client.info('one')
    assert.equal(transport.send.mock.callCount(), 0)
    client.info('two')
    await client.flush()

    assert.equal(transport.send.mock.callCount(), 1)
    const [, body] = transport.send.mock.calls[0].arguments
    assert.equal(body.logs.length, 2)
    assert.equal(body.logs[0].message, 'one')
  })

  it('retries retryable failures then succeeds', async () => {
    let attempts = 0
    const transport = createMockTransport(async () => {
      attempts += 1
      if (attempts < 3) {
        const error = new Error('temporary')
        error.retryable = true
        throw error
      }
    })

    const client = new ObservoClient(
      {
        apiKey: 'obs_test',
        baseUrl: 'http://example.test/api/v1',
        flushAt: 1,
        maxRetries: 3,
        retryBaseDelayMs: 1,
      },
      transport,
    )

    client.info('retry-me')
    await client.flush()
    assert.equal(attempts, 3)
  })

  it('drops oldest when the queue overflows', async () => {
    const transport = createMockTransport(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    const errors = []
    const client = new ObservoClient(
      {
        apiKey: 'obs_test',
        baseUrl: 'http://example.test/api/v1',
        flushAt: 100,
        flushIntervalMs: 60_000,
        maxQueueSize: 2,
        overflow: 'drop-oldest',
        onError: (_err, ctx) => errors.push(ctx),
      },
      transport,
    )

    client.info('a')
    client.info('b')
    client.info('c')

    assert.equal(client.pendingCount, 2)
    assert.ok(client.dropped >= 1)
    assert.ok(errors.some((e) => e.dropped))

    await client.close()
  })

  it('stops accepting events after close', async () => {
    const transport = createMockTransport()
    const client = new ObservoClient(
      {
        apiKey: 'obs_test',
        baseUrl: 'http://example.test/api/v1',
        flushAt: 10,
      },
      transport,
    )

    client.info('before')
    await client.close()
    client.info('after')

    assert.equal(client.dropped, 1)
    assert.equal(client.pendingCount, 0)
  })

  it('applies default appName and environment', async () => {
    const transport = createMockTransport()
    const client = new ObservoClient(
      {
        apiKey: 'obs_test',
        baseUrl: 'http://example.test/api/v1',
        flushAt: 1,
        appName: 'billing',
        environment: 'staging',
      },
      transport,
    )

    client.info('hi')
    await client.flush()

    const [, body] = transport.send.mock.calls[0].arguments
    assert.equal(body.logs[0].app_name, 'billing')
    assert.equal(body.logs[0].environment, 'staging')
  })
})
