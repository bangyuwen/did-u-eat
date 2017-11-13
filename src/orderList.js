// store the orders in Object as name order pair
const store = {};

exports.pushNewOrder = (message) => {
  const newOrderList = message.split('\n');
  newOrderList.forEach((val) => {
    const [name, order] = val.split(/:|：/);
    store[name] = order;
  });
};

exports.getOrderList = () => {
  const res = Object.keys(store).map(key => `${key}：${store[key]}`);
  return res.sort().join('\n') || '';
};

exports.deleteOrder = (user) => {
  delete store[user];
};
