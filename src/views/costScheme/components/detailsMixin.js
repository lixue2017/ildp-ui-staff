//新增修改
import { detailsServicePriceConfig, detailsCustomerPriceConfig } from "./detail/model.js"
import { mapActions, mapState } from "vuex";
import { typeConversion } from '@/utils/index'
import { filesPreview } from "@/utils/index";
import { getSchemeDetail, getRelationList, getRelationVo,DELETERelationRemoveCustomer, addRelation, deleteScheme, upgradeScheme, getSchemeConfigInfo, updateSchemeStatus, previewScheme } from "@/api/costScheme/index.js"
export const detailsMixin = {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComDialog: () => import("./dialog/index"),
    TransformDialog: () => import('./transferDialog/index'),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    ServiceDrawer:()=> import("./serviceDrawer/index"),
  },
  data() {
    return {
      config: {
        servicePrice: detailsServicePriceConfig,
        customerPrice: detailsCustomerPriceConfig
      },
      footerBtn: [
        //1-草稿 2-已启用 3-已禁用 4-已过期
        {
          text: "修 改",
          type: "primary",
          showType: ['customerPrice', "servicePrice"],
          showStatus: [1],
          handleClick: () => {
            this.handleEdit()
          },
        },
        {
          text: "删 除",
          type: "primary",
          showType: ['customerPrice', "servicePrice"],
          showStatus: [1],
          handleClick: () => {
            this.handleDelete()
          },
        },
        {
          text: "启 用",
          type: "primary",
          showType: ['customerPrice', "servicePrice"],
          showStatus: [1, 3],
          handleClick: () => {
            this.handleChangeStatus({ status: 2 })
          },
        },
        {
          text: "禁 用",
          type: "primary",
          showType: ['customerPrice', "servicePrice"],
          showStatus: [2],
          handleClick: () => {
            this.handleChangeStatus({ status: 3 })
          },
        },
        {
          text: "升 级",
          showStatus: [2],
          showType: ['customerPrice', "servicePrice"],
          type: "primary",
          handleClick: () => {
            const { id } = this.$route.query
            this.upgradeScheme({ id })
          },
        },
        {
          text: "预 览",
          type: "primary",
          showStatus: [1, 2, 3, 4],
          showType: ['customerPrice'],
          handleClick: () => {
            this.handlePreview()
          },
        },
        {
          text: "返 回",
          showStatus: [1, 2, 3, 4],
          showType: ['customerPrice', "servicePrice"],
          handleClick: () => {
            this.handleBack()
          },
        },
      ],
      supplement: [
        {
          id: "otherCost",
          title: "其他费用",
          costType: ['customerPrice'],
          input: "",
          inputHtml: "",
        },
        {
          id: "otherRemark",
          title: "费用备注",
          costType: ['customerPrice'],
          input: "",
          inputHtml: "",
        },
        {
          id: "otherReplenish",
          title: "其他补充",
          costType: ["servicePrice", 'customerPrice'],
          input: "",
          inputHtml: "",
        },
        {
          id: "remark",
          title: "备注",
          costType: ['customerPrice'],
          input: "",
          inputHtml: "",
        },
      ],
      cost: {
        id: "",//id
        type: "",//区分服务价格列表和客户项目价格
        billUnit: ""//计费单位，需要实时改变table中的单位
      },
      showSearchForm: false,
      textarea: "",
    }
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["costSchemeType", "billingTemplate", "pricingUnit", "billModle"]).then(() => {
      this.getConfig()
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    async getConfig() {
      //初始化
      this.showSearchForm = false;
      const { id, listsType } = this.$route.query
      const costDetails = await getSchemeDetail(id)
      const {
        serviceId,
        serviceName,
        name,
        adWarehouse,
        warehouseCode,
        countryId,
        billCurrency,
        costType,
        startTime,
        endTime,
        configRuleList,
        countryName,
        billUnitName,
        timeLimitCost,
        startSignAging,
        endSignAging,
        delayedClaims,
        delayedClaimsMoney,
        delayedClaimsUnit,
        billUnit,
        versions,
        billTemplate,
        billModle,
        otherReplenish,
        status,
        createBy,
        createTime,
        otherCost,
        otherRemark,
        remark,
        billCurrencyName,
        costName,
        costCode,
        headTransportModeName,
        outWarehouseWayName,
        encasementWayName
      } = costDetails.data
      this.cost = {
        ...this.cost,
        id,
        type: listsType,
        billUnit: billUnit ? billUnit == 1 ? "CBM" : 'KG' : ''
      }
      const supplementObj = {
        otherCost,
        otherRemark,
        otherReplenish,
        remark
      }
      Object.keys(supplementObj).map(key => {
        this.supplement.map((e) => {
          if (e.id == key && supplementObj[key]) {
            e.inputHtml = supplementObj[key]
          }
        })
      })
      const config = this.config[listsType]
      this.formConfig = {
        //表单form
        ...this.formConfig,
        lists: config.formLists,
        formModel: {
          id,
          serviceId,
          serviceName,
          name,
          adWarehouse,
          warehouseCode,
          countryId,
          billCurrency,
          costType: typeConversion(costType),
          startTime,
          endTime,
          billUnitName,
          countryName,
          timeLimitCost,
          startSignAging,
          endSignAging,
          delayedClaims,
          delayedClaimsMoney,
          delayedClaimsUnit,
          versions,
          billUnit: typeConversion(billUnit),
          billTemplate: typeConversion(billTemplate),
          billModle: typeConversion(billModle),
          otherReplenish,
          status,
          billCurrencyName,
          costName,
          costCode,
          headTransportModeName,
          outWarehouseWayName,
          encasementWayName
        }
      }
      // this.getTableData()
      this.tableTags = {
        //标签tags
        ...this.tableTags,
        columns: config.btnTagsLists
      },
        this.formData = {
          ...this.formData,
          title: config.title,
          createBy,
          createTime
        }
      this.showSearchForm = true;
    },
    changeTabs(key) {
      //标签切换
      const { customerPrice } = this.$route.query
      this.tableTags.active = key;
      const refreshTable = {
        1: "tablePriceInfoRef",
        2: "tableServiceRef",
      };
      this.$nextTick(() => {
        this.$refs[refreshTable[key]] &&
          this.$refs[refreshTable[key]].refreshTable(true);
      });
    },
    handleSuccess() {
      const { active } = this.tableTags
      this.changeTabs(active)
    },
    handleAddRules(row = {}, type) {
      //规则设置
      this.$refs.comDialog.show(row, type)
    },
    handleAddCustomer(relevanceType) {
      //关联客户
      const tableData = this.$refs.tableServiceRef?.getNewTableData()
      const { type, id } = this.cost
      const customerIdList = tableData.map((e) => e.customerId)
      const customerType = type == "servicePrice" ? 3 : 2
      const params = {
        customerType,
        customerIdList,
        costId: id
      }
      const httpRequest = {
        get: getRelationVo,
        add: addRelation
      }
      this.$refs.TransformDialog.show(params, httpRequest, relevanceType)
    },
    handleServiceDrawer(){
      //抽屉关联服务商
      const tableData = this.$refs.tableServiceRef?.getNewTableData()
      const { type, id } = this.cost
      const customerIdList = tableData.map((e) => e.customerId)
      const customerType = type == "servicePrice" ? 3 : 2
      const params = {
        customerType,
        customerIdList,
        costId: id
      }
      this.$refs.ServiceDrawerRef.show(params)
    },
    handleBack() {
      //返回
      this.$refs.detailTopRef?.comReBack();
    },
    handleDelete() {
      //删除
      const { id } = this.formConfig.formModel
      this.$refs.confirmDialog.delete().then(() => {
        deleteScheme(id).then(() => {
          this.$message.success("删除成功");
          this.handleBack()
        });
      });
    },
    handleEdit(row = {}) {
      //编辑
      const { id, listsType } = this.$route.query
      const costId = row.id ? row.id : id //区分升级和编辑
      this.$router.push({
        path: "/costScheme/costSchemeAddEdit",
        query: {
          backPath: this.$route.fullPath,
          listsType,
          id: costId,
          operationType: "edit"
        },
      });
    },
    handleChangeStatus(extra = {}) {
      const { id } = this.$route.query
      const { status } = extra
      const params = {
        id,
        status
      }
      updateSchemeStatus(params).then((res) => {
        this.getConfig();
      })
    },
    handleTopClick({ type, id }) {
      //上下页
      if (type === "pre" || type === "next") {
        this.tableTags.active = 1;
        this.getConfig();
      }
    },
    getColumnConfig(active) {
      //获取tableConfig
      const { listsType } = this.$route.query
      return this.config[listsType].tableLists[active]
    },
    getHttpRequest(active) {
      //获取tableHttpRequest
      const httpRequest = {
        1: getSchemeConfigInfo,
        2: getRelationList,
      }
      return httpRequest[active]
    },
    getQueryParams() {
      //talbe调用接口参数
      const { id } = this.$route.query
      return {
        costId: id
      }
    },
    handlePreview() {
      const { id } = this.$route.query
      previewScheme(id).then((res) => {
        const url = res?.msg
        filesPreview(url)
      })
    },
    upgradeScheme(row = {}) {
      const params = {
        id: row.id,
      }
      upgradeScheme(params).then((res) => {
        const { status, id } = res.data
        if (status == 1) {
          this.$refs.confirmDialog.upgrade().then(() => {
            this.handleEdit({ id })
          });
        } else {
          this.handleEdit({ id })
        }
      })
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
  },
}
