<template>
  <el-form
    ref="myForm"
    :class="[
      `form-class ${formConfig.searchForm ? 'search-form-class' : ''}`,
      formConfig.className,
    ]"
    :model="formModel"
    :rules="formRules"
    :labelWidth="formConfig.labelWidth || '100%'"
    :size="formConfig.size || 'small'"
    :label-position="formConfig.labelPosition"
    :validate-on-rule-change="false"
    :disabled="disabled"
    @validate="handleValidate"
    @submit.native.prevent
  >
    <div class="form-column-list">
      <template v-for="(list, fieldIndex) in formConfig.lists">
        <div
          :key="`${fieldIndex}_list_${
            list.change_model_key || ''
          }` /* change_model_key用于切换模板 */"
          :class="list.className"
          :style="`${
            list.width
              ? `width: ${list.width}px;`
              : `flex: 1; maxWidth: ${100 / (list.scaleWidth || 1)}%`
          }`"
        >
          <template v-for="(rowList, index) in list.fieldList">
            <div
              v-if="!rowList.disable"
              :key="index"
              :class="[rowList.rowClassName]"
            >
              <slot
                :name="rowList.prop"
                v-if="rowList.title === 'slot'"
                :fieldItem="rowList.titleConfig || undefined"
                :formModel="formModel"
              />
              <div
                :class="`form-title${
                  rowList.titleClass ? rowList.titleClass : ''
                }`"
                v-else-if="rowList.title"
                :key="`${index}_title`"
              >
                {{ rowList.title }}
              </div>
              <el-row
                v-for="(colList, rowIndex) in rowList.rows"
                :gutter="20"
                :key="`${index}_${rowIndex}_row`"
                :class="[rowList.className, colList.colClassName]"
                :style="`${
                  rowList.width
                    ? `width: ${rowList.width}px;float:left;margin-right:4%;`
                    : 'flex: 1;'
                }`"
              >
                <el-col
                  :class="[colList.className || '', fieldItem.className || '']"
                  v-for="(fieldItem, colIndex) in colList.cols"
                  :key="`${rowIndex}_row${colIndex}_col_${
                    fieldItem.colKey || ''
                  }`"
                  :span="
                    [0, 1, 2].includes(fieldItem.residueCol) &&
                    span * fieldItem.residueCol < 24
                      ? 24 - span * fieldItem.residueCol
                      : fieldItem.span || span
                      ? fieldItem.span || span
                      : 24 / colList.cols.length
                  "
                  v-show="
                    fieldItem.colItemHide
                      ? false
                      : !fieldItem.noValueShow || formModel[fieldItem.id]
                  "
                >
                  <el-form-item
                    v-if="
                      visibleAll[fieldItem.id] ||
                      expansion ||
                      formConfig.visibleAll
                    "
                    :label="fieldItem.label"
                    :prop="fieldItem.colItemHide ? undefined : fieldItem.id"
                    :label-width="fieldItem.labelWidth"
                    :class="[
                      fieldItem.type == 'txt' && 'form-item-txt',
                      fieldItem.labelClassName,
                      !['textarea', 'slot'].includes(fieldItem.type) &&
                        'fix-height-32',
                      fieldItem.type === 'customUploadFile' &&
                        'form-item-custom-file',
                      fieldItem.showTag && 'form-item-flex',
                      fieldItem.className,
                    ]"
                  >
                    <template v-if="fieldItem.customLabel" slot="label">
                      <slot
                        :name="`${fieldItem.id}Label`"
                        :fieldItem="fieldItem"
                      >
                      </slot>
                    </template>
                    <template
                      v-if="
                        fieldItem.oneLineTipLabel ||
                        (!fieldItem.noSlotLabel &&
                          overseaLangObj.yu_yan_lang === 'en-us' &&
                          fieldItem.label &&
                          fieldItem.label.length > 16)
                      "
                      slot="label"
                    >
                      <!-- 一行显示 -->
                      <TooltipOver
                        className="txt-rg"
                        :content="fieldItem.label"
                      />
                    </template>
                    <span
                      v-if="fieldItem.type == 'txt'"
                      style="word-wrap: break-word"
                      class="base-flex-align"
                      @click="handleClickSkip(fieldItem)"
                    >
                      <TooltipOver
                        :class="fieldItem.isSkip && 'skip-click'"
                        :textLineClamp="fieldItem.textLineClamp"
                        :showMoreTextBtn="fieldItem.showMoreTextBtn"
                        :labelTip="fieldItem.label"
                        :numDecimal="fieldItem.decimal || fieldItem.numDecimal"
                        :content="
                          fieldItem.render
                            ? fieldItem.render(
                                formModel,
                                dicsListName(
                                  dicsListParams(
                                    fieldItem.basicType,
                                    formModel,
                                    fieldItem.basicTypeVal || fieldItem.id
                                  )
                                )
                              )
                            : fieldItem.basicType
                            ? dicsListName(
                                dicsListParams(
                                  fieldItem.basicType,
                                  formModel,
                                  fieldItem.basicTypeVal || fieldItem.id
                                )
                              )
                            : fieldItem.customDicsArr
                            ? slotDicsList(fieldItem, formModel).nameCn || '--'
                            : formModel[fieldItem.id]
                        "
                        :colsObjKey="colList.colsObjKey"
                        :fieldItem="fieldItem"
                        :formModel="formModel"
                        :style="{
                          maxWidth: fieldItem.tipWidth
                            ? fieldItem.tipWidth
                            : '100%',
                        }"
                      />
                      <i
                        v-if="fieldItem.txtCopy"
                        class="txt-copy el-icon-document-copy"
                        @click="
                          handleCopyText(
                            fieldItem.render
                              ? fieldItem.render(
                                  formModel,
                                  dicsListName(
                                    dicsListParams(
                                      fieldItem.basicType,
                                      formModel,
                                      fieldItem.basicTypeVal || fieldItem.id
                                    )
                                  )
                                )
                              : fieldItem.basicType
                              ? dicsListName(
                                  dicsListParams(
                                    fieldItem.basicType,
                                    formModel,
                                    fieldItem.basicTypeVal || fieldItem.id
                                  )
                                )
                              : fieldItem.customDicsArr
                              ? slotDicsList(fieldItem, formModel).nameCn ||
                                '--'
                              : formModel[fieldItem.id]
                          )
                        "
                      ></i>
                    </span>
                    <el-input
                      id="input"
                      v-if="fieldItem.type === 'text'"
                      :type="fieldItem.inputType || 'text'"
                      v-model="formModel[fieldItem.id]"
                      :placeholder="
                        overseaLangObj.yu_yan_lang === 'en-us'
                          ? 'Please input'
                          : fieldItem.placeholder
                      "
                      :disabled="disableAll[fieldItem.id]"
                      :maxlength="fieldItem.maxlength || 50"
                      clearable
                      :class="fieldItem.inputType === 'number' && 'figure-type'"
                      @keyup.native="
                        formatNum(
                          $event,
                          fieldItem.inputType,
                          fieldItem.id,
                          fieldItem.decimal
                        )
                      "
                      @keydown.native="inputLimit($event, fieldItem.inputType)"
                      @keyup.enter.native="enterSubmit"
                      @change="
                        (val) => {
                          changeUppercase(fieldItem, val.trim());
                          handleChange(val.trim(), fieldItem.id);
                        }
                      "
                    >
                      <template slot="append" v-if="fieldItem.unit">
                        {{ fieldItem.unit }}
                      </template>
                    </el-input>

                    <el-input-number
                      v-if="fieldItem.type == 'number'"
                      v-model="formModel[fieldItem.id]"
                      :controls-position="fieldItem.postition || 'right'"
                      :min="fieldItem.min"
                      :max="fieldItem.max"
                    ></el-input-number>

                    <div
                      v-if="fieldItem.type == 'inputNumber'"
                      :class="[
                        'base-flex-between',
                        (fieldItem.unit || fieldItem.unitKey) &&
                          'input-unit-number',
                        fieldItem.selectKey && 'number-right-select',
                      ]"
                    >
                      <el-input-number
                        v-model="formModel[fieldItem.id]"
                        v-input-number-limit="{
                          value: fieldItem.numDecimal || 0, // 几位小数限制
                          maxNumber: fieldItem.maxNumber, // 最大值限制
                        }"
                        :max="
                          fieldItem.maxNumKey
                            ? minMaxNumber(
                                formModel[fieldItem.maxNumKey],
                                'max'
                              )
                            : fieldItem.max
                        "
                        :min="
                          fieldItem.minNumKey
                            ? minMaxNumber(formModel[fieldItem.minNumKey])
                            : fieldItem.min || 0
                        "
                        :precision="fieldItem.precision"
                        :controls="fieldItem.controls || false"
                        :controls-position="fieldItem.postition || 'right'"
                        :placeholder="fieldItem.placeholder"
                        :disabled="fieldItem.disable"
                        @change="(val) => handleChange(val, fieldItem.id)"
                        @keyup.enter.native="enterSubmit"
                      />

                      <el-select
                        v-if="fieldItem.selectKey"
                        v-model="formModel[fieldItem.selectKey]"
                        :disabled="fieldItem.selectDisabled"
                        :placeholder="fieldItem.selectPlaceholder"
                      >
                        <el-option
                          v-for="(sCItem, sCIndex) in formConfig.selectList ||
                          []"
                          :key="sCIndex"
                          :label="sCItem.label"
                          :value="sCItem.value"
                        ></el-option>
                      </el-select>

                      <span
                        v-if="fieldItem.unit || fieldItem.unitKey"
                        style="min-width: 39px; text-align: right"
                      >
                        {{
                          formModel[fieldItem.unitKey] || fieldItem.unit || "--"
                        }}
                      </span>
                    </div>
                    <!-- @input.native="inputNumEvt" -->

                    <el-input
                      v-if="fieldItem.type == 'password'"
                      type="password"
                      v-model.trim="formModel[fieldItem.id]"
                      :placeholder="fieldItem.placeholder"
                      autocomplete="new-password"
                      :maxlength="fieldItem.maxlength"
                    ></el-input>
                    <el-radio-group
                      v-if="fieldItem.type == 'radio'"
                      v-model="formModel[fieldItem.id]"
                      :placeholder="fieldItem.placeholder"
                      :disabled="disableAll[fieldItem.id]"
                      @change="handleChange($event, fieldItem.id)"
                    >
                      <el-radio
                        v-for="selectItem in selectAll[fieldItem.id]"
                        :key="selectItem.value"
                        :label="selectItem.value"
                        :disabled="selectItem.disabled"
                        >{{ selectItem.label }}</el-radio
                      >
                    </el-radio-group>
                    <el-checkbox-group
                      v-if="fieldItem.type == 'multiCheckbox'"
                      v-model="formModel[fieldItem.id]"
                      :disabled="disableAll[fieldItem.id]"
                      @change="handleChange($event, fieldItem.id)"
                    >
                      <el-checkbox
                        v-for="selectItem in selectAll[fieldItem.id]"
                        :key="selectItem.value"
                        :label="selectItem.value"
                        :style="{
                          width: fieldItem.width && `${fieldItem.width}px`,
                        }"
                        :disabled="
                          fieldItem.leastOne
                            ? handleIsOne(
                                formModel[fieldItem.id],
                                selectItem.value
                              )
                            : false
                        "
                      >
                        {{ selectItem.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                    <!-- <template v-if="fieldItem.type == 'multiCheckbox'">
                    <el-checkbox
                      v-for="selectItem in selectAll[fieldItem.id]"
                      :key="selectItem.value"
                      :label="selectItem.label"
                      v-model="formModel[fieldItem.id]"
                    >
                      {{ selectItem.value }}
                    </el-checkbox>
                  </template> -->
                    <el-select
                      v-if="fieldItem.type == 'select'"
                      :multiple="fieldItem.multiple || false"
                      :collapse-tags="fieldItem.collapseTags || false"
                      v-model="formModel[fieldItem.id]"
                      :placeholder="
                        overseaLangObj.yu_yan_lang === 'en-us'
                          ? 'Select'
                          : fieldItem.placeholder
                      "
                      :disabled="fieldItem.disabled"
                      @change="bindThis(fieldItem.handle, $event, fieldItem.id)"
                      style="width: 100%"
                      :filterable="fieldItem.isFilterable"
                      :clearable="fieldItem.clearable === false ? false : true"
                    >
                      <el-option
                        v-for="selectItem in selectAll[fieldItem.id]"
                        :key="selectItem.value"
                        :label="selectItem.label"
                        :value="
                          fieldItem.isShowNumber // 是否转为Number类型
                            ? Number(selectItem.value)
                            : selectItem.value
                        "
                      />
                    </el-select>
                    <el-input
                      v-if="fieldItem.type == 'textarea'"
                      type="textarea"
                      v-model="formModel[fieldItem.id]"
                      :placeholder="
                        overseaLangObj.yu_yan_lang === 'en-us'
                          ? 'Please input'
                          : fieldItem.placeholder
                      "
                      :maxlength="fieldItem.maxlength || 2000"
                      :autosize="
                        fieldItem.autosize || {
                          minRows: fieldItem.minRows || fieldItem.rows || 3,
                          maxRows: fieldItem.maxRows || fieldItem.rows || 6,
                        }
                      "
                      :disabled="disableAll[fieldItem.id]"
                      :show-word-limit="fieldItem.showWordLimit !== false"
                      :resize="fieldItem.resize || 'none'"
                      @focus="() => inputExpandCollapse(fieldItem, 'focus')"
                      @blur="() => inputExpandCollapse(fieldItem)"
                      @change="
                        (val) => {
                          changeUppercase(fieldItem, val.trim());
                        }
                      "
                    />
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
                      :type="fieldItem.type"
                      v-model="formModel[fieldItem.id]"
                      :placeholder="
                        overseaLangObj.yu_yan_lang === 'en-us'
                          ? 'Select date'
                          : fieldItem.placeholder
                      "
                      :disabled="disableAll[fieldItem.id]"
                      range-separator="-"
                      :start-placeholder="
                        overseaLangObj.yu_yan_lang === 'en-us'
                          ? 'Start date'
                          : fieldItem.startPlaceholder || '开始日期'
                      "
                      :end-placeholder="
                        overseaLangObj.yu_yan_lang === 'en-us'
                          ? 'End date'
                          : fieldItem.endPlaceholder || '结束日期'
                      "
                      :value-format="fieldItem.valueFormat"
                      :picker-options="fieldItem.pickerOptions || {}"
                      :clearable="fieldItem.clearable === false ? false : true"
                      unlink-panels
                      @change="
                        (row) => {
                          fieldItem.handleTimeChange &&
                            fieldItem.handleTimeChange(row);
                          handleChange(row, fieldItem.id);
                        }
                      "
                    />
                    <el-switch
                      v-if="fieldItem.type == 'switch'"
                      v-model="formModel[fieldItem.id]"
                    />
                    <el-checkbox
                      v-if="fieldItem.type == 'singleCheckbox'"
                      :class="fieldItem.className"
                      v-model="formModel[fieldItem.id]"
                      :disabled="fieldItem.disabled"
                      @change="handleChange($event, fieldItem.id)"
                      >{{ fieldItem.text }}</el-checkbox
                    >
                    <AutoComplete
                      :formModel="formModel"
                      :fieldItem="fieldItem"
                      :additionalParam="fieldItem.additionalParam || {}"
                      :ref="`${fieldItem.id}Ref`"
                      :selectValChangeObj="selectValChangeObj"
                      @loadSearchOptions="autoLoadSearchChange"
                      @selectHandleChange="
                        (val) => handleChange(val, fieldItem.id)
                      "
                      @onDefaultSelect="
                        (val) => onDefaultSelect(fieldItem, val)
                      "
                      v-if="fieldItem.type == 'autocomplete'"
                    >
                      <template
                        v-if="fieldItem.autoSlotRight"
                        v-slot:[fieldItem.id]="slotProps"
                      >
                        <slot
                          :name="fieldItem.id"
                          :formModel="slotProps.formModel"
                        />
                      </template>
                    </AutoComplete>
                    <div
                      v-if="fieldItem.type == 'rangeSelect'"
                      class="range-select"
                    >
                      <el-input-number
                        v-model="formModel[fieldItem.startId]"
                        v-input-number-limit="fieldItem.numDecimal || 2"
                        :max="minMaxNumber(formModel[fieldItem.endId], 'max')"
                        :precision="fieldItem.precision"
                        :controls="fieldItem.controls || false"
                        :placeholder="
                          overseaLangObj.yu_yan_lang === 'en-us'
                            ? 'Start'
                            : fieldItem.startPlaceholder
                        "
                        :disabled="fieldItem.disable"
                        @keyup.enter.native="enterSubmit"
                        @change="
                          (val) =>
                            handleRangeChange(
                              val,
                              fieldItem.id,
                              formModel[fieldItem.endId]
                            )
                        "
                      ></el-input-number>
                      <span class="separator">~</span>
                      <el-input-number
                        v-model="formModel[fieldItem.endId]"
                        v-input-number-limit="fieldItem.numDecimal || 2"
                        :min="minMaxNumber(formModel[fieldItem.startId])"
                        :precision="fieldItem.precision"
                        :controls="fieldItem.controls || false"
                        :placeholder="
                          overseaLangObj.yu_yan_lang === 'en-us'
                            ? 'End'
                            : fieldItem.endPlaceholder
                        "
                        :disabled="fieldItem.disable"
                        @keyup.enter.native="enterSubmit"
                        @change="
                          (val) =>
                            handleRangeChange(
                              val,
                              fieldItem.id,
                              formModel[fieldItem.startId]
                            )
                        "
                      ></el-input-number>
                    </div>
                    <template v-if="fieldItem.type === 'customUploadFile'">
                      <FormUpload
                        ref="formUploadRef"
                        :formConfig="formConfig"
                        :fieldItem="fieldItem"
                        :fileRules="formRules[fieldItem.id] || []"
                        @fileListChange="
                          (fileObj) => handleFileChange(fileObj, fieldItem)
                        "
                      />
                    </template>
                    <template v-if="fieldItem.type === 'colorPicker'">
                      <el-color-picker
                        v-model="formModel[fieldItem.id]"
                        :disabled="fieldItem.disabled"
                        @change="handleChange($event, fieldItem.id)"
                      ></el-color-picker>
                    </template>
                    <template v-if="fieldItem.type == 'slot'">
                      <slot
                        :name="fieldItem.id"
                        :fieldItem="fieldItem"
                        :formModel="formModel"
                        :disableAll="disableAll"
                        :selectAll="selectAll"
                        :dicsList="selectAll[fieldItem.id]"
                        :dicsData="slotDicsList(fieldItem, formModel)"
                      />
                    </template>
                    <template v-if="fieldItem.tip">
                      <slot
                        :name="fieldItem.tip"
                        :formModel="formModel"
                        :selectAll="selectAll"
                        :fieldItem="fieldItem"
                      />
                    </template>
                    <template v-if="fieldItem.infoTip">
                      <el-tooltip
                        :placement="fieldItem.placement || 'bottom-start'"
                        effect="light"
                        :visible-arrow="false"
                        :popper-class="`${fieldItem.infoTipClass} info-tip`"
                      >
                        <div
                          slot="content"
                          class="tip-content"
                          v-html="fieldItem.infoTip"
                        ></div>
                        <i
                          class="tip-icon el-icon-warning"
                          style="color: #5094ff"
                        ></i>
                      </el-tooltip>
                    </template>
                    <template
                      v-if="fieldItem.showTag && formModel[fieldItem.tagId]"
                    >
                      <el-tag
                        :color="`${fieldItem.tagColor}1A`"
                        :style="{ color: fieldItem.tagColor }"
                        size="mini"
                        :hit="false"
                        :class="[
                          'form-tag',
                          fieldItem.tagPosition && 'form-tag-position',
                        ]"
                      >
                        {{
                          fieldItem.basicType || fieldItem.tagBasicType
                            ? dicsListName(
                                dicsListParams(
                                  fieldItem.basicType || fieldItem.tagBasicType,
                                  formModel,
                                  fieldItem.basicTypeVal || fieldItem.tagId
                                )
                              )
                            : fieldItem.customDicsArr
                            ? slotDicsList(
                                {
                                  ...fieldItem,
                                  id: fieldItem.basicTypeVal || fieldItem.tagId,
                                },
                                formModel
                              ).nameCn || "--"
                            : formModel[fieldItem.tagId]
                        }}
                      </el-tag>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="search-form-btn" v-if="formConfig.searchForm">
      <el-button type="primary" @click="submitForm" size="small" v-throttle>
        {{ basicLangObj.cx_search || "搜索"
        }}<i class="el-icon-search el-icon--right"></i>
      </el-button>
      <el-button
        size="small"
        @click="resetForm"
        plain
        v-if="!formConfig.noSearchReset"
        v-throttle
      >
        {{ basicLangObj.cz_reset || "重置"
        }}<i class="el-icon-refresh el-icon--right"></i>
      </el-button>
      <el-button
        v-if="formConfig.fold"
        type="primary"
        size="small"
        @click="showToggle"
        plain
      >
        {{
          expansion
            ? basicLangObj.sq_retract || "收缩"
            : basicLangObj.zk_expand || "展开"
        }}<i
          :class="`${
            expansion ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
          } el-icon--right`"
        ></i>
      </el-button>
      <slot name="form-submit" />
    </div>
  </el-form>
</template>

<script>
import Schema from "async-validator";
import { debounce } from "@/utils";
import { querySearch } from "@/api/common";
import { DICTIONARY_Obj } from "@/comModel/dictionary";
import { mapState, mapActions } from "vuex";
import { isNumberStr, typeConversion, duplicateRemoval } from "@/utils/index";
import { singleEmitEvents } from "@/utils/emit-events";
import basicLangObj from "@/language/basicLang.js";
import { handleCopyText } from "@/utils/confirmBox.js";

export default {
  props: {
    formConfig: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AutoComplete: () => import("./AutoComplete"),
    FormUpload: () => import("./FormUpload"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  computed: {
    ...mapState({
      dictData: (state) => state.dictionary.dicsData,
      preventRepeatedClicks: (state) => state.settings.isRepeatedClick,
    }),

    dicsListParams() {
      return (basicType, row, rowProp) => {
        return {
          basicType,
          row,
          rowProp,
        };
      };
    },
    dicsList() {
      return (params) => {
        const rowDics = params.row[params.rowProp];
        const basicType = this.dictData[params.basicType];
        const hasBasicType = this.dictData && basicType;
        if (!hasBasicType) {
          return {
            nameCn: "",
            color: "",
          };
        }
        const fColDict = this.getDictObj(basicType, rowDics, false);
        if (fColDict.constructor === Array) {
          return {
            nameCn: fColDict.map((e) => e.nameCn).join(","),
            // color: fColDict.map((e) => e.color).join(","),
          };
        }
        return {
          nameCn: fColDict.nameCn,
          color: fColDict.color,
        };
        // 	let arr = [];
        //   if (rowDics && rowDics.constructor === Array) {
        //     arr = rowDics;
        //   } else {
        //     if (rowDics?.length > 1) arr = rowDics.split(",");
        //     else arr = [rowDics];
        //   }
        //   const nameCnArr = [];
        //   const colorArr = [];
        //   const basicTypeObj = {};
        //   basicType.forEach((item) => {
        //     basicTypeObj[item.value] = item;
        //   });
        //   arr.forEach((_, index) => {
        //     if (basicTypeObj[arr[index]]) {
        //       nameCnArr.push(basicTypeObj[arr[index]].nameCn);
        //       colorArr.push(basicTypeObj[arr[index]].color);
        //     }
        //   });
        //   return {
        //     nameCn: nameCnArr.toString(),
        //     color: colorArr.toString(),
        //   };
      };
    },
    dicsListName() {
      return (params) => {
        return this.dicsList(params).nameCn;
      };
    },
  },
  data() {
    return {
      validator: null,
      formModel: {},
      formRules: {},
      selectAll: {},
      disableAll: {},
      visibleAll: {},
      searchOptions: [],
      searchTotal: 999,
      loading: false,
      expansion: false,
      selectValChangeObj: {},
      span: "",
      searchPageNum: 1,
      delSelectLabelKeyArr: [], // 下拉框需要删除的属性（回显的名称）
      refreshShow: true,
      basicLangObj,
      defaultParams: {}, // 默认值
      handleCopyText,
    };
  },
  watch: {
    formModel: {
      deep: true,
      handler: function (newVal, oldVal) {
        //实时验证表单
        this.validator.validate(
          newVal,
          { firstFields: true },
          (errors, invalidFields) => {
            if (errors === null) {
              this.$emit("input-validate", true);
            } else {
              this.$emit("input-validate", false);
            }
          }
        );
      },
    },
  },
  created() {
    this.formModel = this.getFormModel();
    this.formRules = this.getFormRules();
    this.validator = new Schema(this.formRules);
    if (this.formConfig.searchForm) {
      singleEmitEvents.on(`onCustomSearchEvt${this.$route.path}`, (val) => {
        const { isWebChangeAttr, ...searchObj } = val || {};
        if (isWebChangeAttr) {
          this.defaultParams = searchObj;
        }
        this.setFormModel(searchObj, true, isWebChangeAttr ? "changeAttr" : "");
        this.$nextTick(() => {
          this.submitForm();
        });
      });
    }
  },
  mounted() {
    if (typeof this.formConfig.afterMounted == "function") {
      this.$nextTick(() => {
        this.formConfig.afterMounted.call(this);
      });
    }
  },
  methods: {
    renewForm() {
      // this.refreshShow = false;
      this.getFormModel();
      this.formRules = this.getFormRules();
      this.validator = new Schema(this.formRules);
      // this.$nextTick(() => {
      //   this.refreshShow = true;
      // });
    },
    customDicsName(cItem, row = {}) {
      const val = cItem.customDicsVal || cItem.id;
      let dictObj = {};
      cItem.customDicsArr.forEach((e) => {
        const ele =
          typeof e === "number" && cItem.dicsStr ? `${cItem.dicsStr}_${e}` : e;
        if (DICTIONARY_Obj[ele]?.value === typeConversion(row[val])) {
          dictObj = DICTIONARY_Obj[ele];
        }
      });
      return dictObj;
    },
    slotDicsList(colItem, formModel) {
      // 返回字典词
      if (colItem.basicType) {
        return this.dicsList(
          this.dicsListParams(
            colItem.basicType,
            formModel,
            colItem.basicTypeVal || colItem.id
          )
        );
      } else if (colItem.customDicsArr) {
        return this.customDicsName(colItem, formModel);
      }
      return {};
    },
    handleFileChange(fileObj, fieldItem) {
      const { fileIds, delAttachIds = [], files } = fileObj || {};
      const {
        attachIdKeyName = "attachId",
        delAttachIdsName,
        isBackFile,
      } = fieldItem;
      const { nDelAttachIds = [] } = this.formModel;
      let fileOpt = {
        ...this.formModel,
        [attachIdKeyName]: fileIds.join(","),
      };
      if (isBackFile) {
        fileOpt[attachIdKeyName] = files;
      } else if (delAttachIdsName) {
        // 附件模板切换时，不同类型删除的附件值
        fileOpt[delAttachIdsName] = (
          this.formModel[delAttachIdsName] || []
        ).concat(delAttachIds);
      } else {
        fileOpt.nDelAttachIds = nDelAttachIds.concat(delAttachIds);
      }
      this.setFormModel(fileOpt, true);
      if (fileIds.length) {
        this.$refs.myForm?.clearValidate(attachIdKeyName);
      }
    },
    bindThis(handle, val, prop) {
      this.handleChange(val, prop);
      return handle && handle.call(this, val);
    },
    querySearchAsync(
      {
        queryString,
        httpRequest,
        category,
        defaultProp = { value: "value", label: "key" },
      },
      isLoadMore
    ) {
      const that = this;
      const getRequest = httpRequest || querySearch;
      if (isLoadMore) {
        this.searchPageNum++;
      } else {
        this.loading = true;
        this.searchPageNum = 1;
      }
      debounce(() => {
        getRequest({
          name: queryString,
          category,
          pageNum: this.searchPageNum,
          pageSize: 10,
        }).then((res) => {
          const nameInfo = res.rows || [];
          this.searchTotal = res.total;
          if (nameInfo.length) {
            nameInfo.forEach((item) => {
              item.label = item[defaultProp.label];
              item.value = item[defaultProp.value];
            });
          }
          if (isLoadMore) {
            that.searchOptions.push(...nameInfo);
          } else {
            that.searchOptions = nameInfo;
          }
          this.loading = false;
        });
      })();
    },
    loadMore({ queryString, httpRequest, category, defaultProp }) {
      if (this.searchTotal <= this.searchOptions.length) return;
      this.querySearchAsync(
        { queryString, httpRequest, category, defaultProp },
        true
      );
    },
    onDefaultSelect(item, obj) {
      // 防止重置时，初始化数据被清空
      this.formConfig.formModel[item.id] = obj?.value;
      this.formConfig.formModel[item.selectLabelKey] = obj?.label;
    },
    /**
     * private
     * 获取表单Model
     */
    getFormModel() {
      let _formModel = {};
      const { span, num } = this.getSpan();
      this.searchFormHeight();
      this.formConfig.lists.map((list) => {
        list.fieldList.map((rowList) => {
          rowList.rows.map((colsList) => {
            colsList.cols.map((fieldItem, fieldIndex) => {
              if (fieldItem.selectLabelKey && !fieldItem.isSelectLabelParam) {
                // 需要传参的label值不用删除
                this.delSelectLabelKeyArr.push(fieldItem.selectLabelKey);
              } else {
                if (this.formConfig.searchForm && !fieldItem.multiple) {
                  // 查询表单添加下拉显示属性名，防止下拉框查询没值时显示出ID
                  fieldItem.selectLabelKey = `${fieldItem.id}_name`;
                  this.delSelectLabelKeyArr.push(fieldItem.selectLabelKey);
                }
              }
              fieldItem.type = fieldItem.type || "text";
              this.$set(
                this.disableAll,
                fieldItem.id,
                fieldItem.disable || false
              );
              if (this.formConfig.searchForm && this.formConfig.fold) {
                this.span = span;
                const { columnMultiples = 1, residueCols } = this.formConfig;
                let colNum = num * columnMultiples;
                if (span < 12 && residueCols?.length) {
                  // 减去剩余列加上自身列
                  residueCols.forEach((cNum) => {
                    colNum = colNum - (24 - span * cNum) / span + 1;
                  });
                }
                this.$set(this.visibleAll, fieldItem.id, colNum > fieldIndex);
              } else {
                this.$set(
                  this.visibleAll,
                  fieldItem.id,
                  fieldItem.visible === undefined ? true : fieldItem.visible
                );
              }
              if (fieldItem.basicType) {
                //新增代码开始,先判断是否有数据字典，如果没有就使用本地模拟数据
                let options = [];
                const basicTypeList = this.dictData[fieldItem.basicType];
                // console.log(this.dictData);
                if (basicTypeList) {
                  for (let i = 0; i < basicTypeList.length; i++) {
                    options.push({
                      label: basicTypeList[i].nameCn,
                      value: basicTypeList[i].value,
                      color: basicTypeList[i].color,
                      expandVal: basicTypeList[i].expandVal,
                    });
                  }
                }
                if (fieldItem.hideList)
                  options = options.filter((item) => {
                    return !fieldItem.hideList.includes(item.value * 1);
                  });
                if (fieldItem.showList)
                  options = options.filter((item) => {
                    return fieldItem.showList.includes(item.value);
                  });
                if (fieldItem.expandValFilter) {
                  //利用拓展值过滤数据，防止以后字典的VALUE值动态改变，hideList失效
                  options = options.filter((item) => {
                    const { expandVal } = item;
                    return fieldItem.expandValFilter.includes(expandVal);
                  });
                }
                // console.log(fieldItem.id, options);
                fieldItem.options = options;

                this.$set(this.selectAll, fieldItem.id, fieldItem.options);
                // console.log(this.selectAll);
              } else if (fieldItem.options) {
                this.selectAll[fieldItem.id] = fieldItem.options;
              } else if (fieldItem.customDicsArr) {
                // 自定义字典词
                let dictOptions = [];
                fieldItem.customDicsArr.forEach((e) => {
                  const ele =
                    typeof e === "number" && fieldItem.dicsStr
                      ? `${fieldItem.dicsStr}_${e}`
                      : e;
                  dictOptions.push({
                    ...DICTIONARY_Obj[ele],
                    label: DICTIONARY_Obj[ele].nameCn,
                  });
                });
                this.selectAll[fieldItem.id] = dictOptions;
              }
              if (![null, undefined, ""].includes(fieldItem.value)) {
                _formModel[fieldItem.id] = fieldItem.value;
              } else {
                if (fieldItem.type == "inputNumber") {
                  // 计数器默认值为0，重置为空需改默认值为undefined
                  _formModel[fieldItem.id] = undefined;
                } else {
                  _formModel[fieldItem.id] =
                    fieldItem.type === "multiCheckbox" ? [] : "";
                }
              }
            });
          });
        });
      });

      if (this.formConfig.formModel) {
        _formModel = Object.assign(_formModel, this.formConfig.formModel);
      }
      return _formModel;
    },

    searchFormHeight() {
      if (this.formConfig.searchNum || this.formConfig.searchColsHeight) {
        this.$nextTick(() => {
          let sElHeight =
            this.$refs.myForm?.$el?.offsetHeight ||
            (this.formConfig.columnMultiples || 1) * 52;
          if (document.body.clientWidth <= 1680 && sElHeight > 3 * 52) {
            // 兼容小屏
            sElHeight = 3 * 52;
          }
          this.$emit("searchHeight", sElHeight);
        });
        // if (this.expansion) {
        // let searchLength = 1;
        // if (this.formConfig.searchNum) {
        //   searchLength = +this.formConfig.searchNum;
        // } else if (this.formConfig.searchColsHeight) {
        //   searchLength =
        //     this.formConfig.lists[0]?.fieldList[0].rows[0].cols?.length || 1;
        // }
        // const { span, num } = this.getSpan();
        // if (document.body.clientWidth > 1680 && this.formConfig.residueCols) {
        //   this.formConfig.lists[0]?.fieldList[0].rows[0].cols.forEach(
        //     (rItem) => {
        //       if ([0, 1, 2].includes(rItem.residueCol)) {
        //         // 使用residueCol合并列显示，需要加上被合并的列
        //         searchLength += (24 - span * rItem.residueCol) / span - 1;
        //       }
        //     }
        //   );
        // }
        // let maxRow = Math.ceil(searchLength / num);
        // if (document.body.clientWidth <= 1680 && maxRow > 3) {
        //   // 兼容小屏
        //   maxRow = 3;
        // }
        //   this.$emit("searchHeight", this.$refs.myForm?.offsetHeight);
        // } else {
        //   const minRow = this.formConfig.columnMultiples || 1;
        //   this.$emit("searchHeight", minRow * 52);
        // }
      }
    },

    getSpan() {
      let num = 3;
      if (document.body.clientWidth < 1280) {
        num = 2;
      } else if (
        document.body.clientWidth >= 1280 &&
        document.body.clientWidth <= 1680
      ) {
        num = 3;
      } else if (
        document.body.clientWidth > 1680 &&
        document.body.clientWidth <= 2135
      ) {
        num = 4;
      } else if (document.body.clientWidth > 2135) {
        num = 6;
      }
      let span = 24 / num;
      return { span, num };
    },
    /**
     * private
     * 获取表单Rules
     */
    getFormRules() {
      const { formRules = {} } = this.formConfig;
      for (let key in formRules) {
        formRules[key].map((rule) => {
          if (typeof rule.validator === "function") {
            rule.validator.bind(this);
          }
          if (this.overseaLangObj.yu_yan_lang === "en-us" && rule.message) {
            if (rule.message.includes("请输入")) {
              rule.message = "Please input";
            }
            if (rule.message.includes("请选择")) {
              rule.message = "Please Select";
            }
          }
        });
      }
      return formRules;
    },
    setFormRules(ruleValide = {}, removeRule = []) {
      // 对象为添加，数组为移除校验
      this.formRules = {
        ...this.formRules,
        ...ruleValide,
      };
      // 注意顺序，移除在后
      if (removeRule.length) {
        removeRule.forEach((key) => {
          delete this.formRules[key];
        });
        this.$refs.myForm?.clearValidate(removeRule);
      }
      return this.formRules;
    },
    /**
     * 按enter键提交表单数据
     */
    enterSubmit() {
      // 查询
      if (this.formConfig.searchForm) {
        this.submitForm();
      }
    },
    /**
     * public
     * 提交表单数据
     */
    submitForm() {
      this.$refs["myForm"].validate((valid) => {
        if (valid) {
          if (typeof this.formConfig.confirm === "function") {
            this.formConfig.confirm.call(this).then(() => {
              this.sendHttp();
            });
          } else {
            this.sendHttp();
          }
        } else {
          if (this.formConfig.isCheckTip) {
            this.msgError("请检查数据是否填写正确");
          }
        }
      });
    },
    /**
     * private
     * 发送http
     */
    sendHttp() {
      if (this.preventRepeatedClicks) {
        // 防止重复点击请求
        return;
      }
      this["settings/actionFormSubmit"](true);
      setTimeout(() => {
        /** 提交时其他校验未通过，且返回不是Promise时 */
        this["settings/actionFormSubmit"](false);
      }, 300);
      let opt = this.getFormParams();
      if (this.formConfig.searchForm && this.formConfig.isGetSearchAll) {
        opt.webAllSearchFormData = this.formModel;
      }
      this.$emit("before-request");
      this.formConfig
        .httpRequest(opt)
        .then((result) => {
          this.$emit("success-request");
          if (result && result.code === 200) {
            this.formConfig.successMessage &&
              this.$message.success(this.formConfig.successMessage);
          }
          // 可把参数带到successFunction回调后再调接口
          this.formConfig.successFunction &&
            this.formConfig.successFunction(result);
        })
        .catch((err) => {
          this.$emit("error-request");
          this.formConfig.errorFunction && this.formConfig.errorFunction(err);
        })
        .finally(() => {
          // 防止表单重复点击提交
          setTimeout(() => {
            // 延时返回，先更新页面DOM结构
            this["settings/actionRepeatedClick"](false);
          }, 100);

          this.$emit("complete-request");
        });
      /**
       * 防止前端校验不通过时，没有返回Promise回调，而无法再次调接口，
       * 需要改为先校验再提交表单
       */
    },
    /** 提交传给后台的属性，用于过滤多余的属性 */
    saveFormParams(saveKeyArr, dataObj = {}) {
      // const saveKeyArr = ["id", "remark", "attachId"];
      const { webOriginalFormData, ...saveObj } = dataObj || {};
      const getParamsObj = webOriginalFormData || this.getFormParams();
      const optObj = saveKeyArr.reduce((sOpt, sKey) => {
        sOpt[sKey] = getParamsObj[sKey];
        return sOpt;
      }, saveObj);
      return optObj;
    },
    /**
     * public
     * 获取表单提交参数
     */
    getFormParams() {
      const { searchForm, getFormParams, isAttachFileId } = this.formConfig;
      let params = {};
      if (searchForm) {
        for (let key in this.formModel) {
          if (this.formModel[key] || this.formModel[key] === 0) {
            if (typeof this.formModel[key] === "string") {
              params[key] = this.formModel[key]
                .replace(/%/g, "\\%")
                .replace(/_/g, "\\_");
            } else {
              params[key] = this.formModel[key];
            }
          }
        }
      } else {
        params = Object.assign({}, this.formModel);
      }
      const { undefined, nDelAttachIds, attachList, ...nParams } = params;
      this.delSelectLabelKeyArr.forEach((nameKey) => {
        if (nParams[nameKey] !== undefined) {
          delete nParams[nameKey];
        }
      });
      if (isAttachFileId) {
        // 编辑时传入已删除的附件ID
        if (nDelAttachIds?.length) {
          nParams.deleteAttachIdList = duplicateRemoval(nDelAttachIds);
        }
      }
      if (typeof getFormParams === "function") {
        return getFormParams(nParams);
      }
      return nParams;
    },
    /**
     * public
     * 设置form model
     */
    setFormModel(formData, deep = false, isValidate = "") {
      if (deep) {
        if (isValidate === "changeAttr") {
          Object.assign(this.formModel, formData);
        } else {
          this.formModel = Object.assign({}, formData);
        }
      } else {
        let _formModel = {};
        Object.keys(this.formModel).map((key) => {
          if (formData[key] !== undefined) {
            this.selectValChangeObj[key] = true;
            _formModel[key] = formData[key];
          } else {
            _formModel[key] = this.formModel[key];
          }
        });
        this.formModel = _formModel;
        if (isValidate === "resetFields") {
          this.$nextTick(() => {
            this.validateField(Object.keys(formData));
          });
        }
      }
    },
    autoLoadSearchChange(key) {
      this.selectValChangeObj[key] = false;
    },

    /**
     * form展开收缩
     */
    showToggle() {
      this.expansion = !this.expansion;
      this.searchFormHeight();
    },
    /**
     * public
     * 表单重置
     */
    resetForm() {
      // 重置的方法（重置前的数据，重置后的数据），放在最上面才有重置前的数据
      this.$emit("resetForm");
      this.formConfig.resetFormFn &&
        this.formConfig.resetFormFn(this.getFormParams(), this.getFormModel());
      this.$refs.myForm.resetFields();
      this.formModel = this.getFormModel();
      this.$nextTick(() => {
        // 重置完成后，再请求, 默认值不重置
        if (Object.keys(this.defaultParams).length) {
          singleEmitEvents.emit(`onCustomSearchEvt${this.$route.path}`, {
            ...this.defaultParams,
            isWebChangeAttr: true, // 切换页签带出默认查询值
          });
        } else {
          this.submitForm();
        }
      });
    },
    /** 切换模板时重置初始值 */
    changeModelFormData() {
      this.formModel = this.getFormModel();
    },
    // 获取表单属性值
    getFormModelVal(key) {
      return key ? this.formModel[key] : this.formModel;
    },
    /**
     * 表单验证时触发
     */
    handleValidate(name, state) {
      this.$emit("validate", { name, state });
    },
    // 校验部分表单
    validateField(props, cb = () => {}) {
      this.$refs.myForm.validateField(props, cb);
    },
    // 校验表单
    validateAll(param) {
      return new Promise((resolve, reject) => {
        this.$refs["myForm"]
          .validate()
          .then((valid) => {
            resolve({ valid, param });
          })
          .catch((valid) => {
            reject({ valid, param });
          });
      });
    },
    /** 输入框失焦、选择框改变事件，oninput输入触发事件不要用此方法 */
    handleChange(e, type) {
      this.$emit("handleChange", e, type);
    },
    /** 数值范围必填项校验 */
    handleRangeChange(e, type, val) {
      if (type) {
        this.setFormModel({
          [type]: (e || e === 0) && (val || val === 0) ? `${e}~${val}` : "",
        });
      }
    },
    /** 英文输入转换为大写 */
    changeUppercase(cItem, val) {
      this.formModel[cItem.id] = val;
      if (cItem.colUppercase) {
        if (val && typeof val === "string") {
          this.formModel[cItem.id] = val.toLocaleUpperCase();
        }
      }
    },
    // 聚焦展开/失焦收起
    inputExpandCollapse(cItem, zType) {
      const tVal = this.formModel[cItem.id];
      if (zType === "focus") {
        cItem.maxRows = cItem.zkRows;
      } else {
        cItem.maxRows = cItem.sqRows;
      }
      this.formModel[cItem.id] = (tVal || "") + "."; // 用于改变DOM显示
      this.$nextTick(() => {
        this.formModel[cItem.id] = tVal;
      });
    },
    setConfigLists(colsIndex, config) {
      this.formConfig.lists.map((list) => {
        list.fieldList.map((rowList) => {
          rowList.rows.map((colsList) => {
            colsList.cols.map((fieldItem, fieldIndex) => {
              this.formConfig.lists[0].fieldList[0].rows[0].cols[colsIndex] =
                config;
            });
          });
        });
      });
    },
    changeSelectAll(sIdKey, sObj) {
      // 联动改变可用字典词;
      if (sIdKey) {
        const { hideList } = sObj || {};
        if (!this.tempSelectAll) {
          // 改变之前，复制一份原数据
          this.tempSelectAll = JSON.parse(JSON.stringify(this.selectAll));
        }
        if (hideList) {
          this.selectAll[sIdKey] = (this.tempSelectAll[sIdKey] || []).filter(
            (item) => {
              return !hideList.includes(+item.value);
            }
          );
        }
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
    inputNumEvt(nVal) {
      // 如果有最大、最小数值限制，InputNumber计数器 实时计算需要配合 @change 使用
      // console.log('nVal==', nVal.target.value)
    },
    handleIsOne(checkList, value) {
      if (checkList.length === 1 && checkList[0] === value) {
        return true;
      }
      return false;
    },
    handleClickSkip(fieldItem) {
      if (!fieldItem.isSkip) return;
      this.$emit("handleClickSkip", fieldItem);
    },
    ...mapActions([
      "settings/actionFormSubmit",
      "settings/actionRepeatedClick",
    ]),
  },
};
/**
 * 组件配置说明：
 * isAttachFileId: 是否只上传文件ID，父组件配置是否根据附件ID调接口获取附件，默认不传为：'否'
 * detailDisplay: 详情 附件一行显示
 */
</script>

<style lang="scss">
@import "~@/assets/styles/variables.scss";
.search-form-width {
  // .form-class {
  label.el-form-item__label {
    color: #515151;
  }
  // }
}
.form-class {
  &.detail-see-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .form-tag {
    height: 21px;
    line-height: 21px;
    border: none;
    border-radius: 12px;
    padding: 0 13px;
    margin-left: 5px;

    &.form-tag-position {
      position: absolute;
      top: 6px;
      right: 6px;
      transform: translateX(100%);
    }
  }
  label {
    font-weight: 400;
  }
  .el-form-item__content {
    font-size: 13px;
  }
  &.search-form-class {
    display: flex;
    justify-content: space-between;
    .form-column-list {
      width: 100%;
      padding: 0;
    }
    .el-col {
      padding-left: 3px !important;
      padding-right: 3px !important;
    }
    .search-form-btn {
      text-align: right;
      white-space: nowrap;
      padding-left: 22px;
    }
  }
  .flex {
    display: flex;
  }
  .flex-align-center {
    align-items: center;
  }
  .form-title {
    font-size: 14px;
    font-weight: bold;
    padding-left: 10px;
    border-left: 2px solid #00adb2;
    margin: 6px 0 24px;
    color: #515151;
  }
  .form-title-1 {
    border: none;
    color: #515151;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .form-title-2 {
    border: none;
    color: #515151;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .border-left-solid {
    border-left: 1px solid #aaa;
    margin-left: 22px;
    padding-left: 20px;
  }
  .border-bottom-dashed {
    border-bottom: 1px dashed #aaa;
    margin-bottom: 22px;
  }
  .form-column-list {
    display: flex;
    .el-form-item--medium {
      &.fix-height {
        .el-form-item__content {
          height: 36px;
        }
      }
      &.form-item-custom-file {
        .el-form-item__content {
          height: auto;
        }
      }
      .el-form-item__content {
        min-height: 36px;
      }
    }
    .fix-height .el-form-item__content {
      height: 32px;
    }
    .el-input-number,
    .el-autocomplete,
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner,
    .el-select.auto-search {
      width: 100%;
    }
    .input-unit-number {
      .el-input-number {
        width: auto;
        flex: 1;
        margin-right: 5px;
      }
    }
    .number-right-select {
      .el-input-number {
        .el-input__inner {
          border-radius: 4px 0 0 4px;
        }
      }
      .el-select {
        .el-input__inner {
          border-left: none;
          border-radius: 0 4px 4px 0;
        }
      }
    }
    .el-form-item--small .el-form-item__content {
      min-height: 32px;
    }
    .item-label-title > .el-form-item__label {
      font-size: 14px;
      font-weight: bold;
      padding-right: 10px;
      color: #515151;
    }
    .form-item-txt .el-form-item__content,
    .form-item-txt .el-form-item__label {
      height: auto;
      // line-height: 22px;
      // padding-top: 5px;
    }
    .form-item-flex .el-form-item__content {
      position: relative;
      display: flex;
      align-items: center;
    }
    .item-height-36 .el-form-item {
      height: 36px;
    }
    .figure-type .el-input__inner {
      padding: 0 0 0 15px;
    }
  }
  .auto-search.el-icon-search:before {
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  .range-select {
    display: flex;
    // .el-input__inner {
    //   padding-right: 0;
    // }
    .separator {
      margin: 0 8px;
    }
  }
  .el-checkbox {
    margin-right: 10px;
  }
  .border-bottom-solid {
    &::after {
      content: "";
      width: calc(100% - 20px);
      border-bottom: 1px solid #e2e2e2;
      transform: translateX(10px);
    }
    margin-bottom: 22px;
  }
  .border-top-solid {
    &::before {
      content: "";
      width: calc(100% - 20px);
      height: 1px;
      transform: translateX(10px);
      background-color: #e2e2e2;
      margin-top: 22px;
    }
  }
  .el-radio-group {
    white-space: nowrap;
    .el-radio {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      .el-radio__label {
        padding-left: 2px;
      }
    }
  }
  .el-checkbox__label {
    padding-left: 3px;
  }
  .el-textarea {
    .el-input__count {
      line-height: 20px;
    }
    // .el-input__count {
    //   line-height: 20px;
    //   bottom: -20px;
    //   right: 0px;
    //   background: transparent;
    // }
  }
  .custom-remark {
    margin-bottom: 0;
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        line-height: 20px;
        margin: 20px 0 15px;
        font-weight: bold;
        font-size: 14px;
        color: #515151;
      }
    }
    .text-tooltip {
      display: none;
    }
  }
  .label-top-title {
    display: flex;
    flex-direction: column;
    .el-form-item__label {
      line-height: 20px;
      margin: 20px 0 15px;
      font-weight: bold;
      font-size: 14px;
      color: #515151;
      text-align: left;
    }
    .el-form-item__content {
      margin-left: 5px !important;
    }
  }
  .margin-bottom-0 {
    margin-bottom: 0;
  }
  .el-row {
    display: flex;
    flex-wrap: wrap;
  }
  .el-col {
    &.col-right-0 {
      padding-right: 0 !important;
    }
  }
  .file-detail-display {
    .el-upload-list__item:first-child {
      margin-top: 8px;
    }
  }
  .txt-copy {
    font-size: 18px;
    margin-left: 6px;
    color: #5094ff;
    cursor: pointer;
  }
  .white-space-nowrap {
    white-space: nowrap;
  }
  .skip-click {
    cursor: pointer;
    color: #5094ff;
    text-decoration: underline;
  }
}
.el-tooltip__popper.is-light.info-tip {
  padding: 15px 20px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  border: none;

  &[x-placement^="bottom"] {
    margin-top: 1px;
  }
}
.tip-content {
  font-family: PingFangSC, PingFang SC;
  max-width: 450px;
  line-height: 20px;

  .title {
    font-weight: bold;
    font-size: 14px;
    color: #515151;
    margin-bottom: 5px;

    &.margin-top {
      margin-top: 10px;
    }
  }
  .info {
    font-size: 14px;
    color: #8b8b8b;
  }
}
.tip-icon {
  font-size: 17px;
  margin-left: 10px;
}
</style>
