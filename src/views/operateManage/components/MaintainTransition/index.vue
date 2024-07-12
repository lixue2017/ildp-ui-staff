<template>
  <ComDialog
    v-if="dialogShow"
    ref="myDialog"
    :customDialog="dialogConfig"
    @onClose="handleClose"
  >
    <template v-slot:content>
      <div class="warehousing-form">
        <ComForm :formConfig="formConfig" ref="myComForm" />
      </div>
      <div class="new-line">
        <el-button
          size="mini"
          type="primary"
          plain
          round
          @click="handleAddLine()"
          >新增行</el-button
        >
      </div>
      <div class="warehousing-table">
        <ComTable
          ref="tableConfig"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :pagination="false"
          :extraConfig="{
            stripe: false,
          }"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'customsDeclarationType'">
              <div class="tag delete" v-if="slotProps.row.deleted">删</div>
              <div
                class="tag new"
                v-if="!slotProps.row.deleted && slotProps.row.isNew"
              >
                新
              </div>
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.dicsList.nameCn || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-select
                    v-model="slotProps.row.customsDeclarationType"
                    style="width: 100%"
                    size="mini"
                    :clearable="false"
                  >
                    <el-option
                      v-for="selectItem in dictionary.dicsData
                        .customsDeclarationType"
                      :key="Number(selectItem.value || 0)"
                      :label="selectItem.nameCn"
                      :value="Number(selectItem.value || 0)"
                    />
                  </el-select>
                </el-row>
              </template>
            </template>

            <template v-if="slotProps.prop === 'ontainerSno'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.ontainerSno || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.ontainerSno"
                    placeholder="集装箱编号"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'sealingStripSno'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.sealingStripSno || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.sealingStripSno"
                    placeholder="密封条编号"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'packTypeId'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.dicsList.nameCn || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-select
                    v-model="slotProps.row.packTypeId"
                    size="mini"
                    style="width: 100%"
                    :clearable="false"
                  >
                    <el-option
                      v-for="selectItem in dictionary.dicsData.packagingCode"
                      :key="Number(selectItem.value || 0)"
                      :label="selectItem.nameCn"
                      :value="Number(selectItem.value || 0)"
                    />
                  </el-select>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'boxSizeId'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.boxSizeCode || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <AutoComplete
                    :formModel="slotProps.row"
                    :fieldItem="{
                      id: 'boxSizeId',
                      size: 'mini',
                      noClearable: true,
                      httpRequest: (params) => getSizeList({ ...params }),
                      defaultProp: {
                        value: 'id',
                        label: 'code',
                      },
                    }"
                    defaultKey="id"
                  />
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'warehousingQuantity'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.warehousingQuantity || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input-number
                    size="mini"
                    v-model="slotProps.row.warehousingQuantity"
                    v-input-number-limit="{
                      value: slotProps.column.decimal,
                      maxNumber: slotProps.column.colMax,
                    }"
                    :min="0"
                    placeholder="请输入"
                    class="text-align-left"
                    :disabled="freightType === '0'"
                    :controls="false"
                  />
                </el-row>
              </template>
            </template>

            <template
              v-if="
                [
                  // 'warehousingWeight',
                  // 'warehousingVolume',
                  'warehousingTotalWeight',
                  'warehousingTotalVolume',
                ].includes(slotProps.prop)
              "
            >
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ toFixedNum(slotProps.row[slotProps.prop]) || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input-number
                    v-model="slotProps.row[slotProps.prop]"
                    size="mini"
                    :min="0"
                    placeholder="请输入"
                    :controls="false"
                    v-input-number-limit="{
                      value: slotProps.column.decimal,
                      maxNumber: slotProps.column.colMax,
                    }"
                  ></el-input-number>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'operation'">
              <el-button
                class="operate-icon"
                size="small"
                type="text"
                @click="handleDeleteOrRecover(slotProps.row.id, 0)"
                v-if="slotProps.row.deleted === 1"
                >恢复</el-button
              >
              <template v-else>
                <template
                  v-for="(item, index) in tableConfig.statusList[
                    slotProps.row.isUpdate || 0
                  ]"
                >
                  <el-button
                    :class="`operate-icon ${
                      item.info ? 'operate-icon-info' : ''
                    }`"
                    size="small"
                    type="text"
                    :icon="item.icon"
                    :key="index"
                    @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
                    >{{ item.text }}</el-button
                  >
                </template>
              </template>
            </template>
          </template>
        </ComTable>
        <div class="grand-total">
          <div class="grand-title">合计：</div>
          <div
            v-for="gross in grossTotalConfig"
            :key="gross.prop"
            class="grand-cols"
          >
            <div>
              <el-row class="show-overflow-tooltip">
                <span class="label">{{ gross.label }}</span>
                <span class="value">
                  {{ grossTotal[gross.prop] }}
                </span>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ComDialog>
</template>
<script>
import { mapState } from "vuex";
import { config } from "./model";
import { handleDecimal } from "@/utils/validate";
import {
  getBoxList,
  saveOrderBox,
  updateOrderBox,
  operationBoxState,
} from "@/api/order/firstTransport.js";
import { submitTransportationGoods } from "@/api/trandition/oceanModel.js";
import { getSizeList } from "@/api/common";
import { multiplicationFn } from "@/utils/instructions";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  props: {
    basicData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isTransitionType: true,
      dialogShow: false,
      grossTotalConfig: config.grossTotal,
      getSizeList,
      dialogConfig: {
        title: "货物信息",
        width: "1050px",
        center: false,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.handleClose();
            },
          },
          {
            text: "保存",
            type: "primary",
            handleClick: this.submitSave,
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: () => {}, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        labelWidth: "90px",
        className: "content-padding-20",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.formLists,
                  },
                ],
              },
            ],
          },
        ],
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        // tableHeight: "500px",
        statusList: {
          0: [
            {
              text: "修改",
              handleClick: (row) => {
                row.isUpdate = 1;
                if (row.id) {
                  this.currRow[row.id] = { ...row };
                }
              },
            },
            {
              text: "删除",
              handleClick: (row) => this.handleDeleteOrRecover(row.id, 1),
            },
          ],
          1: [
            {
              text: "取消",
              icon: "",
              info: true,
              handleClick: (row, index) => {
                if (row.newAdd) {
                  this.formConfig.formModel.lists.rows.splice(index, 1);
                  this.$refs.tableConfig.refreshTable(true);
                  return;
                }
                const {
                  customsDeclarationType,
                  warehousingQuantity,
                  packTypeId,
                  // warehousingWeight,
                  // warehousingVolume,
                  ontainerSno,
                  sealingStripSno,
                  boxSizeId,
                  warehousingTotalVolume,
                  warehousingTotalWeight,
                  // warehousingLength,
                  // warehousingWidth,
                  // warehousingHeight,
                } = this.currRow[row.id];
                row.customsDeclarationType = customsDeclarationType;
                row.warehousingQuantity = warehousingQuantity;
                row.packTypeId = packTypeId;
                // row.warehousingWeight = warehousingWeight;
                // row.warehousingVolume = warehousingVolume;
                row.ontainerSno = ontainerSno;
                row.sealingStripSno = sealingStripSno;
                row.boxSizeId = boxSizeId;
                (row.warehousingTotalVolume = warehousingTotalVolume),
                  (row.warehousingTotalWeight = warehousingTotalWeight);
                // row.warehousingLength = warehousingLength;
                // row.warehousingWidth = warehousingWidth;
                // row.warehousingHeight = warehousingHeight;
                row.isUpdate = 0;
              },
            },
            {
              text: "保存",
              icon: "",
              handleClick: this.handleSave,
            },
          ],
        },
        httpRequest: () => {
          return new Promise((resolve) => {
            console.log(
              "this.formConfig.formModel.lists",
              this.formConfig.formModel.lists
            );
            resolve(this.formConfig.formModel.lists);
          });
        },
        columnConfig: config.hyTableColumn,
      },
      freightType: null, // FCL整柜件数为1，不可编辑
      grossTotal: {},
      newId: 0,
      currRow: {},
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  methods: {
    handleDecimal,
    handleDeleteOrRecover(id, deleted) {
      operationBoxState({
        id,
        deleted, //删除or恢复 0-恢复 1-删除
      }).then(() => {
        this.getBoxList();
      });
    },
    async show(freightType, type) {
      this.freightType = freightType;
      if (type === 4) {
        this.isTransitionType = false;
        this.tableConfig.columnConfig = config.kyTableColumn;
      } else {
        this.isTransitionType = true;
        this.tableConfig.columnConfig = config.hyTableColumn;
      }
      await this.getBoxList();
      this.dialogShow = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.myDialog.show();
        });
      });
    },
    handleAddLine() {
      //新增的时候需要给每个输入框赋值，否则无法输入
      const { lists } = this.formConfig.formModel;
      this.newId += 1;
      this.formConfig.formModel.lists.rows = [
        {
          customsDeclarationType: "",
          warehousingQuantity: 1,
          packTypeId: "",
          // warehousingWeight: "",
          // warehousingVolume: "",
          ontainerSno: "",
          sealingStripSno: "",
          boxSizeId: "",
          // warehousingLength: "",
          // warehousingWidth: "",
          // warehousingHeight: "",
          isUpdate: 1,
          newAdd: true,
          newId: this.newId,
        },
        ...(lists.rows || []),
      ];
      this.$refs.tableConfig.refreshTable(true);
    },
    handleClose() {
      // this.$emit("handleChange");
      this.dialogShow = false;
    },
    handleSave(row) {
      console.log("row", row);
      const {
        id,
        customsDeclarationType,
        warehousingQuantity,
        packTypeId,
        // warehousingWeight,
        // warehousingVolume,
        ontainerSno,
        sealingStripSno,
        boxSizeId,
        // warehousingLength,
        // warehousingWidth,
        // warehousingHeight,
        freightId,
        warehousingTotalWeight,
        warehousingTotalVolume,
      } = row;

      const { freightType } = this.basicData;
      let params = {
        customsDeclarationType,
        warehousingQuantity,
        packTypeId,
        // warehousingWeight,
        // warehousingVolume,
        freightId,
        warehousingTotalWeight,
        warehousingTotalVolume,
        freightType: Number(freightType || 0),
      };
      let infoMsg = {
        customsDeclarationType: "请选择报关方式",
        warehousingQuantity: "请输入件数",
        packTypeId: "请输入包装",
        // warehousingWeight: "请输入重量",
        // warehousingVolume: "请输入体积",
      };
      if (this.isTransitionType) {
        infoMsg = {
          ...infoMsg,
          ontainerSno: "请输入箱号",
          sealingStripSno: "请输入封号",
          boxSizeId: "请选择箱型",
        };
        params = {
          ...params,
          ontainerSno,
          sealingStripSno,
          boxSizeId,
        };
      } else {
        infoMsg = {
          ...infoMsg,
          // warehousingLength: "请输入长",
          // warehousingWidth: "请输入宽",
          // warehousingHeight: "请选择高",
        };
        params = {
          ...params,
          // warehousingLength,
          // warehousingWidth,
          // warehousingHeight,
        };
      }
      for (let key in infoMsg) {
        console.log(key);
        if (!row[key] && row[key] !== 0) {
          this.$message.error(infoMsg[key]);
          return;
        }
      }
      // params.warehousingTotalWeight = (
      //   Number(params.warehousingWeight) * Number(params.warehousingQuantity)
      // ).toFixed(2);
      // params.warehousingTotalVolume = (
      //   Number(params.warehousingVolume) * Number(params.warehousingQuantity)
      // ).toFixed(2);
      if (freightType != 1) {
        // params.weight = warehousingWeight;
        // params.volume = warehousingVolume;
        params.quantity = warehousingQuantity;
        if (!this.isTransitionType) {
          // params.length = warehousingLength;
          // params.width = warehousingWidth;
          // params.height = warehousingHeight;
        }
        params.totalWeight = params.warehousingTotalWeight;
        params.totalVolume = params.warehousingTotalVolume;
      }
      if (id) {
        params.id = id;
        updateOrderBox(params).then(() => {
          this.getBoxList();
        });
      } else {
        const {
          operationOrderId,
          orderType,
          id: orderId,
          // freightType,
        } = this.basicData;
        params.isGoods = Number(freightType || 0) ? 0 : 1;
        // params.freightType = Number(freightType || 0);
        params.operationOrderId = operationOrderId;
        params.orderType = orderType;
        params.orderId = orderId;
        params.verifyStatus = 1; //传统都传1，仅用于解决维护货物信息新增货物后列表没有返回数据的BUG
        saveOrderBox(params).then(() => {
          this.getBoxList();
        });
      }
      row.isUpdate = 0;
    },
    // handleChange(row, prop) {
    //   //整柜散货字段一样，不必做区分
    //   const {
    //     warehousingQuantity = 0,
    //     warehousingWeight = 0,
    //     // warehousingVolume = 0,
    //     warehousingTotalWeight = 0,
    //     warehousingTotalVolume = 0,
    //   } = row;
    //   if (prop == "warehousingQuantity") {
    //     //件数
    //     row.warehousingTotalWeight = multiplicationFn(
    //       [warehousingQuantity, warehousingWeight],
    //       2
    //     );
    //     row.warehousingTotalVolume = multiplicationFn(
    //       [warehousingQuantity, warehousingVolume],
    //       2
    //     );
    //   } else if (prop == "warehousingWeight") {
    //     //通过单件毛重计算毛重小计
    //     row.warehousingTotalWeight = multiplicationFn(
    //       [warehousingQuantity, warehousingWeight],
    //       2
    //     );
    //   } else if (prop == "warehousingVolume") {
    //     //通过单件体积计算体积小计
    //     row.warehousingTotalVolume = multiplicationFn(
    //       [warehousingQuantity, warehousingVolume],
    //       2
    //     );
    //   } else if (prop == "warehousingTotalWeight") {
    //     //通过毛重小计计算单件毛重
    //     const weight = (
    //       Number(warehousingTotalWeight) / Number(warehousingQuantity)
    //     ).toFixed(2);
    //     row.warehousingWeight = weight == Infinity ? 0 : weight;
    //   } else if (prop == "warehousingTotalVolume") {
    //     //通过体积小计计算单件体积
    //     const volume = (
    //       Number(warehousingTotalVolume) / Number(warehousingQuantity)
    //     ).toFixed(2);
    //     row.warehousingVolume = volume == Infinity ? 0 : volume;
    //   }
    // },
    getBoxList() {
      const {
        operationOrderId,
        freightType,
        orderType,
        operationOrderNum,
        customerShortName,
        bailorPeople,
        createTime,
      } = this.basicData;
      return new Promise((resolve) => {
        getBoxList({
          operationOrderId,
          freightType: Number(freightType || 0),
          orderType,
        }).then((res) => {
          console.log("res", res);
          console.log(this.$refs.tableConfig?.getNewTableData());
          const arr = this.$refs.tableConfig?.getNewTableData() || [];
          const addArr = [];
          const editIds = [];
          const editArr = [];
          arr.forEach((item) => {
            if (item.id && item.isUpdate) {
              editIds.push(item.id);
              editArr.push(item);
            }
            if (item.newAdd && item.isUpdate) {
              addArr.push(item);
            }
          });
          res.data = [
            ...addArr,
            ...this.handleData(res.data, editIds, editArr),
          ];
          console.log(1111, res.data);

          var lists = {
            rows: res.data,
          };
          this.formConfig.formModel = {
            lists,
            operationOrderNum,
            bailorPeople: customerShortName || bailorPeople,
            createTime,
          };
          console.log("lists", lists);
          this.$refs.tableConfig && this.$refs.tableConfig.refreshTable(true);
          resolve(lists);
        });
      });
    },
    handleData(data, editIds = [], editArr = []) {
      const { freightType } = this.basicData;
      let totalWeight = 0;
      let totalVolume = 0;
      let totalQuantity = 0;
      const arr = data.map((item) => {
        let newData = "";
        if (editIds.includes(item.id) && !item.deleted) {
          const index = editArr.findIndex((e) => e.id === item.id);
          newData = editArr[index];
        } else {
          item.isUpdate = 0;
        }
        if (freightType != 1) {
          // item.warehousingWeight = item.weight || item.warehousingWeight;
          // item.warehousingVolume = item.volume || item.warehousingVolume;
          item.warehousingQuantity = item.quantity || item.warehousingQuantity;
          // item.warehousingLength =
          //   item.length || item.warehousingLength || undefined;
          // item.warehousingWidth =
          //   item.width || item.warehousingWidth || undefined;
          // item.warehousingHeight =
          //   item.height || item.warehousingHeight || undefined;
        }

        if (!item.deleted) {
          totalWeight += Number(item.warehousingTotalWeight || 0);
          totalVolume += Number(item.warehousingTotalVolume || 0);
          totalQuantity += Number(item.warehousingQuantity || 0);
        }
        return newData || item;
      });
      this.grossTotal = {
        totalWeight: totalWeight.toFixed(2),
        totalVolume: totalVolume.toFixed(2),
        totalQuantity: totalQuantity.toFixed(0),
      };
      return arr;
    },
    submitSave() {
      const lists = this.$refs.tableConfig.getNewTableData();
      if (lists.findIndex((item) => item.isUpdate) > -1) {
        return this.$message.error("有数据未保存，请保存！");
      }
      // const index = lists.findIndex(
      //   (item) => !item.sealingStripSno || !item.ontainerSno
      // );
      // if (index > -1) {
      //   this.$message.error(`第${index + 1}行数据未补充完整，请补充！`);
      //   return;
      // }
      submitTransportationGoods(lists).then((res) => {
        this.$message.success("保存成功！");
        this.$emit("handleSuccess");
        this.handleClose();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.new-line {
  text-align: right;
  margin-bottom: 5px;
}
.warehousing-form {
  margin-top: 4px;
  /deep/ {
    .form-class .form-column-list .el-form-item--small .el-form-item__content,
    .el-form-item--small .el-form-item__label {
      line-height: 21px;
      min-height: 21px;
    }
  }
}
.warehousing-table {
  .tag {
    font-size: 12px;
    width: 40px;
    height: 17px;
    line-height: 17px;
    text-align: center;
    position: absolute;
    left: -50px;
    top: 0;
    border-radius: 0px 0px 19px 0px;
    color: #fff;

    &.delete {
      background: #f59ead;
    }
    &.new {
      background: #96dcb7;
    }
  }
  .title {
    font-weight: bold;
    font-size: 14px;
    padding: 14px 0 16px;
    color: #515151;
  }
  .text-align-left {
    /deep/ .el-input__inner {
      text-align: left;
    }
  }
  .text-align-right {
    /deep/ .el-input__inner {
      text-align: right;
    }
  }
  /deep/ {
    .el-input__inner {
      padding: 0 0 0 5px;
    }
    .el-table--medium td,
    .el-table--medium th {
      padding: 8px 0;
    }

    .el-icon-search:before {
      position: absolute;
      z-index: 100;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .ellipsis-text {
    line-height: 28px;
    &:last-child {
      margin-top: 4px;
    }
  }
  .grand-total {
    line-height: 20px;
    text-align: right;
    padding-right: 45px;
    background: #e8f0ff;
    display: flex;
    justify-content: flex-end;
    padding: 14px 20px;
    .grand-item {
      display: flex;

      .label {
        font-size: 13px;
        width: 100px;
        color: #8b8b8b;
        & > div:first-child {
          margin-bottom: 9px;
        }
      }
      .value {
        font-size: 15px;
        text-align: left;

        & > div:first-child {
          margin-bottom: 9px;
        }
        .diff-mark {
          padding: 0 7px;
          border-radius: 2px;
          margin-left: 2px;
        }
        .plus-mark {
          background: rgba(83, 200, 138, 0.06);
          border: 1px solid #53c88a;
          color: #53c88a;
        }
        .minus-mark {
          background: rgba(255, 103, 103, 0.06);
          border: 1px solid #ff6767;
          color: #ff6767;
        }
      }
    }
  }
}
.operate-icon-info {
  color: #8b8b8b;
}
</style>
