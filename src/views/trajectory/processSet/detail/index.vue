<template>
  <div class="app-container">
    <ComForm
      :formConfig="searchFormConfig"
      @searchHeight="getSearchHeight"
      v-if="Object.keys(dictionary.dicsData).length"
    />
    <div>
      <p style="font-size: 14px; margin-bottom: 15px">
        {{ (tableConfig.title && tableConfig.title) || "配置页面" }}
      </p>
      <ComTable
        :ref="`tableConfig`"
        :tableHeight="tableConfig.tableHeight"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="() => getQueryParams()"
        :columnData="tableConfig.columnData"
        :pagination="false"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'operation'">
            <div class="operation-content">
              <div
                class="btn"
                v-for="(item, index) in tableConfig.statusList"
                :key="index"
              >
                <el-button
                  class="operate-icon"
                  size="mini"
                  type="text"
                  icon="el-icon-edit-outline"
                >
                  {{ item.text }}
                </el-button>
              </div>
            </div>
          </template>
        </template>
      </ComTable>
      <div class="tableFootBtn">
        <el-button
          v-for="(item, index) in tableConfig.footBtn"
          :key="index"
          :type="item.type"
          @click="item.handleClick()"
          >{{ item.label }}</el-button
        >
      </div>
    </div>
    <!-- <ConfirmDialog ref="confirmDialog"></ConfirmDialog> -->
  </div>
</template>

<script>
import { getNodeList } from "@/api/trajectory/index";
import { mapActions, mapState } from "vuex";
import { tableColumns, searchLists } from "./model";
import { getBasicDataList } from "@/api/operationalData";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: false, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: false,
        expansion: false,
        size: "small",
        labelWidth: "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchLists,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        title: "配置页面",
        // tableHeight: "calc(100vh - 264px)",
        columnConfig: tableColumns,
        httpRequest: getNodeList, //搜索时请求的接口
        statusList: [
          {
            text: "上移",
            icon: "",
            // handleClick: (row) => this.handleUpdate(row, "editStatus"),
          },
          {
            text: "下移",
            icon: "",
            // handleClick: (row) => this.handleUpdate(row, "editStatus"),
          },
        ],
        columnData: [
          {
            id: 1,
            LCJD: "客户下单",
            QZTJ: "123",
            KHD: "123",
            YGD: "123",
            LX: "123",
          },
          {
            id: 2,
            LCJD: "订舱",
            QZTJ: "123",
            KHD: "123",
            YGD: "123",
            LX: "123",
          },
          {
            id: 3,
            LCJD: "交仓",
            QZTJ: "123",
            KHD: "123",
            YGD: "123",
            LX: "123",
          },
        ],
        footBtn: [
          {
            label: "取 消",
            type: "",
          },
          {
            label: "保 存",
            type: "primary",
            handleClick: () => {
              // this.openDialog();
            },
          },
        ],
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("tranditionTypeEn");
    this.searchFormConfig.formModel = {
      LCJD: [],
    };
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchHeight(height) {
      this.tableConfig.tableHeight = `calc(100vh - ${height + 211}px)`;
    },
    getList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
        // beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        // dataStatus: searchFrom.dataStatus && searchFrom.dataStatus.join(","),
        // types: searchFrom.types && searchFrom.types.join(","),
      };
      this.$refs.tableConfig.refreshTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    // openDialog(rows) {
    //   this.$refs.confirmDialog.handleFormDialog("timeConfirm", {
    //     dialogTitle: "修改舱位",
    //   });
    // },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-content {
  // padding: 0 20px;
  display: flex;
  .operate-status {
    span {
      &:nth-child(1) {
        width: 40%;
      }
      &:nth-child(2) {
        width: 60%;
      }
      display: inline-block;
      text-align: center;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 7px;
    .btn-list {
      display: flex;
    }
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
.tableFootBtn {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
