# Rereact
A reimplementation of `reactjs` library. **It is made for learning purpose.**

The aim of this library is to simplify the code of `reactjs` library to better understand `react` internals.

It uses diff algorithm (just like react) to update only those dom nodes which needs to be updated.

[Calculator](https://stackblitz.com/edit/js-tigrjk) is an example application which is made using this `rereact` library.

## Supported reactjs features
- React lifecycle methods
- React Reconciliation
- Refs
- Keys
- Api: (findDomNode, cloneElement, createElement)

## How to use

- Install this library using `npm`:
```sh
$ npm install @itsprakash87/rereact
```

- Tell the `jsx` parser to use this library's `createElement` method to parse the `jsx` at the top of the file and then `import` the methods
```sh
/** @jsx createElement */

import { Component, createElement, render } from '@itsprakash87/rereact';

class App extends Component {
    ...
}
```

## Example
- [Calculator](https://stackblitz.com/edit/js-tigrjk)
