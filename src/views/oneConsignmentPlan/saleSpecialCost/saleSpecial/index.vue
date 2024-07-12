<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :httpRequest="tableConfig.httpRequest"
              :columnConfig="tableMixinConfig(tab.name)"
              :getQueryParams="() => getQueryParams()"
              @handleTableView="handleView"
              :rowOperationBtnListFn="getOperationBtn"
              @handleRowBtnClick="handleRowBtnClick"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ComCustomDialog ref="customDialogRef" />
    <ConfirmDialog ref="confirmDlgRef" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns,diyCustomDialogCols } from "./model";
import { msgBox } from "@/utils/confirmBox.js";
import { mapState, mapActions } from "vuex";
import {
  getChargesPriceList,
  enableDisableChargesPrice,
  deleteChargesPrice,
  getCostSpecialChargesPriceUp,
  putCostSpecialChargesPriceUpdEnablingTime,
  putCostSpecialChargesPriceCancelUp
} from "@/api/oneConsignmentPlan/saleSpecialCost";
import { getNowDate } from "@/utils/index.js"
export default {
  name: "SaleSpecialList",
  mixins: [mixinColsConf],
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "销售特殊费价格",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleAdd(),
          },
        ],
      },
      searchFromData: {
        stateIn:['0','1']
      },
      searchFormConfig: {
        formModel: {
          stateIn:['0','1']
        }, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "98px",
        searchNum: searchColumns.length,
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
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getChargesPriceList,
      },
      mixinTableColArr: [tableColumns],
      operationBtn: [
        {
          text: "复制",
          type: "copy",
          status: [1, 2 ,4],
        },
        {
          text: "启用",
          type: "enable",
          status: [0, 2],
        },
        {
          text: "禁用",
          type: "interdict",
          status: [1],
        },
        {
          text: "修改",
          type: "edit",
          status: [0],
        },
        {
          text: "删除",
          type: "delete",
          status: [0],
          color: "#ff6767",
        },
        {
          text: "升级",
          type: "upgradation",
          status: [1],
        },
        {
          text: "修改生效时间",
          type: "editTime",
          status: [3],
        },
        {
          text: "取消",
          type: "cancel",
          status: [3],
        },
      ],
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this.searchDictionary();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchDictionary() {
      this["dictionary/getDictionary"]("costPartitionScheme").then(() => {
        this.showSearchForm = true;
      });
    },
    handleCommand(cb, row) {
      cb && cb(row);
    },
    getList(searchFrom = {}) {
      const { beginTime, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        beginTime: beginTime && beginTime.join("@"),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const {stateIn=[],...obj}=this.searchFromData
      return {
        ...obj,
        stateIn:stateIn.join(',')
      }
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/oneConsignmentPlan/saleSpecialCost/saleSpecialDetail",
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleAdd() {
      this.$router.push({
        path: "/oneConsignmentPlan/saleSpecialCost/editSaleSpecial",
        query: {
          backPath: this.$route.path,
        },
      });
    },
    getOperationBtn(row) {
      const { state } = row;
      return this.operationBtn.filter((btn) => btn.status.includes(state));
    },
    handleInterdict(rows) {
      const { id } = rows;
      if (id) {
        const msg = "操作禁用之后该数据不可被关联引用！";
        const title = "禁用提示";
        const className = "el-icon-warning text-warning";

        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, enableDisableChargesPrice, { id }).then(
            () => {
              this.msgSuccess("禁用成功！");
              this.mixinkeepTable();
            }
          );
        });
      }
    },
    handleDelete(rows) {
      const { id } = rows;
      if (id) {
        const msg = "删除操作不可逆！";
        const title = "删除提示";
        const className = "el-icon-warning text-warning";

        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, deleteChargesPrice, { id }).then(() => {
            this.msgSuccess("删除成功！");
            this.mixinkeepTable();
          });
        });
      }
    },
    handleChangeState(row,type){
      const {enablingTime}=row
      const {customFormConfig,dialogConfig={},httpRequest,tips=undefined}={
        0:{//启用
          customFormConfig:diyCustomDialogCols,
          httpRequest:enableDisableChargesPrice,
          dialogConfig:{
            title:"销售特殊费-启用"
          },
          tips:"启用成功！"
        },
        1:{//修改生效时间
          customFormConfig:diyCustomDialogCols,
          httpRequest:putCostSpecialChargesPriceUpdEnablingTime,
          dialogConfig:{
            title:"修改生效时间"
          },
        },
      }[type]
      this.$refs.customDialogRef.showCustomDialog({
				customFormConfig:customFormConfig(dialogConfig),
				formModel: {
          enablingTime:enablingTime||`${getNowDate('-')} 00:00`
        },
				httpRequest: (formModel)=>{
          const {id}=row
          const params={
            id,
            ...formModel,
          }
          return httpRequest(params)
        },
				successFunction: ()=>{
          this.mixinkeepTable()
          if(tips){
            this.msgSuccess("启用成功！");
          }
        },
			})
    },
    handleUpgradation(row){
      const { id } = row;
      this.$refs.confirmDlgRef?.upgrade().then(() => {
        getCostSpecialChargesPriceUp(id).then((res) => {
          const { id } = res?.data || {};
          this.handleRowBtnClick({ id }, { type: "edit" });
        });
      });
    },
    handleCancel(row){
      const {id}=row
      const msg = "取消操作不可逆！";
        const title = "取消提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, putCostSpecialChargesPriceCancelUp, id).then(
            () => {
              this.msgSuccess("取消成功！");
              this.mixinkeepTable();
            }
          );
        });
    },
    handleRowBtnClick(row, btn) {
      const { type } = btn;
      switch (type) {
        case "copy":
          this.$router.push({
            path: "/oneConsignmentPlan/saleSpecialCost/editSaleSpecial",
            query: {
              copyId: row.id,
              backPath: this.$route.path,
            },
          });
          break;
        case "enable":
        const { id,state } = row;
          if (state == 2) {
            const enablingTime = `${getNowDate("-")} 00:00`;
            const params={
              id,
              enablingTime
            }
            enableDisableChargesPrice(params).then((res) => {
              this.mixinkeepTable();
              this.msgSuccess("启用成功！");
            });
          } else {
            this.handleChangeState(row, 0);
          }
          // this.comRepeatedRequest(this, enableDisableChargesPrice, {
          //   id: row.id,
          // }).then(() => {
          //   this.msgSuccess("启用成功！");
          //   this.mixinkeepTable();
          // });
          break;
        case "interdict":
          this.handleInterdict(row);
          break;
        case "edit":
          this.$router.push({
            path: "/oneConsignmentPlan/saleSpecialCost/editSaleSpecial",
            query: {
              id: row.id,
              backPath: this.$route.path,
            },
          });
          break;
        case "delete":
          this.handleDelete(row);
          break;
        case "upgradation":
          this.handleUpgradation(row)
          break
        case "editTime":
        this.handleChangeState(row,1)
          break
        case "cancel":
        this.handleCancel(row)
          break
        default:
          break;
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
