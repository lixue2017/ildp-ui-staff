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

    <ConfirmDialog ref="confirmDlgRef" />
    <CostTrialDrawer ref="costTrialDrawerRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns,passCustomDialogCols,repulseCustomDialogCols,takeEffectCustomDialogCols,diyCustomDialogCols } from "./model";
import { msgBox } from "@/utils/confirmBox.js";
import { mapState, mapActions } from "vuex";
import {
  getCostLogisticsList,
  updStateCostLogistics,
  deleteCostLogistics,
  getCustomerLevel,
  getCostSaleLogisticsPriceUp,
  putCostSaleLogisticsPriceUpdEnablingTime,
  putCostSaleLogisticsPriceCancelUp,
} from "@/api/oneConsignmentPlan/saleCost";
import { getNowDate } from "@/utils/index.js"
export default {
  name: "SaleLogisticsList",
  mixins: [mixinColsConf],
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    CostTrialDrawer: () => import("../customerLogistics/components/CostTrialDrawer"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "销售物流价格",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            dropdownClassName: "logistics-dropdown",
            icon: "el-icon-plus",
            btnType: "dropdown",
            dropdownArr: [],
            handleClick: this.handleAdd,
            handleDropdown: this.getCustomerLevel,
          },
          {
            table: "一件代发费用试算",
            className: "btn-type-button",
            handleClick: () => this.handleTrial(),
          },
        ],
      },
      searchFromData: {
        stateList:['4','-1','0','2','1']
      },
      searchFormConfig: {
        formModel: {
          stateList:['4','-1','0','2','1']
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
        labelWidth: "85px",
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
        httpRequest: getCostLogisticsList,
      },
      mixinTableColArr: [tableColumns],
      operationBtn: [
        {
          text: "提交",
          type: "submit",
          status: [0, -1],
        },
        {
          text: "修改",
          type: "edit",
          status: [0, -1],
        },
        {
          text: "删除",
          type: "delete",
          status: [0, -1],
          color: "#ff6767",
        },
        {
          text: "通过",
          type: "pass",
          status: [1],
        },
        {
          text: "打回",
          type: "repulse",
          status: [1],
          color: "#ff6767",
        },
        {
          text: "作废",
          type: "repeal",
          status: [2],
        },
        {
          text: "生效",
          type: "effectuate",
          status: [3],
        },
        {
          text: "升级",
          type: "upgradation",
          status: [2],
        },
        {
          text: "修改生效时间",
          type: "editTime",
          status: [4],
        },
        {
          text: "取消",
          type: "cancel",
          status: [4],
        },
        {
          text: "复制",
          type: "copy",
          status: [5],
        },
      ],
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this.searchDictionary();
    // this.getCustomerLevel();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchDictionary() {
      this["dictionary/getDictionary"]("saleLogistics").then(() => {
        this.showSearchForm = true;
      });
    },
    getCustomerLevel() {
      getCustomerLevel({
        state: 3,
        pageNum: 1,
        pageSize: 999,
      }).then((res) => {
        const { rows = [] } = res;
        const dropdownArr = rows.map((item) => ({
          name: `${item.warehouseName}/${item.productName}/${item.priceLevelName}`,
          value: item.id,
          key: `${item.warehouseId},${item.productId},${item.priceLevel}`,
          label: `${item.warehouseCode}/${item.warehouseName},${item.productName},${item.priceLevel}`,
        }));
        this.tabsConfig.btnArr[0].dropdownArr = dropdownArr;
      });
    },
    handleCommand(cb, row) {
      cb && cb(row);
    },
    getList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const [beginTime, endTime] = createTime || [];
      this.searchFromData = {
        ...searchObj,
        beginTime,
        endTime,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
      };
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/oneConsignmentPlan/saleCost/saleLogisticsDetail",
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleAdd(_, dItem) {
      const { key, label } = dItem;
      this.$router.push({
        path: "/oneConsignmentPlan/saleCost/editSaleLogistics",
        query: {
          backPath: this.$route.path,
          key,
          label,
        },
      });
    },
    getOperationBtn(row) {
      const { state } = row;
      return this.operationBtn.filter((btn) => btn.status.includes(state));
    },
    handleRepeal(rows) {
      const { id } = rows;
      if (id) {
        const msg = "操作作废之后该数据不可被关联匹配！";
        const title = "作废提示";
        const className = "el-icon-warning text-warning";

        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, updStateCostLogistics, {
            id,
            state: 3,
          }).then(() => {
            this.msgSuccess("作废成功！");
            this.mixinkeepTable();
          });
        });
      }
    },
    handleDelete(rows = {}) {
      const { id } = rows;
      if (id) {
        const msg = "删除操作不可逆！";
        const title = "删除提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, deleteCostLogistics, { id }).then(
            () => {
              this.msgSuccess("删除成功！");
              this.mixinkeepTable();
            }
          );
        });
      }
    },
    handleProcess(row={},type){
      const {enablingTime}=row
      const {customFormConfig,extraParams,tips=undefined,dialogConfig={},httpRequest}={
        0:{//通过
          customFormConfig:passCustomDialogCols,
          extraParams:{
            state: 2
          },
          httpRequest:updStateCostLogistics
        },
        1:{//打回
          customFormConfig:repulseCustomDialogCols,
          extraParams:{
            state: -1
          },
          httpRequest:updStateCostLogistics
        },
        3:{//修改生效时间
          customFormConfig:diyCustomDialogCols,
          dialogConfig:{
            title:"修改生效时间"
          },
          httpRequest:putCostSaleLogisticsPriceUpdEnablingTime
        }
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
            ...extraParams
          }
          return httpRequest(params)
        },
				successFunction: ()=>{
          this.mixinkeepTable()
          if(tips){
            this.$message.success(tips);
          }
        },
			})
    },
    // handleProcess(row, type) {
    //   const { title, state, formRules } = [
    //     {
    //       title: "通过",
    //       state: 2,
    //       formRules: {},
    //     },
    //     {
    //       title: "打回",
    //       state: -1,
    //     },
    //   ][type || 0];
    //   this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
    //     confObj: {
    //       title: `收款确认-${title}`,
    //       label: `${title}说明：`,
    //       message: `请输入${title}说明`,
    //     },
    //     formModel: {},
    //     formRules,
    //     httpRequest: ({ optRemark }) => {
    //       const opt = {
    //         id: row.id,
    //         optRemark,
    //         state,
    //       };
    //       return updStateCostLogistics(opt);
    //     },
    //     successFunction: this.mixinkeepTable,
    //   });
    // },
    handleUpgradation(row) {
      const {id}=row
      this.$refs.confirmDlgRef?.upgrade().then(() => {
        getCostSaleLogisticsPriceUp(id).then((res)=>{
          const {id}=res?.data||{}
            this.handleRowBtnClick({id},{type:'edit'})
        })
      });
    },
    handleStatus(row, state, msg) {
      updStateCostLogistics({
        id: row.id,
        state,
      }).then(() => {
        this.mixinkeepTable();
        this.$message.success(msg);
      });
    },
    handleCancel(row){
      const {id}=row
      const msg = "取消操作不可逆！";
        const title = "取消提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, putCostSaleLogisticsPriceCancelUp, id).then(
            () => {
              this.msgSuccess("取消成功！");
              this.mixinkeepTable();
            }
          );
        });
    },
    handleEffectuate(row) {
      const enablingTime = `${getNowDate("-")} 00:00`;
      const { id } = row;
      const params = {
        enablingTime,
        id,
        state: 2
      };
      updStateCostLogistics(params).then((res) => {
        this.mixinkeepTable();
        this.$message.success('生效成功');
      });
    },
    handleRowBtnClick(row, btn) {
      const { type } = btn;
      switch (type) {
        case "submit":
          this.handleStatus(row, 1, "提交成功！");
          break;
        case "edit":
          this.$router.push({
            path: "/oneConsignmentPlan/saleCost/editSaleLogistics",
            query: {
              id: row.id,
              backPath: this.$route.path,
            },
          });
          break;
        case "delete":
          this.handleDelete(row);
          break;
        case "pass":
          this.handleProcess(row, 0);
          break;
        case "repulse":
          this.handleProcess(row, 1);
          break;
        case "repeal":
          this.handleRepeal(row);
          break;
        case "effectuate":
          // this.handleStatus(row, 2, "生效成功！");
          this.handleEffectuate(row)
          // this.handleProcess(row,2)
          break;
        case "upgradation":
          this.handleUpgradation(row)
          break
        case "editTime":
        this.handleProcess(row,3)
          break
        case "cancel":
          this.handleCancel(row)
          break
        case "copy":
          this.$router.push({
            path: "/oneConsignmentPlan/saleCost/editSaleLogistics",
            query: {
              id: row.id,
              isCopy:true,
              backPath: this.$route.path,
            },
          });
          break
        default:
          break;
      }
    },
    handleTrial() {
      this.$refs.costTrialDrawerRef.show();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.logistics-dropdown {
  min-width: 217px;
  text-align: center;

  .el-dropdown-menu__item {
    white-space: nowrap;
  }
}
.btn-type-button{
  height:29px;
  margin-left:10px;
}
</style>
