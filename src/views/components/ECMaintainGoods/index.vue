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
        <ComForm
          ref="formRef"
          :formConfig="formConfig"
          @handleChange="handleChange"
        />
      </div>
      <div class="goods-tab flex-space-between">
        <div class="explain">
          <span class="title">货物信息</span>
          <i class="el-icon-warning-outline text-theme-color"></i>
          <span
            >说明：当前版本FCL整柜支持多个“目的地”，LCL散货只能存在一个“目的地”</span
          >
        </div>
        <div class="text-right">
          <span>装箱方式：</span>
          <el-radio-group v-model="freightType" disabled>
            <el-radio :label="0">FCL</el-radio>
            <el-radio :label="1">LCL</el-radio>
          </el-radio-group>
          <el-button
            type="primary"
            plain
            round
            size="mini"
            @click="handleAddLine"
            >新增货物</el-button
          >
        </div>
      </div>
      <MaintainTable
        ref="maintainTableRef"
        :goodsRows="goodsRows"
        :countryId="basicData.countryId"
        :formModel="basicData"
      />
    </template>
  </ComDialog>
</template>
<script>
import {
  getMaintainGoodsList,
  updateMaintainGoodsList,
} from "@/api/order/firstTransport.js";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { formConfig, FclFormConfig } from "./model";
import noDataImg from "@/assets/image/noData.png";
export default {
  props: {
    type: {
      type: Number,
      default: 2,
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    MaintainTable: () => import("./Table"),
  },
  data() {
    return {
      noDataImg,
      dialogShow: false,
      // grossTotalConfig: formConfig.grossTotal,
      httpWarehousePublicSelect,
      warehouseModel: {},
      dialogConfig: {
        title: "货物信息维护",
        width: "1211px",
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
              this.$refs.formRef.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        labelWidth: "90px",
        httpRequest: this.submitSave, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        ...formConfig,
      },
      copyId: 0,
      goodsRows: [],
      basicData: {},
    };
  },
  methods: {
    handleAddLine() {
      this.$refs.maintainTableRef?.handleAddLine();
    },
    show(row) {
      const {
        id: orderId,
        number,
        customerShortName,
        encasementWay,
        createTime,
      } = row;
      this.basicData = row;
      this.freightType = Number(encasementWay);
      this.formConfig = {
        ...this.formConfig,
        ...(encasementWay == 0 ? FclFormConfig : formConfig),
      };
      getMaintainGoodsList(orderId, this.type).then(({ data = {} }) => {
        const { encasementWay, boxCount, boxId, code, unitWeight, freghtList } =
          data;
        const { consigneeWarehouseId, consigneeWarehouseCode, warehouseName } =
          freghtList[0] || {};
        this.goodsRows = (freghtList || []).map((item) => ({
          ...item,
          productList: item.productList || [
            {
              temp_only_key: Math.random() + "",
              newProductAdd: true,
            },
          ],
        }));
        this.formConfig.formModel = {
          number,
          customerShortName,
          createTime,
          orderId,
          encasementWay,
          boxCount,
          boxId,
          code,
          unitWeight,
          totalBoxCount: this.goodsRows.reduce(function (acc, obj) {
            return acc + obj.boxCount;
          }, 0),
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
    },
    submitSave(formModel) {
      const freghtList = this.$refs.maintainTableRef?.handleSave();
      if (!freghtList) {
        return Promise.reject();
      }
      // const { boxId } = formModel || {};
      // if (typeof boxId !== "number" && boxId) {
      //   formModel.code = boxId.code;
      //   formModel.boxId = boxId.id;
      // } else {
      //   formModel.code = this.formConfig.formModel.code;
      // }
      return updateMaintainGoodsList({ ...formModel, freghtList });
    },
    handleSuccess() {
      this.handleClose();
      this.$emit("handleChange");
    },
    handleClose() {
      this.dialogShow = false;
      this.goodsRows = [];
    },
    handleChange(val, prop) {
      if (prop === "boxId" && val) {
        this.$refs.formRef.setFormModel({
          code: val.code,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.warehousing-form {
  margin-top: -5px;
  padding-bottom: 20px;
  padding-right: 40px;
}
/deep/ {
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}
.explain {
  display: flex;
  align-items: center;
  line-height: 19px;
  .title {
    font-weight: bold;
    font-size: 14px;
    color: #515151;
    margin-right: 10px;
  }
  i {
    font-size: 17px;
    margin-right: 3px;
  }
  span {
    color: #a5a5a5;
    font-size: 12px;
  }
}
.goods-tab {
  margin-bottom: 3px;
  .text-right {
    .el-button {
      margin-left: 10px;
    }
  }
  /deep/ {
    .el-radio {
      margin-right: 10px;
      .el-radio__label {
        padding-left: 3px;
      }
    }
  }
}
</style>
