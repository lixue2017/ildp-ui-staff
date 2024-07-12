import { mapActions, mapState } from "vuex";
import { warehouseRentFormConfig, warehouseRentFormRulesConfig, rentFreeDay } from "../model.js";
import { getStorageScheme, addStorageScheme, updateStorageScheme,GETCountByBillWarehouseId,addStorageRelation } from "@/api/costScheme/index.js"
import { typeConversion } from '@/utils/index' // 数据类型转换
export const mixinWarehouseRent = {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ServiceDrawer:()=> import("../../../components/serviceDrawer/index"),
  },
  data() {
    return {
      showSearchForm: false,
      deleteIdList: [],
      operationType:''
    }
  },
  computed: {
    ...mapState(["dictionary"]),
    tableAutoHeight() {
      //根据table数据量获取表格高度
      const tableLenth = this.tableConfig.columnData.length;
      const tableHeight = 5 * 53 + 49
      return tableLenth > 4 ? tableHeight : undefined
      // 小于等于5行时不出现滚动条 表格行数 * 单行高度 + 表头高度
    },
  },

  created() {
    this["dictionary/getDictionary"](["costSchemeStatus", "pricingUnit", "warehouseBusinessType", 'warehousePricingUnit', 'warehouseRentFreeType', 'warehouseRentSettlement']).then(() => {
      this.getDetails()
    });
  },

  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleSubmit(formModel) {
      const { operationType } = this.$route.query
      const customerTable=this.$refs.customerTableServiceRef?.getNewTableData()||[]
      const { closingType, id, rentFreeType, rentFreeDay,isGeneralRules, ...nObj } = formModel
      const columnData = this.tableConfig.columnData
      if(['copy','edit'].includes(operationType)&&!isGeneralRules&&customerTable.length==0){
        this.$message.error("请至少关联一个客户");
        return new Promise((resolve,reject)=>{
          reject()
        })
      }
      let params = {
        ...nObj,
        id,
        storageCostList: columnData,//table
        status: this.saveStatus,//保存状态
        deleteIdList: this.deleteIdList,
        rentFreeType,
        rentFreeDay: rentFreeType == 1 ? rentFreeDay : 0,
        closingType: closingType || '1',
        isGeneralRules
      }
      if (id) {
        //编辑
        return this.comRepeatedRequest(this, updateStorageScheme, params)
      } else {
        //新增
        return this.comRepeatedRequest(this, addStorageScheme, params)
      }
    },
    btnSubmit() {
      //先校验table再提交
      let submitStatus = true
      this.tableConfig.columnData.map((e, index) => {
        const { endValue, unitPrice, minPrice, maxPrice, isLast } = e
        if (endValue == undefined && !isLast) {
          setTimeout(() => {
            this.$message.error(
              `提交失败,第${index + 1}行开始值不能与结束值相同`
            );
          }, 500)
          submitStatus = false
          return
        }
        if (unitPrice == undefined) {
          setTimeout(() => {
            this.$message.error(
              `提交失败,第${index + 1}行单价不能为空`
            );
          }, 500)
          submitStatus = false
          return
        }
        if (minPrice == undefined) {
          setTimeout(() => {
            this.$message.error(
              `提交失败,第${index + 1}行最低费用不能为空`
            );
          }, 500)
          submitStatus = false
          return
        }
      })
      if (submitStatus) {
        this.$refs.dialogForm.submitForm()
      }
    },
    handleSuccess() {
      this.handleBack()
    },
    async getDetails() {
      const { id,operationType='edit' } = this.$route.query
      this.operationType=operationType
      let formModel
			let isGeneralRules = null;
      let webGeneralDisabled = 0;
      if (id) {
        await getStorageScheme(id).then(async(res) => {
          const { storageCostList, rentFreeType, billUnit, businessType=undefined,billWarehouseId=undefined, ...nObj } = res.data
          if(operationType=='copy'){
            const params = {
              id,
              billWarehouseId,
              businessType
            };
            await GETCountByBillWarehouseId(params).then((res) => {
              webGeneralDisabled = res.data;
              isGeneralRules = res.data > 0 ? false : true;
            });
          }
          formModel = {
            ...nObj,
            rentFreeType: typeConversion(rentFreeType),//免租类型
            billUnit: typeConversion(billUnit),//计价单位
            businessType: typeConversion(businessType),//业务类型
						billWarehouseId,
            webGeneralDisabled,
            isGeneralRules : operationType == 'copy' ? isGeneralRules : nObj.isGeneralRules
          }
          this.tableConfig.columnData = (storageCostList||[]).map((e, index) => {
            const { maxPrice } = e
            if (index + 1 == storageCostList.length) {
              e.isLast = true
              e.endValue = null
            }
            return {
              ...e,
              maxPrice: maxPrice || undefined
            }
          })
        })
      }
      this.formConfig = {
        ...this.formConfig,
        formModel: {
          ...formModel,
          rentFreeType: formModel?.rentFreeType || '0',
          closingType: formModel?.closingType || '1',
          isGeneralRules :formModel?.isGeneralRules||false
        },
        lists: warehouseRentFormConfig({
          changeType: formModel?.rentFreeType || '0',
          // warehouseChange: () => {
          //   this.$refs.billWarehouseId?.changeFocusRequest();
          // },
        }),
        formRules: warehouseRentFormRulesConfig({ rentFreeType: formModel?.rentFreeType || '0' })
      }
      this.$refs.dialogForm?.setFormModel(this.formConfig.formModel)
      this.$refs.tableServiceRef?.setNewTableData(this.tableConfig.columnData)
      this.showSearchForm = true;
    },
    handleChange(row, type) {
      if (type == 'rentFreeType') {
        const { rentFreeType, ...nObj } = this.$refs.dialogForm?.getFormParams();
        this.formConfig.lists = warehouseRentFormConfig({
          changeType: row,
          // warehouseChange: () => {
          //   this.$refs.billWarehouseId?.changeFocusRequest();
          // },
        })
        const ruleValide = row == 1 ? {
          rentFreeDay: rentFreeDay,
        } : {};
        const removeRule = row == 1 ? [] : ["rentFreeDay"];

        this.formConfig.formModel = {
          rentFreeType,
          ...nObj
        }
        this.$refs.dialogForm?.changeModelFormData();
        this.$refs.dialogForm?.setFormRules(ruleValide, removeRule); //根据用户的选择新增与删除校验
      }else if(type=='businessType'){
        const row = this.$refs.dialogForm?.getFormParams();
        this.changeBillCompanyId(row)

      }
    },
    handleAdd(row) {
      //新增价格信息
      const length = this.tableConfig.columnData.length
      const { temp_secondId } = row
      if (length >= 10) {
        this.$message.error(`新增失败，最多存在十条数据`);
        return
      }
      this.tableConfig.columnData.find((e, index) => {
        const { endValue } = e
        if (e.temp_secondId == temp_secondId) {
          this.tableConfig.columnData.splice(index + 1, 0, {
            startValue: endValue,//开始值
            endValue,//结束值
          });
        }
      });
      this.getLastDataStatus()
    },
    handleDelete(row) {
      //删除价格信息
      const length = this.tableConfig.columnData.length
      const { temp_secondId } = row
      if (length <= 1) {
        this.$message.error(`删除失败，最少保留一条数据`);
        return
      }
      let columnData = JSON.parse(JSON.stringify(this.tableConfig.columnData))
      columnData.map((e, index) => {
        if (columnData[index].temp_secondId == temp_secondId) {
          if (index == 0) {
            //如果删除的是第一条数据，第二条开始值为0
            columnData[index + 1] = {
              ...columnData[index + 1],
              startValue: 0,
            }
          } else if (columnData[index - 1] && (index + 1 < columnData.length)) {
            //如果删除的非第一条或最后一条，下一条数据的开始值等于上一条的结束值
            columnData[index + 1] = {
              ...columnData[index + 1],
              startValue: columnData[index - 1].endValue,
            }
          }
          if (columnData[index].id) {
            this.deleteIdList.push(columnData[index].id)
          }
          delete columnData[index]
        }
      });
      this.tableConfig.columnData = columnData.filter((e) => e !== undefined)
      this.$refs.tableServiceRef?.setNewTableData(this.tableConfig.columnData)
      this.getLastDataStatus()
    },
    getLastDataStatus() {
      //新增或删除价格信息后将价格信息的最后一条消息置为不可编辑
      const length = this.tableConfig.columnData.length;
      this.tableConfig.columnData.map((e, index) => {
        if (index + 1 == length) {
          e.isLast = true;
          e.endValue = null
        } else {
          e.isLast = false;
        }
      });
    },
    changeEndValue(row) {
      //输入结束值后
      const { endValue, temp_secondId } = row
      this.tableConfig.columnData.map((e, index) => {
        if (e.temp_secondId == temp_secondId) {
          if (this.tableConfig.columnData[index + 1]) {
            this.tableConfig.columnData[index + 1].startValue = endValue;
          }
        }
      });
    },
    getBtnLists(row, type) {
      //操作按钮判断
      const length = this.tableConfig.columnData.length
      if (length == 1) {
        return [
          this.tableConfig.statusBtnList[0]
        ]
      } else {
        return this.tableConfig.statusBtnList
      }
    },
    changeBillCompanyId(row) {
      const { id = undefined,billWarehouseId=undefined,businessType=undefined } = row;
      if (billWarehouseId) {
        const params = {
          id,
          billWarehouseId,
          businessType
        };
        GETCountByBillWarehouseId(params).then((res) => {
          const { data } = res;//0通用规则 1非通用规则
          if(data!=1){
            this.tableTags.active==1
            this.changeTabs(1)
          }
          this.formConfig.formModel = {
            ...this.formConfig.formModel,
            webGeneralDisabled: data,
            isGeneralRules: data > 0 ? false : true,
          };
          this.$refs.dialogForm?.setFormModel({
            isGeneralRules: data > 0 ? false : true,
          });
        });
      } else {
        this.formConfig.formModel={
          ...this.formConfig.formModel,
          isGeneralRules:false
        }
        this.$refs.dialogForm?.setFormModel({
          isGeneralRules: false,
        });
      }
    },
    inputEndValue(row) {
    },
    handleBack() {
      //返回
      this.$refs.detailTopRef?.comReBack();
    },
    getTableTags(row){
      const {operationType}=this.$route.query
      const {isGeneralRules}=row
      const arr=(this.tableTags.columns||[]).filter((e)=>{
        const {showOperationType,showIsGeneralRules}=e
        return (showOperationType?showOperationType.includes(operationType):true)&&(showIsGeneralRules?showIsGeneralRules.includes(isGeneralRules):true)
      })
      return arr
    },
    changeTabs(key) {
      //标签切换
      this.tableTags.active = key;
      if(key==2){
        this.getcustomerInfo()
      }
    },
    getcustomerInfo() {
      //获取关联客户局部刷新
      this.$nextTick(()=>{
        this.$refs.customerTableServiceRef?.refreshTable(true);
      })
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
          this.getcustomerInfo()
        }
      );
    },
    handleServiceDrawer(){
      const { id } = this.$route.query
      const params = {
        customerType:4,
        storageId: id
      }
      this.$refs.ServiceDrawerRef.show(params)
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
    getTableResult(row={}){
      const {total=0}=row
      this.customerTableConfig.statusBtnList[0].disabled=total==1?true:false
    }
  },
}
