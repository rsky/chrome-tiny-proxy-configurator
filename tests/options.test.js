import { handlePACScript, handleFixedServers, parseProxyRule } from '../src/options'

describe('parseProxyRule', () => {
  it('should success with IPv4 hostname', () => {
    expect(parseProxyRule('127.0.0.1')).toEqual({
      host: '127.0.0.1',
    })
  })

  it('should success with IPv4 hostname and port', () => {
    expect(parseProxyRule('127.0.0.1:8888')).toEqual({
      host: '127.0.0.1',
      port: 8888,
    })
  })

  it('should success with IPv4 hostname and scheme', () => {
    expect(parseProxyRule('quic://127.0.0.1')).toEqual({
      scheme: 'quic',
      host: '127.0.0.1',
    })
  })

  it('should success with IPv4 hostname, scheme and port', () => {
    expect(parseProxyRule('https://127.0.0.1:8443')).toEqual({
      scheme: 'https',
      host: '127.0.0.1',
      port: 8443,
    })
  })

  it('should success with IPv4 URL ends with slash', () => {
    expect(parseProxyRule('http://127.0.0.1:8888/')).toEqual({
      scheme: 'http',
      host: '127.0.0.1',
      port: 8888,
    })
  })

  it('should success with IPv6 hostname', () => {
    expect(parseProxyRule('[::1]')).toEqual({
      host: '::1',
    })
  })

  it('should success with IPv6 hostname and port', () => {
    expect(parseProxyRule('[::1]:8888')).toEqual({
      host: '::1',
      port: 8888,
    })
  })

  it('should success with IPv6 hostname and scheme', () => {
    expect(parseProxyRule('quic://[::1]')).toEqual({
      scheme: 'quic',
      host: '::1',
    })
  })

  it('should success with IPv6 hostname, scheme and port', () => {
    expect(parseProxyRule('https://[::1]:8443')).toEqual({
      scheme: 'https',
      host: '::1',
      port: 8443,
    })
  })

  it('should success with IPv6 URL ends with slash', () => {
    expect(parseProxyRule('http://[::1]:8888/')).toEqual({
      scheme: 'http',
      host: '::1',
      port: 8888,
    })
  })

  it('should fail with unsupported scheme', () => {
    expect(parseProxyRule('unknown://127.0.0.1')).toBeNull()
  })
})
