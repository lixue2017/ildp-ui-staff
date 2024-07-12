<template>
  <!-- 新页面 -->
  <div>
    <div class="base-flex-between export-btn">
      <div>
        <span class="title">
        {{ overseaLangObj.ps_delivery_info || "派送信息" }}
      </span>
    </div>
      <div>
				<el-button size="small" type="primary" round @click="handleGoodsExport">
					{{ overseaLangObj.export_cargo_size || "导出货物箱规表" }}
				</el-button>
				<el-button size="small" type="primary" round @click="handleExport">
					{{ overseaLangObj.dc_export("导 出") }}
				</el-button>
			</div>
    </div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumns"
      :httpRequest="tableConfRequest()"
      :getQueryParams="getQueryParams"
      :pagination="false"
			@getResult="calcNumTotal"
    >
      <!-- :customSort="{ prop: 'canNo', order: 'descending' }" -->
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'cmrNo'">
          <span
            v-if="slotProps.row.cmrNo"
            class="primary-text-btn"
            @click="handleClearanceView(slotProps.row)"
          >
            {{ slotProps.row.cmrNo }}
          </span>
          <span v-else>--</span>
        </template>
      </template>
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
</template>

<script>
import { comFileDownload } from "@/utils/download.js";
import { accumulationFn } from "@/utils/instructions";
import { tableColumns } from "./model.js";
import {
  getSendInfoList,
  sendInfoExport,
  getClearanceSendInfoList,
  sendInfoClearanceExport,
	exportBoxGauge,
} from "@/api/warehouse/prediction";
export default {
  props: {
    dispatchObj: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      tableColumns,
			tableSubtotal: [],
    };
  },
  methods: {
    handleGoodsExport() {
			comFileDownload(this, exportBoxGauge, this.getQueryParams());
    },
		handleExport() {
      const { viewSource } = this.dispatchObj;
      let httpExport = sendInfoExport;
      if (viewSource === "clearanceTab") {
        httpExport = sendInfoClearanceExport;
      }
			comFileDownload(this, httpExport, this.getQueryParams());
    },
    getQueryParams() {
      return {
        operationId: this.dispatchObj.id,
      };
    },
    tableConfRequest() {
      const { viewSource } = this.dispatchObj;
      if (viewSource === "clearanceTab") {
        return getClearanceSendInfoList;
      }
      return getSendInfoList;
    },
    handleClearanceView(row) {
      const { truckId } = row;
      if (truckId) {
        this.$router.push({
          path: "/warehouseManage/process/editTruckRecord",
          query: {
            id: truckId,
            backPath: this.$route.fullPath,
          },
        });
      } else {
        this.$message.error("缺少卡车数据");
      }
    },
		calcNumTotal({ tableData: arr = [] }) {
			this.tableSubtotal = [{
				totalLabel: this.overseaLangObj.tc_zxs || "头程总箱数",
				totalNum: accumulationFn(arr.map(e => e.ecNum))
			}, {
				totalLabel: this.overseaLangObj.yb_ztj || "预报总体积/CBM",
				totalNum: accumulationFn(arr.map(e => e.checkNum), 2)
			}, {
				totalLabel: this.overseaLangObj.yb_zzl || "预报总重量/KGS",
				totalNum: accumulationFn(arr.map(e => e.checkWeight), 2)
			}]
		},
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.export-btn {
  margin: 10px 0px;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
