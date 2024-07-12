<template>
  <div class="app-content-container">
    <ComDetailTop
      v-if="pageViewType === '0'"
      :title="`费用模板（查看）`"
      ref="detailTopRef"
      class="title-sides-margin-none"
      :titConfig="leftTopConfig"
      :formModel="cFormConfig.formModel"
      @handleClick="handleTopClick"
    />
    <ComDetailTop
      v-else
      :title="`费用模板（编辑）`"
      ref="detailTopRef"
      class="title-sides-margin-none"
      :config="{}"
    />

    <div class="des-content-box" v-if="isInitRes">
      <div class="partition-right">
        <ComForm
          ref="costFormRef"
          :class="pageViewType === '0' ? 'detail-see-form' : ''"
          :formConfig="weightFormConfig()"
        >
        </ComForm>

        <div class="base-flex-between" style="padding: 10px 0">
          <span class="title-txt">模板明细</span>
          <div v-if="pageViewType !== '0'">
            <el-button type="primary" size="small" @click="handleAddTableRow">
              新 增
            </el-button>
          </div>
        </div>
        <ComTable
          :ref="`tableCostRef`"
          :columnConfig="editTableColumns()"
          :tableHeight="tableAutoHeight"
          :isMountedRequest="false"
          :rowOperationBtnListFn="mixinTableRowBtnArr"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-for="(tItem, tIdx) in ['type', 'prepaidCollect']">
              <template v-if="slotProps.prop === tItem">
                <!-- 类型、到付预付 -->
                <div :key="`t_${tIdx}`">
                  <el-select
                    v-if="slotProps.row.rBtnUpdate"
                    size="mini"
                    v-model="slotProps.row[tItem]"
                    style="width: 100%"
                    :clearable="false"
                  >
                    <el-option
                      v-for="selectItem in dictArr(tItem)"
                      :key="Number(selectItem.value || 0)"
                      :label="selectItem.nameCn"
                      :value="Number(selectItem.value || 0)"
                    />
                  </el-select>

                  <span
                    v-else
                    :style="{
                      color: slotProps.dicsList && slotProps.dicsList.color,
                    }"
                    >{{ slotProps.dicsList.nameCn }}</span
                  >
                </div>
              </template>
            </template>

            <template
              v-for="(aItem, aIdx) in [
                'dealingsCompanyName',
                'costName',
                'currency',
              ]"
            >
              <template v-if="slotProps.prop === aItem">
                <!-- 操作单号、往来单位、费用名称、币别 -->
                <div :key="`a_${aIdx}_${slotProps.row.temp_bs_key}`">
                  <AutoComplete
                    v-if="slotProps.row.rBtnUpdate"
                    :formModel="slotProps.row"
                    :fieldItem="{
                      ...slotProps.column.fieldItem,
                    }"
                    :additionalParam="{
                      mainId: 1, // 往来单位参数
                    }"
                  />
                  <span v-else>{{
                    slotProps.row[
                      aItem === "currency" ? "currencyCode" : aItem
                    ] || "--"
                  }}</span>
                </div>
              </template>
            </template>

            <template v-for="(nItem, nIdx) in ['unitPrice', 'num', 'taxRate']">
              <template v-if="slotProps.prop === nItem">
                <!-- 单价、数量、税率% -->
                <div :key="`n_${nIdx}`">
                  <el-input-number
                    v-if="slotProps.row.rBtnUpdate"
                    size="mini"
                    v-model="slotProps.row[nItem]"
                    v-input-number-limit="slotProps.column.decimal"
                    :max="slotProps.column.max"
                    :precision="slotProps.column.precision"
                    :controls="false"
                    :placeholder="slotProps.column.label"
                    @change="(val) => handleMoney(slotProps.row, val, nItem)"
                  />
                  <span v-else>{{
                    formatMoney(
                      slotProps.row[nItem],
                      slotProps.column.decimal,
                      slotProps.column.colFormat
                    )
                  }}</span>
                </div>
              </template>
            </template>

            <template v-if="slotProps.prop === 'isIncludeTax'">
              <template v-if="!slotProps.row.rBtnUpdate">
                <i
                  class="el-icon-circle-check"
                  style="font-size: 16px; color: #53c88a"
                  v-if="slotProps.row.isIncludeTax"
                ></i>
                <span v-else>--</span>
              </template>
              <template v-else>
                <el-checkbox
                  :true-label="1"
                  :false-label="0"
                  v-model="slotProps.row.isIncludeTax"
                />
              </template>
            </template>
          </template>
        </ComTable>
      </div>
    </div>

    <template v-if="isInitRes && pageViewType === '1'">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in footBtnList">
          <el-button
            @click="btn.handleClick"
            :key="index"
            :loading="btn.footBtnLoading && isBtnLoading"
          >
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { multiplicationFn } from "@/utils/instructions";
import {
  mixinTableOperationRow,
  mixinTableWatchOpnBtn,
} from "_comp/ComTable/tableOperation/rowOperationMixin.js";
import {
  getAddCostDetail,
  postAddCostTemp,
} from "@/api/settlementManage/feeSet";
import { comSaveRepeatedRequest } from "@/api/common";
import {
  editOrDetailFormCols,
  pageFormRules,
  editOrDetailTableCols,
} from "./model.js";

