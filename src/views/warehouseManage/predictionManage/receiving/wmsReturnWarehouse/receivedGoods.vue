<template>
  <div class="received-goods-table">
    <div>
      <div class="base-flex-align">
        <div class="table-title">
          {{ overseaLangObj.ysh_info || "已收货信息" }}
        </div>
        <!-- <span class="tab-reminder">* 转存仓/转派送/上架都是基于托盘维度</span> -->
      </div>
      <ComTable
        :ref="`rTableRef`"
        :tableHeight="tableAutoHeight()"
        :columnConfig="tableReceivedColumns()"
        :columnData="[]"
        :rowOperationBtnListFn="(r) => tableReceiptStatusList(r)"
        @handleTableView="(r) => handleTrayTable(r)"
        @handleRowUpload="(r) => handleRowUpload(r)"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'sku'">
            <div class="sku-mark" v-if="slotProps.row.addSource === 2">新</div>
            <el-row class="ellipsis-text">
              {{ slotProps.row.sku || "--" }}
            </el-row>
          </template>
        </template>
      </ComTable>
    </div>

    <ComUpload
      style="display: none"
      ref="uploadSchemeRef"
      :uploadConfig="uploadSchemeConfig"
      @handleSuccess="uploadSuccess"
    />

    <BatchGroundingDlg ref="groundingRef" />
    <TrayCargoDrawer ref="cargoRef" />
  </div>
</template>

<script>
import { wmsReceivedTableCols } from "./model";
import { getAttachList } from "@/api/overseas/fbaOrder";
import {
  putReturnReceipt,
  delReturnReceipt,
  uploadReturnReceipt,
  putRemarkReturnReceipt,
} from "@/api/warehouse/process";
import { defaultTextParams, fileTypeUploadUrl } from "_comp/ComUpload/model";
import { mixinTableOperationRow } from "_comp/ComTable/tableOperation/rowOperationMixin.js";
export default {
  mixins: [mixinTableOperationRow],
  props: {
    receivedObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rightBtnList: [
        {
          text: this.overseaLangObj.cp_pl_hs("产品批量核实"),
          btnType: 1,
          handleClick: () => {
            this.handleVerify(this.selectRowList);
          },
        },
        {
          text: this.overseaLangObj.qd_sh || "确定收货",
          btnType: 2,
          handleClick: () => {
            this.bindTrayBefore();
          },
        },
      ],
      tableReceiptBtnList: [
        {
          text: "去上架",
          btnStatus: ["w_11"],
          handleClick: (r) => this.handleBatchEdit([r]),
        },
        // {
        //   text: "转派送",
        //   btnStatus: ['w_11'],
        //   handleClick: (row) => {},
        // },
        // {
        //   text: "取消下架",
        //   btnStatus: ['w_12'],
        //   handleClick: (row) => {},
        // },
      ],
      editBaseData: {},
      uploadSchemeConfig: {
        ...defaultTextParams,
        url: fileTypeUploadUrl,
        showFileList: false,
        accept: ".jpeg,.jpg,.png,.bmp",
        uploadData: {
          type: 250, // 附件类型
        },
      },
      selectRowList: [],
      mixinTableRef: "rTableRef",
      mixinOperationObj: {
        httpSaveRequest: (r) => {
          return putReturnReceipt({
            id: r.id,
            num: r.takeNum,
            // attachId: (r.attachList || []).map((f) => f.id).join(","),
          });
        },
        saveCallBack: () => this.handleChange(),
        httpDelRequest: (r) => delReturnReceipt(r.id),
        delCallBack: () => this.handleChange(),
      },
    };
  },
  methods: {
    handleBatchEdit(rows) {
      const { warehouseId } = this.receivedObj;
      console.log("==warehouseId", warehouseId, this.receivedObj);
      this.$refs.groundingRef?.show(rows, {
        warehouseId,
        successFn: () => this.handleChange(),
      });
    },
    handleChange() {
      this.$emit("onChangeRefresh");
    },
    handleRowUpload(r) {
      this.editBaseData.uploadRow = r; // 对象类型暂存, 保证上传后赋值到同一数据源
      // this.uploadSuccess({ data: [7955] });
      this.$refs.uploadSchemeRef?.handleUploadClick();
    },
    uploadSuccess(res) {
      // 上传后更新表格数据
      console.log("===2", res);
      if (res.data?.length) {
        const { id, attachList } = this.editBaseData.uploadRow;
        const idArr = (attachList || [])
          .map((f) => f.id)
          .concat(res.data || []);
        uploadReturnReceipt({
          id,
          attachIds: idArr.join(","),
        }).then(() => {
          getAttachList({ attachId: res.data.join(",") }).then((fRes) => {
            this.editBaseData.uploadRow.attachList.push(...(fRes.data || []));
          });
        });
      }
    },
    handleTrayTable(row) {
      this.$refs.cargoRef?.show(row);
    },
    tableReceiptStatusList(row) {
      if (row.kw) {
        // 已上架
        return this.tableReceiptBtnList.filter((e) =>
          e.btnStatus.includes("w_12")
        );
      }
      if (this.receivedObj.receiptOk || row.rowReceiptOk) {
        // 收货完成
        return this.tableReceiptBtnList.filter((e) =>
          e.btnStatus.includes("w_11")
        );
      }
      return [
        ...(row.rBtnUpdate
          ? []
          : this.tableReceiptBtnList.filter((e) =>
              e.btnStatus.includes("w_11")
            )),
        ...this.mixinTableRowBtnArr().filter(
          (btn) => (btn.btnUpdate || false) === (row.rBtnUpdate || false)
        ),
      ];
    },
    tableReceivedColumns() {
      return wmsReceivedTableCols(this.receivedObj.receiptOk, {
        httpDelImgRequest: (row, idx) => {
          const cRow = JSON.parse(JSON.stringify(row)); // 防止接口报错也删除成功
          cRow.attachList.splice(idx, 1);
          return uploadReturnReceipt({
            id: cRow.id,
            attachIds: (cRow.attachList || []).map((f) => f.id).join(","),
          });
        },
        onAreaChange: (cRow) => {
          putRemarkReturnReceipt({
            id: cRow.id,
            remark: cRow.remark,
          }).then(() => {
            this.msgSuccess("备注成功");
          });
        },
      });
    },
    setReceivedTableData(okArr) {
      this.setTableMixinData(okArr);
    },
    tableAutoHeight() {
      return (this.mixinTableDataArr || []).length > 6
        ? `${7 * 49}px`
        : undefined;
    },
  },
  created() {},
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComUpload: () => import("_comp/ComUpload"),
    BatchGroundingDlg: () => import("../components/batchGrounding"),
    TrayCargoDrawer: () => import("../components/trayCargo"),
  },
};
</script>

<style lang="scss" scoped>
.received-goods-table {
  .table-title {
    color: #515151;
    font-weight: bold;
    margin: 15px 0;
  }
  .tab-reminder {
    margin: 0 5px;
    color: #5094ff;
  }
  .sku-mark {
    font-size: 12px;
    height: 17px;
    line-height: 17px;
    text-align: center;
    border-radius: 0px 0px 19px 0px;
    color: #fff;
    background: #96dcb7;
    max-width: 48px;
  }
}
</style>
