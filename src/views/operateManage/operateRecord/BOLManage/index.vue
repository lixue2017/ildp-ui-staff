<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
							:rowOperationBtnListFn="(row) => showBtnList(row)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <span
                    class="primary-text-btn"
                    @click="handleUpdate(slotProps.row, 'view')"
                    >{{ slotProps.row.code }}</span
                  >
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AddEditDialog ref="AddEditDialog" @getTableSelect="getTableSelect" />
    <editDialog ref="editDialog" @handleSuccess="mixinkeepTable" />
    <draftDialog ref="draftDialog" @handleSuccess="mixinkeepTable" />
    <CabinetVerifyDialog
      ref="cabinetVerifyDialog"
      @handleSuccess="mixinkeepTable"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { tableColumns, searchLists } from "./model";
import {
  deletePopBill,
  editPopBill,
  getPopBillList,
} from "@/api/operateRecord/BOLManage.js";
import { msgTipBox, msgInfoBox } from "@/utils/confirmBox.js";
import {
  getFreightList, // 获取电商散货
  getBoxList, // 获取电商整柜
} from "@/api/order/firstTransport.js";
import { getSeaTraditionFreightList } from "@/api/trandition/oceanModel";
import { getPopBillGoods } from "@/api/trandition/oceanModel.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "BOLManage",
  mixins: [mixinColsConf],
  components: {
    editDialog: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/editDialog/index"
      ),
    ComDialog: () => import("_comp/ComDialog"),
    AddEditDialog: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/AddEditDialog/index"
      ),
    draftDialog: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/draftDialog/index"
      ),
    CabinetVerifyDialog: () =>
      import("_comp/ComOperate/components/CabinetVerifyDialog"), // 整柜核实
  },
  data() {
    return {
      dataStatus: [
        {
          label: "草稿",
          value: 0,
          color: "#FAAD14",
        },
        {
          label: "已预报",
          value: 1,
          color: "#52C41A",
        },
      ],
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "提单信息",
            name: "1",
          },
        ],
        // btnArr: [
        //   {
        //     table: "创建",
        //     handleClick: () => this.handleUpdate({}, "add"),
        //   },
        // ],
      },
      searchFromData: {
        // 1: { orderType: 3 },
        // 2: { orderType: 3 },
        // 3: { orderType: 4 },
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
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
        tableHeight: "calc(100vh - 264px)",
        columnConfig: tableColumns,
        httpRequest: getPopBillList,
      },
      tableBtnArr: [
        {
          text: "提单完结",
          statusArr: [0],
          handleClick: (row) => {
            this.sendDraft(row);
          },
          // handleClick: (row) => this.handleUpdate(row, "draft"),
        },
        // {
        //   text: "登记集装箱",
        //   statusArr: [0, 1, 2],
        //   fclStatusArr: [1, '1'],
        //   handleClick: (row) => this.handleUpdate(row, "VGM"),
        // },
        {
          text: "修改",
          statusArr: [0, 2],
          handleClick: (row) => this.handleUpdate(row, "edit"),
        },
        {
          text: "提单登记",
          statusArr: [1],
          handleClick: (row) => this.handleUpdate(row, "edit"),
        },
        // {
        //   text: "DRAFT确认",
        //   statusArr: [1],
        //   handleClick: (row) => this.handleUpdate(row, "draft"),
        // },
        {
          text: "删除",
					color: "#FF6767",
          statusArr: [0, 1],
          handleClick: ({ id, operationOrderId }) => {
						msgTipBox(this, {}, () => {
							this.comRepeatedRequest(this, deletePopBill, {id, operationOrderId}).then(() => {
								this.mixinkeepTable();
							}).catch(err => {
								msgInfoBox(this, {
									msgTitle: '当前提单不可删除',
									msgTxt: err.msg
								})
							})
						})
					}
        },
      ],
      showSearchForm: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("BLinfoTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    submitSuccess() {
      this.$confirm("当前提单流程已完结", "提示", {
        confirmButtonText: "关闭",
        showCancelButton: false,
        type: "success",
        showClose: false,
      }).then(() => {
        this.mixinkeepTable();
      });
    },
    getList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        dataStatus: searchFrom.dataStatus && searchFrom.dataStatus.join(","),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { dataStatus } = this.searchFromData;
      Array.isArray(dataStatus) &&
        (this.searchFromData.dataStatus = dataStatus.join(","));
      return this.searchFromData;
    },
    handleCopy(row) {
      // console.log("复制");
      // console.log(row);
    },
    handleDelete(row) {
      // console.log("删除");
      // console.log(row);
    },
    handleUpdate(rows, type) {
      if (/add|edit/.test(type)) {
        if (type === "edit") {
          this.$refs.editDialog.show(rows, "edit");
        } else {
          this.$refs.AddEditDialog.show();
        }
      } else if (type === "view") {
        const idList = this.$refs[
          `tableRef${+this.tabsConfig.activeName}`
        ][0].tableData.map((e) => e.operationOrderId);
        this.$router.push({
          path: "/operateManage/operateRecord/BOLManageDetails",
          query: {
            id: rows.operationOrderId, // 操作单ID
            backPath: this.$route.fullPath,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
      } else if (type === "draft") {
        this.$refs.draftDialog.show(rows, "listEdit");
      } else if (type === "VGM") {
        const { operationOrderId, operationOrderNum } = rows;
        return new Promise((resolve, reject) => {
          getPopBillGoods(operationOrderId).then((res) => {
            this.$refs.cabinetVerifyDialog.show({ ...res, operationOrderNum });
            return resolve(res);
          });
        });
        // let httpRequestList = {
        //   20: getBoxList, //电商整柜
        //   21: getFreightList, //电商散货
        //   30: getSeaTraditionFreightList, //传统整柜
        //   31: getSeaTraditionFreightList, //传统散货
        //   41: getSeaTraditionFreightList, //空运散货
        //   50: getSeaTraditionFreightList, //拖车整柜
        // };
        // const params = {
        //   orderEcId: rows.orderId,
        //   orderId: rows.orderId,
        //   orderType: rows.orderType,
        // };
        // const { operationOrderId, orderType, freightType, operationOrderNum } =
        //   rows;
        // return new Promise((resolve, reject) => {
        //   httpRequestList[orderType + freightType](params).then((res) => {
        //     this.$refs.cabinetVerifyDialog.show({
        //       operationId: operationOrderId, //操作单ID
        //       orderType: orderType, //操作单类型（2-电商，3,4-传统）
        //       freightType: "0", //货物类型（0-整柜，1-散货）
        //       operationOrderNum, //操作单号
        //       lists: res,
        //     });
        //     return resolve(res);
        //   });
        // });
      }
    },
    getTableSelect(rows, type) {
      //获取提单新增数据
      this.$refs.editDialog.show(rows, "add", type);
    },
    sendDraft(row) {
      //待发DRAFT扭转状态
      const params = {
        id: row.id,
        status: "2",
        operationOrderId: row.operationOrderId,
      };
      editPopBill(params).then((res) => {
        this.submitSuccess();
      });
    },
    // 列表按钮
    showBtnList(row) {
      const bArr = [...this.tableBtnArr];
      const nBtnArr = bArr.filter(
        (e) =>
          e.statusArr?.includes(row.status) &&
          (e.fclStatusArr ? e.fclStatusArr.includes(row.fclStatus) : true)
      );
      return nBtnArr;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.white-space-nowrap {
  white-space: nowrap;
}
.operation-header {
  // padding: 0 20px;
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
</style>
