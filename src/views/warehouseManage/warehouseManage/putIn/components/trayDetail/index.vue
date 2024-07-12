<template>
  <div class="app-content-container">
    <ComDetailTop
      :title="overseaLangObj.tray_details"
      :formModel="formConfig.formModel"
      ref="detailTopRef"
      class="title-sides-margin-none"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            formConfig.formModel.traySn
              ? `(${formConfig.formModel.traySn})`
              : ""
          }}
        </span>
      </template>
    </ComDetailTop>
    <template v-if="isInitRes">
      <ComForm ref="formRef" :formConfig="getFormConfig()"></ComForm>
      <div>
        <div class="table-title base-flex-between">
          <span>{{ overseaLangObj.cargo_details }}</span>
          <el-button
            size="small"
            type="primary"
            plain
            round
            v-debounce
            v-if="!formConfig.formModel.locationSn"
            :disabled="!selectionRows.length"
            @click="handleBatchDelivery"
            >{{ this.overseaLangObj.pl_batch || "批量"
            }}{{
              formConfig.formModel.storageMode == 2
                ? this.overseaLangObj.zh_cc("转存仓")
                : this.overseaLangObj.zh_ps("转派送")
            }}</el-button
          >
        </div>
        <div>
          <ComTable
            ref="tableRef"
            :columnConfig="getColumnConfig()"
            :tableHeight="tableAutoHeight"
            :pagination="false"
            :columnData="tableColumnData"
            :selectionRow="selectionRowEvt"
            @onSelectionChange="onTableSelectionChange"
            :selectionTableRow="[...selectionRows]"
            selectionKey="storageId"
          >
          </ComTable>
          <div class="grand-total">
            <template v-for="(tItem, i) in tableSubtotal">
              <span :key="`t_${i}`">
                <span>{{ tItem.totalLabel }}：</span>
                <span>{{ tItem.totalNum }}</span>
              </span>
            </template>
          </div>
        </div>
      </div>
      <template v-if="!$route.query.tcType">
        <div class="footer-seize-seat"></div>
        <div class="order-footer">
          <template v-for="(fBtn, index) in getFootBtn()">
            <el-button @click="fBtn.handleClick" :key="`b_${index}`">
              {{ fBtn.text }}
            </el-button>
          </template>
        </div>
      </template>
    </template>
    <!-- <EditPutShelfDlg ref="editPutShelfRef" /> -->
    <BatchPutShelfDlg ref="batchRef" />
    <RedeliveryDialog ref="redeliveryRef" />
    <!-- <ChangeNumDialog ref="cNumRef" /> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchColumns, tableConfig } from "./model.js";
