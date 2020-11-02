# Memoria
Caches function output with separated cache for each input signature

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#License)

## Installation

<pre>npm i memoria</pre>

## Usage
```js
import Memoria from "memoria";
const callback = () => true;
const callbackMemoized = new Memoria(callback);
callbackMemoized();
callbackMemoized();//cached result
```
## License
[MIT](license)
