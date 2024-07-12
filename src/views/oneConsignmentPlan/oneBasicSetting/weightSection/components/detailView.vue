<template>
  <div class="app-container">
    <ComDetailTop
      v-if="pageViewType === 'edit'"
      :title="`重量段模板（编辑）`"
      ref="detailTopRef"
      :config="{}"
    />
    <ComDetailTop
      v-else
      :title="`重量段模板（查看）`"
      ref="detailTopRef"
      :formModel="wFormConfig.formModel"
      @handleClick="handleTopClick"
    />

    <div class="des-content-box" v-if="isInitRes">
      <div class="partition-right">
        <ComForm
          v-if="initDictData"
          ref="formWeightRef"
          :class="pageViewType === 'edit' ? '' : 'detail-see-form'"
          :formConfig="weightFormConfig()"
        >
        </ComForm>

        <div class="partition-tit-btn base-flex-between">
          <div>
            <span class="title-txt">模板明细</span>
            <span class="title-tip"
              >*
              计算规则：支持3种模式，全总价模式，全单价模式，总价+续单价模式</span
            >
          </div>
          <div class="title-radio">
            <el-radio-group
              v-model="wFormConfig.formModel.tempModel"
              :disabled="pageViewType !== 'edit'"
              @change="handleChangeTemp"
            >
              <el-radio
                v-for="selectItem in weightSectionTempModel"
                :key="selectItem.value"
                :label="selectItem.value"
                >{{ selectItem.label }}</el-radio
              >
            </el-radio-group>
          </div>
          <!-- <template v-if="pageViewType === 'edit'">
						<el-button type="primary" size="small" icon="el-icon-plus" class="btn-type-add"
							@click="handleAddTableRow">
							新增
						</el-button>
					</template> -->
        </div>
        <ComTable
          :ref="`tableWeightRef`"
          :columnConfig="detailTableWeightColumns()"
          :isMountedRequest="false"
          :rowOperationBtnListFn="mixinTableRowBtnArr"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="['title', 'remark'].includes(slotProps.prop)">
              <template>
                <el-input
                  type="text"
                  size="mini"
                  v-model="slotProps.row[slotProps.prop]"
                  :placeholder="slotProps.column.label"
                  :maxlength="slotProps.column.maxLength"
                />
              </template>
            </template>

            <template v-if="['chargingType'].includes(slotProps.prop)">
              <el-select
                size="mini"
                v-model="slotProps.row[slotProps.prop]"
                style="width: 100%"
                :clearable="false"
                :disabled="true"
                @change="(val) => handleSelect(val, slotProps.rowIndex)"
              >
                <el-option
                  v-for="sItem in dictChargingType"
                  :key="sItem.value"
                  :label="sItem.nameCn"
                  :value="sItem.value"
                  :disabled="
                    slotProps.rowIndex === 0
                      ? sItem.value === '3'
                      : sItem.value === '1'
                  "
                />
              </el-select>
            </template>

            <template
              v-if="
                ['beginWeight', 'endWeight', 'chargingSingleWeight'].includes(
                  slotProps.prop
                )
              "
            >
              <template>
                <el-input-number
                  size="mini"
                  v-model="
                    slotPropsRow(slotProps.row, slotProps.prop)[slotProps.prop]
                  "
                  v-input-number-limit="slotProps.column.decimal"
                  :precision="slotProps.column.decimal"
                  :placeholder="slotProps.column.label"
                  :controls="false"
                  :min="
                    slotProps.prop === 'endWeight'
                      ? slotProps.row.beginWeight
                      : undefined
                  "
                  :max="getMax(slotProps.prop, slotProps.rowIndex)"
                  :disabled="
                    slotProps.prop === 'beginWeight' ||
                    (slotProps.row.chargingType === '1' &&
                      slotProps.prop === 'chargingSingleWeight')
                  "
                  @change="
                    (val) =>
                      handleChange(val, slotProps.prop, slotProps.rowIndex)
                  "
                />
              </template>
            </template>
            <template v-if="slotProps.prop === 'operation'">
              <div class="operation-content-btn">
                <template
                  v-for="(item, index) in getStatusList(slotProps.rowIndex)"
                >
                  <span v-if="item === '--'" :key="item">--</span>
                  <el-button
                    v-else
                    :key="index"
                    size="small"
                    type="text"
                    :style="{ color: item.color }"
                    v-throttle
                    @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
                    >{{ item.text }}</el-button
                  >
                </template>
              </div>
            </template>
          </template>
        </ComTable>
      </div>
    </div>

    <template v-if="isInitRes">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <slot name="footerBtn" :btnInfo="wFormConfig.formModel" />
        <template v-for="(btn, index) in footBtnListFn()">
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
import {
  getWeightSectionTempInfo,
  getCopyWeightSectionTempInfo,
  postWeightSectionTemp,
} from "@/api/warehouse/basic";
import {
  mixinTableOperationRow,
  mixinTableWatchOpnBtn,
} from "_comp/ComTable/tableOperation/rowOperationMixin.js";
import { comSaveRepeatedRequest } from "@/api/common";
import {
  editOrDetailFormCols,
  pageFormRules,
  editOrDetailTableCols,
} from "../model.js";

