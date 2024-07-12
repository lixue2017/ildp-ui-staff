<template>
  <div class="mixin-table">
    <div class="goods-tab flex-space-between">
      <div class="explain">
        <span class="title">货物信息</span>
        <i class="el-icon-warning-outline text-theme-color"></i>
        <span
          >说明：当前版本FCL整柜支持多个“目的地”，LCL散货只能存在一个“目的地”</span
        >
      </div>
      <div class="text-right">
        <div class="explain">
          <i class="el-icon-warning-outline text-theme-color"></i>
          <span>注：货物导入前，需先将数据/模板导出进行编辑</span>
        </div>
        <div>
          <template v-for="(btn, i) in rightBtn">
            <el-button
              :key="i"
              type="primary"
              :plain="btn.plain"
              size="small"
              @click="btn.handleClick"
              >{{ btn.text }}</el-button
            >
          </template>
        </div>
      </div>
    </div>
    <GoodsInfo
      ref="goodsTableRef"
      :countryId="formModel.countryId"
      :formModel="formModel"
    />
    <ComUpload
      style="display: none"
      ref="productUploadRef"
      :uploadConfig="{
        ...productUploadConfig,
        url: importGoodsRelationProduct,
        uploadData: {
          orderId: formModel.id,
          importType: importType,
          customerId: formModel.customerId,
          ...(formModel.operationOrderId
            ? { operationOrderId: formModel.operationOrderId }
            : {}),
        },
      }"
      @handleSuccess="(res) => uploadSuccess(res)"
      @handleError="handleImportErr"
      @handleUploading="handleUploading"
    />
  </div>
</template>

<script>
import { mixinImportConf } from "@/views/operateManage/components/mixinImportConf.js";
import { importGoodsRelationProduct } from "_comp/ComUpload/model";
import qs from "qs";
export default {
  mixins: [mixinImportConf],
  props: {
    formModel: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    GoodsInfo: () => import("../components/GoodsProductsInfo"),
  },
  data() {
    return {
      importGoodsRelationProduct,
      nationId: null,
      rightBtn: [
        {
          text: "新增货物",
          handleClick: this.addGoodsTable,
        },
        {
          text: "货物导入",
          handleClick: this.handleImport,
        },
        {
          text: "货物导出",
          plain: true,
          handleClick: this.importUrlXlsx,
        },
      ],
      goodsSelect: [],
      importType: 1,
    };
  },
  methods: {
    // 新增货物
    addGoodsTable() {
      this.$refs.goodsTableRef?.handleAddLine();
    },
    handleSave() {
      const freightObj = this.$refs.goodsTableRef?.handleSave();
      if (!freightObj) return false;
      return freightObj;
    },
    goImportInvoice(data = {}) {
      const { id, operationOrderId, countryId, encasementWay } = this.formModel;
      const query = {
        id,
        operationOrderId,
        countryId,
        encasementWay,
        importType: this.importType,
        backPath: this.$route.path,
        data: encodeURI(qs.stringify(this.$route.query)),
      };
      if (this.isPrediction) {
        query.isPrediction = 1;
      }
      this["dataImport/setECommerceImport"](data);
      this.$router.push({
        path: "/operateManage/verifiedImportInvoice",
        query,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .el-table__expand-icon--expanded {
    display: none;
  }
  .com-tabs {
    &.btn-pane .el-tabs__item {
      margin: 20px 10px 9px 0;
    }
    .operation-btn.el-button--small {
      height: 18px;
    }
  }
}

.goods-tab {
  padding: 3px 0;
  align-items: center;
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
</style>
