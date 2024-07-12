<template>
  <ComDialog
    v-if="dialogShow"
    ref="myDialog"
    :customDialog="dialogConfig"
    @onClose="handleClose"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <div class="warehousing-form">
        <ComForm :formConfig="formConfig" ref="myComForm" />
      </div>
      <div class="warehousing-table">
        <div class="new-line">
          <div class="title">货物信息</div>
          <div class="base-flex-align" v-if="freightType">
            <span>
              <span class="text-danger-color">* </span>
              <el-tooltip
                effect="dark"
                content="说明：当前版本“目的地”对应只能存在一个"
                placement="top"
              >
                <span>目的地：</span>
              </el-tooltip>
            </span>
            <AutoComplete
              :formModel="warehouseModel"
              :fieldItem="{
                id: 'consigneeWarehouseObj',
                selectLabelKey: 'code',
                placeholder: '目的地',
                isBackAll: true,
                noClearable: true,
                ...httpWarehousePublicSelect({
                  itemId: 'id',
                  typeList: '0,1,2,3,4',
                  includTypeList: '0,1,2,3',
                  customerId: basicData.customerId,
                  countryId: basicData.countryId,
                }),
                disabled: true,
                className: 'warehouse',
              }"
            />
          </div>
          <!-- <el-button
            v-if="!freightType"
            size="mini"
            type="primary"
            plain
            round
            @click="handleAddLine()"
            >新增行</el-button
          > -->
        </div>
        <template v-for="(item, index) in goodsRows">
          <SingleGood
            v-if="dialogShow"
            :key="item.id || item.copyId"
            :index="index"
            :ref="`single${index}`"
            :basicData="{
              customerId: basicData.customerId,
              countryId: basicData.countryId,
            }"
            :data="item"
            :isCabinet="!freightType"
            @handleSave="(row) => handleSaveGood(row, index)"
            @handleDelete="handleStatus(1, index)"
            @handleRecovery="handleStatus(0, index)"
            @handleReduction="handleReduction(index)"
            @handleCopy="handleCopy(index)"
          />
        </template>
        <template v-if="!goodsRows.length">
          <div class="data-empty">
            <img :src="noDataImg" alt="" srcset="" width="150px" />
            <div>
              没有货物数据哦～ <br />
              快去添加吧！
            </div>
          </div>
        </template>
      </div>
    </template>
  </ComDialog>
