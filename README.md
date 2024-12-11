<div align="center">
  <p align="center">
    <div><img alt="Reactlit" src="https://raw.githubusercontent.com/mshafir/reactlit/refs/heads/main/ReactlitwText.png" /></div>
    <em>A faster way to build React apps.</em>
  </p>
  <p align="center">
  <a href="https://www.npmjs.com/package/@reactlit/core">
    <img src="https://img.shields.io/npm/v/%40reactlit%2Fcore?logo=npm" alt="npm version">
  </a>
  <a href="https://github.com/mshafir/reactlit/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  </a>
  <a href="https://github.com/mshafir/reactlit/actions/workflows/main.yml">
    <img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/mshafir/reactlit/main.yml">
  </a>
  <a href="https://github.com/mshafir/reactlit/stargazers">
    <img src="https://img.shields.io/github/stars/mshafir/reactlit.svg" alt="GitHub stars">
  </a>
  <br/>
  <a href="https://reactlit.dev">Explore the docs →</a>
</p>
</div>

<strong>Reactlit</strong> is a headless, procedural UI component for React inspired by [Streamlit](https://streamlit.io/) and modeled after [Observable Framework](https://observablehq.com/platform/framework).

<p align="center">
<img src="https://raw.githubusercontent.com/mshafir/reactlit/refs/heads/main/hello-world-example.png" alt="Hello World Example" width="500">
</p>

## Motivation

By writing your frontend procedurally you can treat your UI as <strong>functions that return data</strong>.
This makes it easier to read and understand what the code is doing. Modern hook-based
React has a lot of complexity: you have to know when to memoize, you have
to follow the rules of hooks and declare their dependencies, you have to jump around in the code between the hooks at the top and the JSX where the data is used. Reactlit aims to to offer a simpler alternative to plain React for many common use cases.

Reactlit can't compete with the flexibility of React, but for many simpler use cases, it offers a higher-level abstraction that can result in code that is simpler and often shorter as well.

## Getting Started

To get started with Reactlit, you can install the core package. We offer a set of pre-built input components in the `@reactlit/vanilla` and `@reactlit/radix` packages, or you can wrap your own components with the `defineView` helper.

```bash
npm install @reactlit/core @reactlit/radix
```

See the [Getting Started](https://reactlit.dev/docs/guides/getting-started) guide for more information.

## Contributing

<strong>Reactlit</strong> is still in the early stages of development and feedback is welcome! If you're interested in contributing, please reach out! Please open an issue or a discussion if you have any questions or feedback.

We're looking for help with the following:

- Documentation
- Examples
- Testing
- More pre-built input packages

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more details.
