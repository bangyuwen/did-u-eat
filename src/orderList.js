const store = {};
exports.pushNewOrder = (message) => {
  console.log('new order start');
  const newOrderList = message.split('\n');
  newOrderList.forEach((val) => {
    const [name, order] = val.split(/:|：/);
    store[name] = order;
  });
  console.log(store, 'new order end');
};

exports.getOrderList = () => {
  console.log('get start');
  const res = Object.keys(store).map(key => `${key}：${store[key]}`);
  console.log(res.sort());
  console.log('get end');
  return res.sort().join('\n');
};

exports.deleteOrder = (user) => {
  delete store[user];
};
