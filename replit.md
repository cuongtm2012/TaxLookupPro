# VietQR Tax ID Lookup Chrome Extension

## Overview

This is a Chrome browser extension that allows users to look up Vietnamese company information using tax IDs through the VietQR API. The extension provides a simple popup interface where users can enter multiple tax codes separated by semicolons and retrieve company details. It features local storage for user convenience, loading animations, and error handling for a smooth user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application**: Built with vanilla HTML, CSS, and JavaScript without any frontend frameworks
- **Popup Interface**: Chrome extension popup pattern with a 400px fixed width container
- **Event-Driven Architecture**: Uses JavaScript classes and event listeners for user interactions
- **Responsive Design**: Clean, modern UI with CSS flexbox and system fonts

### Extension Structure
- **Manifest V3**: Modern Chrome extension architecture with proper permissions and security policies
- **Action Popup**: Extension icon triggers a popup window for user interaction
- **Content Security Policy**: Strict CSP preventing inline scripts and external resources
- **Icon Support**: SVG icons in multiple sizes (16px, 32px, 48px, 128px)

### Data Management
- **Chrome Storage API**: Local storage for persisting user input between sessions
- **Form Validation**: Client-side validation for tax ID input format
- **State Management**: Simple JavaScript class-based state management without external libraries

### API Integration
- **VietQR API**: External REST API integration for Vietnamese business data lookup
- **HTTP Client**: Native fetch API for making HTTP requests
- **Error Handling**: Comprehensive error handling for network failures and API responses
- **Loading States**: UI feedback with spinners and disabled states during API calls

### Security Considerations
- **Host Permissions**: Restricted to specific VietQR API domain
- **Storage Permissions**: Limited to local storage for user preferences
- **CSP Policy**: Prevents code injection and ensures secure execution context

## External Dependencies

### APIs
- **VietQR API (api.vietqr.io)**: Primary service for Vietnamese business tax ID lookups and company information retrieval

### Browser APIs
- **Chrome Extension APIs**: Storage API for data persistence, Action API for popup management
- **Web APIs**: Fetch API for HTTP requests, DOM APIs for user interface manipulation

### Runtime Environment
- **Chrome Browser**: Target platform with Manifest V3 support
- **JavaScript ES6+**: Modern JavaScript features including classes, async/await, and arrow functions