export default {
  mixins: [mixinTableOperationRow, mixinTableWatchOpnBtn],
  props: {
    pageViewType: {
      type: String,
      default: () => "", // 区分编辑与详情页
    },
  },
  data() {
    return {
      wFormConfig: {
        formModel: {
          tempModel: 1,
        },
        labelWidth: "105px",
      },
      mixinTableBtnAll: [
        {
          text: "新增",
          opnBtnType: "addRow",
          handleClick: this.handleAddTableRow,
        },
        {
          text: "删除",
          color: "#FF6767",
          opnBtnType: "delRow",
          handleClick: (row) => this.handleMixinDirectlyDel(row),
        },
      ],
      footBtnList: [
        {
          text: "保存并启用",
          vType: "edit",
          footBtnLoading: true,
          handleClick: () => this.handleSave(1),
        },
        {
          text: "保 存",
          vType: "edit",
          footBtnLoading: true,
          handleClick: () => this.handleSave(0),
        },
        {
          text: "关 闭",
          isBtnAll: true,
          handleClick: this.reBack,
        },
      ],
      mixinTableRef: "tableWeightRef",
      mixinShowOpnBtnArr: ["addRow", "delRow"],
      initDictData: false,
      isInitRes: false,
      weightSectionTempModel: [
        {
          label: "总价+续单价模式",
          value: 1,
        },
        {
          label: "单价模式",
          value: 2,
        },
        {
          label: "总价模式",
          value: 3,
        },
      ],
    };
  },
  methods: {
    getStatusList(index) {
      return [
        {
          text: "新增",
          handleClick: this.handleAddTableRow,
        },
        ...(index !== 0
          ? [
              {
                text: "删除",
                color: "#ff6767",
                handleClick: this.handleDelete,
              },
            ]
          : []),
      ];
    },
    handleDelete(row, index) {
      this.handleMixinDirectlyDel(row);
      const list = [...this.mixinTableDataArr];
      if (list[index]) {
        list[index].beginWeight = list[index - 1].endWeight;
      }
      this.setTableMixinData(list);
    },
    handleChangeTemp(val) {
      console.log(val);
      const list = this.mixinTableDataArr.map((item, index) => {
        return this.handleTempSingle(item, index);
      });
      this.setTableMixinData(list);
    },
    getMax(prop, index) {
      if (prop === "endWeight") {
        const list = [...this.mixinTableDataArr];
        if (list[index + 1]) {
          const { endWeight } = list[index + 1];
          return endWeight;
        }
      }
      return undefined;
    },
    handleTempSingle(row, index) {
      const { tempModel } = this.wFormConfig.formModel;
      let chargingType = "";
      let beginWeight = row.beginWeight;
      if (tempModel === 3 || (tempModel === 1 && index === 0)) {
        chargingType = "1";
      } else if (tempModel === 1) {
        chargingType = "3";
      } else if (tempModel === 2) {
        chargingType = "2";
      }
      if (index !== 0) {
        const { endWeight } = this.mixinTableDataArr[index - 1];
        beginWeight = endWeight;
      }
      return {
        ...row,
        chargingType,
        beginWeight: beginWeight || 0,
        chargingSingleWeight:
          chargingType === "1" ? 1 : row.chargingSingleWeight,
      };
    },
    handleChange(val, prop, index) {
      console.log(val, prop);
      if (prop === "endWeight") {
        if (this.mixinTableDataArr.length - 1 > index) {
          const list = this.mixinTableDataArr[index + 1];
          list.beginWeight = val;
          this.setTableMixinData(this.mixinTableDataArr);
        }
      }
    },
    handleSave(state) {
      this.$refs.formWeightRef.validateAll().then((v) => {
        if (v.valid) {
          const rRuleObj = {
            ruleMsg: {
              title: "标题",
              chargingType: "计费种类",
              beginWeight: "开始重量",
              endWeight: "截止重量段",
              chargingSingleWeight: "计费单重",
            },
          };
          this.handleMixinSaveAll(rRuleObj, (itemList) => {
            // console.log('all==', itemList)
            const keyArr = [
              "id",
              "code",
              "nameCn",
              "nameEn",
              "goodsPackType",
              "logisticsChannelId",
              "warehouseMainId",
              "remark",
            ];
            const { tempModel } = this.wFormConfig.formModel;
            const sFormData = this.$refs.formWeightRef?.saveFormParams(keyArr);
            const opt = {
              state, // 0=草稿；1=启用
              itemList,
              ...sFormData,
              tempModel,
            };
            comSaveRepeatedRequest(postWeightSectionTemp, opt).then(() => {
              this.$refs.detailTopRef?.comReBack();
            });
          });
        }
      });
    },
    handleAddTableRow(_, index) {
      // const len = this.mixinTableDataArr.length;
      const list = [...this.mixinTableDataArr];
      if (!index && index !== 0) {
        list.push({
          ...this.handleTempSingle(
            {
              title: "",
              chargingType: "",
              beginWeight: undefined,
              endWeight: undefined,
              chargingSingleWeight: undefined,
              remark: "",
              isNewAdd: true,
              rBtnUpdate: true,
            },
            0
          ),
        });
      } else {
        list.splice(index + 1, 0, {
          ...this.handleTempSingle(
            {
              title: "",
              chargingType: "",
              beginWeight: undefined,
              endWeight: undefined,
              chargingSingleWeight: undefined,
              remark: "",
              isNewAdd: true,
              rBtnUpdate: true,
            },
            index + 1
          ),
        });
      }

      this.setTableMixinData(list);
    },
    handleSelect(val, index) {
      const list = [...this.mixinTableDataArr];
      if (val === "1") {
        list[0].beginWeight = 0;
        list[0].chargingSingleWeight = 1;
        list.map((item, index) => {
          if (index !== 0) {
            item.chargingType = "3";
          }
        });
      } else if (val === "2") {
        list.map((item) => {
          item.chargingType = "2";
        });
      } else if (val === "3") {
        list.map((item, index) => {
          if (index !== 0) {
            item.chargingType = "3";
          } else {
            item.chargingType = "1";
          }
        });
      }
      this.setTableMixinData(list);
    },
    weightFormConfig() {
      return {
        ...this.wFormConfig,
        formRules: this.pageViewType !== "edit" ? {} : pageFormRules(), // 表单校验规则
        lists: editOrDetailFormCols(this.pageViewType !== "edit"),
      };
    },
    detailTableWeightColumns() {
      return editOrDetailTableCols({ isSee: this.pageViewType !== "edit" });
    },
    getDetailInfo() {
      this.isInitRes = false;
      const { id, webRowCopy } = this.$route.query;
      if (!id) {
        // 新增数据
        this.isInitRes = true;
        setTimeout(() => {
          this.handleAddTableRow();
        }, 300);
      } else {
        // 编辑/复制与详情数据
        const getDetailHttp =
          webRowCopy === "btnCopy"
            ? getCopyWeightSectionTempInfo
            : getWeightSectionTempInfo;
        getDetailHttp(id).then((res) => {
          const {
            createUserName,
            itemList,
            goodsPackType,
            tempModel,
            ...nRes
          } = res.data || {};
          this.wFormConfig.formModel = {
            ...nRes,
            goodsPackType: this.typeConversion(goodsPackType),
            createBy: createUserName,
            tempModel: tempModel || 1,
          };
          this.isInitRes = true;
          setTimeout(() => {
            this.setTableMixinData(
              (itemList || []).map((tRow) => {
                return {
                  ...tRow,
                  chargingType: this.typeConversion(tRow.chargingType),
                  rBtnUpdate: this.pageViewType === "edit",
                };
              })
            );
          }, 300);
        });
      }
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetailInfo();
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack({
        isBackTip: this.pageViewType === "edit",
      });
    },
    footBtnListFn() {
      return this.footBtnList.filter((e) =>
        e.vType ? this.pageViewType === e.vType : e.isBtnAll
      );
    },
    slotPropsRow(row, key) {
      // 无值时改为undefined，否则会显示数字 0
      row[key] = row[key] === null ? undefined : row[key];
      return row;
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "goodsPackType",
      "chargingType",
      "status",
    ]).then(() => {
      this.initDictData = true;
    });
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
      dictChargingType: (state) => state.dictionary.dicsData.chargingType,
    }),
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  padding: 0;
  .des-content-box {
    padding: 0 20px 15px;
    display: flex;
    .partition-right {
      flex: 1;
      overflow: hidden;
    }
  }
  .detail-see-form {
    padding-bottom: 17px;
  }
  .partition-tit-btn {
    border-top: 1px solid #e2e2e2;
    height: 52px;
    .title-txt {
      font-size: 14px;
      font-weight: 500;
    }
    .title-tip {
      color: #5094ff;
      margin-left: 10px;
    }
    .title-radio {
      /deep/ {
        .el-radio {
          margin-right: 10px;
        }
        .el-radio__label {
          padding-left: 4px;
        }
      }
    }
  }
}
</style>
