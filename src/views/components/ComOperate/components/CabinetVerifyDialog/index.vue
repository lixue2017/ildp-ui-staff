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
            <template v-if="slotProps.prop === 'size'">
              <el-row class="ellipsis-text">
                {{ slotProps.row.code }}
              </el-row>
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
            <!-- <template v-if="slotProps.prop === 'count'">
              <DiffMark
                v-if="!slotProps.row.isUpdate"
                :currentVal="slotProps.row.boxCount"
                :verifyVal="slotProps.row.warehousingBoxNum"
                :decimal="slotProps.column.decimal"
              />
              <template v-else>
                <el-row class="ellipsis-text">
                  {{ slotProps.row.boxCount }}
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input
                    type="number"
                    size="mini"
                    v-model="slotProps.row.warehousingBoxNum"
                    placeholder="请输入VGM数量"
                    oninput="value=value.replace(/[^\d]/g,'')"
                  ></el-input>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'weight'">
              <DiffMark
                v-if="!slotProps.row.isUpdate"
                :currentVal="slotProps.row.unitWeight"
                :verifyVal="slotProps.row.warehousingWeight"
                :decimal="slotProps.column.decimal"
              />
              <template v-else>
                <el-row class="ellipsis-text">
                  {{ slotProps.row.unitWeight }}
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input
                    type="number"
                    size="mini"
                    v-model="slotProps.row.warehousingWeight"
                    placeholder="请输入VGM重量"
                    @input.native="
                      handleDecimal(slotProps.row, 'warehousingWeight', slotProps.column.decimal)
                    "
                  ></el-input>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'number'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.warehousingContainerSno || "--" }}
                </el-row>
                <el-row class="ellipsis-text">
                  {{ slotProps.row.warehousingSealingStripSno || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.warehousingContainerSno"
                    placeholder="集装箱编号"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.warehousingSealingStripSno"
                    placeholder="密封条编号"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'code'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.warehousingProductName || "--" }}
                </el-row>
                <el-row class="ellipsis-text">
                  {{ slotProps.row.customsCode || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.warehousingProductName"
                    placeholder="货物品名"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.customsCode"
                    placeholder="海关编码"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
              </template>
            </template> -->
            <template v-if="slotProps.prop === 'operation'">
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
                  @click="item.handleClick(slotProps.row)"
                  >{{ item.text }}</el-button
                >
              </template>
            </template>
          </template>
          <template v-slot:customHeader="{ slotProps }">
            <template
              v-if="/size|weight|count|number|code/.test(slotProps.column.prop)"
            >
              <div>{{ slotProps.column.labelTop }}</div>
              <div>{{ slotProps.column.labelBtm }}</div>
            </template>
          </template>
        </ComTable>
        <!-- <div class="grand-total">
          <div class="grand-item">
            <div class="label">柜型Size：</div>
            <div class="value">
              <template
                v-for="(item, index) in grossTotal.warehousingBoxInfo || []"
              >
                <div :key="index">
                  {{ item }}
                </div>
              </template>
            </div>
          </div>
          <template v-for="gross in grossTotalConfig">
            <div :key="gross.propTop" class="grand-item">
              <div class="label">
                <div>{{ gross.labelTop }}</div>
                <div>{{ gross.labelBtm }}</div>
              </div>
              <div class="value">
                <div>{{ grossTotal[gross.propTop] }}</div>
                <div>
                  <span>{{ grossTotal[gross.propBtm] }}</span>
                  <span
                    :class="[
                      'diff-mark',
                      getDiffMark(
                        grossTotal[gross.propTop],
                        grossTotal[gross.propBtm]
                      ).mark,
                    ]"
                    v-if="
                      getDiffMark(
                        grossTotal[gross.propTop],
                        grossTotal[gross.propBtm]
                      ).val
                    "
                    >{{
                      getDiffMark(
                        grossTotal[gross.propTop],
                        grossTotal[gross.propBtm],
                        gross.decimal
                      ).val
                    }}</span
                  >
                </div>
              </div>
            </div>
          </template>
        </div> -->
      </div>
    </template>
  </ComDialog>
</template>
<script>
import { config } from "./model";
import { handleDecimal } from "@/utils/validate";
import { freightVerify } from "@/api/operateManage/common";
import { calculation } from "@/utils/calculation";
import { submitTransportationGoods } from "@/api/trandition/oceanModel.js";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
  },
  data() {
    return {
      dialogShow: false,
      grossTotalConfig: config.grossTotal,
      dialogConfig: {
        // title: "核实VGM重量",
        title: "登记集装箱信息",
        width: "800px",
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
              icon: "el-icon-edit-outline",
              handleClick: (row) => {
                row.isUpdate = 1;
                this.currRow = { ...row };
              },
            },
          ],
          1: [
            {
              text: "取消",
              icon: "",
              info: true,
              handleClick: (row) => {
                const {
                  warehousingBoxNum,
                  warehousingWeight,
                  ontainerSno,
                  sealingStripSno,
                  warehousingProductName,
                  customsCode,
                } = this.currRow;
                row.isUpdate = 0;
                row.warehousingBoxNum = warehousingBoxNum;
                row.warehousingWeight = warehousingWeight;
                row.ontainerSno = ontainerSno;
                row.sealingStripSno = sealingStripSno;
                row.warehousingProductName = warehousingProductName;
                row.customsCode = customsCode;
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
            console.log(this.formConfig.formModel.lists);
            resolve(this.formConfig.formModel.lists);
          });
        },
        columnConfig: config.tableColumn,
      },
      grossTotal: {},
    };
  },
  methods: {
    handleDecimal,
    show(rows) {
      rows.data.map((item) => {
        item.isUpdate = 0;
      });
      console.log(rows);
      var lists = {
        rows: rows.data,
      };
      this.formConfig.formModel = {
        lists,
        operationOrderNum: rows.operationOrderNum,
      };
      this.dialogShow = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.myDialog.show();
        });
      });
    },
    // show(row) {
    //   if (!row.lists || !row.lists.total) {
    //     return this.$message.error("无核实信息！");
    //   }
    //   const lists = {
    //     totalWeight: 0,
    //     warehousingTotalWeight: 0,
    //     totalBoxCount: 0,
    //     warehousingTotalBoxCount: 0,
    //     warehousingBoxInfo: [],
    //     total: row.lists.total,
    //   };
    //   const warehousingBoxInfo = {};
    //   const boxParams = row.lists.rows.map((item) => {
    //     let data = {
    //       freightId: item.id,
    //       boxId: item.boxId || item.boxSizeId,
    //       code: item.code || item.boxCode,
    //       boxCount: item.boxCount || item.boxNum || 0,
    //       unitWeight: item.unitWeight || item.weight || 0,
    //       customsCode: item.customsCode || "",
    //       warehousingProductName:
    //         item.warehousingProductName || item.productNameCn || "",
    //       warehousingContainerSno: item.warehousingContainerSno || "",
    //       warehousingSealingStripSno: item.warehousingSealingStripSno || "",
    //       isUpdate: 0,
    //     };
    //     const warehousingBoxNum =
    //       item.warehousingBoxNum === null
    //         ? data.boxCount
    //         : item.warehousingBoxNum;
    //     const warehousingWeight =
    //       item.warehousingWeight === null
    //         ? data.unitWeight
    //         : item.warehousingWeight;
    //     data = {
    //       ...data,
    //       totalWeight: calculation.multiply(data.unitWeight, data.boxCount, 2),
    //       warehousingBoxNum,
    //       warehousingWeight,
    //       warehousingTotalWeight:
    //         item.warehousingTotalWeight ||
    //         calculation.multiply(warehousingWeight, warehousingBoxNum, 2) ||
    //         0,
    //     };
    //     lists.totalWeight = calculation.add(
    //       lists.totalWeight,
    //       data.totalWeight,
    //       2
    //     );
    //     console.log(
    //       calculation.multiply(
    //         data.warehousingWeight,
    //         data.warehousingBoxNum,
    //         2
    //       )
    //     );
    //     lists.warehousingTotalWeight = calculation.add(
    //       lists.warehousingTotalWeight,
    //       data.warehousingTotalWeight,
    //       2
    //     );
    //     lists.totalBoxCount = calculation.add(
    //       lists.totalBoxCount,
    //       data.boxCount,
    //       2
    //     );
    //     lists.warehousingTotalBoxCount = calculation.add(
    //       lists.warehousingTotalBoxCount,
    //       data.warehousingBoxNum,
    //       0
    //     );
    //     warehousingBoxInfo[data.code] = warehousingBoxInfo[data.code]
    //       ? warehousingBoxInfo[data.code] + 1
    //       : 1;
    //     return data;
    //   });
    //   Object.keys(warehousingBoxInfo).map((key) => {
    //     lists.warehousingBoxInfo.push(`${warehousingBoxInfo[key]}x${key}`);
    //   });
    //   this.grossTotal = lists;
    //   lists.rows = boxParams;
    //   this.formConfig.formModel = {
    //     operationId: row.operationId,
    //     orderType: row.orderType,
    //     freightType: row.freightType,
    //     operationOrderNum: row.operationOrderNum,
    //     warehousingBoxInfo: lists.warehousingBoxInfo,
    //     lists,
    //   };
    //   this.dialogShow = true;
    //   this.$nextTick(() => {
    //     setTimeout(() => {
    //       this.$refs.myDialog.show();
    //     });
    //   });
    // },
    handleClose() {
      this.dialogShow = false;
    },
    handleSave(row) {
      const {
        warehousingBoxNum,
        warehousingWeight,
        ontainerSno,
        sealingStripSno,
        warehousingProductName,
        customsCode,
      } = row;
      // if (!warehousingBoxNum) {
      //   this.$message.error("请输入VGM数量");
      //   return;
      // }
      // if (!warehousingWeight) {
      //   this.$message.error("请输入VGM重量");
      //   return;
      // }
      if (!ontainerSno) {
        this.$message.error("请输入集装箱编码");
        return;
      }
      if (!sealingStripSno) {
        this.$message.error("请输入密封条编码");
        return;
      }
      // if (!warehousingProductName) {
      //   this.$message.error("请输入品名");
      //   return;
      // }
      // if (!customsCode) {
      //   this.$message.error("请输入海关编码");
      //   return;
      // }
      row.warehousingTotalWeight = calculation.multiply(
        warehousingBoxNum,
        warehousingWeight,
        2
      );
      const {
        warehousingBoxNum: currWarehousingBoxNum,
        warehousingWeight: currWarehousingWeight,
      } = this.currRow;
      const currWarehousingTotalWeight = calculation.multiply(
        currWarehousingWeight,
        currWarehousingBoxNum,
        2
      );
      const warehousingTotalWeight = calculation.add(
        row.warehousingTotalWeight,
        calculation.subtract(
          this.grossTotal.warehousingTotalWeight,
          currWarehousingTotalWeight
        ),
        2
      );
      const warehousingTotalBoxCount = calculation.add(
        this.grossTotal.warehousingTotalBoxCount,
        calculation.subtract(warehousingBoxNum, currWarehousingBoxNum),
        2
      );
      this.grossTotal = {
        ...this.grossTotal,
        warehousingTotalWeight: Number(warehousingTotalWeight),
        warehousingTotalBoxCount: Number(warehousingTotalBoxCount),
      };
      row.isUpdate = 0;
    },
    getDiffMark(oldVal, newVal, decimal) {
      const diff = newVal - oldVal;
      if (diff > 0) {
        return {
          val: `+${diff.toFixed(decimal)}`,
          mark: "plus-mark",
        };
      } else if (diff < 0) {
        return {
          val: diff.toFixed(decimal),
          mark: "minus-mark",
        };
      }
      return {
        val: 0,
        mark: "minus-mark",
      };
    },
    // submitSave() {
    //   const freightVerifyVoList = this.$refs.tableConfig.getNewTableData();
    //   console.log(freightVerifyVoList);
    //   if (freightVerifyVoList.findIndex((item) => item.isUpdate) > -1) {
    //     return this.$message.error("有数据未保存，请保存！");
    //   }
    //   // const index = freightVerifyVoList.findIndex(
    //   //   (item) =>
    //   //     !item.warehousingSealingStripSno ||
    //   //     !item.warehousingContainerSno ||
    //   //     !item.warehousingProductName ||
    //   //     !item.customsCode
    //   // );
    //   const index = freightVerifyVoList.findIndex(
    //     (item) =>
    //       !item.warehousingSealingStripSno || !item.warehousingContainerSno
    //   );
    //   if (index > -1) {
    //     this.$message.error(`第${index + 1}行数据未补充完整，请补充！`);
    //     return;
    //   }
    //   const { operationId, orderType, freightType, warehousingBoxInfo } =
    //     this.formConfig.formModel;
    //   freightVerify({
    //     operationId,
    //     orderType,
    //     freightType,
    //     // warehousingBoxInfo: warehousingBoxInfo.join(","),
    //     freightVerifyVoList,
    //   }).then(() => {
    //     this.$message.success("核实成功！");
    //     this.$emit("handleSuccess");
    //     this.handleClose();
    //   });
    // },
    submitSave() {
      const lists = this.$refs.tableConfig.getNewTableData();
      if (lists.findIndex((item) => item.isUpdate) > -1) {
        return this.$message.error("有数据未保存，请保存！");
      }
      const index = lists.findIndex(
        (item) => !item.sealingStripSno || !item.ontainerSno
      );
      if (index > -1) {
        this.$message.error(`第${index + 1}行数据未补充完整，请补充！`);
        return;
      }
      submitTransportationGoods(lists).then((res) => {
        this.$message.success("核实成功！");
        this.$emit("handleSuccess");
        this.handleClose();
      });
      // const { operationId, orderType, freightType, warehousingBoxInfo } =
      //   this.formConfig.formModel;
      // freightVerify({
      //   operationId,
      //   orderType,
      //   freightType,
      //   // warehousingBoxInfo: warehousingBoxInfo.join(","),
      //   freightVerifyVoList,
      // }).then(() => {
      //   this.$message.success("核实成功！");
      //   this.$emit("handleSuccess");
      //   this.handleClose();
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.warehousing-form {
  margin-top: -10px;
}
.warehousing-table {
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
