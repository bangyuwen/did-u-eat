module.exports = function(menuName) {
  if (!menuName) return `你在說什麼！聽不懂！`
  return `請給我${menuName}的菜單`;
}
