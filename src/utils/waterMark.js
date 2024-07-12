
let setWatermark = (str1, str2) => {
  let id = '1.23452384164.123412415'
  if (document.getElementById(id)) {
    //如果已经有水印了就先清除掉已经有的水印,否则会出现水印叠加或者水印不跟随窗口变化的情况
    document.body.removeChild(document.getElementById(id))
    document.body.removeChild(document.getElementById(id))
  }

  let can = document.createElement('canvas')
  // 设置canvas画布大小
  can.width = 150
  can.height = 200

  let cans = can.getContext('2d')
  cans.rotate(0 * Math.PI / 180) // 水印旋转角度
  cans.font = '13px PingFang SC'
  cans.fillStyle = '#000000'
  cans.textAlign = 'center'
  cans.textBaseline = 'Middle'
  cans.fillText(str1, can.width / 2, can.height - 22) // 水印在画布的位置x，y轴
  // cans.fillText(str2, can.width / 2, can.height + 22)

  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '-506px'
  div.style.left = '-530px'
  div.style.opacity = '0.05'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = document.documentElement.clientWidth + 600 + 'px'
  div.style.height = document.documentElement.clientHeight + 1200 + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  div.style.transform = 'rotateZ(-30deg)'

  let div2 = document.createElement('div')
  div2.id = id
  div2.style.pointerEvents = 'none'
  div2.style.top = '-632px'
  div2.style.left = '-520px'
  div2.style.opacity = '0.05'
  div2.style.position = 'fixed'
  div2.style.zIndex = '100000'
  div2.style.width = document.documentElement.clientWidth + 600 + 'px'
  div2.style.height = document.documentElement.clientHeight + 1200 + 'px'
  div2.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  div2.style.transform = 'rotateZ(-30deg)'
  document.body.appendChild(div)
  document.body.appendChild(div2)

  return id
}

// 添加水印方法
export const setWaterMark = (str1, str2) => {
  let id = setWatermark(str1, str2)
  if (document.getElementById(id) === null) {
    id = setWatermark(str1, str2)
  }
}

// 移除水印方法
export const removeWatermark = () => {
  let id = '1.23452384164.123412415'
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
}

