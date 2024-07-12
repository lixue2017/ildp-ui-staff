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
        <ComForm :formConfig="formConfig" />
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
        </div>
      </div>
      <MaintainTable
        ref="maintainTableRef"
        :goodsRows="goodsRows"
        :formModel="basicData"
        :countryId="basicData.countryId"
      />
    </template>
  </ComDialog>
</template>
<script>
import {
  getEcFreightList,
  getEcFreightNewEdit,
} from "@/api/order/firstTransport.js";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { formConfig } from "./model";
import noDataImg from "@/assets/image/noData.png";
export default {
  props: {
    // 1:客户端  2：操作单 3：清关 4：国内仓库
    operationType: {
      type: Number,
      default: undefined,
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    MaintainTable: () => import("./TableVerify"),
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
            handleClick: this.submitSave,
          },
        ],
      },
      formConfig: {
        formModel: {},
        labelWidth: "90px",
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
      const { createTime } = row;
      const {
        number,
        customerShortName,
        bailorPeople,
        freightType,
        operationOrderId,
      } = row;
      this.basicData = row;
      this.freightType = Number(freightType);
      getEcFreightList({
        operationOrderId,
        isVerified: freightType == "1" ? 1 : undefined,
      }).then((res) => {
        this.goodsRows = res.rows || res.data.freghtList || [];
        const { consigneeWarehouseId, consigneeWarehouseCode, warehouseName } =
          this.goodsRows[0] || {};
        this.formConfig.formModel = {
          number,
          customerShortName: customerShortName || bailorPeople,
          createTime,
          totalBoxCount: this.goodsRows.reduce(function (acc, obj) {
            return acc + obj.warehousingBoxNum;
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
    submitSave() {
      const { operationOrderId } = this.basicData;
      const freightEditList = this.$refs.maintainTableRef?.handleSave();
      if (!freightEditList) return Promise.reject();
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
/deep/ {
  .warehouse {
    .el-input.is-disabled .el-input__inner {
      padding: 0 0 0 5px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
    }
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
  .el-button {
    margin-left: 10px;
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
