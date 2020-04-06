let arr = [
  [1],
  [1, 2, 3],
  [1, [2, 3]]
]
// 自带flat方法
// console.log(arr.flat(Infinity))

// console.log(arr.toString().split(',').map(item => Number(item)))

// console.log(JSON.stringify(arr).replace(/\[\]/g, '').split(',').map(item => Number(item)))

// concat可以展开一层，一直展开到数组里面没有数组
// while (arr.some(item => Array.isArray(item))) {
//   arr = [].concat(...arr)
// }

// 递归判断
Array.prototype.myFlat = function () {
  let result = [];
  let _this = this;
  function _flat(arr) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i]
      if (Array.isArray(item)) {
        _flat(item)
      } else {
        result.push(item)
      }
    }
  }
  _flat(_this)
  return result
}

function flatten (arr) {
  return [].concat(
    ...arr.map(x => 
      Array.isArray(x) ? flatten(x) : x
    )
  )
}
