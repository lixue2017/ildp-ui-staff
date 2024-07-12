<template>
  <div class="goods-content">
    <div>
      <ComForm :formConfig="goodsInfoConfig" v-if="showSearchForm"> </ComForm>
    </div>
    <div class="goods-table">
      <ComTable
        ref="tableRef"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :pagination="false"
        :columnData="tableConfig.columnData"
        :getQueryParams="getQueryParams"
        v-if="showSearchForm"
      />
    </div>
  </div>
</template>

  <script>
import { GetListByBill } from "@/api/costScheme/index.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
  props: {
    goodsInfo: {
      type: Object,
      required: true,
    },
    formModel: {
      type: Object,
      required: true,
    },
    webParams: {
      type: Object,
      // required: true,
      default: () => ({
        // queryType   1查看货物跳转查询  2切换标签查询
      }),
    },
  },
  data() {
    return {
      goodsInfoConfig: {
        formModel: {}, // 表单数据
        fold: false, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "98px",
        lists: this.goodsInfo.formConfig,
      },
      searchFromData: {},
      tableConfig: {
        httpRequest: GetListByBill,
        columnConfig: this.goodsInfo.tableConfig,
        columnData:undefined
      },
      showSearchForm:false,
      WEB_isMountedRequest:false,
    };
  },
  created() {
    const { tableData } = this.webParams;
    if (tableData) {
      this.tableConfig.columnData = tableData;
      const { batchNumber, trayNum } = tableData && tableData[0];
      this.goodsInfoConfig.formModel = {
        batchNumber,
        trayNum,
      };
      this.searchFromData = {
        ...this.goodsInfoConfig.formModel,
      };
    }
    this.showSearchForm = true;
  },
  methods: {
    getList(formModel) {
      this.searchFromData = {
        ...formModel,
      };
      this.$refs.tableRef?.refreshTable(true);
    },
    getQueryParams() {
      const { id } = this.formModel;
      return {
        ...this.searchFromData,
        monthlyBillId:id,
        pageSize: 9999,
      };
    },
  },
};
</script>
  <style rel="stylesheet/scss" lang="scss" scoped>
.goods-content {
  margin-top:15px;
  .goods-table {
    margin-top: 15px;
  }
}
</style>
