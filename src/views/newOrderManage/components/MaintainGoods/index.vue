<template>
  <ComDialog
    v-if="dialogShow"
    ref="myDialog"
    :customDialog="dialogConfig"
    @onClose="handleClose"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <div class="warehousing-form" v-if="!formConfig.formModel.encasementWay">
        <ComForm :formConfig="formConfig" ref="myComForm" />
      </div>
      <div class="warehousing-table">
        <div class="new-line">
          <div class="title">货物信息</div>
          <div class="warehousing-flex">
            <div
              class="base-flex-align"
              v-if="formConfig.formModel.encasementWay"
            >
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
                  }),
                  className: 'warehouse',
                }"
                :additionalParam="{
                  includTypeList: '0,1,2,3',
                  customerId: basicData.customerId,
                  countryId: basicData.countryId,
                }"
              />
            </div>
            <el-button
              size="mini"
              type="primary"
              plain
              round
              @click="handleAddLine()"
              >新增行</el-button
            >
          </div>
        </div>
        <template v-for="(item, index) in goodsRows">
          <SingleGood
            v-if="dialogShow"
            :key="item.id || item.copyId"
            :index="index"
            :ref="`single${index}`"
            :customerId="basicData.customerId"
            :countryId="basicData.countryId"
            :data="item"
            :isCabinet="!formConfig.formModel.encasementWay"
            productsKey="productList"
            @handleSave="(row) => handleSaveGood(row, index)"
            @handleDelete="handleDelete(index)"
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
import {
  getMaintainGoodsList,
  updateMaintainGoodsList,
} from "@/api/order/firstTransport.js";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { config } from "./model";
import noDataImg from "@/assets/image/noData.png";
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
    type: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      httpWarehousePublicSelect,
      noDataImg,
      dialogShow: false,
      grossTotalConfig: config.grossTotal,
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
            handleClick: () => {
              if (!this.formConfig.formModel.encasementWay) {
                this.$refs.myComForm.submitForm();
              } else {
                this.submitSave(this.formConfig.formModel);
              }
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitSave, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "50px",
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
        formRules: config.formRules, // 表单校验规则
      },
      warehouseModel: {},
      copyId: 0,
      goodsRows: [],
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
          boxCount: undefined,
          boxWeight: undefined,
          boxLength: undefined,
          boxWidth: undefined,
          boxHeight: undefined,
          consigneeWarehouseId: "",
          consigneeWarehouseCode: "",
          warehouseName: "",
          boxVolume: 0.0,
          consigneeWarehouseName: "",
          isEdit: 1,
          productList: [],
          copyId: this.copyId,
          newAdd: true,
        },
        ...this.goodsRows,
      ];
    },
    show(orderId) {
      getMaintainGoodsList(orderId, this.type).then(({ data = {} }) => {
        const { encasementWay, boxCount, boxId, code, unitWeight, freghtList } =
          data;
        const { consigneeWarehouseId, consigneeWarehouseCode, warehouseName } =
          freghtList[0] || {};
        this.goodsRows = freghtList;
        this.formConfig.formModel = {
          orderId,
          encasementWay,
          boxCount,
          boxId,
          code,
          unitWeight,
        };
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
    handleDelete(index) {
      this.goodsRows.splice(index, 1);
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
      if (data.productList) {
        data.productList.map((item) => ({
          ...item,
          id: undefined,
        }));
      }
      data.newAdd = true;
      data.isEdit = 1;
      this.goodsRows.unshift(data);
      console.log(data);
    },
    submitSave(formModel) {
      let isPass = 0;
      const freghtList = [];
      const freightType = this.formConfig.formModel.encasementWay;
      const {
        id: consigneeWarehouseId,
        code: consigneeWarehouseCode,
        name: warehouseName,
      } = this.warehouseModel.consigneeWarehouseObj;
      if (freightType && !consigneeWarehouseId) {
        return this.$message.warning("请选择目的地");
      }
      this.goodsRows.forEach((_, index) => {
        const item = this.$refs[`single${index}`][0].getNewData();
        if (item.isEdit) {
          isPass = 1;
          return this.$message.info(`第${index + 1}行未保存`);
        }
        const { shipmentId = "", boxCount } = item;
        let num = "00000";
        let boxNumber = shipmentId;
        if (boxCount) {
          if (boxCount > 1) {
            num = num.substring(0, 5 - (boxCount + "").length) + boxCount;
            boxNumber = `${shipmentId}00001~${num}`;
          } else {
            boxNumber = `${shipmentId}00001`;
          }
        }

        const {
          addProduct,
          boxSize,
          freightProductDtoList,
          consigneeWarehouseName,
          isEdit,
          newAdd,
          copyId,
          productList,
          ...data
        } = item;
        freghtList.push({
          ...data,
          boxNumber,
          ...(freightType
            ? {
                consigneeWarehouseId,
                consigneeWarehouseCode,
                warehouseName,
              }
            : {}),
          productList: productList.map((product) => ({
            id: product.id || undefined,
            ecFreightId: data.id,
            productId: product.productId,
            productCount: product.productCount,
          })),
        });
      });
      if (isPass) return;
      const { boxId } = formModel || {};
      if (typeof boxId !== "number" && boxId) {
        formModel.code = boxId.code;
        formModel.boxId = boxId.id;
      } else {
        formModel.code = this.formConfig.formModel.code;
      }
      console.log("----------------------");
      console.log({ ...formModel, freghtList });
      return updateMaintainGoodsList({ ...formModel, freghtList }).then(() => {
        this.handleSuccess();
      });
    },
    handleSuccess() {
      this.handleClose();
      this.$emit("handleChange");
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
  .warehousing-flex {
    display: flex;
    align-items: center;

    .base-flex-align {
      margin-right: 20px;
    }
  }
}
.operate-icon-info {
  color: #8b8b8b;
}
</style>
