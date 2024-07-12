<template>
  <div v-if="isInitRes">
    <div class="base-flex-between tit-btn">
      <span>{{overseaLangObj.trailer_info || "拖车信息"}}</span>
      <el-button
        size="small"
        type="primary"
        round
        @click="handleTrailer({ operationOrderId: operateId })"
      >
        {{ trailerModeType === 1 ? overseaLangObj.jzx_lg : "新增集装箱拖车" }}
      </el-button>
    </div>
    <ComTable
      :ref="`tableRef`"
      :columnConfig="tableConfig.columnConfig"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="getQueryParams"
      :current-row="true"
      @onCurrentChange="onCurrentChangeEvt"
      @getResult="getTableResult"
      :pagination="false"
    >
      <!-- :paginationConfig="{ limit: 999 }" -->
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'code'">
          <div
            class="display-flex"
            @click.stop="handleTrailer(slotProps.row, true)"
          >
            <span class="primary-text-btn ellipsis-text">
              {{ slotProps.row.code || "--" }}
            </span>
          </div>
        </template>

        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content-btn">
            <template v-for="(item, index) in tableConfig.statusBtnList">
              <el-button
                :key="index"
                size="small"
                type="text"
                @click="item.handleClick(slotProps.row)"
                v-debounce
                >{{ item.text }}</el-button
              >
            </template>
            <div style="marginLeft: 10px">
              <PreviewOrDownload
                btnTxt="托运单预览"
                :previewDownloadConf="previewDownloadConfig(slotProps.row.id)"
              />
            </div>
          </div>
        </template>
      </template>
    </ComTable>

    <EditTrailer ref="trailerEditRef" @handleSuccess="handleRefresh" />

    <div class="address-tit">
      {{ trailerModeType === 1 ? "目的地址" : "地址信息" }}
    </div>
    <ComTable
      :ref="`addressTableRef`"
      :columnConfig="addressTableConf.columnConfig"
      :pagination="false"
      :columnData="[]"
    >
    </ComTable>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import {
  getTrailerList,
  delPopTrailer,
  getTrailerAddress,
  getTrailerPreview,
  copyPopTrailer,
} from "@/api/performance/record";
import { trailerTableCols, addressTableCols } from "./model";

export default {
  props: {
    operateId: {
      type: [String, Number],
      default: () => "", // 操作单ID
    },
    trailerModeType: {
      type: [String, Number],
      default: () => 0, // 拖车类型  0 集装箱到港 1集装箱离港
    },
  },
  data() {
    return {
      tableConfig: {
        tableHeight: "calc(100vh - 324px)",
        columnConfig: trailerTableCols,
        httpRequest: getTrailerList,
        statusBtnList: [
          {
            text: "复制",
            handleClick: (row) => {
              this.addressObj.isChangeAddress = true; // 编辑后更新地址
              const { id, ...params } = row;
              this.comRepeatedRequest(this, copyPopTrailer, {
                id,
              }).then(() => {
                this.$message.success("复制成功！");
                this.handleRefresh();
                // this.handleTrailer({
                //   id: res.data,
                //   ...params,
                // });
              });
            },
          },
          {
            text: "编辑",
            handleClick: (row) => {
              this.addressObj.isChangeAddress = true; // 编辑后更新地址
              this.handleTrailer(row);
            },
          },
          {
            text: "删除",
            handleClick: this.handleDelete,
          },
        ],
      },
      addressTableConf: {
        columnConfig: addressTableCols,
      },
      addressObj: {}, // 用于选中拖车行，带出地址信息
      isInitRes: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("trailer");
    this.getInitDetail();
  },
  methods: {
    // 预览、下载参数与接口
    previewDownloadConfig(tId) {
      return {
        previewParam: {
          tId,
        },
        previewHttp: getTrailerPreview,
      };
    },
    // 新增/编辑/查看
    handleTrailer(row = {}, isSee = false) {
      // console.log("handleUpdate==", row);
      this.$refs.trailerEditRef.show({
        ...row,
        trailerType: this.trailerModeType, //拖车类型  0 集装箱到港 1集装箱离港   2拖车到仓  3拖车离仓  4其他
        type: 0, // 0 集装箱拖车  1一般拖车
        isSee,
      });
    },
    async getInitDetail() {
      // this.isInitRes = false;
      // const desData = await this["operateDetails/storeTrailerList"]({
      //   operationOrderId: this.operateId
      // })
      //拖车信息

      this.isInitRes = true;
    },
    handleDelete(row = {}) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        delPopTrailer(row.id).then(() => {
          this.msgSuccess("删除成功");
          if (this.addressObj.id === row.id) {
            this.addressObj = {};
          }
          this.handleRefresh();
        });
      });
    },
    handleRefresh() {
      this.$refs.tableRef?.refreshTable();
    },
    getTableResult({ tableData }) {
      if (tableData.length && !this.addressObj.id) {
        // 初始化与删除当前行时需选中第一行的拖车地址
        this.$refs.tableRef?.setComCurrentRow(tableData[0]);
      }
      if (this.addressObj.isChangeAddress) {
        // 编辑当前行时更新地址信息
        this.addressObj.isChangeAddress = undefined;
        this.onCurrentChangeEvt(this.addressObj);
      }
    },
    onCurrentChangeEvt(row = {}) {
      // 根据拖车行获取地址
      this.addressObj = row;
      getTrailerAddress({ popTrailerId: row.id }).then((res) => {
        this.$refs.addressTableRef?.setNewTableData(res.rows || []);
      });
    },
    getQueryParams() {
      return {
        operationOrderId: this.operateId,
        exportTypeList: this.trailerModeType,
        type: 0,
      };
    },
    ...mapActions([
      "dictionary/getDictionary",
      "operateDetails/storeTrailerList",
    ]),
  },
  components: {
    EditTrailer: () =>
      import(
        "@/views/operateManage/operateRecord/trailerInfo/editTrailer/index.vue"
      ),
    ComTable: () => import("_comp/ComTable"),
    TooltipOver: () => import("_comp/TooltipOver"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.tit-btn {
  margin:10px 0px;
}
.address-tit {
  margin: 20px 0 10px;
}
</style>
