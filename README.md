# Memoize
Caches function output with separated cache for each input signature

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#License)

## Installation

```npm i @tyimarques/memoize```

## Usage
```js
import Memoize from "@tyimarques/memoize";
const callback = () => true;
const callbackMemoized = new Memoize(callback);
callbackMemoized();
callbackMemoized();//cached result
```

## License
[MIT](license)
