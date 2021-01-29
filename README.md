# memo
Caches function output with separated cache for each input signature

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#License)

## Installation

```npm i @tyimarques/memo```

## Usage
```js
import memo from "@tyimarques/memo";
const callback = () => true;
const memoizedCallback = memo(callback);
memoizedCallback() //not cached
memoizedCallback() //cached

const evenAnotherMemoizedCallback = memo(callback, { duration: 100 })
evenAnotherMemoizedCallback() // not cached
evenAnotherMemoizedCallback() // cached
setTimeout(() => {
    evenAnotherMemoizedCallback() // not cached
}, 100)

const anotherCallback = (first, second, thrid) => first + second + third
const anotherMemoizedCallback = memo(anotherCallback)
anotherMemoizedCallback(1, 2, 3) // 6, not cached
anotherMemoizedCallback(1, 2, 3) // 6, cached
anotherMemoizedCallback(2, 2, 3) // 7, not cached
```

## License
[MIT](license)
