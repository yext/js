# Yext JavaScript & TypeScript SDKs (`yext/js`)

**Yext's Official Open‑Source JavaScript & TypeScript SDK Monorepo**

---

## Overview

This repository is a monorepo housing Yext’s JavaScript and TypeScript SDKs—designed to streamline integrations with Yext’s platform. If you're looking to leverage Yext functionalities such as Search, Chat, Pages, Analytics, or Listings in your JavaScript/TypeScript project, you’ve come to the right place.  
([github.com](https://github.com/yext/js?utm_source=chatgpt.com))

---

## Project Structure

```
yext/js/
├── apps/           # Example/demo applications and test sandboxes
├── packages/       # Individual SDKs (e.g., search-core, chat-core, search-headless)
├── scripts/        # Useful tooling for maintenance and development
├── .eslintrc.json
├── .prettierignore
├── LICENSE
├── THIRD-PARTY-NOTICES
├── package.json
├── pnpm-workspace.yaml
├── turbo.json      # Turborepo config for optimized build orchestration
└── README.md       # (This file)
```

---

## Included SDKs

The `packages/` folder contains all modular SDKs, each with their own specific purpose:

- **`search-core`**: Networking layer for the Yext Search API (100% TypeScript; browser + Node.js)  
- **`search-headless`**: UI‑agnostic headless logic for building search frontends; includes React bindings and demo app  
- **`chat-core`**: Core networking library for the Yext Chat API, including AWS Connect integration  
- **`chat-headless`**: Headless library + React bindings for Chat UI functionality  
- *Additional packages may exist and will follow the same modular structure.*

---

## Getting Started

### Prerequisites

- **Node.js** v18 or v20 (as per Yext Pages guidelines)  
- `pnpm` package manager (recommended for workspace handling and Turborepo caching)

### Local Setup

1. Clone this repository:  
   ```bash
   git clone https://github.com/yext/js.git
   cd js
   ```
2. Install dependencies:  
   ```bash
   pnpm install
   ```
3. Run Turborepo commands for building or development:  
   ```bash
   pnpm turbo run build
   pnpm turbo run test
   ```

---

## Usage Examples

Each package typically includes its own `README.md` with usage instructions. For instance:

#### `@yext/search-core`
```js
import { provideCore } from '@yext/search-core';

const core = provideCore({
  apiKey: '<YOUR_API_KEY>',
  experienceKey: '<EXPERIENCE_KEY>',
  locale: 'en',
  experienceVersion: 'PRODUCTION',
});

core.verticalSearch({
  verticalKey: 'FAQs',
  query: 'What is Yext Search?',
})
.then(results => console.log(results))
.catch(err => console.error(err));
```

Be sure to explore each package's folder for similar guidance.

---

## Contributing

Yext welcomes contributions! Here's how to get involved:

1. Fork this repository and create a branch for your feature or fix.
2. Make your changes, run tests (`pnpm turbo run test`), and build (`pnpm turbo run build`).
3. Ensure all relevant linting tools pass.
4. Open a pull request with a clear title, description, and linked issue if applicable.
5. Your work will be reviewed; feedback may be offered to get your changes merged.

---

## License & Third-Party Notices

This project is licensed under the [LICENSE](LICENSE) file. Any third-party dependencies are listed in [THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES).

---

## Summary

- Central **monorepo** for all Yext SDKs (`JavaScript` & `TypeScript`)  
- Structured via `apps/` and `packages/` directories  
- Optimized development workflow using **Turborepo** and `pnpm`  
- Individual README documentation per package  
- Open to community contributions
