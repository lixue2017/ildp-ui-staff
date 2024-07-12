<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName == tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="(row) => getHttpRequest(row, tab.name)"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="(row) => getBtnLists(row)"
              :spanMethod="spanMethod"
              :tree-props="{
                children: 'children',
                hasChildren: 'WEB_DROP',
              }"
              :treeLazyLoad="{
                lazy: true,
                load: (row, treeNode, resolve) =>
                  getColsChildren(row, treeNode, resolve),
              }"
              v-if="tabsConfig.activeName == tab.name && showSearchForm"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'customerName'">
                  <div v-if="slotProps.row.WEB_ISCHILD" class="content-spacing">
                    <template v-for="(item, index) in suborder">
                      <!-- <span :title="slotProps.row[item.value]" :key="index">{{
                        `${item.label}：${
                          item.value ? slotProps.row[item.value] : "--"
                        }`
                      }}</span> -->
                      <el-popover
                        placement="top-start"
                        :title="item.label"
                        :width="item.tipsWidth"
                        trigger="hover"
                        :content="slotProps.row[item.value]"
                      >
                        <span slot="reference">{{
                          `${item.label}：${
                            item.value ? slotProps.row[item.value] : "--"
                          }`
                        }}</span>
                      </el-popover>
                    </template>
                  </div>
                  <span v-else>{{ slotProps.row.customerName || "--" }}</span>
                </template>
                <template v-for="key in ['callType', 'errMsg']">
                  <template v-if="slotProps.prop === key">
                    <span :style="getColor(slotProps)">{{
                      slotProps.row[key]
                    }}</span>
                  </template>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  searchForm,
  tableColumns,
  detailTableColumns,
  suborder,
} from "./model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  POSTApiRequestInfoGetPage,
  POSTApiRequestInfoGetDetailPage,
  POSTApiRequestInfoResend
} from "@/api/customerManage/customerList.js";
export default {
  name: "AccessRecord",
  mixins: [mixinColsConf],
  data() {
    return {
      suborder,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "接口访问记录",
            name: "1",
          },
          {
            label: "访问明细",
            name: "2",
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        fold: true,
        size: "small",
        labelWidth: "100px",
        lists: searchForm,
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
      },
      showSearchForm: false,
      searchFromData: [],
      mixinTableColArr: [detailTableColumns, tableColumns],
      statusList: [
        {
          text: "重新发货",
          showState:[1,'1'],
          isParent:true,
          handleClick: (row) => {
            this.handleRedelivery(row);
          },
        },
      ],
    };
  },
  computed: {
    getColor() {
      return (ratio) => {
        const {dicsList}=ratio
        let style = {
          color: dicsList?.color||'none',
        };
        return style;
      };
    },
  },
  mounted() {},
  created() {
    this["dictionary/getDictionary"](["apiType",'apiCallType','apiErrMsg']).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(searchFrom = {}) {
      const { ...nSearchFrom } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...nSearchFrom,
      };
      this.mixinkeepTable();
    },
    getQueryParams(tName) {
      return this.searchFromData[tName];
    },
    getColsChildren(row = {}, treeNode, resolve) {
      const { serialNumber } = row;
      POSTApiRequestInfoGetDetailPage({ serialNumber }).then((res) => {
        const data = (res?.rows || []).map((e) => {
          return {
            ...e,
            WEB_ISCHILD: true,
          };
        });
        resolve(data);
      });
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const { WEB_ISCHILD } = row;
      const { activeName } = this.tabsConfig;
      const length = this.mixinTableColArr[activeName - 1].length;
      if (WEB_ISCHILD) {
        if (columnIndex == 1) {
          return [1, length];
        }
      }
    },
    getHttpRequest(row, tName) {
      const httpRequest = {
        1: POSTApiRequestInfoGetPage,
        2: POSTApiRequestInfoGetDetailPage,
      };
      if (tName == 1) {
        return new Promise((resolve, reject) => {
          httpRequest[tName](row).then((res) => {
            const result = {
              ...res,
              rows: (res.rows || []).map((e) => {
                return {
                  ...e,
                  WEB_DROP: e.serialNumber || undefined,
                  // WEB_DROP: true || undefined,
                };
              }),
            };
            resolve(result);
          });
        });
      } else {
        return httpRequest[tName](row);
      }
    },
    getBtnLists(row) {
      const {state,WEB_ISCHILD}=row
      const arr=this.statusList.filter((e)=>{
        return (e.showState?e.showState.includes(state):true)&&
        (e.isParent?!WEB_ISCHILD:true)
      })
      return arr
    },
    handleRedelivery(row){
      const {id}=row
      const params={
        apiRequestInfoId:id
      }
      POSTApiRequestInfoResend(params).then((res)=>{
        this.$message.success("发送成功");
        this.mixinkeepTable();
      })
    }
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style lang="scss" scoped>
.content-spacing {
  display: flex;
  span {
    white-space: nowrap; /* 确保文本在一行内显示 */
    overflow: hidden; /* 隐藏超出容器的文本 */
    text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
    width: 200px;
    // &:not(:first-child) {
    margin-left: 30px;
    // }
  }
}
</style>
