//新增修改
import { addServicePriceConfig, addCustomerPriceConfig } from "./addEdit/model.js"
import { mapActions, mapState } from "vuex";
import { typeConversion } from '@/utils/index'
import { getSchemeDetail, getRelationList, deleteConfig,DELETERelationRemoveCustomer, getPriceRelationWarehouse, updateConfig, getRelationVo, addRelation, updateScheme, getSchemeConfigInfo, previewScheme } from "@/api/costScheme/index.js"
export const addEditMixin = {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComDialog: () => import("./dialog/index"),
    TransformDialog: () => import('./transferDialog/index'),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    ServiceDrawer:()=> import("./serviceDrawer/index"),
  },
  data() {
    return {
      config: {
        servicePrice: {
          add: addServicePriceConfig,
          edit: addServicePriceConfig
        },
        customerPrice: {
          add: addCustomerPriceConfig,
          edit: addCustomerPriceConfig
        }
      },
      footerBtn: [
        {
          text: "保存并启用",
          type: "primary",
          showType: [],
          handleClick: () => {
            this.submitStatus = 2
            this.$refs.dialogForm.submitForm();
          },
        },
        {
          text: "保 存",
          type: "primary",
          showType: ['customerPrice', 'servicePrice'],
          handleClick: () => {
            this.submitStatus = 1
            this.$refs.dialogForm.submitForm();
          },
        },
        {
          text: "取 消",
          showType: ['customerPrice', 'servicePrice'],
          handleClick: () => {
            this.handleBack()
          },
        },
      ],
      cost: {
        id: "",//id
        type: "",//区分服务价格列表和客户项目价格
        operationType: "",//区分是新增还是编辑
        billUnit: "",//计费单位，需要实时改变table中的单位
        billCurrencyCode: "",//计费币种,
      },
      showSearchForm: false,
      costRules: {},
      supplement: [
        {
          id: "otherCost",
          title: "其他费用",
          costType: ['customerPrice'],
          placeholder: "请输入其他费用",
          type: "textarea",
          rows: 3,
          input: "",
          inputHtml: "",
        },
        {
          id: "otherRemark",
          title: "费用备注",
          type: "textarea",
          rows: 3,
          costType: ['customerPrice'],
          placeholder: "请输入费用备注",
          input: "",
          inputHtml: "",
        },
        {
          id: "otherReplenish",
          title: "其他补充",
          type: "textarea",
          rows: 3,
          costType: ["servicePrice", 'customerPrice'],
          placeholder: "请输入其他补充",
          input: "",
          inputHtml: "",
        },
        {
          id: "remark",
          title: "备注",
          type: "textarea",
          rows: 5,
          costType: ['customerPrice'],
          placeholder: "请输入备注",
          input: "",
          inputHtml: "",
        },
      ],
      ishandleChangerules: false,
      priceInfo: []
    }
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "costSchemeType",
      "billingTemplate",
      "pricingUnit",
      "billModle",
      'freightType',
      'outWarehouseWay',
      'headTransportMode'
    ]).then(() => {
      this.getConfig()
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    async getConfig() {
      //初始化
      const { id, listsType, operationType } = this.$route.query
      const config = this.config[listsType][operationType]
      const costDetails = await getSchemeDetail(id)
      const {
        serviceId,
        name,
        adWarehouse,
        countryId,
        billCurrency,
        billCurrencyName,
        costType,
        // startTime,
        // endTime,
        timeLimitCost,
        startSignAging,
        endSignAging,
        delayedClaims,
        delayedClaimsMoney,
        delayedClaimsUnit,
        billUnit,
        billUnitName,
        versions,
        billTemplate,
        billModle,
        otherReplenish,
        costId,
        otherCost,
        otherRemark,
        remark,
        warehouseCode,
        costCode,
        originalSchemeId,
        headTransportMode,
        outWarehouseWay,
        encasementWay
      } = costDetails.data
      const supplementObj = {
        otherCost,
        otherRemark,
        otherReplenish,
        remark
      }
      Object.keys(supplementObj).map(key => {
        this.supplement.map((e) => {
          if (e.id == key && supplementObj[key]) {
            e.input = supplementObj[key].replace(/<br>/g, '\n').replace(/&nbsp/g, ' ')
            e.inputHtml = supplementObj[key]
          }
        })
      })
      this.cost = {
        ...this.cost,
        id,
        type: listsType,
        operationType,
        billCurrencyCode: billCurrencyName || "",
        billUnit: billUnit ? billUnit == 1 ? "CBM" : 'KG' : 'CBM'
      }
      let adWarehouseLists, billCurrencyId = undefined
      if (listsType == 'servicePrice') {
        //服务价格
        adWarehouseLists = adWarehouse ? (adWarehouse.split(',')).map((e) => {
          const id = typeConversion(e, 'number')
          return {
            id
          }
        }) : undefined
        billCurrencyId = {
          id: billCurrency
        }
      } else {
        //客户价格
        adWarehouseLists = adWarehouse
        billCurrencyId = {
          id: billCurrency
        }
      }
      this.formConfig = {
        //表单form
        ...this.formConfig,
        lists: config.formLists,
        formRules: config.formRules,
        formModel: {
          costId: costId ? {
            id: costId
          } : undefined,
          serviceId,
          name,
          adWarehouse: adWarehouseLists,
          countryId,
          billCurrency: billCurrencyId,
          billCurrencyName,
          costType: listsType == 'servicePrice' && operationType == 'add' ? '1' : listsType == 'customerPrice' && operationType == 'add' ? '2' : typeConversion(costType),
          // startTime,
          // endTime,
          timeLimitCost,
          startSignAging,
          endSignAging,
          delayedClaims,
          delayedClaimsMoney,
          delayedClaimsUnit,
          versions,
          billUnit: billUnit ? typeConversion(billUnit) : '1',
          billUnitName,
          billTemplate: listsType == 'servicePrice' && operationType == 'add' ? '1' : typeConversion(billTemplate),
          billModle: listsType == 'servicePrice' && operationType == 'add' ? '1' : typeConversion(billModle),
          warehouseCode,
          costCode,
          originalSchemeId,
          headTransportMode:typeConversion(headTransportMode),
          outWarehouseWay:typeConversion(outWarehouseWay),
          encasementWay:typeConversion(encasementWay)
        }
      }
      this.formData.title = config.title
      this.tableTags = {
        //标签tags
        ...this.tableTags,
        columns: config.btnTagsLists
      }
      this.showSearchForm = true;
    },
    changeTabs(key) {
      //标签切换
      this.tableTags.active = key;
      const refreshTable = {
        1: "tablePriceInfoRef",
        2: "tableServiceRef",
      };
      if (key == 1) {
        this.priceInfo = []
      } else if (key == 2 && this.priceInfo?.length == 0) {
        //用的是V-IF，切到第二个标签后，第一个标签的数据会清除掉，需要在切换之前保存一份用于提交校验
        this.priceInfo = this.$refs.tablePriceInfoRef?.getNewTableData()
        console.log('this.priceInfo', this.priceInfo)
      }
      this.$nextTick(() => {
        this.$refs[refreshTable[key]] &&
          this.$refs[refreshTable[key]].refreshTable(true);
      });
    },
    handleAddRules(row, type) {
      //规则设置
      this.$refs.comDialog.show(row, type)
    },
    handleAddCustomer(relevanceType) {
      //关联服务商
      const { id } = this.$route.query
      const tableData = this.$refs.tableServiceRef?.getNewTableData()
      const { type } = this.cost
      const customerIdList = tableData.map((e) => e.customerId)
      const customerType = type == "servicePrice" ? 3 : 2
      const params = {
        customerType,
        customerIdList,
        costId: id,
      }
      const httpRequest = {
        get: getRelationVo,
        add: addRelation
      }
      this.$refs.TransformDialog.show(params, httpRequest, relevanceType)
    },
    handleServiceDrawer(){
      //抽屉关联服务商
      const { id } = this.$route.query
      const tableData = this.$refs.tableServiceRef?.getNewTableData()
      const { type } = this.cost
      const customerIdList = tableData.map((e) => e.customerId)
      const customerType = type == "servicePrice" ? 3 : 2
      const params = {
        customerType,
        customerIdList,
        costId: id,
      }
      // const httpRequest = {
      //   get: getRelationVo,
      //   add: addRelation
      // }
      this.$refs.ServiceDrawerRef.show(params)
    },
    handleSuccess() {
      const { active } = this.tableTags
      this.changeTabs(active)
    },
    handleDeleteRules(row) {
      const { id } = row
      this.$refs.confirmDialog.delete().then(() => {
        deleteConfig(id).then((res) => {
          this.handleSuccess()
        })
      });
    },
    changeFormData(row, type) {
      if (type == 'billUnit') {
        //计费单位的改变需要同步至表格中的规则
        this.cost.billUnit = row == 1 ? 'CBM' : "KG"
      }
    },
    handleMainTainWarehouse(row) {
      //维护仓库
      const { type } = this.cost
      const { id, warehouseIds, costId } = row
      console.log('row', row)
      let warehouseIdList = []
      if (warehouseIds) {
        warehouseIdList = warehouseIds.split(',').map(Number)
      }
      const params = {
        id,
        servicePrice: type == 'servicePrice' ? 3 : 2,
        costId,
        warehouseIdList
      }
      const httpRequest = {
        get: getPriceRelationWarehouse,
        add: updateConfig//修改接口
      }
      this.$refs.TransformDialog.show(params, httpRequest, 'warehouse')
    },
    handleBack() {
      //返回
      this.$refs.detailTopRef?.comReBack();
    },
    getInputHtml(row, input) {
      input.inputHtml = row.replace(/\n|\r\n/g, '<br>').replace(/ /g, ' &nbsp')
    },
    handleSaveData(row) {
      const {
        serviceId,
        name,
        adWarehouse,
        countryId,
        billCurrency,
        billModle,
        billTemplate,
        billUnit,
        timeLimitCost,
        startSignAging,
        endSignAging,
        delayedClaims,
        delayedClaimsMoney,
        delayedClaimsUnit,
        // startTime,
        // endTime,
        versions,
        costId,
        costCode,
        originalSchemeId,
        headTransportMode,
        outWarehouseWay,
        encasementWay
      } = row
      const { type } = this.cost
      let billCurrencyId, adWarehouseLists, costCustomerPrice, id = undefined
      let configRuleList = this.$refs.tablePriceInfoRef?.getNewTableData()
      if (type == 'servicePrice') {
        //服务成本
        adWarehouseLists = adWarehouse?.map((e) => e.id).join(',')//必选项不用做判空
        billCurrencyId = billCurrency.id
        id = this.cost.id
      } else {
        //客户价格
        billCurrencyId = billCurrency.id
        adWarehouseLists = adWarehouse
        costCustomerPrice = costId.id
        id = this.$route.query.id
        configRuleList?.map((e) => {
          //只要是手动切换了成本规则就去掉价格信息的ID和规则中的ID
          if (this.ishandleChangerules) {
            delete e.id
          }
          const { type } = this.cost
          e.configType = type == "servicePrice" ? 1 : 2
          const { billingRuleList } = e
          billingRuleList?.map((item) => {
            item.ruleType = type == "servicePrice" ? 1 : 2
            if (this.ishandleChangerules) {
              delete item.id
            }
          })
        })
      }
      let supplementObj = {}
      this.supplement.map((e) => {
        this.$set(supplementObj, [e.id], e.inputHtml)
      })
      const params = {
        id,
        costId: costCustomerPrice,
        status: this.submitStatus,
        serviceId,
        name,
        adWarehouse: adWarehouseLists,
        countryId,
        billCurrency: billCurrencyId,
        costType: type == 'servicePrice' ? 1 : 2,
        billModle,
        billTemplate,
        billUnit,
        timeLimitCost,
        startSignAging,
        endSignAging,
        delayedClaims,
        delayedClaimsMoney,
        delayedClaimsUnit,
        // startTime,
        // endTime,
        configRuleList: configRuleList || this.priceInfo,
        versions,
        costCode,
        originalSchemeId,
        headTransportMode,
        outWarehouseWay,
        encasementWay,
        ...supplementObj
      }
      console.log('params', params)
      return this.comRepeatedRequest(this, updateScheme, params).then((res) => {
        this.$nextTick(() => {
          this.handleBack()
        })
      })
    },
    handleChangerules(row = {}) {
      //手动选择成本规则
      this.ishandleChangerules = true
      const {
        id,
        adWarehouse,
        countryId,
        billCurrency,
        billModle,
        billTemplate,
        billUnit,
        billUnitName,
        timeLimitCost,
        startSignAging,
        endSignAging,
        delayedClaims,
        delayedClaimsMoney,
        delayedClaimsUnit,
        billCurrencyName,
        serviceId,
        warehouseCode,
        name,
        headTransportMode,
        outWarehouseWay,
        encasementWay
      } = row
      const { active } = this.tableTags
      this.formConfig.formModel = {
        ...this.formConfig.formModel,
        billCurrencyName
      }
      this.$refs.dialogForm.setFormModel({
        serviceId,
        adWarehouse,
        countryId,
        billCurrency: {
          id: billCurrency,
        },
        billCurrencyName,
        billModle,
        billTemplate,
        billUnit,
        billUnitName,
        timeLimitCost,
        startSignAging,
        endSignAging,
        delayedClaims,
        delayedClaimsMoney,
        delayedClaimsUnit,
        warehouseCode,
        name,
        headTransportMode,
        outWarehouseWay,
        encasementWay
      });
      const costId = this.$route.query.id
      this.costRules = {
        costId: id || costId
      }
      this.cost = {
        ...this.cost,
        id: id || costId,
        billUnit: billUnit ? billUnit == 1 ? "CBM" : 'KG' : ''
      }
      //上面两个对象需要合并一下
      this.changeTabs(active)
      // this.$refs.tablePriceInfoRef.setNewTableData(configRuleList||[]);

    },
    getColumnConfig(active) {
      const { listsType, operationType } = this.$route.query
      if (listsType || operationType) {
        return this.config[listsType][operationType]?.tableLists[active]
      }
    },
    getHttpRequest(row) {
      //新增或维护需要获取列表数据进行初始化，不能加分页
      const { costId } = row
      const { active } = this.tableTags
      let params = {
        costId
      }
      const httpRequest = {
        1: getSchemeConfigInfo,
        2: getRelationList,
      }
      return httpRequest[active](params)
    },
    getQueryParams() {
      const { id } = this.$route.query
      const { costId } = this.costRules//成本规则的ID
      const { active } = this.tableTags
      let params
      if (active == 1 && costId) {
        //当客户项目费用新增或编辑页面勾选了成本规则时，价格信息根据成本ID查询，
        params = {
          costId: costId
        }
      } else {
        params = {
          costId: id
        }
      }
      return params
    },
    handleChangeBillCurrency(row) {
      //手动选择币种
      const { nameCn, code } = row
      this.cost = {
        ...this.cost,
        billCurrencyCode: code || ""
      }
      this.$refs.dialogForm.setFormModel({
        billCurrencyName: nameCn,
      });
    },
    getTableWarehouseIds() {
      //获取仓库列表所有仓库集合
      const tableData = this.$refs.tablePriceInfoRef?.getNewTableData();
      let warehouseIds = [];
      tableData.map((e) => {
        if (e.warehouseIds) {
          const ids = e.warehouseIds.split(",");
          warehouseIds = [...warehouseIds, ...ids];
        }
      });
      return warehouseIds
    },
    getServiceBtnLists(){
      const {active}=this.tableTags
      const arr=this.tableStatusBtnList.filter((e)=>{
        const {showtabs}=e
        return showtabs? showtabs.includes(active):false
      })
      return arr
    },
    onSelectionChange(rows) {
      this.selectAll = rows;
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectAll,
      });
    },
    handleRemove(data) {
      const { customerId } = data;//customerId有值就是对象，没值就是数组
      if(data.length==0&&!customerId){
        this.$message.error("未勾选数据");
        return
      }
      const { id: costId } = this.$route.query;
      const params = {
        customerIdList: customerId?[customerId]:data.map((e)=>e.customerId),
        costId,
      };
      this.comRepeatedRequest(this, DELETERelationRemoveCustomer, params).then(
        (res) => {
          this.onSelectionChange([])
          this.handleSuccess();
        }
      );
    },
  }
}

/**
 * 客户项目价格：
 * 新增删除页面查询价格信息有2种类型，初始化的时候取路由ID查询（与服务价格一致），切换成本规则的时候用成本规则ID查询
 *
 * 服务成本价格：
 * 新增价格信息有两个判断，如果列表无数据，新增计费规则初始化两条数据；如果列表有数据，计费规则继承第一条数据，且除了单价外其他均不可修改
 *
 * 新增修改复制维护仓库价格信息均需要去掉列表已有关联仓库
 *
 * 计费规则修改规则，最小计费值等于第一条计费规则开始值，第一条计费规则结束值等于第二条计费规则开始值，最后一条计费规则结束值不让填写，删除与新增数据时要同步最小计费值和计费规则的开始值
 *
 * 新增与复制计费规则时，需要去掉每条计费规则中的ID
 *
 */

