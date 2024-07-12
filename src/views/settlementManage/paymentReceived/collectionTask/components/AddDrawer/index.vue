<template>
  <ComDrawer
    class="add-drawer"
    ref="myDrawer"
    :customDrawer="drawerConfig"
    :confirmClose="false"
  >
    <template v-slot:content>
      <ComDetailTop title="数据添加" class="title-sides-margin-none" :config="{}" />
      <ComForm
        :formConfig="searchFormConfig"
        v-if="Object.keys(dictionary.dicsData).length"
      >
      </ComForm>
      <ComTable
        ref="tableConfig"
        :tableHeight="tableConfig.tableHeight"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="getQueryParams"
        @onSelectionChange="onSelectionChange"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'billType'">
            <span
              :style="{
                color: slotProps.dicsList.color,
              }"
            >
              {{ slotProps.dicsList.nameCn }}
            </span>
          </template>
        </template>
      </ComTable>
    </template>
  </ComDrawer>






</template>

<script>
import { searchColumns, tableColumns } from "./model";
import { mapActions, mapState } from "vuex";
import { getBillList } from "@/api/settlementManage/statementManage";
export default {
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      drawerConfig: {
        title: "slot",
        width: "1200px",
        size: "small",
        showClose: false,
        wrapperClosable: true,
        footer: [
          {
            num: null,
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.submitSelect();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getBillList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "80px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        httpRequest: (rows) => {
          return getBillList(rows);
        },
        columnConfig: tableColumns,
      },
      selectAll: [],//选择的数据
      selectTotal:[]//一共有的数据
    };
  },
  methods: {
    show() {
      this.$refs.myDrawer.show();
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
    getList() {},
    getQueryParams() {
      return {};
    },
    onSelectionChange(rows,total) {
      this.filter(rows,total)
      this.selectAll = rows;
      this.drawerConfig.footer[0].num = this.selectAll.length;
    },
    submitSelect() {
      this.$emit("selectAll", this.selectAll);
      this.hide();
    },
    filter(){

    }
  },
};
</script>
<style lang="scss" scoped>
.add-drawer {
  /deep/ {
    .el-drawer__header {
      display: none;
    }
    .drawer-content {
      padding: 0 20px 10px;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
    .el-table::before {
      background-color: transparent;
    }
  }
  .com-detail-top {
    padding: 20px 0 0;
    margin-bottom: 20px;
  }
}
</style>
