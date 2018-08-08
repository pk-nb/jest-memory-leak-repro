This repo serves as a memory issue reproduction against Jest 23.4.2. From these examples we can
isolate the memory leaks to the require/module implementation that Jest provides to isolate test
environments.

Big thanks to @lev-kazakov for https://github.com/lev-kazakov/jest-leak-fixer which was the original test suite and attempt to track down.

We have 4 examples to highlight the issue. The main issue seems to stem from imports that have a closure over other imports:

```js
// sourceThatLeaks.js

const https = require('https');

let originalHttpsRequest = https.request

https.request = (options, cb) => {
  return originalHttpsRequest.call(https, options, cb);
};

// If this is uncommented, the leak goes away!
// originalHttpsRequest = null
```

This issue appears in both JSDOM and node environments, so I don't think it's a window= issue with JSDOM. Jasmine, as it simply uses the default require without any mocking mechanism, does not have the require performance overhead or leak. Jest-babel is not used here so while that package may contribute to running out of memory more quickly, it is not the leak.



You can run each suite in different modes with the following commands:

```
# First suite
jest:00:jsdom
jest:00:jsdom:debug
jest:00:node
jest:00:node:debug
jasmine:00

# Second suite (you can see the leak as memory starts climbing)
jest:01:jsdom
jest:01:jsdom:debug
jest:01:node
jest:01:node:debug
jasmine:01

# Third suite (no leak with the = null for gc)
jest:02:jsdom
jest:02:jsdom:debug
jest:02:node
jest:02:node:debug
jasmine:02

# Fourth suite (large enough to run out of heap space with default node on a 32gb macbook pro)
# Slows down ~1300MB and crashes around ~1400MB.
jest:03:jsdom
jest:03:jsdom:debug
jest:03:node
jest:03:node:debug
jasmine:03
```

With the debug commands you can run memory profiling with the chrome devtools by going to `chrome://inspect` and opening the dedicated devtools > memory.
