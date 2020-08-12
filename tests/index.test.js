const RedisTaskQueue = require("../index");

describe("index", () => {
  const instance = new RedisTaskQueue();
  it("should be instance of a class", () => {
    expect(instance).toBeInstanceOf(RedisTaskQueue);
  });
});
