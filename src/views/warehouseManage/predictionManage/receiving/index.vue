<template>
  <div class="app-content-container">
    <ComDetailTop :title="`收货入库单`" :config="{}">
      <template v-slot:subTitle>
        <span class="sub-title" v-if="searchOrderData.orderSn">
          ({{ searchOrderData.orderSn }})
        </span>
      </template>
      <template v-slot:titContentSlot>
        <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
      </template>
    </ComDetailTop>

    <div class="content-box" v-if="showSearchForm">
      <div class="head-search">
        <ComForm
          :formConfig="searchTabForm()"
          ref="searchFormRef"
          @resetForm="handleResetForm"
        >
          <template v-slot:form-submit>
            <template v-if="isInitRes">
              <!-- 订单类型显示按钮 -->
              <el-button
                v-if="searchOrderData.receiptOk"
                type="primary"
                @click="handleResetReceipt"
                size="small"
                v-throttle
              >
                重新收货
              </el-button>
              <el-button
                v-else
                type="primary"
                @click="handleReceiptCompleted"
                size="small"
                v-throttle
              >
                {{ overseaLangObj.receipt_completed || "收货完成" }}
              </el-button>
            </template>
          </template>
        </ComForm>
      </div>

      <div class="content" v-if="isInitRes">
        <!-- wms退仓收货 -->
        <WmsReturnWarehouse
          :wmsObj="searchOrderData"
          :btnTabsList="tableTabs()"
        />
      </div>
    </div>
    <ClaimAddDialogPackage ref="cPackageRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { customMessageBox } from "@/utils/confirmBox.js";
import { fullLoading } from "@/utils/loading.js";
import {
  getSearchStorageReceipt,
  postReturnReceiptOk,
  putResetReceiptGoods,
} from "@/api/warehouse/process";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { searchColumns, formRules } from "./model";
export default {
  name: "PredictionReceiving",
  mixins: [curWarehouseMixin, mixinEditCache],
  data() {
    return {
      showSearchForm: false,
      isInitRes: false,
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (searchVal) => {
          return new Promise((resolve) => {
            this.searchFromVal = searchVal;
            this.getSearchList();
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "80px",
        formRules,
      },
      searchFromVal: {},
      searchOrderData: {},
    };
  },
  methods: {
    mixinInitData() {
      this.searchFromVal = {};
      this.searchOrderData = {};
      this.isInitRes = false;
      this.showSearchForm = false;
      const { type, search } = this.$route.query;
      this.searchFormConfig.formModel = {
        type: type || "1", // 默认订单
        search,
      };
      this["dictionary/getDictionary"]([
        "searchReceiptType",
        "haiwaiWarehousingSource",
        "wmsStorageMode",
      ]).then(() => {
        this.showSearchForm = true;
      });
    },
    handleReceiptCompleted() {
      customMessageBox(
        this,
        {
          msgTxt1: "是否收货完成？",
          msgTxt2: "确认后不可修改收货数据!",
          httpMsgRequest: () => {
            const { receivingSource } = this.searchOrderData;
            const { type, search } = this.searchFromVal || {};
            return postReturnReceiptOk({
              search,
              type,
              receivingSource, // 1-第三方入库单 2-电商头程 4 海外入仓 5-wms退仓
            });
          },
        },
        () => {
          this.msgSuccess("收货完成");
          this.getSearchList();
        }
      );
    },
    handleResetReceipt() {
      customMessageBox(
        this,
        {
          msgTxt1: `当前单号已收货完成，`,
          msgTxt2: "是否重新收货？",
          httpMsgRequest: () => {
            const { receivingSource } = this.searchOrderData;
            const { type, search } = this.searchFromVal || {};
            return putResetReceiptGoods({
              search,
              type,
              receivingSource,
            });
          },
        },
        () => {
          this.getSearchList();
        }
      );
    },
    getSearchList() {
      this.handleResetForm(); // 先重置
      const { type, search } = this.searchFromVal || {};
      fullLoading.show();
      getSearchStorageReceipt({
        type,
        search,
        wmsId: this.curWarehouseObj.value,
      })
        .then((res) => {
          if (res.data) {
            this.searchOrderData = {
              ...res.data,
              sReceiptType: type,
              warehouseId: this.curWarehouseObj.value,
            };
            const { customerShortName = "", receivingSource } = res.data;
            this.$refs.searchFormRef?.setFormModel({
              customerShortName,
              receivingSource,
              type,
              search,
            });
            this.isInitRes = true;
          } else {
            this.msgError("该工作单号没有查询到收货信息");
          }
        })
        .catch((err) => {
          if (err.code === 1002) {
            this.handleUnknownReceipt(err, search);
          }
        })
        .finally(() => {
          fullLoading?.hide();
        });
    },
    handleResetForm() {
      this.searchOrderData = {};
      this.isInitRes = false;
      this.$refs.searchFormRef?.setFormModel({
        customerShortName: "",
        receivingSource: "",
      });
    },
    handleUnknownReceipt(err, search) {
      customMessageBox(
        this,
        {
          msgTxt1: "",
          msgTxt2: err?.msg || "未找到可收货信息",
          distinguishCancelAndClose: true,
          confirmButtonText: "未知退仓",
          cancelButtonText: "新建包裹",
          cancelBtnCallBack: () => {
            this.$refs.cPackageRef?.showDlg({
              trackSn: search,
              warehouseId: this.curWarehouseObj.value,
              successFn: () => this.getSearchList(),
            });
          },
        },
        () => {
          this.$router.push({
            path: "/warehouseManage/putIn/unknownCustomerEdit",
            query: {
              trackSn: search,
              warehouseId: this.curWarehouseObj.value,
              backPath: this.$route.fullPath,
            },
          });
        }
      );
    },
    tableTabs() {
      let tabs = [];
      const { boxIdList, skuIdList } = this.searchOrderData;
      if (boxIdList?.length) {
        tabs.push({
          label: "按箱收货",
          name: "1", // 需要按1,2...的顺序排列, 根据name值显示不同表格模板
        });
      }
      if (skuIdList?.length) {
        tabs.push({
          label: "按SKU收货",
          name: "2",
        });
      }
      return tabs;
    },
    getWarehouseTableMixin(obj) {
      // 获取当前所在仓
      this.curWarehouseObj = {
        ...obj,
      };
      this.$refs.searchFormRef?.submitForm();
    },
    searchTabForm() {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(),
      };
    },
    ...mapActions(["dictionary/getDictionary","customer/setStoreCurWarehouse"]),
  },
  created() {
    const { warehouseId } = this.$route.query;
    if (warehouseId) {
      this["customer/setStoreCurWarehouse"]({
        value: warehouseId,
      });
    }
  },
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    WmsReturnWarehouse: () => import("./wmsReturnWarehouse"),
    ClaimAddDialogPackage: () =>
      import("./components/addPackage/claimWithdrawal.vue"),
  },
};
</script>

<style lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 82px);
  padding: 0 0 30px;
  .content-box {
    padding: 0 20px;
  }
  /deep/ {
    .com-detail-top {
      .title {
        padding-bottom: 6px;
      }
      .page-turn {
        padding: 0;
      }
    }
    .current-warehouse {
      margin-right: 0;
      margin-bottom: 6px;
    }
  }
}
</style>
