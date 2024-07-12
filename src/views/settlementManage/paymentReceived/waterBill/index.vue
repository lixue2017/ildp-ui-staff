<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchTabForm(tab.name)"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
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
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :customSort="{ prop: 'createTime', order: 'descending' }"
              :rowOperationBtnListFn="(row) => tableBtnList(row)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'serialCode'">
                  <span
                    class="primary-text-btn"
                    @click="handleUpdate(slotProps.row, 'claimDialog', 'view')"
                  >
                    {{ slotProps.row.serialCode }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight v-if="tabsConfig.activeName === '1'">
        支持水单银行收款信息上传，
        <!-- <span @click="importUrlXlsx" class="primary-text-btn import-xlsx">
          下载导入模板
        </span> -->
        <el-dropdown @command="downLoadTemplate">
          <span class="el-dropdown-link primary-text-btn import-xlsx">
            下载导入模板
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">新模板</el-dropdown-item>
            <el-dropdown-item command="2">旧模板</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-slot:btnOptions="{ slotProps }">
        <el-dropdown
          v-if="tabsConfig.activeName == 1"
          @command="slotProps.btn.handleCommand"
          trigger="click"
          class="dropDown"
        >
          <el-button type="primary" :size="slotProps.btn.size">
            {{ slotProps.btn.table
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu
            slot="dropdown"
            class="water-bill-dropdown"
            :style="{ maxHeight: 'calc(100% - 150px)' }"
          >
            <el-input
              class="search-waterBill"
              v-model="waterBillSearchName"
              @change="getSearchWaterBillData"
              placeholder="输入后，按Enter键查询"
              size="small"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search icon-position"
              ></i>
            </el-input>
            <div v-if="slotProps.btn.options.length">
              <el-dropdown-item
                v-for="(options, index) in slotProps.btn.options"
                :key="index"
                :command="options"
              >
                {{ options.label }}
              </el-dropdown-item>
            </div>
            <div v-else>
              <div class="table-empty">
                <img :src="noDataImg" alt="" srcset="" width="150px" />
                <div class="grey-text-color">暂无搜索数据</div>
              </div>
            </div>

            <ComUpload
              style="display: none"
              ref="dropdownUploadRef"
              :uploadConfig="contractUploadConfig"
              @handleSuccess="uploadSuccess"
            />
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </ComTabs>
    <AuditDialog ref="auditDialog" @handleSuccess="mixinkeepTable" />
    <ClaimDialog ref="claimDialog" @handleSuccess="mixinkeepTable" />
    <EditDialog ref="editDialog" @handleSuccess="mixinkeepTable" />
    <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['repeatTips']">
      <template v-slot:repeatTips="slotProps">
        <span v-html="slotProps.formModel.tips" class="tips-color" />
      </template>
    </ComCustomDialog>
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script>
import {
  getReceiptList,
  deleteWaterBill,
  postBxVerification,
  GETSettleBankReceiptExport,
  POSTReceiptImportAcc,
} from "@/api/settlementManage/paymentReceived";
import { getAccountInfoFromSD as getAccountList } from "@/api/settlementManage/feeSet";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns, baiXinWriteOffCols } from "./model";
import { waterUploadSuccessCols } from "./components/EditDialog/model";
import {
  defaultTextParams,
  importWaterBillUrl,
  WATER_BILL_TEMPLATE,
  NEW_WATER_BILL_TEMPLATE,
  newImportWaterBillUrl,
} from "_comp/ComUpload/model";
import noDataImg from "@/assets/image/noData.png";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "WaterBill",
  mixins: [mixinColsConf],
  components: {
    AuditDialog: () => import("./components/AuditDialog"),
    ClaimDialog: () => import("./components/ClaimDialog"),
    EditDialog: () => import("./components/EditDialog"),
    ComUpload: () => import("_comp/ComUpload"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      noDataImg,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            // const bArr =
            //   this.tabsConfig.activeName === "1" ? this.tabBtnArr : [];
            // this.$set(this.tabsConfig, "btnArr", bArr);
            this.initMixinColumnConf();
          });
        },
        tabs: [
          {
            label: "收款水单信息",
            name: "1",
          },
          {
            label: "已完结",
            name: "2",
          },
        ],
      },
      tabBtnArr: [
        {
          table: "新增水单",
          showTabName: ["1"],
          hasPermission: ["settlementManage:waterBill:addWaterBill"],
          handleClick: (rows) => this.addWaterBill(rows, "createWaterBill"),
        },
        {
          table: "导出",
          showTabName: ["1", "2"],
          icon: "iconfont daochu",
          hasPermission: ["settlementManage:waterBill:export"],
          handleClick: () => this.handleExport(),
        },
        {
          table: "导入水单",
          showTabName: ["1"],
          hasPermission: ["settlementManage:waterBill:exportWater"],
          handleClick: (row) => {
            this.handleNewUploadWaterBill(row);
          },
        },
        {
          table: "导入水单",
          showTabName: ["1"],
          size: "small",
          options: [],
          hasPermission: ["settlementManage:waterBill:exportWater"],
          handleCommand: this.handleAddCommand,
        },
      ],
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        size: "small",
        labelWidth: "100px",
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 265px)",
        httpRequest: getReceiptList,
        statusList: [
          {
            text: "佰信核销",
            btnStatus: [0],
            showDel: [0, 1],
            hasPermission: ["settlementManage:waterBill:verification"],
            handleClick: (row) => this.handleBaiXin(row),
          },
          {
            text: "修改",
            btnStatus: [0],
            showDel: [1],
            hasPermission: ["settlementManage:waterBill:editWater"],
            handleClick: (row) => this.handleUpdate(row, "editDialog"),
          },
          {
            text: "删除",
            color: "#FF6767",
            btnStatus: [0],
            showDel: [1],
            hasPermission: ["settlementManage:waterBill:deleteWater"],
            handleClick: (row) => this.handleDelete(row),
          },
        ],
      },
      contractUploadConfig: {
        ...defaultTextParams,
        url: importWaterBillUrl,
        name: "attachFile",
        showFileList: false,
        fileList: [],
        limit: 992,
        accept: ".xlsx,.xls",
        uploadData: {},
      },
      waterBillSearchName: "",
      waterBillRepeatImport: false, //是否有重复导入
      mixinTableColArr: [tableColumns("1"), tableColumns("2")],
    };
  },
  created() {
    this.getAccountList({ isint: true }); //获取导入水单列表
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getInitialData();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(searchFrom = {}) {
      const { auditTime, transactionTime, verificationTime, ...searchObj } =
        searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        startTime: auditTime && auditTime[0],
        endTime: auditTime && auditTime[1],
        startDealDate: transactionTime && transactionTime[0],
        endDealDate: transactionTime && transactionTime[1],
        verificationStartTime: verificationTime && verificationTime[0],
        verificationEndTime: verificationTime && verificationTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      const { activeName } = this.tabsConfig;
      //列表会返回所有状态的数据，但是收款水单只需要展示待认领与待复核的数据
      let searchStatus;
      if (
        this.searchFromData[tab] &&
        this.searchFromData[tab].status &&
        this.searchFromData[tab].status.length > 0
      ) {
        searchStatus = this.searchFromData[tab].status.join(",");
      } else {
        if (activeName === "1") {
          searchStatus = "0,1,9";
        } else {
          searchStatus = "2";
        }
      }
      const { companyByName, ...nObj } = this.searchFromData[tab] || {};
      return {
        ...nObj,
        status: searchStatus,
        payType: 1, // 1-应收
      };
    },
    handleView(row) {},
    handleBaiXin(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: baiXinWriteOffCols,
        formModel: {
          money: row.money,
          currencyCode: row.currencyCode,
        },
        httpRequest: (opt) => {
          const { verificationMoney, remark } = opt;
          return postBxVerification({
            id: row.id,
            verificationMoney,
            remark,
          });
        },
        successFunction: this.mixinkeepTable,
      });
    },
    handleUpdate(row, type, operationType) {
      const { activeName } = this.tabsConfig;
      const { status, id } = row;
      if (activeName == 1 && status == 0) {
        this.$refs[type].show(row, type, operationType);
      } else {
        const idList = this.$refs[
          `tableRef${+this.tabsConfig.activeName}`
        ][0].tableData
          .map((e) => {
            if (e.status != 0) {
              return e.id;
            } else {
              return;
            }
          })
          .filter((e) => e);
        this.$router.push({
          path: "/settlementManagement/billConfirmed/waterDetail",
          query: {
            id,
            backPath: this.$route.path,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
      }
    },
    generateBill() {},
    addWaterBill(rows, type) {
      this.$refs.editDialog.show(rows, type);
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tName), // 搜索表单渲染列表
        formModel: {
          ...this.searchFromData[tName], // tab1默认筛选，tab2不默认
        },
      };
    },
    handleDelete(row) {
      this.$refs.confirmDialog.delete().then(() => {
        deleteWaterBill(row.id).then(() => {
          this.mixinkeepTable();
        });
      });
    },
    handleAddCommand(cb, row) {
      this.contractUploadConfig = {
        ...this.contractUploadConfig,
        url: importWaterBillUrl,
        uploadData: {
          receiptPaymentAccount: cb.value,
          currencyCode: cb.currencyId,
        },
      };
      this.$refs.dropdownUploadRef?.handleUploadClick();
    },
    uploadSuccess(res = {}, file, dialog = true) {
      const { data = {} } = res;
      (this.waterBillRepeatImport = dialog), //有提示就是需要确认重复导入，没提示就不用确认
        this.$refs.customDialogRef.showCustomDialog({
          customFormConfig: waterUploadSuccessCols,
          formModel: res?.data || {},
          httpRequest: this.waterBillRepeatImport
            ? (formModel) => {
                let formData = new FormData();
                formData.append("attachFile", file.raw);
                formData.append("status", 1);
                return POSTReceiptImportAcc(formData);
              }
            : undefined,
          successFunction: this.waterBillRepeatImport
            ? (results) => {
                this.waterBillRepeatImport = false;
                this.$message.success("导入成功");
                // this.uploadSuccess(results,{},false)
                // this.mixinkeepTable();
              }
            : undefined,
        });
      if (res?.data) {
        this.mixinkeepTable();
      }
    },
    // importUrlXlsx() {
    //   window.open(WATER_BILL_TEMPLATE);
    // },
    getAccountList(row = {}) {
      //获取导入水单列表
      //name为搜索字段，只有在用户输入搜索时会用到，其他地方未用到
      const { name, isint } = row;
      if (isint) {
        const btnArr = this.tabBtnArr.filter((e) => {
          const { hasPermission } = e;
          return hasPermission ? hasBtnPermits(hasPermission) : true;
        });
        this.$set(this.tabsConfig, "btnArr", btnArr);
      }
      const index = (this.tabsConfig.btnArr || []).findIndex((e) => e.options);
      if (index == -1) {
        return;
      }
      const params = {
        type: 0,
        pageNum: 1,
        pageSize: 100,
        name: name ? name : "",
      };
      getAccountList(params).then((res) => {
        this.tabsConfig.btnArr[index].options = res.rows.map((item) => {
          const {
            id,
            bankAccount,
            openingBank,
            code,
            customerName,
            currencyId,
            customerId,
          } = item;
          return {
            label: `${bankAccount}/${openingBank} ${code}/${customerName}`,
            value: id,
            currencyId,
            customerId,
          };
        });
      });
    },
    getInitialData() {
      this.showSearchForm = true;
      // getFirstInitData({
      //   httpRequest: logisticsCustomerInfo,
      // }).then((res) => {
      //   this.tabsConfig.tabs.map((e) => {
      //     this.searchFromData[e.name] = {
      //       companyBy: res.id,
      //       companyByName: `${res.code}[${res.shortName}]`,
      //     };
      //   });
      //   this.showSearchForm = true;
      // });
    },
    getSearchWaterBillData(name) {
      this.getAccountList({ name });
    },
    tableBtnList(row = {}) {
      const { status, isDel } = row;
      return this.tableConfig.statusList.filter((e) => {
        const { showDel, btnStatus, hasPermission } = e;
        return (
          btnStatus.includes(status) &&
          showDel.includes(isDel) &&
          hasBtnPermits(hasPermission)
        );
      });
    },
    handleExport() {
      const { activeName } = this.tabsConfig;
      const params = {
        ...this.getQueryParams(activeName),
      };
      comFileDownload(this, GETSettleBankReceiptExport, params);
    },
    downLoadTemplate(val) {
      if (val == 1) {
        // 新模板
        window.open(NEW_WATER_BILL_TEMPLATE);
      } else {
        window.open(WATER_BILL_TEMPLATE);
        //旧模板
      }
    },
    handleNewUploadWaterBill(row) {
      this.contractUploadConfig = {
        ...this.contractUploadConfig,
        url: newImportWaterBillUrl,
        uploadData: {
          status: 0,
        },
      };
      this.$refs.dropdownUploadRef?.handleUploadClick();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.import-xlsx {
  margin-right: 10px;
}
.water-bill-dropdown {
  overflow: auto;
  margin-left: -254px;
  width: 600px;
  min-height: 250px;
  .el-dropdown-menu__item {
    white-space: nowrap;
  }
  .search-waterBill {
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 5px;
  }
  .icon-position {
    padding-right: 34px;
  }
  .table-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 20px));
    line-height: 20px;
    text-align: center;
    img {
      width: 100px;
      padding: 30px 0 14px;
    }
    div {
      padding-bottom: 30px;
    }
  }
}
/deep/.text-uploader {
  .el-upload--text .upload-btn {
    width: auto;
    padding-right: 10px;
    border: none;
    background: transparent;
    font-size: 13px;
    color: #000;
  }
  // .el-upload__tip {
  //   display: none;
  // }
}
.tips-color {
  color: #f6902f;
}
</style>
