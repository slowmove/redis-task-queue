const utils = require("../../src/helpers/utils");

describe("utils", () => {
  let jsonData;
  let stringData;

  beforeEach(() => {
    jsonData = { name: "hej", mock: true };
    stringData = JSON.stringify({ name: "hej", mock: true });
  });
  describe("storeData", () => {
    it("should return stringified data if received json", () => {
      expect(typeof utils.storeObject(jsonData) === "string").toBeTruthy();
    });
    it("should return stringied data if received string", () => {

      expect(typeof stringData === "string").toBeTruthy();
    });
    it("should append id if not existing in the object", () => {
      expect(jsonData.id).not.toBeDefined();
      expect(JSON.parse(stringData).id).not.toBeDefined();
      const jsonBase = utils.storeObject(jsonData);
      expect(JSON.parse(jsonBase).id).toBeDefined();
      const stringBase = utils.storeObject(stringData);
      expect(JSON.parse(stringBase).id).toBeDefined();
    });
    it("should not touch the id if already exists", () => {
      const dataContainingId = jsonData;
      dataContainingId.id = "123";
      const storeData = utils.storeObject(dataContainingId);
      expect(JSON.parse(storeData).id).toEqual(dataContainingId.id);
    });
  });
});
