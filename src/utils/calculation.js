
/*
*** one:第一个数
*** two:第二个数
*** decimal:小数点后几位
四舍五入
*/

// 无法获取计算精度，已废弃，使用src\utils\instructions.js 里的方法

// 两数相加
function add(one, two, decimal) {
  const num = Number(one) + Number(two)
  if (typeof decimal !== 'number') {
    return num
  }
  return num.toFixed(decimal)
}
// 两数相减
function subtract(one, two, decimal) {
  const num = Number(one) - Number(two)
  if (typeof decimal !== 'number') {
    return num
  }
  return num.toFixed(decimal)
}
// 两数相乘
function multiply(one, two, decimal) {
  const num = Number(one) * Number(two)
  if (typeof decimal !== 'number') {
    return num
  }
  return num.toFixed(decimal)
}
// 两数相除
function divide(one, two, decimal) {
  const num = Number(one) / Number(two)
  if (typeof decimal !== 'number') {
    return num
  }
  return num.toFixed(decimal)
}

export const calculation = {
  add,
  subtract,
  multiply,
  divide
}