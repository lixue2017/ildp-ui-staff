import { mapActions, mapState } from "vuex";
import { getStorageScheme,addStorageRelation } from "@/api/costScheme/index.js"
import { typeConversion } from '@/utils/index' // 数据类型转换

export const mixinWarehouseRentDetail = {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ServiceDrawer:()=> import("../../../components/serviceDrawer/index"),
  },

  data() {
    return {
      isInitRes: false
    }
  },

  computed: {
    ...mapState(["dictionary"]),
    tableAutoHeight() {
      //根据table数据量获取表格高度
      const tableLen = this.tableConfig.columnData.length;
      const tableHeight = 5 * 53 + 49
      return tableLen > 4 ? tableHeight : undefined
      // 小于等于5行时不出现滚动条 表格行数 * 单行高度 + 表头高度
    },
  },

  created() {
    this["dictionary/getDictionary"](["costSchemeStatus", "pricingUnit", "warehouseBusinessType", 'warehousePricingUnit', 'warehouseRentFreeType', 'warehouseRentSettlement']).then(() => {
      const { id } = this.$route.query
      this.getDetailsData(id)
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleBack() {
      //返回
      this.$refs.detailTopRef?.comReBack();
    },
    async getDetailsData(id) {
      this.isInitRes = false
      this.tableTags.active
      const {active}=this.tableTags
      getStorageScheme(id).then((res) => {
        const { storageCostList, rentFreeType, billUnit,isGeneralRules, ...nObj } = res.data
        this.formConfig.formModel = {
          ...nObj,
          rentFreeType: typeConversion(rentFreeType),
          billUnit: typeConversion(billUnit),
          isGeneralRules
        }
        if(isGeneralRules){
          this.tableTags.active=1
        }
        if(this.tableTags.active==1){
          this.getPriceInfo(storageCostList)
        }else{
          this.getcustomerInfo()
        }
        this.isInitRes = true
      })
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetailsData(id);
      }
    },
    handleAdd(row, extra) {
      let { id } = row
      const { path, operationType } = extra
      this.$router.push({
        path,
        query: {
          backPath: this.$refs.detailTopRef?.newPathUrl(),
          id,
          operationType
        },
      });
    },
    handleChangeStatus(row, extra) {
      const { id } = row
      const { status, httpRequest } = extra
      const params = {
        id,
        status
      }
      httpRequest(params).then((res) => {
        this.getDetailsData(id)
      })
    },
    changeTabs(key) {
      //标签切换
      this.tableTags.active = key;
      if(key==1){
        this.getPriceInfo()
      }else{
        this.getcustomerInfo()
      }
    },
    getPriceInfo(rows){
      //获取价格信息局部刷新
      if(rows){
        this.tableConfig.columnData = rows
        this.$refs.tableServiceRef?.setNewTableData(this.tableConfig.columnData)
      }else{
        const { id } = this.$route.query
        getStorageScheme(id).then((res) => {
          const { storageCostList } = res.data
          this.tableConfig.columnData = storageCostList
          this.$refs.tableServiceRef?.setNewTableData(this.tableConfig.columnData)
        })
      }
    },
    getcustomerInfo() {
      //获取关联客户局部刷新
      this.$nextTick(()=>{
        this.$refs.customerTableServiceRef?.refreshTable(true);
      })
    },
    getQueryParams(){
      const { id } = this.$route.query;
      return {
        storageId: id,
      }
    },
    onSelectionChange(rows){
      this.selectAll = rows;
      const tableTotal=this.$refs.customerTableServiceRef?.getTableDataNum()
      this.$refs.customerTableServiceRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectAll,
      });
      if(tableTotal==rows.length){
        this.tableTags.btnLists[0].disabled = true
      }else{
        this.tableTags.btnLists[0].disabled = !this.selectAll.length;
      }

    },
    handleServiceDrawer(){
      const { id } = this.$route.query
      const params = {
        customerType:4,
        storageId: id
      }
      this.$refs.ServiceDrawerRef.show(params)
    },
    handleSuccess(){
      this.getcustomerInfo()
    },
    deleteCustomer(rows){
      const { id } = this.$route.query
      const params={
        storageId: id,
        deletedCustomerIds:rows.map((e)=>e.customerId)
      }
      this.comRepeatedRequest(this, addStorageRelation, params).then(
        (res) => {
          this.onSelectionChange([])
          this.handleSuccess();
        }
      );
    },
    getTableTags(row){
      const {isGeneralRules}=row
      const arr=(this.tableTags.columns||[]).filter((e)=>{
        const {showIsGeneralRules}=e
        return showIsGeneralRules?showIsGeneralRules.includes(isGeneralRules):true
      })
      return arr
    },
    getTableResult(row={}){
      const {total=0}=row
      this.customerTableConfig.statusBtnList[0].disabled=total==1?true:false
    }
  },
}
