<template>
  <div class="app-container">
    <div>
      <ComDetailTop
        :title="overseaLangObj.jh_dh"
        ref="detailTopRef"
        :formModel="formConfig.formModel"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{
              formConfig.formModel.warehouseName
                ? `(${formConfig.formModel.warehouseName})`
                : ""
            }}
          </span>
        </template>
      </ComDetailTop>
    </div>
    <div class="form">
      <ComForm :formConfig="formConfig" ref="myFormRef" v-if="showSearchForm" />
    </div>
    <div class="tabs-class custom-tabs-btn">
      <div>
        <template v-for="item in tabsConfig.tabs">
          <el-button
            size="small"
            plain
            :key="item.name"
            class="tabs-change"
            :type="item.name === tabsConfig.active ? 'activation' : ''"
            @click="changeTabs(item.name)"
          >
            {{ item.label }}
          </el-button>
        </template>
      </div>
      <div>
        <el-button
          type="text"
          style="margin-right: 15px"
          v-show="tabsConfig.active === '0'"
          :disabled="!this.selectionRows.length"
          @click="handlePrintExpressWaybill"
          >打印快递面单</el-button
        >
        <PreviewOrDownload
        v-if="[1, 2, 3, 4].includes(formConfig.formModel.pickingStatus)"
          :btnTxt="'按SKU打印拣货单'"
          style="margin-right: 15px"
          :previewDownloadConf="handlePreview()"
        />
        <PreviewOrDownload
          v-if="[1, 2, 3, 4].includes(formConfig.formModel.pickingStatus)"
          :btnTxt="overseaLangObj.dy_jhd('按订单打印拣货单')"
          :previewDownloadConf="previewDownloadConfig(formConfig.formModel)"
          @handleSuccess="(type) => handleSuccess(type, formConfig.formModel)"
        />
      </div>
    </div>
    <div>
      <div v-for="btn in tabsConfig.tabs" :key="btn.name">
        <ComTable
          :ref="`tableRef${btn.name}`"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableTabConfig(btn.name)"
          :httpRequest="tableConfig.httpRequest[btn.name]"
          :getQueryParams="getTableQueryParams"
          :selectionRow="selectionRowEvt"
          @onSelectionChange="onTableSelectionChange"
          :selectionTableRow="[...selectionRows]"
          selectionKey="temp_secondId"
          @getResult="getTableResult"
          v-if="tabsConfig.active == btn.name && showSearchForm"
        />
        <div class="grand-total" v-if="tabsConfig.active === btn.name">
          <template v-for="(tItem, i) in tableSubtotal">
            <span :key="`t_${i}`">
              <span>{{ tItem.totalLabel }}：</span>
              <span>{{ tItem.totalNum }}</span>
            </span>
          </template>
        </div>
      </div>
    </div>
    <template v-if="showSearchForm">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in getFootBtn()">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  getPickingOrderByList,
  getPickingByList,
  GetDownPickingSku,
} from "@/api/warehouse/manage";
import { tableDetailCols, pickingListDetails } from "./model";
import { getPickingList } from "@/api/warehouse/manage";
import { accumulationFn } from "@/utils/instructions";
import { uploadPickingBill } from "@/api/common.js";
import { pickingPut } from "@/api/warehouse/manage";
import { getStreamFileDownload } from "@/utils/zipdownload";
export default {
  data() {
    return {
      showSearchForm: false,
      tabsConfig: {
        active: "0",
        tabs: [
          {
            label: this.overseaLangObj.mx_cp_wd || "明细(产品维度)",
            name: "0",
          },
          {
            label: this.overseaLangObj.mx_dd_wd || "明细(订单维度)",
            name: "1",
          },
        ],
      },
      formConfig: {
        formModel: {},
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "122px" : "98px",
        lists: pickingListDetails, // 表单渲染列表
      },
      tableConfig: {
        tableHeight: "calc(100vh - 370px)",
        httpRequest: [getPickingByList, getPickingOrderByList],
      },
      selectionRows: [],
      tableSubtotal: [],
      footBtn: [
        // {
        //   text: "拣货完成",
        //   showStatus: [3],
        //   handleClick: (row) => {
        //     this.handleSuccess("completed", this.formConfig.formModel);
        //   },
        // },
        {
          text: this.overseaLangObj.gb_close,
          isAllBtn: true,
          handleClick: () => {
            this.reBack();
          },
        },
      ],
    };
  },
  methods: {
    getDetail(id) {
      this.showSearchForm = false;
      getPickingList({ id }).then((res) => {
        const detailData = res.rows[0] || {};
        this.formConfig.formModel = {
          ...detailData,
        };
        this.showSearchForm = true;
      });
    },
    handleTopClick() {
      const { id } = this.$route.query;
      this.getDetail(id);
    },
    getTableQueryParams() {
      const { id } = this.$route.query;
      return {
        id,
      };
    },
    handleSuccess(type, row) {
      const { pickingStatus, id, orderType } = row;
      const params = {
        id,
        orderType,
        pickingStatus: pickingStatus == 1 ? 2 : undefined,
      };
      if (type == "download" && pickingStatus == 1) {
        return pickingPut(params).then((e) => {
          this.reBack();
        });
      }
    },
    tableTabConfig(tName) {
      return tableDetailCols(tName);
    },
    changeTabs(tName) {
      this.tabsConfig.active = tName;
      if (tName === "0") {
        this.onTableSelectionChange();
      }
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = (rows || []).filter(
        (e) => e.dpInfoIdList && e.dpInfoIdList.length
      );
      this.$refs[
        `tableRef${this.tabsConfig.active}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      return row.dpInfoIdList && row.dpInfoIdList.length;
    },
    getFootBtn() {
      const { pickingStatus } = this.formConfig.formModel;
      const arr = this.footBtn.filter(
        (e) =>
          (e.showStatus && e.showStatus.includes(pickingStatus)) ||
          !e.showStatus
      );
      return arr;
    },
    getTableResult(rows) {
      const { tableData } = rows;
      const productNum = {
        totalLabel: this.overseaLangObj.product_total || "产品总数",
        totalNum: accumulationFn(tableData.map((e) => e.quantity)),
      };
      this.tableSubtotal = [productNum];
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handlePreview() {
      return {
        previewParam: this.formConfig.formModel.id,
        previewHttp: GetDownPickingSku,
      };
    },
    previewDownloadConfig(row) {
      const { id, orderType, pickingNumber, userName } = row;
      return {
        previewParam: {
          id,
          orderType,
          pickingNumber,
          userName,
        },
        previewHttp: uploadPickingBill,
      };
    },
    handlePrintExpressWaybill() {
      if (this.selectionRows?.length) {
        let infoIdList = [];
        this.selectionRows.forEach((e) => {
          infoIdList.push(...e.dpInfoIdList);
        });
        getStreamFileDownload(
          "urlDownloadDeliveryNote",
          {
            distributionType: 2, // 1=卡车；2=快递；3=自提
            infoIdList,
          },
          {
            method: "post",
            customFileName: "attach.zip",
          }
        ).then(() => {
          this.onTableSelectionChange();
        });
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    const { id } = this.$route.query;
    this["dictionary/getDictionary"]("exWarehouseDict").then((res) => {
      this.getDetail(id);
    });
  },
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .com-detail-top {
    margin: 0px 0px 15px;
    padding-top: 0px;
  }
  .form {
    border-bottom: 1px solid #e2e2e2;
  }
  .tabs-class {
    border-bottom: none;
    padding: 10px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
