const arith = {
  split(number) {
    number = number.toString()
    const index = number.indexOf('.')
    return index > -1 ? [number.substr(0, index), number.substr(index + 1)] : [number]
  },
  getDecimalLen (arr) {
    return arr.length < 2 ? 0 : arr[1].length
  },
  getMaxDecimalLen (l, r) {
    return Math.max(this.getDecimalLen(l), this.getDecimalLen(r))
  },
  _mul (arr, f) {
    if (!arr[1]) {
      return arr[0] * Math.pow(10, f)
    }
    const decimal = arr[1] + '0000000000'
    const newNumber = arr[0] + decimal.substr(0, f)
    return Number(newNumber)
  },
  add (l, r) {  // 加
    const arrL = this.split(l)
    const arrR = this.split(r)
    const f = this.getMaxDecimalLen(arrL, arrR)
    return f === 0 ? l + r : (this._mul(arrL, f) + this._mul(arrR, f)) / Math.pow(10, f)
  },
  sub (l, r) {  // 减
    const arrL = this.split(l)
    const arrR = this.split(r)
    const f = this.getMaxDecimalLen(arrL, arrR)
    return f === 0 ? l - r : (this._mul(arrL, f) - this._mul(arrR, f)) / Math.pow(10, f)
  },
  mul (l, r) {  // 乘
    const arrL = this.split(l)
    const arrR = this.split(r)
    const f = this.getMaxDecimalLen(arrL, arrR)
    const commonMultiple = Math.pow(10, f)
    return f === 0 ? l * r : this._mul(arrL, f) * this._mul(arrR, f) / (commonMultiple * commonMultiple)
  },
  div (l, r) {  // 除
    const arrL = this.split(l)
    const arrR = this.split(r)
    const f = this.getMaxDecimalLen(arrL, arrR)
    return f === 0 ? l / r : this._mul(arrL, f) / this._mul(arrR, f)
  }
}

module.exports = {
  arith: arith
}