export default {
  name: "EditCostTemplate",
  mixins: [mixinEditCache, mixinTableOperationRow, mixinTableWatchOpnBtn],
  data() {
    return {
      leftTopConfig: {
        columnConfig: [],
      },
      cFormConfig: {
        formModel: {},
        labelWidth: "90px",
      },
      mixinTableRef: "tableCostRef",
      mixinShowOpnBtnArr: ["delRow"],
      mixinOperationObj: {
        isDelNewAdd: true,
      },
      footBtnList: [
        {
          text: "保 存",
          footBtnLoading: true,
          handleClick: () => this.handleSave(),
        },
        {
          text: "关 闭",
          handleClick: () => this.reBack(),
        },
      ],
      isInitRes: false,
    };
  },
  methods: {
    mixinInitData() {
      const { id } = this.$route.query;
      this["dictionary/getDictionary"]([
        "billType",
        "paymentType",
        "accountBillStatus",
      ]).then(() => {
        if (!id) {
          this.isInitRes = true;
        } else {
          this.getDetailInfo();
        }
      });
    },
    getDetailInfo() {
      this.isInitRes = false;
      const { id } = this.$route.query;
      getAddCostDetail(id).then((res) => {
        let { itemList, ...resData } = res.data || {};
        if (this.pageViewType === "1") {
          (itemList || []).forEach((e) => {
            e.isNewAdd = true; // 使编辑时删除生效
            e.rBtnUpdate = true;
          });
        }
        this.cFormConfig.formModel = {
          ...resData,
          itemList,
        };
        this.isInitRes = true;
      });
    },
    handleSave() {
      this.$refs.costFormRef.validateAll().then((v) => {
        if (v.valid) {
          const rRuleObj = {
            ruleMsg: {
              type: "费用类型",
              // dealingsCompany: "往来单位",
              costId: "费用名称",
              currencyId: "币别",
              unitPrice: "单价",
              num: "数量",
            },
            nonZeroKeys: ["unitPrice", "num"], // 必填且不能为0
            // ruleCallBack: (row, idx) => {
            //   if (row.isIncludeTax && !row.taxRate) {
            //     this.msgError(`序号${idx}行请输入税率`);
            //     return false;
            //   }
            //   return true;
            // },
          };
          this.handleMixinSaveAll(rRuleObj, (itemList) => {
            // console.log('all==', itemList)
            const keyArr = ["id", "name"];
            const sFormData = this.$refs.costFormRef?.saveFormParams(keyArr);
            const opt = {
              itemList,
              ...sFormData,
            };
            comSaveRepeatedRequest(postAddCostTemp, opt).then(() => {
              this.$refs.detailTopRef?.comReBack();
            });
          });
        }
      });
    },
    handleAddTableRow() {
      this.mixinAddTableOpnData([
        {
          type: 1,
          prepaidCollect: 0,
          isIncludeTax: 0,
          isNewAdd: true,
          rBtnUpdate: true,
        },
      ]);
    },

    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetailInfo();
      }
    },
    // 计算金额
    handleMoney(row, val, key) {
      // if (["num", "unitPrice"].includes(key)) {
      //   row.totalMoney =
      //     key === "num"
      //       ? multiplicationFn([val, row.unitPrice])
      //       : multiplicationFn([val, row.num]);
      // }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack({
        isBackTip: this.pageViewType === "1",
      });
    },
    weightFormConfig() {
      return {
        ...this.cFormConfig,
        formRules: this.pageViewType === "0" ? {} : pageFormRules(), // 表单校验规则
        lists: editOrDetailFormCols(this.pageViewType === "0"),
        afterMounted: () => {
          setTimeout(() => {
            if (this.cFormConfig.formModel.id) {
              this.setTableMixinData(this.cFormConfig.formModel.itemList || []);
            } else {
              // 初始化新增一条数据
              this.handleAddTableRow();
            }
          }, 20);
        },
      };
    },
    editTableColumns() {
      return editOrDetailTableCols(this.pageViewType === "0");
    },
    dictArr(tItem) {
      // 获取字典词
      return this[`${tItem}Dict`];
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    const { pageType } = this.$route.query;
    this.pageViewType = pageType; // 0-查看, 1-编辑
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
      typeDict: (state) => state.dictionary.dicsData.billType,
      prepaidCollectDict: (state) => state.dictionary.dicsData.paymentType,
    }),
    tableAutoHeight() {
      const tableLen = this.mixinTableDataArr.length;
      return tableLen > 10 ? `${11 * 49}px` : undefined;
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
  .title-txt {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }
}
</style>
