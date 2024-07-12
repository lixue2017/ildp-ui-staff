import { typeConversion } from '@/utils/index'

// import { MAX_PRODUCT_LWH } from "@/utils/instructions.js"

//最大输入数值
export const MAX_PRODUCT_LWH = 9999.9 // 产品长宽高，单位：CM
export const MAX_PRODUCT_NUM = 9999 // 产品箱数
export const MAX_SKU_NUM = 999999; // sku
export const MAX_NUM_SIZE_2 = 9999.99; // 产品长宽高-两位小数
export const MAX_FCL_NUM = 99; // 整柜数量
export const MAX_BOX_WEIGHT = 99999.99 // 单件重量
export const MAX_BOX_VOLUME = 999999.99 // 单件体积
export const MAX_MONEY_NUM = 9999999999 // 金额

//最小输入数值
export const MIN_PRODUCT_NUM = 1// 产品箱数

/**
 * 限制输入框只能输入n位小数
 */
export const inputLimt = {
  bind(el, binding = {}) {
    const { value } = binding
    if (value === null || value === undefined) {
      return
    }
    const target = el instanceof HTMLInputElement ? el : el.querySelector("input");
    target.addEventListener("keyup", e => {
      let val = e.target.value ? e.target.value.toString() : ''
      if (Number(val) != val) {
        val = val.slice(0, -1)
        val = val.replace(/[^\d^\.]+/g, '')
      } else {
        const decLen = typeof value === 'number' ? value : value.value
        // 小数点 - 长度限制
        if (typeof decLen !== 'undefined' && val) {
          const valArr = val.split('.')
          if (decLen === 0) {
            val = valArr[0]
          } else if (valArr[1] && valArr[1].length > decLen) {
            val = valArr[0] + '.' + valArr[1].substr(0, decLen)
          }
        }
      }
      const max_num = value.maxNumber ? typeConversion(value.maxNumber, 'number') : MAX_MONEY_NUM
      // const max_num = 9999999999
      // 最大值限制
      if (val > max_num) {
        val = max_num
      }
      e.target.value = val
      if (value && value.FnLimt && typeof value.FnLimt === 'function') {
        // 不能在此转Number类型，否则无法输入小数点
        value.FnLimt(val)
      }
    })

    target.addEventListener("blur", e => {
      const val = e.target.value
      let nVal = val === '' ? '' : Number(val)
      // 最小值限制
      const min_num = value.minNumber ? typeConversion(value.minNumber, 'number') : 0
      if (nVal < min_num) {
        nVal = min_num
      }
      e.target.value = nVal
      if (value && value.FnLimt && typeof value.FnLimt === 'function') {
        value.FnLimt(nVal)
      }
    })
  }
}


/**
 * 不要写 type="number"
 * 限制几位小数 v-input-limit="2" 这种写法输出的是字符串类型，需要转成数字类型
 * v-input-limit="{
 *  value: 2,
 *  FnLimt: (val) => { $refs && $refs.dialogFormRef.setFormModel({ takeFreightNum: val }) }
 * }"
 * <el-input
      v-model="value"
      v-input-limit="2"
    />
 */


/**
 * 配合 el-input-number 限制输入框只能输入n位小数
 * <el-input-number v-model="num" :controls="false" v-input-number-limit="2"
    @change="handleNumberChange" :min="1" :max="10" :precision="2"></el-input-number>
    handleNumberChange(value) {
      console.log(value);
    }
 */
export const inputNumberLimt = {
  bind(el, binding = {}) {
    const { value } = binding
    if (value === null || value === undefined) {
      return
    }
    const target = el instanceof HTMLInputElement ? el : el.querySelector("input");
    target.addEventListener("input", e => {
      let val = e.target.value ? e.target.value.toString() : ''
			val = val.replace(/\,|\，/g, ''); // 复制时过滤千分符
      if (Number(val) != val && val !== '-') {
        val = val.slice(0, -1)
        val = val.replace(/[^\-?\d^\.]+/g, '')
      } else {
        const decLen = typeof value === 'number' ? value : value.value
        // 小数点 - 长度限制
        if (typeof decLen !== 'undefined' && val) {
          const valArr = val.split('.')
          if (decLen === 0) {
            val = valArr[0]
          } else if (valArr[1] && valArr[1].length > decLen) {
            val = valArr[0] + '.' + valArr[1].substr(0, decLen)
          }
        }
      }
      const max_num = value.maxNumber ? typeConversion(value.maxNumber, 'number') : MAX_MONEY_NUM
      // 最大值限制
      if (val > max_num) {
        val = max_num
      }
      const min_num = -9999999999.99
      // 最小值限制
      if (val < min_num) {
        val = min_num
      }
      e.target.value = val; // 不能在此转Number类型，否则无法输入小数点
    })
  }
}

