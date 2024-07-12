<template>
  <div class="app-container">
    <!-- <div class="order-content"> -->
    <ComDetailTop title="电商头程运输" :config="{}" ref="detailTopRef">
      <template v-slot:subTitle>
        <span class="text-info-color">(货物导入临时信息)</span>
      </template>
    </ComDetailTop>
    <MixinTable
      v-if="importType != 3"
      ref="mixinTable"
      :countryId="countryId"
      :tableColumnData="tableColumnData"
      :encasementWay="encasementWay"
      :outWarehouseWay="outWarehouseWay"
    />
    <CustomerMixinTable
      v-else-if="tableColumnData.length"
      ref="mixinTable"
      :countryId="countryId"
      :tableColumnData="tableColumnData"
      :encasementWay="encasementWay"
      :outWarehouseWay="outWarehouseWay"
    />
    <!-- </div> -->
    <div class="order-footer">
      <template v-for="(item, index) in footer">
        <el-button
          :type="item.type"
          @click="item.handleClick"
          :key="index"
          :plain="item.plain"
        >
          {{ item.text }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import {
  addGoodOfProduct,
  addForecastGoodOfProduct,
  getCustomerInvoiceList,
  addVerifyGoodOfProduct,
} from "@/api/operateManage/details";
import { msgBox } from "@/utils/confirmBox.js";
import { FullscreenLoading } from "@/utils/loading";
import qs from "qs";
export default {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    MixinTable: () => import("./components/MixinTable"),
    CustomerMixinTable: () => import("./components/CustomerMixinTable"),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      countryId: null,
      tableColumnData: [],
      footer: [
        {
          text: "提 交",
          type: "primary",
          handleClick: this.handleSubmit,
        },
        {
          text: "取 消",
          plain: true,
          handleClick: () => this.reBack(),
        },
      ],
      encasementWay: "0",
      outWarehouseWay: "",
      importType: 2,
    };
  },
  computed: {
    ...mapState(["dictionary"]),
    ...mapGetters(["eCommerceImport"]),
  },
  created() {
    const {
      countryId,
      encasementWay,
      outWarehouseWay,
      isCustomerInvoice,
      operationOrderId,
      importType,
    } = this.$route.query;
    this.importType = Number(importType || 2);
    this.countryId = Number(countryId || 0);
    this.encasementWay = encasementWay;
    this.outWarehouseWay = outWarehouseWay;
    this["dictionary/getDictionary"]("orderTypeEn");
    if (Object.keys(this.eCommerceImport).length) {
      // this.fullscreenLoading.show("显示加载中...");
      const {
        invoiceEcVo: { invoiceEcDtoList = [] },
      } = this.eCommerceImport;
      this.tableColumnData = invoiceEcDtoList;
      // this.tableColumnData = invoiceEcDtoList.map((item) => ({
      //   ...item,
      //   mergeColumn: "1",
      // }));
    } else if (isCustomerInvoice) {
      getCustomerInvoiceList({ operationOrderId }).then((res) => {
        this.tableColumnData = res.data || [];
      });
    } else {
      this.reBack();
    }
  },
  methods: {
    ...mapActions([
      "dictionary/getDictionary",
      "tagsView/delView",
      "dataImport/setImportChange",
    ]),
    handleSubmit() {
      const invoiceEcDtoList = this.$refs.mixinTable.getTableData();
      if (!invoiceEcDtoList) {
        return;
      }
      const listNum = this.tableColumnData.length;
      const goodsNum = this.$refs.mixinTable.goodsNum;
      const { isCustomerInvoice } = this.$route.query;
      if (isCustomerInvoice) {
        this.handleEdit();
        return;
      }
      const html = `<div class="base-flex-align">
          <i class="el-icon-warning"></i>
          共导入${goodsNum}条货物信息，${listNum}个产品信息，确认是否导入
        </div>`;
      msgBox(
        this,
        {
          customClass: "confirm-class import-msg-box",
          html,
          confirmButtonText: "确 定",
          showClose: false,
          showCancelButton: true,
        },
        () => {
          this.handleEdit();
        }
      );
    },
    handleEdit() {
      const {
        id: orderId,
        operationOrderId,
        isPrediction,
        importType,
        isCustomerInvoice,
      } = this.$route.query;
      const invoiceEcDtoList = this.$refs.mixinTable.getTableData();
      const req =
        importType == 3
          ? addVerifyGoodOfProduct
          : isPrediction
          ? addForecastGoodOfProduct
          : addGoodOfProduct;
      req({
        invoiceEcDtoList,
        orderId,
        operationOrderId,
        importType,
      }).then((res) => {
        const { otherInfo = {} } = res.data || {};
        if (otherInfo.requiredInfo || otherInfo.matchingInfo) {
          this.handleImportErr(otherInfo);
          return;
        }
        isCustomerInvoice && this.$message.success("保存成功");
        this["dataImport/setImportChange"]();
        this.reBack();
      });
    },
    handleImportErr({ requiredInfo, matchingInfo }) {
      let html = "";
      if (requiredInfo) {
        html = `<div class="base-flex-align">
          <i class="el-icon-warning"></i>
          第${requiredInfo}行产品信息必填项未完善，请核对信息后再导入
        </div>`;
      } else if (matchingInfo) {
        html = `<div class="base-flex-align">
          <i class="el-icon-warning"></i>
          ${matchingInfo}
        </div>`;
      }
      if (html) {
        msgBox(
          this,
          {
            customClass: "confirm-class import-msg-box",
            html,
            confirmButtonText: "确 定",
            showClose: false,
          },
          () => {}
        );
      }
    },
    reBack() {
      const { data = "{}", backPath: path } = this.$route.query;
      this["tagsView/delView"](this.$route).then(() => {
        // 返回时关闭当前页面，防止反复保存
        this.$router.replace({
          path,
          query: qs.parse(decodeURI(data)),
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  /deep/ {
    .com-detail-top {
      margin: 0 0 15px;
      padding: 0;
    }
  }
  /deep/ {
    .mixin-table {
      .top {
        padding: 25px 0px 10px;
        .title {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
