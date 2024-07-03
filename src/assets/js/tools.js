
// 年月日星期时分秒转换
export const getyearData = (timestamp) => {
  var now = new Date();
  var day = now.getDay();
  var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
  var week = weeks[day];
  if (typeof(timestamp) == 'undefined') {
    return ''
  } else {
    let date = new Date(parseInt(timestamp))
    let y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? ('0' + MM) : MM
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let m = date.getMinutes()
    m = m < 10 ? ('0' + m) : m
    let s = date.getSeconds()
    s = s < 10 ? ('0' + s) : s
    // return y + '年' + MM + '月' + d + '日' + '   ' + week + ' ' + h + ':' + m + ':' + s
    return y + '-' + MM + '-' + d
  }
}


export const Storage = {
  // ===============localStorage设置缓存==================
  localSet: function(_name, _data) {
    localStorage.removeItem(_name)
    localStorage.setItem(_name, JSON.stringify(_data))
  },
  localGet: function(_name) {
    return localStorage.getItem(_name)
  },
  localRemove: function(_name) {
    localStorage.removeItem(_name)
  },

  // ===============sessionStorage设置缓存==================
  sessionSet: function(_name, _data) {
    sessionStorage.removeItem(_name)
    sessionStorage.setItem(_name, JSON.stringify(_data))
  },

  sessionGet: function(_name) {
    return sessionStorage.getItem(_name)
  },

  sessionRemove: function(_name) {
    sessionStorage.removeItem(_name)
  },
}

export function debounce(func, wait=300, immediate=false) {
  let timer = null
  return function anonymous(...params) {
    let now = immediate && !timer;
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null;
      !immediate ? func.call(this, ...params) : null
    }, wait);
    now ? func.call(this, ...params) : null
  }
}


