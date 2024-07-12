<template>
  <div>
    <template v-if="fieldItem.type && disabled">
      <TooltipOver
        :content="handleShow()"
        :style="{ width: '100%' }"
        refName="tooltipOverTit"
      />
    </template>
    <template v-else>
      <el-input
        ref="singleRef"
        v-if="fieldItem.type === 'text'"
        v-model="formData[fieldItem.id]"
        size="mini"
        :placeholder="fieldItem.placeholder"
        :maxlength="fieldItem.maxlength || 50"
        :disabled="fieldItem.disabled"
        @change="handleChange($event, fieldItem.id)"
        @input.native="handleInput($event, fieldItem)"
        @compositionstart.native="handleCompositionStart($event)"
        @compositionend.native="handleCompositionEnd($event)"
      ></el-input>
      <el-input-number
        ref="singleRef"
        v-if="fieldItem.type === 'inputNumber'"
        v-model="formData[fieldItem.id]"
        :max="
          fieldItem.maxNumKey
            ? minMaxNumber(formData[fieldItem.maxNumKey], 'max')
            : fieldItem.max
        "
        :min="
          fieldItem.minNumKey
            ? minMaxNumber(formData[fieldItem.minNumKey])
            : fieldItem.min || 0
        "
        :controls="false"
        :placeholder="fieldItem.placeholder"
        v-input-number-limit="{
          value: fieldItem.decimal, // 几位小数限制
          maxNumber: fieldItem.maxNumber, // 最大值限制
        }"
        :precision="fieldItem.decimal"
        :maxlength="fieldItem.maxlength || 11"
        size="mini"
        :disabled="fieldItem.disabled"
        @change="handleChange($event, fieldItem.id)"
      />
      <el-select
        ref="singleRef"
        v-if="fieldItem.type === 'select'"
        v-model="formData[fieldItem.id]"
        :placeholder="fieldItem.placeholder"
        size="mini"
        :disabled="fieldItem.disabled"
        @change="handleChange($event, fieldItem.id)"
      >
        <template
          v-for="item in dictionary.dicsData[fieldItem.basicType] ||
          fieldItem.options ||
          []"
        >
          <el-option
            v-if="
              !fieldItem.hideList ||
              !fieldItem.hideList.includes(Number(item.value))
            "
            :key="Number(item.value)"
            :label="item.nameCn"
            :value="Number(item.value)"
          >
          </el-option>
        </template>
      </el-select>
      <template v-if="fieldItem.type === 'autocomplete'">
        <AutoComplete
          ref="singleRef"
          class="form-class"
          :formModel="formData"
          :fieldItem="{
            id: fieldItem.id,
            ...fieldItem,
            size: 'mini',
          }"
          :additionalParam="fieldItem.additionalParam"
          :disabled="fieldItem.disabled"
          @selectHandleChange="(val) => handleChange(val, fieldItem.id)"
        />
      </template>
      <el-date-picker
        v-if="
          [
            'month',
            'date',
            'datetimerange',
            'daterange',
            'monthrange',
            'datetime',
          ].includes(fieldItem.type)
        "
        ref="singleRef"
        :type="fieldItem.type"
        v-model="formData[fieldItem.id]"
        :placeholder="fieldItem.placeholder"
        range-separator="-"
        :start-placeholder="fieldItem.startPlaceholder || '开始日期'"
        :end-placeholder="fieldItem.endPlaceholder || '结束日期'"
        :value-format="fieldItem.valueFormat"
        :picker-options="fieldItem.pickerOptions || {}"
        :disabled="fieldItem.disabled"
        size="mini"
        @change="
          (formData) => {
            fieldItem.handleTimeChange && fieldItem.handleTimeChange(formData);
            handleChange(formData, fieldItem.id);
          }
        "
      />
    </template>
  </div>
</template>

<script>
import { isNumberStr } from "@/utils/index";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    fieldItem: {
      type: Object,
      default: () => ({}),
    },
    dictionary: {
      type: Object,
      default: () => ({
        dicsData: {},
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  methods: {
    handleFocus() {
      if (this.fieldItem.type === "autocomplete") {
        this.$refs.singleRef.$refs.selectSearch.focus();
      } else {
        this.$refs.singleRef.focus();
      }
    },
    handleChange(e, type) {
      this.$emit("handleChange", e, type, this.formData);
    },
    handleInput(e, fieldItem) {
      if (!fieldItem.inputLimit || e.target.composing) return;
      const val = e.target.value || "";
      this.formData[fieldItem.id] = val.replace(fieldItem.inputLimit, "");
    },
    handleCompositionStart(e) {
      e.target.composing = true;
    },
    handleCompositionEnd(e) {
      e.target.composing = false;
      if (navigator.userAgent.indexOf("Chrome") > -1) {
        this.handleInput(e, this.fieldItem);
      }
    },
    minMaxNumber(val, type) {
      if (isNumberStr(val)) {
        return Number(val);
      }
      if (type === "max") {
        return Infinity; // 无穷大
      }
      return 0;
    },
    handleShow() {
      const { render, basicType, id, decimal } = this.fieldItem;
      if (render) {
        return render(this.formData);
      }

      return basicType
        ? this.colDictParams(this.fieldItem, this.formData) || "--"
        : decimal || decimal === 0
        ? this.toFixedNum(this.formData[id], decimal)
        : this.formData[id] || "--";
    },
    colDictParams(col, row, isObj) {
      const { [col.basicType]: dictColArr = [] } = this.dictionary.dicsData;
      const dictObj =
        dictColArr.find((e) => row[col.basicTypeVal || col.id] == e.value) ||
        {};
      if (isObj) {
        return dictObj;
      }
      // 不能给默认值，会影响有些render函数的显示
      return dictObj.nameCn;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }
  .el-tooltip {
    width: 100%;
  }
}
</style>
