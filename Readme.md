Redis Task Queue
===

Simplest possible implementation to put, pop and bury jobs with Redis as backend.

## Install

`npm install redis-task-queue`

Requires a Redis instance to connect to.

## Usage

### Client

```js
const RedisTaskQueue = require("redis-task-queue");

const payload = {
  lorem: "sit",
  ipsum: "amet",
  dolor: "..."
};

const redisTaskQueue = new RedisTaskQueue();
const jobId = await redisTaskQueue.add({ data: payload });
```

### Worker

```js
const RedisTaskQueue = require("redis-task-queue");

const redisTaskQueue = new RedisTaskQueue();
let currentJob = null;
while (true) {
  currentJob = await redisTaskQueue.get();
  if (!currentJob) continue;
  console.log("Fetched job", currentJob);
  // do some job
  currentJob = null;
}
```

### Methods

**These are generic methods, by default using the default queue set up**

- `add({ queue?, data })` returns **id**
- `get(queue?)` returns the **payload**
- `has(queue?)` returns the **amount of items** in the defined queue
- `list(queue?)` returns **all the items and their payload** in the defined queue

**These are aliases for the standard failed queue**

- `bury({ queue?, data })`
- `getBuried(queue?)`
- `hasBuried(queue?)`
- `listBuried(queue?)`

**Generic methods**

- `getStatus(jobId)` returns the status, whether active, buried or completed.
