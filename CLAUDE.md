# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tiny Proxy Configurator is a Chrome extension (Manifest V3) that provides a simple proxy configuration interface for Google Chrome. The extension is published on the Chrome Web Store.

## Development Commands

### Build
- `npm run build` - Build the extension using esbuild (outputs to `dist/`)
- `npm run build:prod` - Build with minification for production
- `npm run build:watch` - Build with watch mode for development

### Testing & Linting
- `npm test` - Run Jest tests
- `npm run lint` - Lint source files with ESLint (v9 with Flat Config format)

### Packaging
- `npm run package` - Build production version and create a zip file for distribution

## Architecture

### Core Components

The extension consists of four main JavaScript modules in `src/`:

1. **background.js** - Service worker that initializes proxy configuration on startup/install
2. **common.js** - Shared utilities for storage operations, proxy configuration, and badge management
3. **options.js** - Options page logic for configuring proxy settings
4. **popup.js** - Browser action popup for quick enable/disable toggle

### Proxy Configuration Modes

The extension supports five proxy modes (mapped to Chrome's proxy API):
- `direct` - Direct connection (no proxy)
- `autoDetect` - Auto-detect proxy settings
- `pacScriptUrl` / `pacScriptData` - PAC (Proxy Auto-Config) script via URL or inline data
- `fixedServers` - Manual proxy configuration with specific servers for HTTP/HTTPS/FTP
- `system` - Use system proxy settings (default)

### Storage & State

- Uses `chrome.storage.local` (not synced across devices)
- Stores `options` (user configuration) and `enabled` (on/off state)
- Badge text indicates current mode: D=Direct, A=Auto, S=Script, F=Fixed, (empty)=System, off=Disabled

### Proxy Server URL Syntax

Proxy URLs are parsed by `parseProxyRule()` in options.js:
- Format: `[scheme://]host[:port]`
- Supported schemes: http, https, quic, socks4, socks5
- Supports both IPv4 and IPv6 addresses
- IPv6 addresses must be bracketed: `[::1]`
- Examples: `127.0.0.1:8080`, `https://proxy.example.com`, `socks5://[::1]:1080`

### Build System

Uses esbuild to bundle three entry points:
- `src/background.js` → `dist/background.js`
- `src/options.js` → `dist/options.js`
- `src/popup.js` → `dist/popup.js`

The `dist/` directory contains the complete extension with HTML, CSS, images, and manifest.

### Testing

- Tests are in `tests/` directory
- Uses Jest 30.2.0 with esbuild-jest 0.4.0 for transformation
- Jest configuration is in `jest.config.js`
- A custom transformer wrapper (`jest-transformer.js`) is used to bridge esbuild-jest 0.4.0 with Jest 30.2.0
- Requires `jest-environment-jsdom` for DOM-dependent tests
- Currently tests the proxy URL parser (`parseProxyRule`) with various IPv4/IPv6 formats
- Run individual test files: `npm test -- tests/options.test.js`

### Linting

- Uses ESLint 9.39.1 with Flat Config format (eslint.config.js)
- Configuration includes:
  - `eslint:recommended` rules
  - `eslint-plugin-regexp` for regex pattern validation
  - `eslint-plugin-jest` for test file linting
  - Separate configurations for source files, test files, and config files
  - Browser, ES2021, and WebExtensions globals for source files
  - Jest globals for test files
  - Node.js globals for config files
