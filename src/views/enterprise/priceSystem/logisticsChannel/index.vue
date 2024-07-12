<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="setSearchFormConf(tab.name)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <!-- <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template> -->
            </ComForm>
          </keep-alive>
					<!--  v-if="mixinShowTable" -->
          <keep-alive>
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="mixinTableColArr[tab.name - 1]"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getTableQueryParams(tab.name)"
              :rowOperationBtnListFn="() => tableConfig.statusBtnList"
              :colShowBtnFn="operationBtn"
							@handleTableView="r => handleDetails(r)"
							@getResult="getTableResult"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <logisticsEditDlg ref="logisticsEditRef" />
  </div>
</template>

<script>
import {
  basicChannelDel,
  basicChannelPut,
} from "@/api/priceSystem/provider.js";
import { logisticsChannelList } from "@/api/warehouse/basic"
import { mapActions, mapState } from "vuex";
import { customMessageBox } from "@/utils/confirmBox.js";
import { searchColumns, tableColumns } from "./model";
import logisticsEditDlg from "./components/editDlg";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "LogisticsChannel",
  mixins: [mixinColsConf],
  components: {
    logisticsEditDlg,
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "物流渠道信息",
            name: "1",
          },
					// {
          //   label: "API服务授权",
          //   name: "2",
          // },
        ],
        btnArr: [
          {
            table: "新增",
						showTabName: "1",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleAddOrEdit({
							outWarehouseMethod: 0,
							packAndShipImmediately: false,
							traceable: false
						}),
          },
        ],
      },
      searchFromData: {
				'1': {},
				'2': {}
			},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getLogisticsList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "85px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: logisticsChannelList,
        statusBtnList: [
          {
            text: "修改",
            showStatus: [0],
            handleClick: (row) => this.handleAddOrEdit({
							...row,
							webBtnType: 'edit'
						}),
          },
          {
            text: "启用",
            showStatus: [0, 2],
            handleClick: (row) => this.handleUpdate(row),
          },
          {
            text: "禁用",
            color:"#FF6767",
            showStatus: [1],
            handleClick: (row) => this.handleUpdate(row),
          },
          {
            text: "删除",
            color:"#FF6767",
            showStatus: [0],
            handleClick: this.handleDelete,
          },
        ],
      },
      mixinTableColArr: [tableColumns('1'), tableColumns('2')],
    };
  },
  created() {
    this["dictionary/getDictionary"](["tagType", "outWarehouseWay", "status", "trueOrFalse"]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    handleAddOrEdit(row = {}, mode_type) {
      this.$refs.logisticsEditRef.editShow(row, {
        mode_type, // 0: 新增/修改 1：查看
        editSuccess: () => {
          // 编辑成功
          this.mixinkeepTable();
        },
      });
    },
		handleDetails({ id }) {
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.id);
      this.$router.push({
        path: "/oneConsignmentPlan/oneBasicSetting/seeLogisticsChannel",
        query: {
          id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    operationBtn(rItem, row) {
      return rItem.showStatus.includes(row.state);
    },
    handleUpdate({ id }) {
      // 状态：0-草稿，1-启用，2-禁用
      basicChannelPut(id).then(() => {
        this.msgSuccess("更新成功");
        this.mixinkeepTable();
      });
    },
    handleDelete(row) {
			customMessageBox(this, {
				msgTitle: "删除提示",
				msgTxtColor: "#FF6767",
				httpMsgRequest: () => basicChannelDel(row.id),
			}, () => {
				this.msgSuccess("删除成功");
				this.mixinkeepTable();
			})
    },
    getLogisticsList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
			const [createTimeGe, createTimeLe] = createTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        createTimeGe,
        createTimeLe,
      };
      this.mixinkeepTable(true);
    },
		setSearchFormConf(tName) {
			return {
				...this.searchFormConfig,
				fold: tName === '1',
				lists: searchColumns(tName), // 表单渲染列表
			}
		},
		getTableResult({ tableData }) {
			const nTableData = tableData.map(e => {
				return {
					...e,
					traceable: e.traceable ? '1' : '0',
					packAndShipImmediately: e.packAndShipImmediately ? '1' : '0'
				}
			})
			this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].setNewTableData(nTableData)
		},
    getTableQueryParams(tName) {
      return this.searchFromData[tName];
    },
		...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
