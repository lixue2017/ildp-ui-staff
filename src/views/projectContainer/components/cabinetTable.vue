<template>
  <div>
    <keep-alive>
      <ComForm :formConfig="searchFormConfig" v-if="showSearchForm"> </ComForm>
    </keep-alive>
    <keep-alive>
      <ComTable
        :ref="`tableRef${tabsConfig.activeName}`"
        :tableHeight="containerTable.tableHeight"
        :columnConfig="containerTable.columnConfig"
        :httpRequest="containerTable.httpRequest"
        :getQueryParams="containerTable.getQueryParams"
        :rowOperationBtnListFn="getStatusBtnList"
        @getResult="getTableResult"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'code'">
            <div class="display-flex" @click="handleDetails(slotProps.row)">
              <span class="primary-text-btn ellipsis-text">
                {{ slotProps.row.code || "--" }}
              </span>
            </div>
          </template>
          <template v-if="slotProps.prop === 'operationOrderNum'">
            <div class="display-flex" @click="handleDetails(slotProps.row)">
              <span class="primary-text-btn ellipsis-text">
                {{ slotProps.row.operationOrderNum || "--" }}
              </span>
            </div>
          </template>

          <template v-if="slotProps.prop === 'dataStatus'">
            <div class="operate-status">
              <span>
                <i
                  class="status-dot"
                  :style="{
                    backgroundColor: slotProps.dicsList.color,
                  }"
                ></i>
                {{ slotProps.dicsList.nameCn }}
              </span>
            </div>
          </template>
        </template>
        <template v-slot:bottomTotal>
          <div class="grand-total">
            <span>本页小计：</span>
            <template v-for="(tItem, i) in tableSubtotal">
              <span :key="`t_${i}`">
                <span>{{ tItem.totalLabel }}：</span>
                <span>{{ tItem.totalNum }}</span>
              </span>
            </template>
          </div>
        </template>
      </ComTable>
    </keep-alive>
  </div>
</template>

<script>
import {
  getBoxSortList,
  delBoxSort,
  getSortBoxStatus,
} from "@/api/container/arrange.js";
import { msgBox } from "@/utils/confirmBox.js";
import { accumulationFn } from "@/utils/instructions";
import { mapState, mapActions } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  mixins: [mixinColsConf],
  props: {
    containerTableCols: {
      type: Array,
      default: () => [],
    },
    searchColumns: {
      type: Array,
      default: () => [],
    },
    isDelivery: {
      type: String,
      default: () => "",
    },
    httpTableRequest: {
      type: Function,
      default: null,
    },
    activeTab: {
      type: String,
      default: () => undefined,
    },
    WEB_menuType: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      tabsConfig: {
        activeName: this.activeTab,
      },
      containerTable: {
        tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
        httpRequest: this.httpTableRequest || getBoxSortList,
        columnConfig: this.containerTableCols,
      },
      statusBtnList: [
        {
          text: "修改",
          statusArr: [0, 1],
          handleClick: this.handleEdit,
        },
        {
          text: "装柜完成",
          statusArr: [1],
          handleClick: this.handleCabinetDone,
        },
        {
          text: "删除",
          color: "#FF6767",
          statusArr: [0],
          handleClick: this.handleDelete,
        },
      ],
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: this.searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      searchFromData: {},
      tableSubtotal: [],
      showSearchForm: false,
      isArrMixinTable: false,
    };
  },
  methods: {
    searchList(searchFrom = {}) {
      const { estimateTime, dataStatusArr, statusList } = searchFrom;
      this.searchFromData = { ...searchFrom };
      if (estimateTime) {
        this.$set(this.searchFromData, "startDate", estimateTime[0]);
        this.$set(this.searchFromData, "endDate", estimateTime[1]);
        delete this.searchFromData.estimateTime;
      }
      if (dataStatusArr) {
        this.searchFromData.statusList = dataStatusArr.join(",");
        delete this.searchFromData.dataStatusArr;
      }
      if (statusList === "") {
        delete this.searchFromData.statusList;
      }
      this.mixinkeepTable(true);
    },
    handleEdit(row) {
      // console.log('row==', row)
      // 堡森装柜 - 排柜登记
      this.$router.push({
        path: "/projectContainer/editLoadContainer",
        query: {
          id: row.id,
          backPath: this.$route.path,
          isDelivery: this.isDelivery,
        },
      });
    },
    handleDelete(row) {
      // console.log('row==handleDelete', row)
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        delBoxSort(row.id).then(() => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.mixinkeepTable();
        });
      });
    },
    handleCabinetDone(row) {
      getSortBoxStatus({
        id: row.id,
        status: 3,
      })
        .then((res) => {
          this.mixinkeepTable();
        })
        .catch((err) => {
          console.log(err);
          if (err.code === 1002) {
            const title = `当前出库计划存在<span class='draft-state'>${err.msg}票</span>未入库的货物 ！`;
            const className = "el-icon-warning text-warning";
            const msg = "全部货物入库之后才能进行最后出库";
            const html = `<div class='display-flex'><i class='${className}'></i><span>${title}</span></div><div class='subtitle'>${msg}</div>`;
            msgBox(
              this,
              {
                title: "",
                html,
                showClose: false,
                confirmButtonText: "知道了",
                customClass: "delivery-box",
              },
              () => {}
            );
          }
        });
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
        type: 1,
      };
    },
    getStatusBtnList(row) {
      const { dataStatus } = row;
      const isDelivery = this.isDelivery ? 1 : 0;
      if (dataStatus == 1) {
        return this.statusBtnList.filter((e) =>
          e.statusArr.includes(isDelivery)
        );
      } else {
        return [];
      }
    },
    handleDetails(row = {}) {
      // 堡森装柜 - 装柜信息
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`]?.tableData.map(
        (e) => e.id
      );
      this.$router.push({
        path: "/projectContainer/cabinetInfo",
        query: {
          id: row.id,
          backPath: this.$route.path,
          isDelivery: this.isDelivery,
          pageSign: idList.join(","),
          menuType:this.WEB_menuType//出库计划跳转到排柜详情不展示激活关闭按钮，原本是根据不同的业务角色来判断是否展示，但是目前产品不确定2种业务分别包含了哪些角色，暂时改为由页面跳转来判断
        },
      });
    },
    getTableResult({ tableData: arr = [] }) {
      this.tableSubtotal = [
        {
          totalLabel: "总件数",
          totalNum: accumulationFn(arr.map((e) => e.num)),
        },
        {
          totalLabel: "总重量(KG)",
          totalNum: accumulationFn(
            arr.map((e) => e.singleBoxWeight),
            2
          ),
        },
        {
          totalLabel: "总立方(CBM)",
          totalNum: accumulationFn(
            arr.map((e) => e.cbm),
            2
          ),
        },
      ];
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    if (this.WEB_menuType === "deliveryPlan") {
      // 默认查询状态值
      this.searchFormConfig.formModel = {
        statusList: ["1"],
      };
      this.searchFromData = {
        statusList: ["1"],
      };
    } else {
      this.searchFormConfig.formModel = {
        dataStatusArr: ["1"],
      };
      this.searchFromData = {
        statusList: "1",
      };
    }
    this["dictionary/getDictionary"]("cabinetArrangement").then(() => {
      this.showSearchForm = true;
    });
  },
  computed: {
    ...mapState(["dictionary"]),
  },
};
</script>

<style lang="scss" scoped>
.operation-content-btn {
  display: flex;

  .operate-icon {
    display: flex;
    align-items: center;
    margin-right: 14px;

    &.operate-icon-info {
      color: #606060;
    }
  }
}
</style>
