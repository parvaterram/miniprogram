const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const dateFormat = (date, format = 'yyyy-MM-dd hh:mm:ss') => {
  date = new Date(date * 1000)
  const map = {
    'M': date.getMonth() + 1,
    'd': date.getDate(),
    'h': date.getHours(),
    'm': date.getMinutes(),
    's': date.getSeconds(),
    'q': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  format = format.replace(/([yMdhmsqS])+/g, function (n, i) {
    let v = map[i]
    if (v !== undefined) {
      if (n.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (i === 'y') {
      return (date.getFullYear() + '').substr(4 - n.length)
    }
    return n
  })
  return format
}

module.exports = {
  formatTime: formatTime,
  dateFormat: dateFormat
}
