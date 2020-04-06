// 解决按照输入框无法失去焦点
const originHeight = document.documentElement.clientHeight || document.body.clientHeight
window.addEventListener('resize', () => {
  const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
  if (resizeHeight < originHeight) {
    // console.log('键盘弹起')
  } else {
    // console.log('键盘收起')
    const el = document.getElementsByClassName('add-input')
    Array.from(el, (item) => item.blur())
  }
}, false)
