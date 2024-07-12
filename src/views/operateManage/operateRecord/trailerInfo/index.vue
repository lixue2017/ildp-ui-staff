<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchTabForm(idx)"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig[idx]"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :rowOperationBtnListFn="getStatusBtnList"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <div
                    class="display-flex"
                    @click="handleTrailer(slotProps.row, true)"
                  >
                    <span class="primary-text-btn ellipsis-text">
                      {{ slotProps.row.code || "--" }}
                    </span>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'shipperName'">
                  <span class="primary-text-color">{{
                    WAREHOUSE_TYPE[slotProps.row.shipperType]
                  }}</span>
                  <span> {{ slotProps.row.shipperName }}</span>
                </template>
                <template v-if="slotProps.prop === 'consigneeName'">
                  <span class="primary-text-color">{{
                    WAREHOUSE_TYPE[slotProps.row.consigneeType]
                  }}</span>
                  <span> {{ slotProps.row.consigneeName }}</span>
                </template>
                <!-- <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template> -->
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-if="tabsConfig.activeName === '2'" v-slot:slotTabsRight>
        <!-- <el-dropdown trigger="click" class="add-trailer"> -->
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          class="btn-type-add"
          @click="handleTrailer(tabBtnArr[0])"
        >
          新增
          <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
        </el-button>
        <!-- <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(tabBtn, iBtn) in tabBtnArr" :key="iBtn"
              @click.native="handleTrailer(tabBtn)"
            >{{tabBtn.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </template>
    </ComTabs>

    <editTrailer ref="trailerEditRef" @handleSuccess="mixinkeepTable" />
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script>
import {
  getTrailerList,
  delPopTrailer,
  setTrailerStatus,
} from "@/api/performance/record";
import { getNodeDetail } from "@/api/operateManage/common";
import { mapActions, mapState } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import { WAREHOUSE_TYPE } from "@/utils/mixin";
import { formatDate } from "@/utils/index.js";
import editTrailer from "./editTrailer";
import { searchColumns, tableColumns, ordinaryTableCols } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "TrailerInfo",
  mixins: [mixinColsConf],
  components: {
    editTrailer,
    ComDialog: () => import("_comp/ComDialog"),
    ComUpload: () => import("_comp/ComUpload"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  data() {
    let activeName = "1";
    const { params } = this.$route.query;
    if (params) {
      try {
        const { activeName: tName } = JSON.parse(params);
        activeName = tName;
      } catch {}
    }
    return {
      WAREHOUSE_TYPE,
      tabsConfig: {
        activeName,
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        },
        tabs: [
          {
            label: "集装箱拖车",
            name: "1",
          },
          {
            label: "一般拖车",
            name: "2",
          },
        ],
      },
      tabBtnArr: [
        {
          label: "拖车到仓",
          type: 1,
          trailerType: 2,
        },
        {
          label: "拖车离仓",
          type: 1,
          trailerType: 3,
        },
        {
          label: "其他",
          type: 1,
          trailerType: 4,
        },
      ],
      customerTable: {
        statusBtnList: [
          {
            text: "进度反馈",
            showStatus: [0],
            handleClick: this.handleUpdate,
          },
          {
            text: "拖车完结",
            showStatus: [1],
            handleClick: this.handleUpdate,
          },
          {
            text: "修改",
            showStatus: [0],
            handleClick: (r) => this.handleTrailer(r),
          },
          {
            text: "删除",
            // info: true,
            color: "#FF6767",
            showStatus: [0],
            handleClick: this.handleDelete,
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "105px",
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getTrailerList,
        columnConfig: [tableColumns, ordinaryTableCols],
      },
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("trailer").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    async handleUpdate(row, isSee = false) {
      const { activeName } = this.tabsConfig;
      row.trailerType == 0; //到港 节点 37: 出发 15: 到达
      //离港 41: 出发 40: 到达
      let nodeId;
      if (row.trailerType == 0) {
        nodeId = row.status == 1 ? 15 : 37;
      } else {
        nodeId = row.status == 1 ? 40 : 41;
      }
      if (activeName === "2") {
        if (nodeId == 37 || nodeId == 41) {
          this.$refs.trailerEditRef.show({
            ...row,
            trailerType: row.trailerType > 2 ? 2 : row.trailerType, //拖车类型  0 集装箱到港 1集装箱离港   2拖车到仓  3拖车离仓  4其他
            type: this.tabsConfig.activeName - 1, // row.type 0 集装箱拖车  1一般拖车
            isSee: true,
            operationBtn: nodeId,
          });
          return;
        }
        setTrailerStatus({
          id: row.id,
          operationOrderId: row.operationOrderId, // 操作单ID
          operationOrderNum: row.operationOrderNum,
          status: Number(row.status) + 1,
        }).then(() => {
          this.$confirm("当前拖车流程已完结!", "拖车完结!", {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            type: "success",
          }).then(() => {
            this.msgSuccess("更新成功");
            this.mixinkeepTable();
          });
        });
      } else {
        if (nodeId == 37 || nodeId == 41) {
          this.$refs.trailerEditRef.show({
            ...row,
            trailerType: row.trailerType > 2 ? 2 : row.trailerType, //拖车类型  0 集装箱到港 1集装箱离港   2拖车到仓  3拖车离仓  4其他
            type: this.tabsConfig.activeName - 1, // row.type 0 集装箱拖车  1一般拖车
            isSee: true,
            operationBtn: nodeId,
          });
          return;
        }
        // const nodeTrailerMsg = (await getNodeDetail(nodeId)).data || {};
        // const dialogTitle = `拖车${row.status == 1 ? "到达" : "出发"}`;
        setTrailerStatus({
          id: row.id,
          type: 0, // 0: 集装箱拖车
          trailerType: [15, 37].includes(nodeId) ? 0 : 1, // 0: 到港 1: 离港
          operationOrderId: row.operationOrderId, // 操作单ID
          operationOrderNum: row.operationOrderNum,
          status: Number(row.status) + 1,
        }).then((res) => {
          this.$confirm("当前拖车流程已完结!", "拖车完结!", {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            type: "success",
          }).then(() => {
            this.msgSuccess("更新成功");
            this.mixinkeepTable();
          });
        });
      }
    },
    handleDelete(row) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        delPopTrailer(row.id).then(() => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        });
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, declareDate, stateList, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        stateList: stateList?.length ? stateList.join(",") : undefined,
        beginTime: createTime ? `${createTime[0]}@${createTime[1]}` : undefined,
        declareDate: declareDate
          ? `${declareDate[0]}@${declareDate[1]}`
          : undefined,
      };
      this.mixinkeepTable(true);
    },
    // 新增/编辑/查看
    handleTrailer(row, isSee = false) {
      // console.log("handleUpdate==", row);
      this.$refs.trailerEditRef.show({
        ...row,
        trailerType: row.trailerType > 2 ? 2 : row.trailerType, //拖车类型  0 集装箱到港 1集装箱离港   2拖车到仓  3拖车离仓  4其他
        type: this.tabsConfig.activeName - 1, // row.type 0 集装箱拖车  1一般拖车
        isSee,
      });
    },
    getStatusBtnList(row) {
      const { status } = row;
      if (status == 2) {
        return [];
      } else {
        return this.customerTable.statusBtnList.filter((e) =>
          e.showStatus.includes(status)
        );
      }
    },
    getQueryParams() {
      const { stateList } = this.searchFromData[this.tabsConfig.activeName] || {};
      Array.isArray(stateList) &&
        (this.searchFromData[this.tabsConfig.activeName].stateList =
          stateList.join(","));
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        type: this.tabsConfig.activeName - 1,
      };
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(index), // 表单渲染列表
      };
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-content {
  .btn {
    display: flex;

    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;

      &.operate-icon-info {
        color: #606060;
      }

      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
.add-trailer {
  /deep/ .el-button-group .el-button--primary:last-child {
    height: 28px;
  }
}
.dialog-form {
  padding-right: 30px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
</style>
