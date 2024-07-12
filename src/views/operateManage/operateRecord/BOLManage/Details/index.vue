<template>
  <!-- 提单详情 -->
  <div class="app-container">
    <ComDetailTop
      title="提单信息"
      :formModel="formConfig.formModel"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    />
    <ComForm
      class="airline-from"
      :formConfig="formConfig"
      ref="myForm"
      v-if="isInitRes"
    >
      <template v-slot:MDG="slotProps">
        <div class="flex">
          {{ slotProps.formModel.MDG }}
          <div class="green tab-form">
            <el-tag
              :style="{
                color: `${
                  slotProps.dicsData && slotProps.dicsData.color
                    ? slotProps.dicsData.color
                    : '#35D06F'
                }`,
              }"
              size="mini"
              :color="`${
                slotProps.dicsData && slotProps.dicsData.color
                  ? `${slotProps.dicsData.color}1A`
                  : '#35D06F1A'
              }`"
              >{{
                slotProps.dicsData
                  ? slotProps.dicsData.nameCn
                  : slotProps.formModel.importExportType
              }}</el-tag
            >
            <el-tag
              size="mini"
              :style="{
                color: dicsImportExportType[
                  slotProps.formModel.importExportType
                ]
                  ? dicsImportExportType[slotProps.formModel.importExportType]
                      .color
                  : '#66A5FF',
              }"
              :color="`${
                dicsImportExportType[slotProps.formModel.importExportType]
                  ? dicsImportExportType[slotProps.formModel.importExportType]
                      .color
                  : '#66A5FF'
              }1A`"
              >{{
                dicsImportExportType[slotProps.formModel.importExportType] &&
                dicsImportExportType[slotProps.formModel.importExportType]
                  .nameCn
              }}</el-tag
            >
          </div>
        </div>
      </template>
    </ComForm>
    <el-container class="airline-table" v-if="formConfig.formModel.id">
      <el-aside class="airline-left" width="360px">
        <detailOperation
          :columnConfig="leftColumnConfig.columnConfig"
          :columnData="leftColumnConfig.columnData"
          @handleClick="handleTagChange"
        >
          <template v-slot:TDH="{ slotProps }">
            <!-- 操作单详情左侧的数据 -->
            <div
              @click="handleUpdate(slotProps.row, 'view')"
              v-if="slotProps.row.code"
            >
              提单号：<span class="primary-text-btn">{{
                slotProps.row.code
              }}</span>
            </div>
            <!-- <span
            功能没用到暂时移除，代码不删除，
              v-else
              class="primary-text-btn"
              @click.stop="handleUpdate(slotProps.row, 'merge')"
              >+HBL
              </span
            > -->
          </template>
        </detailOperation>
        <!-- </div> -->
      </el-aside>
      <el-main class="airline-right">
        <BLDetails
          ref="blDetailsRef"
          :mblModel="formConfig.formModel"
          @handleSuccess="handleSuccess"
        />
      </el-main>
    </el-container>
    <detailAddMerge ref="detailMerge" @mergeData="mergeData"></detailAddMerge>
    <editDialog ref="editDialogRef" @handleSuccess="handleSuccess" />
  </div>
</template>

<script>
import {
  // getAirlineGroupDetails,
  getAirlineList,
  getAirFlightList,
} from "@/api/marketManage/airline";
import { config, FCLconfig } from "./model";
import { mapActions, mapState } from "vuex";
import {
  getPopBillDetail,
  getLCLdetail,
  getLCLDetailById,
  getBillByIdInfo, //通过操作单ID获取提单详情
} from "@/api/operateRecord/BOLManage.js";

export default {
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TooltipOver: () => import("_comp/TooltipOver"),
    FCLOperation: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/FCLOperation/index.vue"
      ),
    detailOperation: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/detailOperation/index.vue"
      ),
    BLDetails: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/BLdetail/index.vue"
      ),
    detailAddMerge: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/detailAddMerge/index.vue"
      ),
    editDialog: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/editDialog/index.vue"
      ),
  },
  computed: {},
  data() {
    return {
      num: 1,
      formConfig: {
        formModel: {},
        httpRequest: this.getPopBillDetail, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "115px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.formLists,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      routeProxy: "",
      FclFormConfig: {
        formModel: {
          CZDH: "BS220500273",
          DCDL: "堡森市场部",
          ZXFS: "FCL整柜",
          WTR: "FBA深圳鑫塬",
          ZGXX: "20×20’GP，30×40’GP",
          importExportType: "1",
        },
        labelWidth: "115px",
        title: "操作单信息",
        // titleBtn: [
        //   {
        //     label: "+MBL",
        //     handleClick: () => {
        //       this.addShow();
        //     },
        //   },
        // ],
        titleBtn: {
          // 0: [
          //   {
          //     label: "+HBL",
          //     handleClick: () => {
          //       this.addShow({ orderType: "0" });
          //     },
          //   },
          // ],
          // 1: [
          //   {
          //     label: "+MBL",
          //     handleClick: () => {
          //       this.addShow({ orderType: "1" });
          //     },
          //   },
          // ],
          // 2: [],
        },
        lists: FCLconfig.lists, // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      leftColumnConfig: {
        columnConfig: {
          title: "操作单信息",
          // btns: {
          //   name: "+MBL",
          //   handleClick: () => {
          //     this.addShow({ orderType: "1" });
          //   },
          //   size: "mini",
          // },
          ...config.leftTableColumns,
        },
        columnData: [],
        paginationConfig: {
          limit: 10,
          layout: "total, prev, pager, next",
        },
      },
      operationRow: {},
      isInitRes: false,
    };
  },
  computed: {
    ...mapState({
      dicsImportExportType: (state) =>
        state.dictionary.dicsData.importExportType,
    }),
  },
  created() {
    this["dictionary/getDictionary"]("BLinfoTypeEn");
    this.getData();
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getData(callBack) {
      const { id: operationOrderId } = this.$route.query;
      this.isInitRes = false;
      getBillByIdInfo(operationOrderId).then((res) => {
        this.formConfig.lists[0].fieldList[0].rows[0].cols =
          FCLconfig.formLists;
        this.formConfig.formModel = res.data[0] || {};
        var arr = JSON.parse(JSON.stringify(res.data));
        // this.leftColumnConfig.columnData = res.data;
        arr.map((item, index) => {
          if (item.isMainBill === "1") {
            arr.splice(index, 1);
            return;
          }
        });
        this.leftColumnConfig.columnData = arr;
        this.isInitRes = true;
        callBack && callBack();
      });
    },
    getAirlineList(params) {
      return getAirlineList(params);
    },
    handleTagChange(row = {}) {
      //点击左侧修改右侧数据
      if (row.popId) {
        // 获取HBL列表
        this.$refs.blDetailsRef?.getHblList(row.id, row.popId);
      } else {
        this.$refs.blDetailsRef?.getInitHblorMblDetail(
          this.formConfig.formModel.popId,
          { ladingType: "mbl" }
        );
      }
      this.operationRow = row;
    },
    getDetails(id) {
      if (id) {
        this.getData(() => {
          this.$nextTick(() => {
            this.handleTagChange();
          });
        });
      } else {
        this.reBack();
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails(id);
      }
    },
    addShow(row) {
      // const { orderType } = row;
      // this.$refs.editDialogRef.show(
      //   { operationOrderId: this.$route.query.id },
      //   "add",
      //   orderType
      // );
    },
    handleUpdate(data, type, rows) {
      if (type === "merge") {
        var arr = [];
        this.leftColumnConfig.columnData.map((item) => {
          if (
            !item.code &&
            item.bailorPeople === data.bailorPeople &&
            item.id !== data.id
          ) {
            arr.push(item);
          }
        });
        if (arr.length === 0) {
          const paras = {
            mergeOperationId: data.id,
          };
          this.$refs.editDialogRef.show(paras, "merge");
          return;
        }
        this.$refs.detailMerge.show(arr, data.id);
      }
    },
    mergeData(rows, hblOrMbl) {
      this.$refs.editDialogRef.show(rows, hblOrMbl);
    },
    handleSuccess() {
      this.getData();
      this.handleTagChange(this.operationRow);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  padding: 0;
  .el-tag {
    border: none;
  }
  .airline-from {
    padding: 0 20px 10px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    .green {
      color: #53c88a;
    }
    .tab-form .el-tag {
      height: auto;
      line-height: initial;
      padding: 2px 13px;
      border-radius: 12px;
    }
  }
  .airline-table {
    height: calc(100vh - 202px);
    border-top: 1px solid #e2e2e2;

    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .airline-left {
      background: #fff;
      border-right: 1px solid #e2e2e2;
      margin-bottom: 0;
      padding: 8px 0 0 0;

      .el-tag {
        margin-left: 4px;
      }
      .tableData {
        height: calc(100% - 34px);
      }
    }

    .airline-right {
      padding: 15px 8px;
      background: #fcfcfc;

      &::-webkit-scrollbar {
        z-index: 11;
        width: 6px;
      }
      &::-webkit-scrollbar:horizontal {
        height: 6px;
      }
      .title {
        margin-bottom: 8px;
      }
      .tableData {
        height: calc(100% - 26px);
      }
    }
  }
}
</style>