</template>
<script>
import { mapState } from "vuex";
import { freightVerify } from "@/api/operateManage/common";
import { calculation } from "@/utils/calculation";
import {
  getEcFreightList,
  getEcFreightEdit,
  getEcFreightNewEdit,
} from "@/api/order/firstTransport.js";
import { config } from "./model";
import noDataImg from "@/assets/image/noData.png";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
    SingleGood: () => import("./components/singleGood"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  props: {
    basicData: {
      type: Object,
      default: () => {},
    },
    // 1:客户端  2：操作单 3：清关 4：国内仓库
    operationType: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      noDataImg,
      dialogShow: false,
      grossTotalConfig: config.grossTotal,
      warehouseModel: {},
      dialogConfig: {
        title: "货物信息维护",
        width: "1100px",
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
      copyId: 0,
      goodsRows: [],
      httpWarehousePublicSelect,
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  methods: {
    handleAddLine() {
      this.copyId += 1;
      this.goodsRows = [
        {
          shipmentId: "",
          referenceId: "",
          warehousingBoxNum: undefined,
          warehousingWeight: undefined,
          warehousingLength: undefined,
          warehousingWidth: undefined,
          warehousingHeight: undefined,
          consigneeWarehouseId: "",
          consigneeWarehouseCode: "",
          warehouseName: "",
          warehousingVolume: 0.0,
          consigneeWarehouseName: "",
          isEdit: 1,
          deleted: 0,
          cusProducts: [],
          copyId: this.copyId,
          newAdd: true,
        },
        ...this.goodsRows,
      ];
    },
    show(row) {
      const { operationOrderNum, bailorPeople, createTime } = row;
      const { freightType, operationOrderId } = this.basicData;
      console.log(this.basicData);
      this.formConfig.formModel = {
        operationOrderNum,
        bailorPeople,
        createTime,
      };
      this.freightType = Number(freightType);
      getEcFreightList({
        operationOrderId,
        isVerified: freightType == "1" ? 1 : undefined,
      }).then((res) => {
        this.goodsRows = res.rows;
        const { consigneeWarehouseId, consigneeWarehouseCode, warehouseName } =
          res.rows[0] || {};
        // 目的地初始值
        this.warehouseModel = {
          code: consigneeWarehouseCode,
          consigneeWarehouseObj: {
            id: consigneeWarehouseId,
            code: consigneeWarehouseCode,
            name: warehouseName,
          },
        };
        this.dialogShow = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.myDialog.show();
          });
        });
      });
      console.log("this.goodsRows", this.goodsRows);
    },
    handleSaveGood(row, index) {
      this.goodsRows[index] = row;
    },
    handleStatus(status, index) {
      if (this.goodsRows[index].copyId) {
        this.goodsRows.splice(index, 1);
      } else {
        this.goodsRows[index].deleted = status;
      }
    },
    handleReduction(index) {
      this.goodsRows.splice(index, 1);
    },
    handleCopy(index) {
      const data = JSON.parse(JSON.stringify(this.goodsRows[index]));
      if (data.id) {
        delete data.id;
      }
      this.copyId += 1;
      data.copyId = this.copyId;
      if (data.cusProducts) {
        data.cusProducts.map((item) => ({
          ...item,
          detailId: undefined,
        }));
      }
      data.newAdd = true;
      data.isEdit = 1;
      data.deleted = 0;
      this.goodsRows.unshift(data);
      console.log(data);
    },
    submitSave() {
      let isEdit = 0;
      const freightEditList = [];
      const {
        operationOrderId,
        freightType,
        orderId: orderEcId,
      } = this.basicData;
      const {
        id: consigneeWarehouseId,
        code: consigneeWarehouseCode,
        name: warehouseName,
      } = this.warehouseModel.consigneeWarehouseObj;
      if (this.freightType && !consigneeWarehouseId) {
        return this.$message.warning("请选择目的地");
      }
      this.goodsRows.forEach((_, index) => {
        const item = this.$refs[`single${index}`][0].getNewData();
        if (item.isEdit) {
          isEdit = 1;
          return this.$message.info(`第${index + 1}行未保存`);
        }
        const { shipmentId = "", warehousingBoxNum } = item;
        let num = "00000";
        let boxNumber = shipmentId;
        if (warehousingBoxNum) {
          if (warehousingBoxNum > 1) {
            num =
              num.substring(0, 5 - (warehousingBoxNum + "").length) +
              warehousingBoxNum;
            boxNumber = `${shipmentId}00001~${num}`;
          } else {
            boxNumber = `${shipmentId}00001`;
          }
        }
        freightEditList.push({
          ...item,
          operationOrderId,
          orderType: 2,
          freightType,
          orderEcId,
          boxNumber,
          ...(this.freightType
            ? {
                consigneeWarehouseId,
                consigneeWarehouseCode,
                warehouseName,
              }
            : {}),
        });
      });
      if (isEdit) return;
      getEcFreightNewEdit({
        operationOrderId,
        freightEditList,
        operationType: this.operationType,
      }).then((res) => {
        this.handleClose();
        this.$emit("handleChange");
      });
    },
    handleClose() {
      this.dialogShow = false;
      this.goodsRows = [];
    },
  },
};
</script>
<style lang="scss" scoped>
.warehousing-form {
  border-bottom: 1px solid #e2e2e2;
  margin-top: -5px;
  padding-bottom: 20px;
}
.warehousing-table {
  .new-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e2e2e2;
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
      padding: 12px 0;
    }
  }
  /deep/ .el-row {
    line-height: 18px;
    // &:last-child {
    //   margin-top: 13px;
    // }
  }
  /deep/ .show-overflow-tooltip {
    margin-bottom: 10px;
  }

  .data-empty {
    line-height: 20px;
    text-align: center;
    img {
      width: 100px;
      padding: 30px 0 14px;
    }
    div {
      padding-bottom: 30px;
    }
  }
}
.operate-icon-info {
  color: #8b8b8b;
}
</style>
