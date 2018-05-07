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

  it('should fail with IPv4 URL ends with slash', () => {
    expect(parseProxyRule('http://127.0.0.1:8888/')).toBeNull()
  })

  it('should convert to lowercase with IPv4 hostname and scheme', () => {
    expect(parseProxyRule('SOCKS4://LocalHost')).toEqual({
      scheme: 'socks4',
      host: 'localhost',
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

  it('should fail with IPv6 URL ends with slash', () => {
    expect(parseProxyRule('http://[::1]:8888/')).toBeNull()
  })

  it('should convert to lowercase IPv6 hostname and scheme', () => {
    expect(parseProxyRule('SOCKS5://[2001:DB8:85A3:8D3:1319:8A2E:370:7348]')).toEqual({
      scheme: 'socks5',
      host: '2001:db8:85a3:8d3:1319:8a2e:370:7348',
    })
  })

  const allSchemes = ['http', 'https', 'quic', 'socks4', 'socks5']
  for (const scheme of allSchemes) {
    it(`should success with ${scheme} scheme`, () => {
      expect(parseProxyRule(`${scheme}://127.0.0.1`)).not.toBeNull()
    })
  }

  it('should fail with unsupported scheme', () => {
    expect(parseProxyRule('unknown://127.0.0.1')).toBeNull()
  })
})
