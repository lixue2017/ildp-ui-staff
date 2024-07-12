<template>
  <div>
    <div class="base-flex-between">
      <div class="title-txt">清报关信息</div>
      <div>
        <template v-for="(hBtn, index) in tableHeadBtnArr || []">
          <el-button
            :key="`h_${index}`"
            size="small"
            type="primary"
            plain
            round
            v-debounce
            @click="() => hBtn.handleClick(hBtn)"
            >{{ hBtn.text }}</el-button
          >
        </template>
      </div>
    </div>

    <ComTable
      ref="cTableRef"
      :columnConfig="tableTabConfig()"
      :httpRequest="getCustomDeclarationInfo"
      :getQueryParams="() => getTableQueryParams()"
      :pagination="false"
      :rowOperationBtnListFn="(r) => (r.isShowFile === 1 ? tableBtnList : [])"
      @getResult="getTableResult"
      @handleTableView="(r) => handleView(r)"
    >
      <template v-slot:customRow="{ slotProps }">
        <template
          v-if="['xx_c_bg', 'xx_c_qg', 'xx_c_fx'].includes(slotProps.prop)"
        >
          <template v-if="slotProps.row.isShowFile == 0">--</template>
          <PreviewOrDownload
            v-else
            btnTxt="资料下载"
            :btnConf="{ btnType: 'primary', plain: true, round: true }"
            :previewDownloadConf="
              previewDownloadConfig(slotProps.row, slotProps.prop)
            "
          />
        </template>
      </template>
    </ComTable>

    <ComCustomDialog
      ref="customDlgRef"
      :slotDlgFormIds="['fileDeclarationSlot']"
    >
      <template v-slot:fileDeclarationSlot="slotProps">
        <FileUploadTable
          ref="mUploadTypeRef"
          :uploadTableConfig="{
            showFileTypeArr,
            attachList: slotProps.formModel.attachList,
          }"
        />
      </template>
    </ComCustomDialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import {
  getCustomDeclarationInfo,
  postCustomBatchDownloadAttach,
} from "@/api/operateManage/details.js";
import { batchExportZipDownloadEC } from "@/api/performance/record.js";
import { mixinDeclarationNodeFile } from "./mixinNode";
import { tableDeclarationCols } from "./model";
export default {
  mixins: [mixinDeclarationNodeFile],
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      getCustomDeclarationInfo,
      tableHeadBtnArr: [
        {
          text: "导出箱单发票",
          handleClick: () => {
            comFileDownload(this, batchExportZipDownloadEC, {
              importType: 3, // 预报
              type: 1,
              idList: this.tableData.map((e) => e.id),
            });
          },
        },
        // {
        //   text: "批量下载清关资料",
        //   handleClick: () => this.handleBatchDownloadAttach(6),
        // },
        // {
        //   text: "批量下载报关资料",
        //   handleClick: () => this.handleBatchDownloadAttach(2),
        // },
      ],
      tableData: [],
      tableBtnList: [
        {
          text: "上传资料",
          handleClick: (r) =>
            this.handleMixinUploadDialogFile(r, () => {
              this.$emit("handleSuccess");
              this.requestTableData();
            }),
        },
      ],
    };
  },
  methods: {
    handleBatchDownloadAttach(type) {
      let idList = [];
      this.tableData.forEach((e) => {
        e.id && idList.push(e.id);
        e.orderId && idList.push(e.orderId);
      });
      comFileDownload(this, postCustomBatchDownloadAttach, {
        type,
        idList,
      });
    },
    previewDownloadConfig(e, tKey) {
      let idList = [];
      e.id && idList.push(e.id);
      e.orderId && idList.push(e.orderId);
      const typeObj = {
        // 2-客户报关资料   5-报关放行资料   6-客户清关资料
        xx_c_bg: 2,
        xx_c_qg: 6,
        xx_c_fx: 5,
      };
      return {
        previewParam: {
          idList,
          type: typeObj[tKey],
        },
        previewHttp: postCustomBatchDownloadAttach,
      };
    },
    requestTableData() {
      this.$refs.cTableRef?.refreshTable();
    },
    getTableResult({ tableData }) {
      this.tableData = tableData;
    },
    handleView(row) {
      let pathUrl = "";
      if (row.orderType === 2) {
        pathUrl = "/operateManage/ecOperateDetails";
      } else {
        let extend = "";
        if (row.isMainBill === 5) {
          extend = "/extend";
        }
        switch (row.orderType) {
          case 3:
            pathUrl = `/operateManage/seaTransDetails${extend}`;
            break;
          case 4:
            pathUrl = `/operateManage/airTransDetails${extend}`;
            break;
          default:
            pathUrl = "/operateManage/otherDetails";
            break;
        }
      }
      this.$router.push({
        path: pathUrl,
        query: {
          id: row.id, // 操作单ID
          backPath: this.$route.fullPath,
        },
      });
    },
    getTableQueryParams() {
      const { id, isMainBill } = this.formData;
      return {
        operationOrderId: id,
        isMainBill,
      };
    },
    tableTabConfig() {
      return tableDeclarationCols();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  mounted() {},
  created() {
    this["dictionary/getDictionary"](["freightType", "customsDeclarationType"]);
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title-txt {
  padding: 20px 0 15px;
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
}
</style>
