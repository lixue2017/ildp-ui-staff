<template>
  <div class="diff-mark-cols">
    <div class="show-overflow-tooltip" v-if="showCurrentVal">
      <span class="label" v-if="label">{{ label }}</span>
      <span :class="['value', label ? 'overstriking' : '']">
        {{ isValJudgment(decimal) && currentVal ? interceptFixed(currentVal) : currentVal }}
        <template v-if="util">{{ util }} </template>
      </span>
      <span
        :class="['diff-mark', getDiffMark(currentVal, verifyVal).mark]"
        v-if="grossTotal && getDiffMark(currentVal, verifyVal).val"
      >
        {{ getDiffMark(currentVal, verifyVal).val }}
      </span>
    </div>
    <div v-show="!grossTotal && (verifyVal || verifyVal === 0)">
			<span :class="{ overstriking: label }" v-if="showVerifyVal">
        {{ isValJudgment(decimal) && verifyVal ? interceptFixed(verifyVal) : verifyVal }}
      </span>
			<span :class="{ overstriking: label }" v-else>
        {{ isValJudgment(decimal) && currentVal ? interceptFixed(currentVal) : currentVal }}
      </span>
      <span
        :class="[
          'diff-mark',
          getDiffMark(currentVal, verifyVal, differenceVal).mark,
        ]"
        v-if="getDiffMark(currentVal, verifyVal, differenceVal).val"
      >
        {{ getDiffMark(currentVal, verifyVal, differenceVal).val }}
      </span>
    </div>
  </div>
</template>

<script>
import { subtractFn } from "@/utils/instructions";

export default {
  props: {
    showCurrentVal: {
      type: Boolean,
      default: true,
    },
    currentVal: {
      type: Number | String,
      default: 0,
    },
    verifyVal: {
      type: Number | String,
      default: 0,
    },
    differenceVal: {
      // 差额
      type: Number | String,
      default: () => null,
    },
    label: {
      type: String,
      default: "",
    },
    util: {
      type: String,
      default: "",
    },
    decimal: {
      type: Number,
      default: 2,
    },
    isNumIntercept: {
      // 是否为截取显示
      type: Boolean,
      default: false,
    },
    showVerifyVal: {
      type: Boolean,
      default: true,
    },
    grossTotal: {
      type: Boolean,
      default: false,
    },
    calculationMethod: {
      // 计算方式 新数据 - 原数据
      type: String,
      default: () => "new-old",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    getDiffMark(oldVal, newVal, diffVal) {
      // let diff =
      //   diffVal || diffVal === 0
      //     ? Number(diffVal)
      //     : subtractFn([newVal, oldVal]);
      let diff = 0;
      if (diffVal || diffVal === 0) {
        diff = Number(diffVal);
      } else {
        diff =
          this.calculationMethod === "old-new"
            ? subtractFn([oldVal, newVal])
            : subtractFn([newVal, oldVal]);
      }
      if (diff > 0) {
        return {
          val: `+${this.interceptFixed(diff)}`,
          mark: "plus-mark",
        };
      } else if (diff < 0) {
        return {
          val: this.interceptFixed(diff),
          mark: "minus-mark",
        };
      }
      return {
        val: 0,
        mark: "minus-mark",
      };
    },
    interceptFixed(num) {
      if (this.isNumIntercept) {
        return this.toFixedNum(
          this.interceptNum(num, this.decimal),
          this.decimal
        );
      }
      return this.toFixedNum(num, this.decimal);
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  color: #8b8b8b;
}
.value {
  color: #515151;
}
.diff-mark {
  padding: 0 7px;
  border-radius: 2px;
  margin-right: 2px;
}
.plus-mark {
  background: rgba(83, 200, 138, 0.1);
  color: #53c88a;
}
.minus-mark {
  background: rgba(255, 103, 103, 0.1);
  color: #ff6767;
}
.overstriking {
  font-size: 15px;
  font-weight: bold;
}
</style>
