<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <div v-if="isView">
            <ChangeView
              ref="changeView"
              :isRefresh="isRefresh"
              class="viewPattern"
              @isRefresh="isRefresh = false"
            >
              <template v-slot:viewContent="{ slotProps }">
                <div class="title-content">
                  <div
                    :class="`default ellipsis-text ${
                      (slotProps.row.orderNum &&
                        !slotProps.row.isCabinet &&
                        'edit') ||
                      (!slotProps.row.orderNum &&
                        !slotProps.row.isCabinet &&
                        'deleteOrEdit')
                    }`"
                  >
                    <span>{{
                      `${slotProps.row.startPortName}>${slotProps.row.endPortName}`
                    }}</span>
                  </div>
                  <div>
                    <el-dropdown
                      @command="handleCommand"
                      v-if="getListsBtn(slotProps.row).length"
                    >
                      <span class="icon">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-for="(item, index) in getListsBtn(slotProps.row)"
                          :key="index"
                          :command="{
                            handleClick: item.handleClick,
                            row: slotProps.row,
                          }"
                        >
                          {{ item.text }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="middle-content">
                  <span class="ellipsis-text">{{
                    `${
                      slotProps.row.boxModelCode
                        ? slotProps.row.boxModelCode
                        : "--"
                    }/${slotProps.row.sono ? slotProps.row.sono : "--"}`
                  }}</span>
                  <span class="ellipsis-text">{{
                    `${
                      slotProps.row.flightName ? slotProps.row.flightName : "--"
                    }/${
                      slotProps.row.routeNoMangeName
                        ? slotProps.row.routeNoMangeName
                        : "--"
                    }`
                  }}</span>
                </div>
                <div class="foot-content">
                  <div
                    :class="`default ellipsis-text ${
                      (slotProps.row.orderNum &&
                        !slotProps.row.isCabinet &&
                        'edit') ||
                      (!slotProps.row.orderNum &&
                        !slotProps.row.isCabinet &&
                        'deleteOrEdit')
                    }`"
                  >
                    <span
                      class="ellipsis-text"
                      v-if="slotProps.row.isCabinRelease"
                      >√放舱</span
                    >
                    <span class="ellipsis-text" v-if="slotProps.row.isCabinet"
                      >√做柜</span
                    >
                  </div>
                  <div>
                    <span class="ellipsis-text">{{
                      slotProps.row.createBy
                    }}</span>
                  </div>
                </div>
              </template>
            </ChangeView>
          </div>
          <div v-else>
            <keep-alive>
              <ComForm
                :formConfig="searchFormConfig"
								@searchHeight="searchHeight"
                v-if="showSearchForm && tabsConfig.activeName === tab.name"
              >
                <template v-slot:form-submit>
                  <ComColumnConf
                    :tableCols="tableAllMixinConfig(tab.name)"
                    :tName="tab.name"
                    @setColumnConf="(arr) => setColumnMixinConf(arr)"
                  />
                </template>
              </ComForm>
            </keep-alive>
            <keep-alive v-if="mixinShowTable">
              <ComTable
                :ref="`tableRef${tab.name}`"
                :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
                :httpRequest="tableConfig.httpRequest"
                :columnConfig="tableMixinConfig(tab.name)"
                :getQueryParams="getQueryParams"
                :rowOperationBtnListFn="getStatuLists"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'routeNoMangeCode'">
                    <span
                      class="primary-text-btn"
                      @click="handleView(slotProps.row)"
                    >
                      {{
                        slotProps.row.routeNoMangeCode
                          ? slotProps.row.routeNoMangeCode
                          : "--"
                      }}
                    </span>
                  </template>
                </template>
              </ComTable>
            </keep-alive>
          </div>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <div class="switchBtn">
          <el-button size="mini" type="primary" round plain @click="switchView">
            {{ isView ? "切换列表模式" : "切换视图模式" }}</el-button
          >
        </div>
        <!-- <div class="switchLayout" @click="switchView">
          {{ isView ? "切换列表模式" : "切换视图模式" }}
        </div> -->
      </template>
    </ComTabs>
    <ConfirmDialog ref="ConfirmDialog" />
    <SonoDialog
      ref="SonoDialogRef"
      :WEB_ids="WEB_ids"
      @handleSuccess="_mixinkeepTable"
    />
    <RelatedRoute
      ref="RelatedRouteRef"
      :WEB_ids="WEB_ids"
      @handleSuccess="_mixinkeepTable"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { ecPendApproval } from "./model.js";
import {
  getSonoPageLists,
  deleteSono,
  POSTOrderIsolateConfig,
} from "@/api/marketManage/airline.js";

export default {
  name: "AirlineInfo",
  mixins: [mixinColsConf],
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ChangeView: () =>
      import("@/views/marketManage/components/changeView/index.vue"),
    ConfirmDialog: () => import("@/views/components/ConfirmDialog/index.vue"),
    SonoDialog: () =>
      import("@/views/marketManage/components/dialog/index.vue"),
    RelatedRoute: () => import("./components/RelatedRoute"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "SO No.信息",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: (row) => {
              this.handleEdit({}, "add");
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: ecPendApproval().lists,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        searchColsHeight: true,
      },
      tableConfig: {
        httpRequest: getSonoPageLists,
      },
      statuLists: {
        views: [
          //视图操作按钮
          { text: "修改", showStatus: [0, 1], type: "edit" },
          { text: "删除", showStatus: [0, 1], type: "delete" },
        ],
        lists: [
          //表格操作按钮
          {
            text: "修改",
            type: "edit",
            handleClick: this.handleEdit,
          },
          {
            text: "删除",
            type: "delete",
            color: "#FF6767",
            handleClick: this.handleDelete,
          },
          {
            text: "更改航次",
            type: "updateRoute",
            handleClick: this.handleUpdateRoute,
          },
        ],
      },
      isView: true, //true视图状态    false列表状态
      mixinTableColArr: [ecPendApproval().tableColumns],
      params: {},
      isRefresh: false,
      WEB_ids: "",
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("customsClearance").then((res) => {
      this.showSearchForm = true;
    });
    POSTOrderIsolateConfig().then((res) => {
      const { data } = res;
      this.WEB_ids = data;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchList(searchFrom = {}) {
      const { cutGateTime, sailOpenTime, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        beginCutGateTime: cutGateTime && cutGateTime[0],
        endCutGateTime: cutGateTime && cutGateTime[1],
        beginSailOpenTime: sailOpenTime && sailOpenTime[0],
        endSailOpenTime: sailOpenTime && sailOpenTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
      };
    },
    handleAdd() {},
    switchView() {
      this.isView = !this.isView;
    },
    handleEdit(row, type) {
      this.$refs.SonoDialogRef.show(row, type);
    },
    _mixinkeepTable() {
      //视图模式刷新
      this.isRefresh = true;
      this.mixinkeepTable();
    },
    handleDelete(row) {
      const { id } = row;
      deleteSono(id).then((res) => {
        this._mixinkeepTable();
      });
    },
    getListsBtn(row) {
      const { orderNum, isCabinet } = row;
      //空 空 =修改删除
      //有 空 =修改
      //有 有 =无
      const arr = this.statuLists.lists.filter((e) => {
        if (orderNum && !isCabinet) {
          return e.type === "edit";
        } else if (!orderNum && !isCabinet) {
          return e.type !== "updateRoute";
        } else if (orderNum && isCabinet) {
          return e.type === "updateRoute";
        }
      });
      return arr;
    },
    handleCommand(rows) {
      const { handleClick, row } = rows;
      handleClick(row);
    },
    getStatuLists(row) {
      //空 空 =修改删除
      //有 空 =修改
      //有 有 =无
      const { orderNum, isCabinet } = row;
      const arr = this.statuLists.lists.filter((e) => {
        if (orderNum && !isCabinet) {
          return e.type === "edit";
        } else if (!orderNum && !isCabinet) {
          return e.type !== "updateRoute";
        } else if (orderNum && isCabinet) {
          return e.type === "updateRoute";
        }
        return false;
      });
      return arr;
    },
    handleView(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.routeNoManageId);
      this.$router.push({
        path: "/marketManage/airlineFlightDetails",
        query: {
          id: row.routeNoManageId,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleUpdateRoute(row) {
      this.$refs.RelatedRouteRef.show(row);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ {
    .com-tabs .tabs-right-btn {
      width: 100%;
      padding-left: 65px;
      justify-content: space-between;
    }
  }
  // .switchLayout {
  //   width: 120px;
  //   height: 21px;
  //   line-height: 21px;
  //   background: rgba(80, 148, 255, 0.7);
  //   border-radius: 12px;
  //   color: #fff;
  //   text-align: center;
  //   cursor: pointer;
  //   margin-left: 15px;
  // }
  .switchBtn {
    margin-left: 15px;
    margin-bottom: -15px;
  }
  .viewPattern {
    .title-content {
      display: flex;
      justify-content: space-between;
      .default {
        color: #ff813d;
        font-weight: bold;
        &.edit {
          color: #63a103;
        }
        &.deleteOrEdit {
          color: #3179ef;
        }
      }
      .icon {
        cursor: pointer;
      }
    }
    .middle-content {
      display: flex;
      flex-direction: column;
    }
    .foot-content {
      display: flex;
      justify-content: space-between;
      & > div:nth-child(2) {
        font-weight: bold;
      }
      .default {
        color: #ff813d;
        font-weight: bold;
        &.edit {
          color: #63a103;
        }
        &.deleteOrEdit {
          color: #3179ef;
        }
      }
    }
  }
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
}
</style>
