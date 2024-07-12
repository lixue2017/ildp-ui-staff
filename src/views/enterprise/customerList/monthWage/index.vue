<template>
  <div class="app-container" v-loading="loading"  element-loading-text="文件正在上传">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchTabForm(tab.name)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="getHttpRequest(tab.name)"
              :getQueryParams="getQueryParams"
              :rowOperationBtnListFn="(row) => getBtnLists(row)"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['month','belongCustomerId']">
      <template v-slot:belongCustomerId="slotProps">
        <AutoComplete
            ref="belongCustomerIdRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: (val) => handlebelongCustomer(val),
              disabled:disabledAll['belongCustomerId']||false,
            }"
          />
        </template>
      <template v-slot:month="slotProps">
        <el-date-picker
          v-model="slotProps.formModel.month"
          type="month"
          :value-format="slotProps.fieldItem.valueFormat"
          :placeholder="slotProps.fieldItem.placeholder"
          :disabled="disabledAll['month']||false"
          :picker-options="slotProps.fieldItem.pickerOptions || {}"
        >
        </el-date-picker>
      </template>
    </ComCustomDialog>
    <addDialog ref="dialog" :expenseInit="expenseInit" @handleSuccess="handleSuccess" />
    <ComUpload
      style="display: none"
      ref="dropdownUploadRef"
      :uploadConfig="contractUploadConfig"
      @separateUploadCallBack="uploadSuccess"
    />
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getFormConfig,
  tableConfig_1,
  tableConfig_2,
  customDialogCols,
  uploadCheckDialogCols
} from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  GETStaffPayrollListVo,
  GETStaffPayrollDetailListVo,
  POSTStaffPayrollAdd,
  DELETEStaffPayrollDel,
  GETStaffPayrollDownloadDetailList,
  PUTStaffPayrollUpdateRemark,
  GETStaffPayrollBillList,
  GETCountByMonthAndCustomerId,
  GETStaffPayrollStaffApplicantInfo
} from "@/api/customerManage/customerList.js";
import { comFileDownload } from "@/utils/download.js";
import { defaultTextParams } from "_comp/ComUpload/model";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import {formatDate} from '@/utils/index.js'
export default {
  name: "CollectionTask",
  mixins: [mixinColsConf],
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    addDialog: () =>
      import(
        "@/views/settlementManage/paymentReceived/components/addCostDialog/index.vue"
      ),
    ComUpload: () => import("_comp/ComUpload"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "工资记录",
            name: "1",
          },
          {
            label: "员工工资发放记录",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            showTabName: "1",
            icon: "el-icon-plus",
            handleClick: (row) => {
              this.handleAdd(row);
            },
          },
        ],
      },
      searchFromData: [],
      searchFormConfig: {
        fold: false, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getForBookingList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        labelWidth: "100px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: {
          1: GETStaffPayrollListVo,
          2: GETStaffPayrollDetailListVo,
        },
      },
      statusList: [
        {
          text: "修改",
          showActive: ["1"],
          showStatus: [0],
          handleClick: (row) => {
            this.handleAdd(row);
          },
        },
        {
          text: "提交",
          showActive: ["1"],
          showStatus: [0],
          handleClick: (row) => {
            this.handleSubmit(row);
          },
        },
        {
          text: "下载明细",
          showActive: ["1"],
          showStatus: [0, 1],
          hasPermission: ["enterprise:monthWage:download"],
          handleClick: (row) => {
            this.downloadRecord(row);
          },
        },
        {
          text: "上传明细",
          showActive: ["1"],
          showStatus: [0],
          hasPermission: ["enterprise:monthWage:upload"],
          handleClick: (row) => {
            this.handleUpload(row);
          },
        },
        {
          text: "删除",
          showActive: ["1"],
          showStatus: [0], //status  0草稿   1 已提交
          handleClick: (row) => {
            const { id } = row;
            this.$refs.confirmDialog.delete().then(() => {
              DELETEStaffPayrollDel(id).then((res) => {
                this.mixinkeepTable();
              });
            });
          },
        },
        {
          text: "重发",
          showActive: ["2"],
          showStatus: [0],
          handleClick: (rows) => {},
        },
      ],
      mixinTableColArr: [tableConfig_1, tableConfig_2],
      expenseInit: {},
      contractUploadConfig: {
        ...defaultTextParams,
        url: process.env.VUE_APP_BASE_API + "/staffPayroll/uploadDetail",
        name: "file",
        showFileList: false,
        multiple:false,
        fileList: [],
        autoUpload:false,
        uploadCheckCallBack:this.uploadCheckCallBack,
				separateCallBackName: 'separateUploadCallBack',
        fragmentationUpload:false,
        uploadData: {
          id: "",
        },
      },
      disabledAll:{
      },
      loading:false
    };
  },
  created() {
    // 默认当前用户
    this["dictionary/getDictionary"]([
      "expenseStatus",
      "wageStatus",
      "expenseType",
      "expenseFlow",
      "billType",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getForBookingList(searchFrom = {}) {
      //模糊搜索
      const { receiveDate, createTime, isApplyInvoiceIn, ...searchObj } =
        searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        createBeginTime: createTime && createTime[0],
        createEndTime: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      const { statusIn, taskUserName, deptByName, ...nSearchData } =
        this.searchFromData[activeName] || {};
      return {
        ...nSearchData,
      };
    },
    searchTabForm(tName) {
      const { lists } = getFormConfig({ tName });
      return {
        ...this.searchFormConfig,
        lists,
      };
    },
    handleAdd(row = {}) {
      const { id,month } = row;
      if(id){
        this.$set(this.disabledAll,'month',true)
        this.$set(this.disabledAll,'belongCustomerId',true)
      }else{
        this.$set(this.disabledAll,'month',false)
        this.$set(this.disabledAll,'belongCustomerId',false)
      }
      const lastMonth=formatDate(new Date()-30 * 24 * 60 * 60 * 1000,'-','month')
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: customDialogCols({}),
        formModel: {
          ...row,
          month : id ? month : lastMonth//新增取上个月
        },
        httpRequest: (formModel) => {
          const { id, remark } = formModel;
          const httpRequest = id
            ? PUTStaffPayrollUpdateRemark
            : POSTStaffPayrollAdd;
          const params = id ? { id, remark } : { ...formModel };
          return httpRequest(params);
        },
        successFunction: () => {
          this.mixinkeepTable(true);
        },
      });
    },
    async handleSubmit(row = {}) {
      const { id, totleMoney,belongCustomerId=undefined } = row;
      const { data: billInfoList }=await GETStaffPayrollBillList(id)//获取费用明细
      const {data}=await GETStaffPayrollStaffApplicantInfo(belongCustomerId)
        this.expenseInit={
          ...data,
        }
        const params = {
          type: 1,
          flowType: 1,
          billInfoList,
          staffPayrollId: id,
          WEB_MENETYPE: "monthWage",
          invoiceMoney: totleMoney.toFixed(2),
        };
        this.$nextTick(() => {
          this.$refs.dialog.show(params);
        });
    },
    getHttpRequest(active) {
      const httpRequest = this.tableConfig.httpRequest[active];
      return httpRequest;
    },
    getBtnLists(row) {
      const { activeName } = this.tabsConfig;
      const { status } = row;
      const arr = this.statusList.filter((e) => {
        const { showActive, showStatus, hasPermission } = e;
        return (
          (showActive ? showActive.includes(activeName) : true) &&
          (showStatus ? showStatus.includes(status) : true) &&
          (hasPermission ? hasBtnPermits(hasPermission) : true)
        );
      });
      return arr;
    },
    handleUpload(row = {}) {
      const { id = undefined } = row;
      this.contractUploadConfig.uploadData.id = id;
      this.$refs.dropdownUploadRef?.handleUploadClick();
    },
    downloadRecord(row = {}) {
      const { id, status } = row;
      comFileDownload(this, GETStaffPayrollDownloadDetailList, id);
    },
    handlebelongCustomer(val){
      if(val){
        GETCountByMonthAndCustomerId(val).then((res)=>{
        const {data}=res
        this.$set(this.disabledAll,'month',data > 0 ? true : false)
      })
      }else{
        this.$set(this.disabledAll,'month',false)
      }
    },
    uploadSuccess(res = {}) {
      this.loading=false
      const { data, msg } = res || {};
      if (res.code == 1002) {
        if (data) {
          let str = data.join(" <br/> ");
          this.$message({
            dangerouslyUseHTMLString: true,
            message: str,
            type: "error",
          });
        } else {
          this.$message.warning(msg);
        }
      }else if(res.code==200){
        this.$message.success(msg);
      }else if(res.code==500){
        this.$message.error(msg);
      }
      this.handleSuccess();
    },
    uploadCheckCallBack(){
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: uploadCheckDialogCols(),
        httpRequest: (formModel) => {
          const {password}=formModel
          this.contractUploadConfig.uploadData={
            ...this.contractUploadConfig.uploadData,
            password
          }
          this.loading=true
          return new Promise((resolve,reject)=>{
            resolve()
          })
        },
        successFunction: () => {
          this.$refs.dropdownUploadRef?.submitUpload()
        },
      });
    },
    handleSuccess(){
      this.mixinkeepTable();
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/.el-table__cell.wage-color {
  color: #5094ff;
}
</style>
