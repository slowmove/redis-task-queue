const { v4: uuidv4 } = require("uuid");

const storeObject = (data) => {
  const obj = jsonData(data);
  if (obj.id) return strData(obj);
  obj.id = uuidv4();
  return strData(obj);
};

const strData = (data) => {
  return typeof data === "object" ? JSON.stringify(data) : data;
};

const jsonData = (data) => {
  return typeof data === "object" ? data : JSON.parse(data);
};

module.exports = {
  storeObject,
  strData,
  jsonData,
};
