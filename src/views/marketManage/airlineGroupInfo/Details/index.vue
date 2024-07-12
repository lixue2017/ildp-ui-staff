<template>
  <div class="app-container">
    <ComDetailTop
      title="航线组信息"
      :formModel="formConfig.formModel"
      :orderIdList="orderIdList"
      @handleClick="handleTopClick"
    />
    <ComForm
      class="airline-from"
      :formConfig="formConfig"
      ref="myForm"
      v-if="Object.keys(dictionary.dicsData).length && formConfig.formModel.id"
    >
      <template v-slot:isPublic="slotProps">
        <span :class="slotProps.formModel.isPublic === '1' && 'green'">
          <i
            :class="[
              slotProps.formModel.isPublic === '1' && 'el-icon-circle-check',
            ]"
          ></i>
          {{ slotProps.formModel.isPublic === "1" ? "是" : "否" }}
        </span>
      </template>
      <template v-slot:lineType="slotProps">
        <span class="green tab-form">
          <el-tag type="success" size="mini" color="#35D06F1A">{{
            slotProps.dicsList[slotProps.formModel.lineType]
              ? slotProps.dicsList[slotProps.formModel.lineType].label
              : slotProps.formModel.lineType
          }}</el-tag>
        </span>
      </template>
    </ComForm>
    <el-container class="airline-table" v-if="formConfig.formModel.id">
      <el-aside class="airline-left" width="320px">
        <ComTableTag
          ref="comTableTag"
          :tabActive="routeProxy"
          :columnConfig="leftColumnConfig.columnConfig"
          :httpRequest="leftColumnConfig.httpRequest"
          :getQueryParams="leftColumnConfig.getQueryParams"
          @handleTabChange="(val) => (routeProxy = val)"
          @handleClick="handleTagChange"
        >
          <template v-slot:status="{ slotProps }">
            <span>{{ slotProps.row.shipCompany }}</span>
            <span>
              <el-tag
                type="success"
                size="mini"
                :color="`${slotProps.dicsList.color}1A`"
                :style="{
                  color: slotProps.dicsList.color,
                }"
                >{{ slotProps.dicsList.nameCn }}</el-tag
              >
            </span>
          </template>
        </ComTableTag>
      </el-aside>
      <el-main class="airline-right">
        <div class="title">航次信息</div>
        <ComTable
          ref="tableConfig"
          :tableHeight="columnConfig.tableHeight"
          :columnConfig="columnConfig.columns"
          :httpRequest="columnConfig.httpRequest"
          :getQueryParams="getQueryParams"
          :extraConfig="columnConfig.extraConfig"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'status'">
              <span>
                <i
                  class="status-dot"
                  :style="{
                    backgroundColor: slotProps.dicsList.color,
                  }"
                ></i>
                {{ slotProps.dicsList.nameCn }}
              </span>
            </template>
          </template>
        </ComTable>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getAirlineGroupDetails,
  getAirlineList,
  getAirFlightList,
  getAllFlightList,
  getRouteNoRoute
} from "@/api/marketManage/airline";
import { config } from "./model";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComTableTag: () => import("_comp/ComTableTag"),
  },
  computed: {},
  data() {
    return {
      routeCodeActive: null,
      orderIdList: [],
      formConfig: {
        formModel: {},
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
      leftColumnConfig: {
        tableHeight: "calc(100% - 72px)",
        columnConfig: {
          title: "航线信息",
          tabConfig: "clientIdentity",
          showList: [0, 1],
          ...config.leftTableColumns,
        },
        httpRequest: getAirlineList,
        getQueryParams: this.getRouteQueryParams,
        extraConfig: {
          showHeader: false,
        },
        paginationConfig: {
          limit: 10,
          layout: "total, prev, pager, next",
        },
      },
      columnConfig: {
        tableHeight: "calc(100% - 72px)",
        columns: config.tableColumns,
        httpRequest: (params) => {
          console.log(params)
          if (this.routeCodeActive) {
            return getRouteNoRoute(params);
          } else {
            const { code } = this.formConfig.formModel;
            return getAllFlightList(params, code);
          }
        },
        extraConfig: {
          stripe: true,
        },
      },
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("airlineGroup");
    if (localStorage.getItem("airlineGroupIdList"))
      this.orderIdList = JSON.parse(localStorage.getItem("airlineGroupIdList"));
    this.getData();
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getData() {
      const { id } = this.$route.query;
      getAirlineGroupDetails(id).then((res) => {
        this.formConfig.formModel = res.data || {};
        this.$refs.myForm &&
          this.$refs.myForm.setFormModel(this.formConfig.formModel);
        this.$refs.comTableTag && this.$refs.comTableTag.refreshTable(true);
      });
    },
    getAirlineList(params) {
      return getAirlineList(params);
    },
    getRouteQueryParams() {
      const { id, code: routeCode } = this.formConfig.formModel;
      var params = {
        routeCodeId: id,
        routeProxy: this.routeProxy,
      };
      if (!params.routeProxy) {
        delete params.routeProxy;
      }
      return params;
    },
    handleTagChange(row) {
      this.routeCodeActive = row && row.id;
      this.$refs.tableConfig && this.$refs.tableConfig.refreshTable(true);
    },
    getQueryParams() {
      return {
        routeId: this.routeCodeActive,
      };
    },
    getDetails(id) {
      if (id) {
        const newUrl = this.$route.path + `?id=${id}`;
        window.history.replaceState("", "", newUrl);
        console.log(id);
        this.getData();
      } else {
        this.reBack();
      }
    },
    reBack() {
      this.$router.push("/marketManage/marketBData/airlineGroupInfo");
    },
    handleTopClick({ type, id }) {
      if (type === "back") {
        this.reBack();
        return;
      }
      if (type === "pre" || type === "next") {
        this.$route.query.id = id;
        this.getDetails(id);
      }
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
    padding: 10px 20px;
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