// 大于0的最小值限制
export const minLimitNumber = (decLen = 0, num = 0) => {
	const multiplePow = Math.pow(10, (decLen || 0));
	const min_num = 1 / multiplePow;
	if (num < min_num) {
		return min_num;
	}
	return num;
};

// import { toFixedNum } from '@/utils/instructions'

export const toNewFixed = (num, digit = 2) => {
  const multiplePow = Math.pow(10, digit); // 多乘一位防止相乘后有小数点导致精度丢失，如：17.865
  return Math.round((num * (multiplePow * 10)) / 10) / multiplePow;
  // return Math.round(+num + 'e' + digit) / multiplePow
};

export const toFixedNum = (num, len = 2, str = "--") => {
  if ((num || num === 0) && !isNaN(num)) {
    return toNewFixed(num, len).toFixed(len); // toFixed 四舍五入有问题 用只于补0，如25.615.toFixed(2)='25.61'
  }
  return num || str;
};

// 数值截取
export const interceptNum = (num, decLen = 3, str = '--') => {
  if ((num || num === 0) && !isNaN(num)) {
    let strNum = num.toString();
    const numArr = strNum.split('.')
    if (decLen === 0) {
      strNum = numArr[0];
    } else if (numArr[1] && numArr[1].length > decLen) {
      strNum = numArr[0] + '.' + numArr[1].substr(0, decLen)
    }
    return Number(strNum);
  }
  return num || str;
}

// 列表中多个数值计算
export function countListKeyFn(arr, obj) {
  const {
    countKeys = [],
    decimal,
    countMethod = "accumulationFn", // 默认相加
    countObj = {},
  } = obj || {};
  arr.forEach((e) => {
    countKeys.forEach((ele) => {
      if (!countObj[ele]) {
        countObj[ele] = [];
      }
      countObj[ele].push(e[ele]);
    });
  });
	let newObj = {};
	const methodName = {
		accumulationFn
	}
  countKeys.forEach((ele) => {
    newObj[ele] = methodName[countMethod](countObj[ele] || [], decimal);
  });
  return newObj;
}


// 相乘
export function multiplicationFn(mulArr = [], decimal, showType = 'number') {
  let decLen = 0; // 相乘数的小数点总长度
  let tNum = 1; // 相乘后的总数
  mulArr.forEach(ele => {
    const valArr = (ele || 0).toString().split('.');
    decLen += valArr[1] ? valArr[1].length : 0;
    tNum = tNum * valArr.join(''); // 转换成整数
  })
  const multiplePow = Math.pow(10, decLen)
  tNum = tNum / multiplePow
  if (decimal || decimal === 0) {
    return showType === 'string' ? toFixedNum(tNum, decimal) : toNewFixed(tNum, decimal)
  }
  return Number(tNum)
}

// 多个数值相除
export function beDividedFn(divideArr = [], decimal, showType = 'number') {
	if (divideArr.some(e => !e)) {
		return ''; // 除数或被除数为0或无值时返回空
	}

	let sNum = divideArr.splice(0, 1)[0] || 0; // 被除数，初始值为数组的第一个值
	const divisorNum = divideArr.length > 1 ? multiplicationFn(divideArr) : divideArr[0]; // 除数

	const nDivideArr = [sNum, divisorNum]

	const decimalArr = nDivideArr.map(n => {
    const valArr = (n || 0).toString().split('.');
    return valArr[1] ? valArr[1].length : 0;
  })
  // 获取最大的小数点长度
  const maxDecimal = Math.max.apply(null, decimalArr);
  const subPow = Math.pow(10, maxDecimal);

	sNum = Math.round(sNum * subPow);
	sNum = sNum / Math.round(divisorNum * subPow);

	if (decimal || decimal === 0) {
    return showType === 'string' ? toFixedNum(sNum, decimal) : toNewFixed(sNum, decimal)
  }

  return Number(sNum)
}

