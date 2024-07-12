class EmitEvents {
  constructor() {
    this.events = {}; // 事件容器
  }

  // 监听
  on(eventName, callBack) {
    this.removeType(eventName);
    this.events[eventName] = callBack;
  }

  // 触发
  emit(eventName, params) {
    if (this.events[eventName]) {
      this.events[eventName](params);
    }
  }

  removeType(eventName) {
    // 移除
    if (this.events[eventName]) {
      delete this.events[eventName];
    }
  }
}

export const singleEmitEvents = new EmitEvents();
// 注意: 有多个页面共用一个事件时, 需要按页面路由进行事件隔离
