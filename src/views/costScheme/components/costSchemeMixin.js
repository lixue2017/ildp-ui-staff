//列表
import {
  addScheme,
  previewScheme,
  addStorageSchemeQueryAddList,
} from "@/api/costScheme/index.js";
import { mapActions, mapState } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import {diyCustomDialogCols } from "./model"
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { msgBox } from "@/utils/confirmBox.js";
import { getNowDate } from "@/utils/index.js"
export const mixinCostScheme = {
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    rulesDialog: () => import("../customerWHRent/components/dialog.vue"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    TransformDialog: () => import('./transferDialog/index'),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    // AddDrawer: () => import('@/views/costScheme/customerWHRent/components/drawer'),
  },
  data() {
    return {
      customerRules: '',
    }
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    // const { type } = this.tabsConfig
    // if (type == 'customerWHRent' && hasBtnPermits(this.tabsBtn[0].hasPermission)) {
    //   //客户仓租方案-新增客户规则权限
    //   this.tabsConfig.btnArr = this.tabsBtn
    // }
    this["dictionary/getDictionary"]([
      "costSchemeStatus",
      "pricingUnit",
      'warehouseBusinessType',
      'warehousePricingUnit',
      'warehouseBusinessType',
      'warehouseRentFreeType',
      'headTransportMode',
      'outWarehouseWay',
      'freightType',
      'isGeneralRules'
    ]).then(
      () => {
        this.showSearchForm = true;
      }
    );
  },
  mounted() {
    // const { type, btnArr } = this.tabsConfig
    // if (type == "customerWHRent" && btnArr.length > 0) {
    //   //客户仓租方案需要初始化获取规则列表
    //   this.getAddStorageSchemeQueryAddList()
    // }
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchList(searchFrom = {}) {
      const { startUseTime, startTime, endTime, startCreateTime,isGeneralRules, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        startUseTimeBegin: startUseTime && startUseTime[0],//启用时间
        startUseTimeEnd: startUseTime && startUseTime[1],
        startTimeBegin: startTime && startTime[0],//有效开始
        startTimeEnd: startTime && startTime[1],
        endTimeBegin: endTime && endTime[0],//有效结束
        endTimeEnd: endTime && endTime[1],
        startCreateTimeBegin: startCreateTime && startCreateTime[0],//创建时间
        startCreateTimeEnd: startCreateTime && startCreateTime[1],
        isGeneralRules : isGeneralRules ? isGeneralRules == 1 ? false : true : undefined,
        // startTimeBegin: startUseTime && startUseTime[0],
        // startTimeEnd: startUseTime && startUseTime[1],
      };
      this.mixinkeepTable(true);
    },
    async handleAdd(row = {}, extra = {}) {
      let { id } = row
      const { path, operationType, costType } = extra
      const { type } = this.tabsConfig
      if (type == "servicePrice" || type == "customerPrice") {
        //服务成本价格，客户项目价格
        if (!id) {
          await addScheme({ costType }).then((res) => {
            //新增的时候获取ID
            id = res.data
          })
        }
      }
      this.$router.push({
        path,
        query: {
          backPath: this.$route.fullPath,
          listsType: type,
          id,
          operationType
        },
      });
    },
    handleCopy(id, extra) {
      const { httpRequest, path,operationType } = extra
      httpRequest(id).then((res) => {
        //复制的时候获取ID
        const costId = res.data
        const { type: listsType } = this.tabsConfig
        this.$router.push({
          path,
          query: {
            backPath: this.$route.path,
            listsType,
            id: costId,
            operationType
          },
        });
      })
    },
    handleView(row, extra) {
      const { path } = extra
      const { activeName, type } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path,
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          listsType: type
        },
      });
    },
    getQueryParams() {
      const { type } = this.tabsConfig
      const {status = undefined,...obj}=this.searchFromData||{}
      let costType = undefined
      let statusList = undefined
      if (type == 'servicePrice') {
        //服务成本价格
        costType = 1
        statusList=status
      } else if (type == "customerPrice") {
        //客户项目价格
        costType = 2,
        statusList=status
      }else if(type=='warehouseRent'){
        //仓租方案管理
        statusList=(status||[]).join(',')
      }else if(type=='customerWHRent'){
        //客户仓租方案
        statusList=(status||[]).join(',')
      }
      return {
        costType,
        ...obj,
        statusList,
      }
    },
    handleChangeStatus(row = {}, extra = {}) {
      //禁用
      const { id } = row
      const { status, httpRequest } = extra
      const params = {
        id,
        status
      }
      httpRequest(params).then((res) => {
        this.mixinkeepTable(true);
      })
    },
    handleEffectuate(row={},extra={}){
      //已作废/禁用状态下的启用
      const {id}=row
      const {httpRequest,requestParams}=extra
      const enablingTime = `${getNowDate("-")} 00:00`;
      const params={
        id,
        enablingTime,
        ...requestParams
      }
      httpRequest(params).then((res)=>{
        this.mixinkeepTable(true);
        this.msgSuccess('启用成功');
      })
    },
    handleChangeState(row={},extra={}){
      const {type,httpRequest}=extra
      const {enablingTime}=row
      const {customFormConfig,dialogConfig={},tips=undefined,extraData={}}={
        0:{//启用
          customFormConfig:diyCustomDialogCols,
          dialogConfig:{
            title:"启用"
          },
          extraData:{
            status:2
          },
          tips:"启用成功！"
        },
        1:{//修改生效时间
          customFormConfig:diyCustomDialogCols,
          dialogConfig:{
            title:"修改生效时间"
          },
        },
      }[type]
      this.$refs.customDialogRef?.showCustomDialog({
				customFormConfig:customFormConfig(dialogConfig),
				formModel: {
          enablingTime:enablingTime||`${getNowDate('-')} 00:00`
        },
				httpRequest: (formModel)=>{
          const {id}=row
          const params={
            id,
            ...formModel,
            ...extraData
          }
          return httpRequest(params)
        },
				successFunction: ()=>{
          this.mixinkeepTable(true);
          if(tips){
            this.msgSuccess(tips);
          }
        },
			})
    },
    handleDelete(row, extraData) {
      const { id } = row
      const { httpRequest } = extraData
      this.$refs.confirmDialog.delete().then(() => {
        httpRequest(id).then(() => {
          this.$message.success("删除成功");
          this.mixinkeepTable(true);
        });
      });
    },
    upgradeScheme(row={},extra={}) {
      const params = {
        id: row.id,
      }
      const {httpRequest,path,operationType}=extra
      httpRequest(params).then((res) => {
        const { id } = res.data
          this.$refs.confirmDialog.upgrade().then(() => {
            this.handleAdd({ id }, {
              path,
              operationType,
            })
          });
      })
    },
    handleCancel(row,extra){
      console.log('row',row)
      const {httpRequest}=extra
      const {id}=row
      const msg = "取消操作不可逆！";
        const title = "取消提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, httpRequest, id).then(
            () => {
              this.msgSuccess("取消成功！");
              this.mixinkeepTable(true);
            }
          );
        });
    },
    // getAddStorageSchemeQueryAddList(name = "") {
    //   const params = {
    //     pageNum: 1,
    //     pageSize: 999,
    //     name
    //   }
    //   addStorageSchemeQueryAddList(params).then((res) => {
    //     this.tabsConfig.btnArr[0].options = (res.data || []).map((e) => {
    //       const { id, schemeCode, name, billCompanyName, billWarehouseName } = e
    //       const label = `${schemeCode}${name ? `/${name}` : ''}${billCompanyName ? `/${billCompanyName}` : ''}${billWarehouseName ? `/${billWarehouseName}` : ''}`
    //       return {
    //         id,
    //         label
    //       }
    //     })
    //   })
    // },
    handlePreview(row) {
      const { id } = row
      comFileDownload(this, previewScheme, id);
    },
    previewDownloadConfig(row) {
      const { id } = row
      return {
        previewParam: id,
        previewHttp: previewScheme,
      };
    },
    operationBtn(rItem, row) {
      const { status } = row
      const { showStatus } = rItem
      if (showStatus.includes(status)) {
        return true
      } else {
        return false
      }
    },
    handleViewRules(row) {
      this.$refs.rulesDialog?.show(row);
    },
    // handleUpgradation(row={},extra={}){
    //   const {id}=row
    //   const {httpRequest}=extra
    //   httpRequest(id).then((res)=>{
    //     this.mixinkeepTable(true);
    //       this.msgSuccess('升级成功');
    //   })
    // },
    // handleAddCommand(cb) {
    //   const { id } = cb
    //   const params = {
    //     storageId: id
    //   }
    //   this.$refs.AddDrawerRef.show(params)
    // },
    handleSuccess() {
      this.mixinkeepTable(true);
    }
  },
}