import { getWarehouseTrayGoods } from "@/api/warehouse/basic";
import { accumulationFn } from "@/utils/instructions";
export default {
  data() {
    return {
      formConfig: {
        formModel: {}, // 表单数据
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "98px",
      },
      tableColumnData: [],
      isInitRes: false,
      tableSubtotal: [],
      selectionRows: [],
      // tableBtnList: [
      //   {
      //     text: "更改",
      //     handleClick: (row) => {
      //       this.$refs.cNumRef?.show(row);
      //     },
      //   },
      // ],
      footBtn: [
        {
          text: this.overseaLangObj.put_away("上 架"),
          // showStatus: [1],
          btnType: ["putShelfTime"],
          handleClick: () => {
            // this.handleground();
            this.handleBatchEdit();
          },
        },
        {
          text: this.overseaLangObj.gb_close || "关 闭",
          handleClick: () => {
            this.reBack();
          },
        },
      ],
    };
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.tableColumnData?.length;
      return tableLen > 10 ? `${11 * 39 + 54}px` : undefined;
    },
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getColumnConfig() {
      const { menuType } = this.$route.query;
      return tableConfig(menuType, !this.formConfig.formModel.locationSn);
    },
    getFormConfig() {
      const { menuType } = this.$route.query;
      return {
        ...this.formConfig,
        lists: searchColumns(menuType),
      };
    },
    getDetail(id) {
      this.isInitRes = false;
      getWarehouseTrayGoods(id).then((res) => {
        const { goodsList, createUserName, ...resData } = res.data || {};
        this.formConfig.formModel = {
          createBy: createUserName,
          ...resData,
        };
        this.getTableResult(goodsList || []);
        this.isInitRes = true;
      });
    },
    // getQueryParams() {
    //   const { warehouseId } = this.formConfig.formModel;
    //   const { menuType, id } = this.$route.query; //menuType  0按SKU   1按箱   2大货中转
    //   return {
    //     type: menuType,
    //     warehouseId,
    //     traySn: id,
    //   };
    // },
    getTableResult(tableData) {
      this.tableColumnData = tableData;
      this.calcNumTotal(tableData);
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetail(id);
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    // handleground() {
    //   console.log("this.formConfig.formModel", this.formConfig.formModel);
    //   const { customerName, storageMode, traySn, id, warehouseId } =
    //     this.formConfig.formModel || {}; //storageMode  0按SKU   1按箱   2大货中转
    //   const trayRows = [this.formConfig.formModel];
    //   this.$refs.editPutShelfRef.editShow(
    //     {
    //       ...this.formConfig.formModel,
    //       trayNum: traySn,
    //       trayId: id,
    //       customerName,
    //       webPartitionType: storageMode == 2 ? 4 : undefined,
    //       activeType: storageMode != 2 ? storageMode : undefined, // 0-SKU存仓 1-按箱存仓
    //       warehouseId: warehouseId,
    //       trayInfoParamList: trayRows.map((ele) => {
    //         const { traySn } = ele || {};
    //         return {
    //           traySn: traySn,
    //         };
    //       }),
    //     },
    //     {
    //       editSuccess: () => {
    //         // 上架成功后重置
    //         this.getDetail(this.formConfig.formModel.trayId)
    //       },
    //     }
    //   );
    // },
    handleBatchEdit() {
      const {
        customerName,
        storageMode,
        traySn,
        trayId,
        // wtblrIds,
        warehouseId,
      } = this.formConfig.formModel || {}; //storageMode  0按SKU   1按箱   2大货中转
      const tabRows = [
        {
          customerName,
          trayId,
          traySn,
          type: storageMode,
        },
      ];
      this.$refs.batchRef.show(tabRows, {
        warehouseId,
        typeIn: storageMode == 2 ? "4" : "0,1,2,3", // 存仓  4 - 大货中转
        successFn: () => {
          this.getDetail(trayId);
        },
      });
    },
    getFootBtn() {
      const { locationSn } = this.formConfig.formModel;
      return this.footBtn.filter((e) => (e.btnType ? !locationSn : true));
    },
    calcNumTotal(arr = []) {
      const { menuType } = this.$route.query; //menuType  0按SKU   1按箱   2大货中转
      // const customerId = arr.map((e) => e.customerId);
      const num = {
        totalLabel:
          menuType == 1 || menuType == 2
            ? this.overseaLangObj.zxs_total()
            : this.overseaLangObj.total_number,
        totalNum: accumulationFn(arr.map((e) => e.totalNum)),
      };
      const verifyVolume = {
        totalLabel: this.overseaLangObj.total_volume("总体积/m³"),
        totalNum: accumulationFn(arr.map((e) => e.volume)),
      };
      const weight = {
        totalLabel: this.overseaLangObj.total_weight("总重量/KG"),
        totalNum: accumulationFn(arr.map((e) => e.weight)),
      };
      // const customerNum = {
      //   totalLabel: "客户总数",
      //   totalNum: [...new Set(customerId)].length,
      // };
      if (menuType == 0) {
        this.tableSubtotal = [num, verifyVolume, weight];
      } else if (menuType == 1) {
        this.tableSubtotal = [num, verifyVolume, weight];
      } else if (menuType == 2) {
        this.tableSubtotal = [num, verifyVolume, weight];
      }
    },
    handleBatchDelivery() {
      if (this.selectionRows.length) {
        const isAllSelection =
          this.selectionRows.length === this.tableColumnData.length; // 是否全选
        this.$refs.redeliveryRef.convertShow(this.selectionRows, {
          ...this.formConfig.formModel,
          isAllSelection,
          successFn: () => {
            if (isAllSelection) {
              this.reBack();
            } else {
              this.onTableSelectionChange();
              this.getDetail(this.formConfig.formModel.trayId);
            }
          },
        });
      }
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows.filter((e) =>
        [1, 4].includes(e.receivingSource)
      );
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      return [1, 4].includes(row.receivingSource); // 海外与头程可选
    },
  },
  created() {
    const { id } = this.$route.query;
    this["dictionary/getDictionary"]("exWarehouseManage").then(() => {
      this.getDetail(id);
    });
  },
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    // EditPutShelfDlg: () => import("../../storageShelving/editDlg"),
    BatchPutShelfDlg: () => import("../../storageShelving/batchDlg"),
    RedeliveryDialog: () => import("./redeliveryDlg.vue"),
    // ChangeNumDialog: () => import("./changeDlg.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-content-container {
	min-height: calc(100vh - 80px);
  .table-title {
    padding-top: 15px;
    padding-bottom: 15px;
    color: #515151;
    font-weight: bold;
  }
}
</style>
