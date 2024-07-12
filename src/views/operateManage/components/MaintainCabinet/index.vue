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
            <template v-if="slotProps.prop === 'boxSizeCode'">
              <div class="tag delete" v-if="slotProps.row.deleted">删</div>
              <div
                class="tag new"
                v-if="!slotProps.row.deleted && slotProps.row.isNew"
              >
                新
              </div>
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.boxSizeCode }}
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
            <template v-if="slotProps.prop === 'weight'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.weight || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input
                    type="number"
                    size="mini"
                    v-model="slotProps.row.weight"
                    placeholder="重量"
                    maxlength="11"
                    class="text-align-left"
                    @input.native="handleDecimal(slotProps.row, 'weight', 2)"
                  ></el-input>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'volume'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.volume || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input
                    type="number"
                    size="mini"
                    v-model="slotProps.row.volume"
                    placeholder="体积"
                    maxlength="11"
                    class="text-align-left"
                    @input.native="handleDecimal(slotProps.row, 'volume', 2)"
                  ></el-input>
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
      dialogShow: false,
      grossTotalConfig: config.grossTotal,
      getSizeList,
      dialogConfig: {
        title: "维护整柜信息",
        width: "1050px",
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
                this.currRow = { ...row };
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
                  weight,
                  volume,
                  ontainerSno,
                  sealingStripSno,
                  boxSizeId,
                  boxSizeCode,
                } = this.currRow;
                row.weight = weight;
                row.volume = volume;
                row.ontainerSno = ontainerSno;
                row.sealingStripSno = sealingStripSno;
                row.boxSizeId = boxSizeId;
                row.boxSizeCode = boxSizeCode;
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
            resolve(this.formConfig.formModel.lists);
          });
        },
        columnConfig: config.tableColumn,
      },
      grossTotal: {},
      newId: 0,
    };
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
    show(rows) {
      rows.data = this.handleData(rows.data);
      console.log(rows);
      var lists = {
        rows: rows.data,
      };
      this.formConfig.formModel = {
        lists,
      };
      this.formConfig.formModel.operationOrderNum =
        this.basicData.operationOrderNum;
      this.dialogShow = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.myDialog.show();
        });
      });
    },
    handleAddLine() {
      const { lists } = this.formConfig.formModel;
      this.newId += 1;
      const newId = this.newId;
      this.formConfig.formModel.lists.rows = [
        {
          code: "",
          unitWeight: "",
          unitVolume: "",
          ontainerSno: "",
          sealingStripSno: "",
          isUpdate: 1,
          newId,
          newAdd: true,
        },
        ...(lists.rows || []),
      ];
      this.$refs.tableConfig.refreshTable(true);
    },
    handleClose() {
      this.dialogShow = false;
      this.$emit("handleChange");
    },
    handleSave(row) {
      const {
        id,
        weight,
        volume,
        ontainerSno,
        sealingStripSno,
        boxSizeId,
        boxSizeCode,
      } = row;
      const params = {
        weight,
        volume,
        ontainerSno,
        sealingStripSno,
        boxSizeId,
      };
      console.log(Number(boxSizeCode));
      const infoMsg = {
        boxSizeId: "请选择柜型",
        weight: "请输入重量",
        volume: "请输入体积",
        ontainerSno: "请输入箱号",
        sealingStripSno: "请输入封号",
      };
      for (let key in infoMsg) {
        console.log(key);
        if (!row[key]) {
          this.$message.error(infoMsg[key]);
          return;
        }
      }
      if (id) {
        params.id = id;
        updateOrderBox(params).then(() => {
          this.getBoxList();
        });
      } else {
        params.isGoods = 1;
        console.log(this.basicData);
        const { operationOrderId, orderType, id: orderId } = this.basicData;
        params.operationOrderId = operationOrderId;
        params.orderType = orderType;
        params.orderId = orderId;
        saveOrderBox(params).then(() => {
          this.getBoxList();
        });
      }
      row.isUpdate = 0;
    },
    getBoxList() {
      const { operationOrderId } = this.basicData;
      getBoxList({
        operationOrderId,
        freightType: 0,
        isFull: 1,
      }).then((res) => {
        res.data = this.handleData(res.data);
        console.log(res);

        var lists = {
          rows: res.data,
        };
        this.formConfig.formModel = {
          lists,
        };
        this.$refs.tableConfig.refreshTable(true);
      });
    },
    handleData(data) {
      let totalWeight = 0;
      let totalVolume = 0;
      data.map((item) => {
        item.isUpdate = 0;
        if (!item.deleted) {
          totalWeight += Number(item.weight || 0);
          totalVolume += Number(item.volume || 0);
        }
      });
      this.grossTotal = {
        totalWeight: totalWeight.toFixed(2),
        totalVolume: totalVolume.toFixed(2),
      };
      return data;
    },
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
