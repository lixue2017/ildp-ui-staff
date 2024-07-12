/*获取鼠标相对于文档的坐标
 *   left: 鼠标点击位置距离文档左侧的距离，包含滚动条
 *   top: 鼠标点击位置距离文档顶端的距离，包含滚动条
 *   right: 鼠标点击位置距离文档右侧的距离，不包含滚动条
 *   bottom: 鼠标点击位置距离文档底端的距离，不包含滚动条
 * */
export function getMousePosition(event) {
  let x = 0,
    y = 0,
    doc = document.documentElement,
    body = document.body;
  if (!event) event = window.event;
  x =
    ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
    ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
  y =
    ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
    ((doc && doc.clientTop) || (body && body.clientTop) || 0);

  x += event.clientX;
  y += event.clientY;

  let right = doc.clientWidth - event.clientX;
  let bottom = doc.clientHeight - event.clientY;

  return { left: x, top: y, right, bottom };
}
