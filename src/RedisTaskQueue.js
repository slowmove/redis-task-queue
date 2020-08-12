const Redis = require("ioredis");
const logHelper = require("./helpers/logHelper");
const constants = require("./helpers/constants");
const utils = require("./helpers/utils");

class RedisTaskQueue {
  constructor(options) {
    const defaultConfig = {
      port: 6379,
      host: "127.0.0.1",
      password: "",
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
    return this.redis.lrange(queue, 0, -1);
  }

  async bury({ queue = constants.QUEUE.FAILED, data }) {
    logHelper.log(`Bury object ${data.id} onto queue ${queue}`);
    return this.add({ queue, data });
  }

  async getBuried(queue = constants.QUEUE.FAILED) {
    const data = this.get(queue);
    logHelper.log(`Get buried object ${data.id} out of queue ${queue}`);
    return data;
  }

  async hasBuried(queue = constants.QUEUE.FAILED) {
    return this.has(queue);
  }

  async listBuried(queue = constants.QUEUE.FAILED) {
    return this.list(queue);
  }
}
module.exports = RedisTaskQueue;