// 相除 - 除以10的倍数（换算用）
export function dividedFn(dividend, divisor, decimal) {
  let nDecLen = divisor || 0; // 除数- 10的次方数，如除1则为0，除10则为1
  const valArr = (dividend || 0).toString().split('.'); // 被除数转成整数
  nDecLen += valArr[1] ? valArr[1].length : 0;
  const dividePow = Math.pow(10, nDecLen);
  let dNum = valArr.join('') / dividePow;
  if (decimal || decimal === 0) {
		return toFixedNum(dNum, decimal)
  }
  return Number(dNum)
}

// 相加
export function accumulationFn(addArr = [], decimal) {
  let tNum = 0; // 相加后的总数
  if (!addArr.length) {
    return tNum;
  }
  const decimalArr = addArr.map(n => {
    const valArr = (n || 0).toString().split('.');
    return valArr[1] ? valArr[1].length : 0;
  })
  // 获取最大的小数点长度
  const maxDecimal = Math.max.apply(null, decimalArr);
  const addPow = Math.pow(10, maxDecimal);
  addArr.forEach(ele => {
    tNum += Math.round((ele || 0) * addPow);
  })
  tNum = tNum / addPow;
  if (decimal || decimal === 0) {
    return toFixedNum(tNum, decimal) // 不与后台交互，仅作页面显示用，如小计数据
  }
  return Number(tNum)
}


// 相减
export function subtractFn(subArr = [], decimal) {
  const decimalArr = subArr.map(n => {
    const valArr = (n || 0).toString().split('.');
    return valArr[1] ? valArr[1].length : 0;
  })
  // 获取最大的小数点长度
  const maxDecimal = Math.max.apply(null, decimalArr);
  const subPow = Math.pow(10, maxDecimal);

  let sNum = subArr.splice(0, 1)[0] || 0; // 相减的数，初始值为数组的第一个值

  sNum = Math.round(sNum * subPow);

  subArr.forEach(ele => {
    sNum -= Math.round((ele || 0) * subPow);
  })

  sNum = sNum / subPow;
  if (decimal || decimal === 0) {
    return toFixedNum(sNum, decimal)
  }
  return Number(sNum)
}

// 数字转英文大写

function toBits(num) {
  const numbers = [
    "ZERO",
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
    "SIX",
    "SEVEN",
    "EIGHT",
    "NINE",
    "TEN",
    "ELEVEN",
    "TWELVE",
    "THIRTEEN",
    "FOURTEEN",
    "FIFTEEN",
    "SIXTEEN",
    "SEVENTEEN",
    "EIGHTEEN",
    "NINETEEN",
  ];
  return numbers[num];
}
function toTen(num) {
  if (num < 20) {
    return toBits(num);
  }
  const tenNum = {
    2: "TWENTY",
    3: "THIRTY",
    4: "forty",
    5: "FIFTY",
    6: "SIXTY",
    7: "SEVENTY",
    8: "EIGHTY",
    9: "NINETY",
  };
  const remainder = num % 10;
  const except = parseInt(num / 10);
  return remainder
    ? `${tenNum[except]}-${toBits(remainder)}`
    : tenNum[except];
}
function toHundreds(num, notAnd = true) {
  if (num < 100) {
    return `${notAnd ? "AND " : ""}${toTen(num)}`;
  }
  const remainder = num % 100;
  const except = parseInt(num / 100);
  return remainder
    ? `${toBits(except)} HUNDRED AND ${toTen(remainder)}`
    : `${toBits(except)} HUNDRED`;
}
export function numberCnToEn(num) {
  if (num < 1000) {
    return toHundreds(num, false);
  }
  const units = ["THOUSAND", "MILLION", "BILLION", "TRILLION"];
  const remainder = num % 1000;
  const except = parseInt(num / 1000);
  let text = remainder ? toHundreds(remainder) : "";
  let newExcept = except;
  units.forEach((unit) => {
    if (newExcept % 1000) {
      text = `${toHundreds(newExcept % 1000, false)} ${unit} ${text}`;
    }
    newExcept = parseInt(newExcept / 1000);
    if (!newExcept) return;
  });
  return text;
}


/**
 * 比较删除、添加的数组
 * 新旧数组位置变换，就是删除与添加
 * 第一个参数是原数组为新增
 * 第一个参数是新数组为删除
 */
export const deleteOrAddArr = (nArr, oldArr, key) => {
  return oldArr.filter(
    (e) => key !== undefined ? !(nArr.some(ele => ele[key] === e[key])) : !nArr.includes(e)
  );
}


