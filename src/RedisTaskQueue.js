const Redis = require("ioredis");
const logHelper = require("./helpers/logHelper");
const constants = require("./helpers/constants");
const utils = require("./helpers/utils");

class RedisTaskQueue {
  constructor(options) {
    const defaultConfig = {
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST || "127.0.0.1",
      password: process.env.REDIS_PASSWORD || "",
    };
    const config = options
      ? Object.assign({}, defaultConfig, options)
      : defaultConfig;
    this.redis = new Redis(config);
  }

  async add({ queue = constants.QUEUE.DEFAULT, data }) {
    const obj = utils.storeObject(data);
    const id = await this.redis.lpush(queue, obj);
    if (!id) return;
    const storedId = utils.jsonData(obj).id;
    logHelper.log(`Pushed object ${storedId} onto queue ${queue}`);
    return storedId;
  }

  async get(queue = constants.QUEUE.DEFAULT) {
    const obj = await this.redis.rpop(queue);
    if (!obj) return;
    const data = utils.jsonData(obj);
    logHelper.log(`Popped object ${data.id} out of queue ${queue}`);
    return data;
  }

  async has(queue = constants.QUEUE.DEFAULT) {
    return await this.redis.llen(queue);
  }

  async list(queue = constants.QUEUE.DEFAULT) {
    const items = await this.redis.lrange(queue, 0, -1);
    return items.map((item) => utils.jsonData(item));
  }

  async bury({ queue = constants.QUEUE.FAILED, data }) {
    logHelper.log(`Bury object ${data.id} onto queue ${queue}`);
    return this.add({ queue, data });
  }

  async getBuried(queue = constants.QUEUE.FAILED) {
    const data = await this.get(queue);
    logHelper.log(`Get buried object ${data.id} out of queue ${queue}`);
    return data;
  }

  async hasBuried(queue = constants.QUEUE.FAILED) {
    return this.has(queue);
  }

  async listBuried(queue = constants.QUEUE.FAILED) {
    return this.list(queue);
  }

  async getStatus(jobId) {
    if (!jobId) return;
    const activeJobs = await this.list();
    if (activeJobs && Array.isArray(activeJobs)) {
      const isActive = activeJobs.find((j) => {
        return JSON.parse(j).id === jobId;
      });
      if (isActive) return "active";
    }
    const buriedJobs = await this.listBuried();
    if (buriedJobs && Array.isArray(buriedJobs)) {
      const isBuried = buriedJobs.find((j) => {
        return JSON.parse(j).id === jobId;
      });
      if (isBuried) return "buried";
    }
    return "completed";
  }

  disconnect() {
    this.redis.disconnect();
  }
}
module.exports = RedisTaskQueue;
