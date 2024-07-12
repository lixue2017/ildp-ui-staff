<template>
  <!-- 这个文件还在使用吗，taskList文件夹中没有引用这个组件，但这个文件近几个月又有修改 -->
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
        v-show="isFormShow"
        v-if="Object.keys(dictionary.dicsData).length"
      >
      </ComForm>
      <ComTable
        ref="tableConfig"
        v-if="isFormShow"
        :tableHeight="tableConfig.tableHeight"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="getQueryParams"
        @onSelectionChange="onSelectionChange"
        :selectionRow="selectionRowEvt"
        :selectionTableRow="[...selectAll]"
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
      isFormShow: false, // 阻止自动聚焦与表格选择缓存
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
    show(rows = []) {
      this.selectAll = rows;
      this.$refs.myDrawer.show();
      this.drawerConfig.footer[0].num = rows.length;
      this.$nextTick(() => {
        this.isFormShow = true
      })
    },
    hide() {
      this.isFormShow = false
      this.$refs.myDrawer.hide();
    },
    getList() {},
    getQueryParams() {
      return {};
    },
    onSelectionChange(rows) {
      this.selectAll = rows
      this.drawerConfig.footer[0].num = rows.length;
    },
    selectionRowEvt(row) {
      // 选择条件：同一个往来单位/同一个记账主体
      const { dealingsCompanyName, businessCompanyName } = this.$route.query
      const rSome = dealingsCompanyName === row.dealingsCompanyName &&
      businessCompanyName === row.businessCompanyName
      if (!rSome) {
        return false
      }
      return true
    },
    submitSelect() {
      this.$emit("selectAll", this.selectAll);
      this.hide();
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
