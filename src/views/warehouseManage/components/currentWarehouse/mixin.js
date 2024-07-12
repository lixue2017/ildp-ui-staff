// import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
export default {
  data() {
    return {
      showSearchForm: false,
      searchFromData: {},
      curWarehouseObj: {},
    };
  },
  methods: {
    getWarehouseTableMixin(obj = {}) {
			this.isMixinDeactivated = false; // 防止列设置里重复调接口

      // 获取当前所在仓
      this.curWarehouseObj = {
        ...obj
      };
      const { activeName,isSaveParams = false } = this.tabsConfig;
      if (this.selectionRows && (this.selectionRows.length || this.selectionRows[activeName]?.length)) {
        // 切换当前所在仓时清空表格复选框的值-方法名要相同
        this.onTableSelectionChange && this.onTableSelectionChange([]);
      }
      if(isSaveParams){
        //输入搜索字段但是不点击搜索，需要在切换仓库的时候根据已经输入的字段进行搜索
        this.$refs.searchTabForm && this.$refs.searchTabForm[0]?.enterSubmit();
      }else{
        this.keepTableListMixin(true)
      }
    },
    keepTableListMixin(isRefreshPage = false) {
      // console.log('this.curWarehouseObj.value',this.curWarehouseObj.value)
      const { activeName } = this.tabsConfig;
      if (!this.curWarehouseObj.value && !this.isPerformance) {
        // 无当前仓库，清空列表数据
        this.$refs[`tableRef${activeName}`] &&
          this.$refs[`tableRef${activeName}`][0]?.setNewTableData([]);
        return
      }
      this.$refs[`tableRef${activeName}`] &&
        this.$refs[`tableRef${activeName}`][0]?.refreshKeepTable(
          isRefreshPage,
          activeName
        );
    },
  },
}
