<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName == tab.name"
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
              v-if="tabsConfig.activeName == tab.name && showSearchForm"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :httpRequest="tableConfig.httpRequest"
              :columnConfig="tableMixinConfig(tab.name)"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="(row) => getTableBtnLists(row)"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              @handleTableView="handleDetails"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'countsum'">
                  <!-- <span v-if="slotProps.row.isOverseaOrders==1">--</span> -->
                  <span
                    class="primary-text-btn"
                    @click="handleDrawer(slotProps.row)"
                  >
                    {{ slotProps.row.countsum || 0 }}
                  </span>
                </template>
                <template v-if="slotProps.prop == 'pdo'">
                  <el-select
                    v-model="slotProps.row.pdo"
                    size="mini"
                    @change="(val) => handleChangeDo(val, slotProps.row)"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in clearanceDictDo"
                      :key="item.value"
                      :label="item.nameCn"
                      :value="+item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-if="slotProps.prop == 'expectWarehouseType'">
                  <el-select
                    v-model="slotProps.row.expectWarehouseType"
                    size="mini"
                    @change="
                      (val) => handleExpectWarehouseType(val, slotProps.row)
                    "
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in clearanceReservationWarehouse"
                      :key="item.value"
                      :label="item.nameCn"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-if="slotProps.prop == 'pdoExpireTime'">
                  <el-date-picker
                    v-model="slotProps.row.pdoExpireTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm"
                    size="mini"
                    @change="(row) => changeDoDate(row, slotProps.row)"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                </template>
                <template v-if="slotProps.prop === 'splitBoxTime'">
                  <el-date-picker
                    v-if="slotProps.row.warehouseStatus === 1"
                    v-model="slotProps.row.splitBoxTime"
                    type="datetime"
                    :value-format="slotProps.column.valueFormat"
                    size="mini"
                    @change="(val) => changeSplitBoxTime(val, slotProps.row)"
                    :placeholder="slotProps.column.label"
                  >
                  </el-date-picker>
                  <div v-else>{{ slotProps.row.splitBoxTime || "--" }}</div>
                </template>
                <template v-if="slotProps.prop == 'reachTime'">
                  <el-date-picker
                    v-model="slotProps.row.reachTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    size="mini"
                    @change="(row) => changeReachTime(row, slotProps.row)"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                </template>
                <!-- <template v-if="slotProps.prop == 'examineStatus'">
                  <el-select
                    v-model="slotProps.row.examineStatus"
                    size="mini"
                    @change="(val) => handleExamineStatus(val, slotProps.row)"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in clearanceExamineStatus"
                      :key="item.value"
                      :label="item.nameCn"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template> -->
                <template v-if="slotProps.prop == 'remark'">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 3 }"
                    resize="none"
                    placeholder="请输入"
                    maxlength="500"
                    v-model="slotProps.row.remark"
                    @change="(v) => handleChangeRemark(v, slotProps.row)"
                  />
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <editDialogForm
      ref="dialogFormRef"
      @handleSuccess="() => mixinkeepTable()"
    />
    <RegistrationDialog
      ref="registrationRef"
      @handleSuccess="() => mixinkeepTable()"
    />
    <ComCustomDialog ref="customDlgRef" />
    <editTrailer ref="trailerEditRef" @handleSuccess="() => handleSuccess(1)" />
    <!-- 航次离港，到港时间确认弹窗 -->
    <AirlineStatusDialog
      ref="airlineStatusRef"
      @handleSuccess="() => mixinkeepTable()"
    />
    <ConfirmDialog ref="confirmDlgRef" />
    <RemarkDrawer ref="drawerRef" @handleSuccess="() => mixinkeepTable()" />
    <CustomsDispatch :activities="activities" ref="dispatchRef" />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  FclOrLclSearchColumns,
  FclOrLclTableColumns,
  releaseFormConfig,
  warehousingFormConfig,
  batchEditDialogConfig,
} from "./model.js";
import {
  getClearanceAllList,
  popClearanceDetail,
  getOverseaClearanceSalesman,
  submitLogSystemLog,
} from "@/api/performance/record.js";
import {
  clearanceRelease,
  warehousingRegistration,
  clearanceRepulse,
  updateExpectWarehouseType,
  updateClearancePdo,
  putUpdateSplitBoxTime,
  PUTPopClearanceRegisterStatusOver,
  PUTPopClearanceRegisterStatusRevoke,
  postCopyJoinBrief,
  GETExportClearanceAllList,
  PUTBatchUpdateEtaTime,
  popUpdSecondState,
  popClearanceSendFile,
} from "@/api/operateRecord/customsClearance";
import { realityCabinetCols } from "@/views/warehouseManage/devanning/model.js";
import { formatDate, duplicateRemoval } from "@/utils/index";
import { handleCopyText } from "@/utils/confirmBox.js";
import { stripping, actualityDevann } from "@/api/warehouse/prediction";
import { httpDictRequest } from "@/api/performance/dictRecord.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "CclManage",
  mixins: [mixinColsConf],
  components: {
    ComColumnConf: () => import("_comp/ComColumnConf"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    editDialogForm: () =>
      import(
        "@/views/operateManage/operateRecord/customsClearance/editDialog.vue"
      ),
    RegistrationDialog: () =>
      import("@/views/overseasBusiness/components/RegistrationDialog"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    editTrailer: () =>
      import(
        "@/views/operateManage/operateRecord/trailerInfo/editTrailer/index.vue"
      ), // 自定义弹窗
    AirlineStatusDialog: () =>
      import(
        "@/views/marketManage/airlineFlight/components/AirlineStatusDialog"
      ), // 航次到港离港时间确认弹窗
    RemarkDrawer: () =>
      import(
        "@/views/operateManage/operateRecord/components/recordDrawer/remark.vue"
      ),
    CustomsDispatch: () => import("_comp/ComLogistTrack/components/dispatch"),
  },
  data() {
    return {
      activities: {},
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: this.initMixinColumnConf,
        tabs: [
          {
            label: "清关管理FCL",
            name: "1",
          },
          {
            label: "清关管理LCL",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "导出",
            // disabled: true,
            icon: "iconfont daochu",
            handleClick: () => {
              this.handleExport();
            },
          },
          {
            table: "批量修改ETA",
            disabled: true,
            handleClick: () => {
              this.quantityEdit();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        searchColsHeight: true,
        labelWidth: "100px",
      },
      searchFromData: [],
      tableConfig: {
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            getClearanceAllList(formModel).then((res) => {
              const { data, rows, ...obj } = res;
              resolve({
                ...obj,
                rows: rows.map((e) => {
                  return {
                    ...e,
                    examineStatus: e.examineStatus
                      ? e.examineStatus + ""
                      : undefined,
                  };
                }),
              });
            });
          });
        },
      },
      statusLists: [
        {
          warehouseStatusArr: [0], //入仓状态  0待预约      warehouseStatus
          orderTypeList: [2], //订单类型  2电商  orderType
          text: "预计提拆柜", //整柜叫预计提拆柜  散货叫入仓登记
          showIsOverseaOrders: [0], //0国内清关  1海外清关
          isTab: ["1"], //标签
          handleClick: (row) => {
            this.handleDevanning(row);
          },
        },
        {
          warehouseStatusArr: [0], //入仓状态  0待预约      warehouseStatus
          statusArr: [0, 1, 2], //清关状态status
          text: "预计提拆柜", //整柜叫预计提拆柜  散货叫入仓登记
          showIsOverseaOrders: [1], //0国内清关  1海外清关
          isTab: ["1"], //标签
          handleClick: (row) => {
            this.handleWarehousing(row);
          },
        },
        {
          warehouseStatusArr: [0], //入仓状态  0待预约      warehouseStatus
          text: "预约入仓", //就是入仓登记
          isTab: ["2"],
          showIsOverseaOrders: [1], //0国内清关  1海外清关
          isNoShowStatus: [0], //除了状态为0不展示，其他都展示
          handleClick: (row) => {
            this.handleWarehousing(row);
          },
        },
        {
          statusArr: [0], //清关状态  0待清关   1清关中  已清关  status
          text: "清关登记",
          isTab: ["1", "2"], //标签
          handleClick: (row) => {
            this.handleClearanceRegister(row);
          },
        },
        {
          showArrivalStatus: [1], // 到港状态（0-未激活，1-激活，3-完成）：arrivalStatus
          text: "到港",
          isTab: ["1", "2"], //标签
          handleClick: (row) => {
            this.handleArrival(row);
          },
        },
        {
          warehouseStatusArr: [1], //入仓状态  0待预约      warehouseStatus
          text: "实际提拆柜",
          isTab: ["1"], // FCL有
          handleClick: (row) => {
            this.handleRealityUnpack(row);
          },
        },
        {
          statusArr: [1, 3], // 1-清关中 3-查验中
          isTab: ["1", "2"], // FCL有
          text: "清关放行",
          handleClick: (row) => {
            this.handleClearanceRelease(row);
          },
        },
        {
          warehouseStatusArr: [0],
          orderTypeList: [2],
          text: "入仓登记",
          isTab: ["2"],
          handleClick: (row) => {
            this.handleWarehouseRegister(row);
          },
        },
        {
          showRegisterStatus: [10],
          text: "已登记",
          isTab: ["1", "2"],
          handleClick: (row) => {
            this.handleChangeRegisterStatus(row); //清关登记状态 10未登记  20已登记
          },
        },
        {
          showRegisterStatus: [20],
          text: "撤销登记",
          isTab: ["1", "2"],
          handleClick: (row) => {
            this.handleChangeRegisterStatus(row);
          },
        },
        {
          statusArr: [0],
          showIsOverseaOrders: [1],
          text: "打回",
          color: "#FF6767",
          handleClick: (row) => {
            this.handleRepulse(row);
          },
        },
        {
          secondStateArr: [0],
          text: "二审审核",
          handleClick: (row) => {
            popUpdSecondState(row.id).then(() => {
              this.mixinkeepTable();
            });
          },
        },
        {
          text: "复制信息",
          handleClick: (row) => {
            const { isOverseaOrders } = row || {};
            postCopyJoinBrief({
              isOverseaOrders,
              businessId: isOverseaOrders == 0 ? row.joinOrderId : row.id,
            }).then((res) => {
              res.data && handleCopyText(res.data);
            });
          },
        },
        {
          showIsOverseaOrders: [1], //0国内清关  1海外清关
          text: "预约派送",
          isTab: ["1", "2"],
          showBusinessType: [2], //清关+派送
          handleClick: (row) => {
            this.handleDelivery(row, "estimate");
          },
        },
        {
          showIsOverseaOrders: [1], //0国内清关  1海外清关
          text: "实际派送",
          isTab: ["1", "2"],
          showBusinessType: [2], //清关+派送
          handleClick: (row) => {
            this.handleDelivery(row, "actual");
          },
        },
      ],
      mixinTableColArr: [
        FclOrLclTableColumns("1", {
          onSelectChange: (r) => this.handleExamineStatus(r.examineStatus, r),
          onWhetherChange: this.handleSendFile,
        }),
        FclOrLclTableColumns("2", {
          onSelectChange: (r) => this.handleExamineStatus(r.examineStatus, r),
          onWhetherChange: this.handleSendFile,
        }),
      ],
      selectionRows: [],
    };
  },
  watch: {
    selectionRows: {
      deep: true,
      handler: function (newVal) {
        console.log("newVal", newVal);
        this.$set(this.tabsConfig.btnArr[1], "disabled", !newVal.length);
      },
    },
  },
  computed: {
    ...mapState({
      clearanceReservationWarehouse: (state) =>
        state.dictionary.dicsData.clearanceReservationWarehouse,
      clearanceDictDo: (state) => state.dictionary.dicsData.do || [],
      clearanceExamineStatus: (state) =>
        state.dictionary.dicsData.clearanceExamineStatus,
    }),
  },
  created() {
    this["dictionary/getDictionary"]("customsClearance").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getList(searchFrom = {}) {
      const {
        beginTime,
        reachTime,
        splitBoxTime,
        customsBroker,
        expectWarehouseType,
        productAttributeList,
        ...obj
      } = searchFrom;
      const [createStartTime, createEndTime] = beginTime || [];
      const [reachStartTime, reachEndTime] = reachTime || [];
      const [splitBoxTimeBegin, splitBoxTimeEnd] = splitBoxTime || [];
      this.searchFromData[+this.tabsConfig.activeName] = {
        ...obj,
        createStartTime,
        createEndTime,
        reachStartTime,
        reachEndTime,
        splitBoxTimeBegin,
        splitBoxTimeEnd,
        productAttributeList:
          (productAttributeList || []).join(",") || undefined,
        customsBroker: (customsBroker || []).join(",") || undefined,
        expectWarehouseType: (expectWarehouseType || []).join(",") || undefined,
      };
      this.mixinkeepTable(true);
    },
    getSearchFormConfig(tName) {
      return {
        ...this.searchFormConfig,
        lists: FclOrLclSearchColumns(tName),
      };
    },
    getQueryParams(tName) {
      // 我又不想躲着不说话，后来就想着骂就骂吧，话确实是我说的，人确实是我得罪的，我也道歉了
      return {
        ...this.searchFromData[+this.tabsConfig.activeName],
        freightType: tName == 1 ? 0 : 1,
        remarkPermissionTag: "QGGLLIST",
      };
    },
    handleClearanceRegister(row) {
      //清关登记
      const { isOverseaOrders } = row;
      if (isOverseaOrders == 1) {
        //海外清关
        this.$refs.registrationRef?.show(row);
      } else {
        //国内清关
        const new_com_opt = {
          type_num: 0,
          operationOrderId: row.joinOrderId,
        };
        const {
          nlCode,
          orderNumber,
          bailorPeopleName,
          operationMainName,
          businessUnitName,
          salesman,
        } = row;
        this.$refs.dialogFormRef?.show({
          ...new_com_opt,
          nlCode,
          operationOrderNum: orderNumber,
          bailorPeopleName,
          operationMainName, //缺这个
          businessNnitName: businessUnitName,
          salesman,
        });
      }
    },
    handleClearanceRelease(row) {
      //清关放行
      const { isOverseaOrders, id } = row;
      if (isOverseaOrders == 1) {
        this.$refs.customDlgRef?.showCustomDialog({
          httpRequest: (formData) => {
            return clearanceRelease({
              ...formData,
              id,
            });
          },
          successFunction: () => {
            this.mixinkeepTable();
          },
          customFormConfig: releaseFormConfig,
        });
      } else {
        const new_com_opt = {
          type_num: 2,
          operationOrderId: row.joinOrderId,
        };
        const {
          nlCode,
          orderNumber,
          bailorPeopleName,
          operationMainName,
          businessUnitName,
          salesman,
        } = row;
        this.$refs.dialogFormRef?.show({
          ...new_com_opt,
          nlCode,
          operationOrderNum: orderNumber,
          bailorPeopleName,
          operationMainName, //缺这个
          businessNnitName: businessUnitName,
          salesman,
        });
      }
    },
    handleArrival(row) {
      //到港 isOverseaOrders 0-国内交接 1-海外清关
      if (row.isOverseaOrders == 1) {
        this.$refs.airlineStatusRef?.show(undefined, 3, {
          operationOrderId: row.id,
          orderType: 50, // 海外清关没有订舱ID
        });
      } else {
        this.$refs.airlineStatusRef?.show(row.airLineId, 3, {
          operationOrderId: row.joinOrderId,
        });
      }
    },
    async handleRealityUnpack(row) {
      //实际提拆柜
      const { isOverseaOrders, id } = row;
      if (isOverseaOrders == 1) {
        const { salesman, warehouseId, putWarehousing } =
          (await getOverseaClearanceSalesman(id)).data || {};
        this.$refs.customDlgRef.showCustomDialog({
          customFormConfig: realityCabinetCols({ salesman }),
          formModel: {
            id,
            warehouseId,
            putWarehousing,
            actualSplitBoxTime: formatDate(new Date().getTime(), "-"),
          },
          httpRequest: actualityDevann,
          successFunction: () => this.mixinkeepTable(),
        });
      } else {
        const { salesman, warehouseId, putWarehousing } =
          (await popClearanceDetail(row.joinOrderId)).data || {};
        this.$refs.customDlgRef.showCustomDialog({
          customFormConfig: realityCabinetCols({ salesman }),
          formModel: {
            warehouseId,
            putWarehousing,
            actualSplitBoxTime: formatDate(new Date().getTime(), "-"),
          },
          httpRequest: (obj) => {
            return stripping({
              id: row.joinOrderId,
              boxStatus: 1,
              ...obj,
            });
          },
          successFunction: () => {
            this.mixinkeepTable();
          },
        });
      }
    },
    handleDevanning(row) {
      //预计提拆柜
      const new_com_opt = {
        type_num: 1,
        operationOrderId: row.joinOrderId,
        packingMethod: 0, // 0=整柜；1=散货，固定传参字段
      };
      const {
        nlCode,
        orderNumber,
        bailorPeopleName,
        operationMainName,
        businessUnitName,
        salesman,
      } = row;
      this.$refs.dialogFormRef?.show({
        ...new_com_opt,
        nlCode,
        operationOrderNum: orderNumber,
        bailorPeopleName,
        operationMainName, //缺这个
        businessNnitName: businessUnitName,
        salesman,
      });
    },
    handleWarehousing(row) {
      //预约入仓
      const { activeName } = this.tabsConfig;
      const {
        id,
        nlCode,
        bailorPeopleName,
        operationMainName,
        businessUnitName,
        warehouseId,
        warehouseName,
        salesman,
      } = row;
      this.$refs.customDlgRef?.showCustomDialog({
        formModel: {
          nlCode,
          bailorPeopleName,
          operationMainName,
          businessUnitName,
          warehouseId,
          warehouseName,
          // warehousingTime: formatDate(new Date().getTime(), "-")
        },
        httpRequest: (formData) => {
          return warehousingRegistration({
            ...formData,
            id,
          });
        },
        successFunction: () => {
          this.mixinkeepTable();
        },

        customFormConfig: warehousingFormConfig({
          salesman,
          activeName,
        }),
      });
    },
    handleWarehouseRegister(row) {
      //入仓登记
      const new_com_opt = {
        type_num: 1,
        operationOrderId: row.joinOrderId,
        packingMethod: 1,
      };
      const {
        nlCode,
        orderNumber,
        bailorPeopleName,
        operationMainName,
        businessUnitName,
        salesman,
      } = row;
      this.$refs.dialogFormRef?.show({
        ...new_com_opt,
        nlCode,
        operationOrderNum: orderNumber,
        bailorPeopleName,
        operationMainName, //缺这个
        businessNnitName: businessUnitName,
        salesman,
      });
    },
    handleRepulse(row) {
      //打回
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: "打回",
          label: `打回说明：`,
          message: `请输入打回说明`,
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          const opt = {
            id: row.id,
            remark,
          };
          return new Promise((resolve, reject) => {
            clearanceRepulse(opt)
              .then((res) => {
                resolve(res);
              })
              .catch((err) => {
                resolve();
                if (err?.code === 1002) {
                  this.handleNotRepulse();
                }
              });
          });
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    handleNotRepulse() {
      let withdrawTip = `<div class="base-flex-align">
				 <i class="el-icon-warning" style="color: #e6a23c; font-size: 20px; margin-right: 5px;"></i>
				订单费用已生成对账单，无法打回到客户环节
			</div>`;
      withdrawTip += `<div style="margin-left: 25px;">
				<span class="text-danger-color">如对账单未对账完成</span>
				<span>，请先删除对账单再打回</span>
			</div>`;
      this.$alert(`${withdrawTip}`, "提示", {
        confirmButtonText: "关闭",
        dangerouslyUseHTMLString: true,
      });
    },
    handleSuccess(trailerStatus) {
      if (trailerStatus == 1) {
        this.msgSuccess("更新成功");
      }
      this.mixinkeepTable();
    },
    handleChangeRemark(val, row) {
      if (!val.trim()) {
        return this.msgError("请输入备注");
      }
      // const { name } = this.$store.getters;
      // submitLogSystemLog({
      //   moduleName: row.isOverseaOrders == 0 ? 20 : 120,
      //   businessId: row.isOverseaOrders == 0 ? row.joinOrderId : row.id,
      //   businessNo: row.orderNumber,
      //   serviceName: 2,
      //   type: 10,
      //   remark: val,
      //   createBy: name,
      //   updateBy: name,
      // }).then(() => {
      //   this.mixinkeepTable();
      //   this.msgSuccess("备注更新成功");
      // });

      httpDictRequest(
        {
          pageRemarkNameKey: row.isOverseaOrders == 1 ? "HWDDQGBZ" : "DSDDQGBZ",
          requestKey: "postAddBusinessRemark",
        },
        {
          remark: val.trim(),
          businessId: row.isOverseaOrders == 0 ? row.joinOrderId : row.id,
        }
      ).then(() => {
        this.mixinkeepTable();
        this.msgSuccess("备注更新成功");
      });
    },
    handleDetails(row) {
      let idList = [];
      const { activeName } = this.tabsConfig;
      if (row.isOverseaOrders == 1) {
        const path = "/overseasBusiness/overseasClearanceDetail";
        this.$refs[`tableRef${+activeName}`][0]?.tableData.map((e) => {
          if (e.isOverseaOrders == 1) {
            idList.push(e.id);
          }
        });
        sessionStorage.removeItem("tabActive");
        this.$router.push({
          path: path,
          query: {
            id: row.id,
            pageType: 1,
            backPath: this.$route.fullPath,
            pageSign: idList.join(","),
          },
        });
      } else {
        this.$refs[`tableRef${+activeName}`][0]?.tableData.map((e) => {
          if (e.isOverseaOrders != 1) {
            idList.push(e.id);
          }
        });
        this.$router.push({
          path: "/overseasBusiness/customsClearanceInfo",
          query: {
            id: row.id,
            backPath: this.$route.fullPath,
            pageSign: duplicateRemoval(idList).join(","),
            type: activeName === "1" ? 1 : 0,
          },
        });
      }
    },
    getTableBtnLists(row) {
      const { activeName } = this.tabsConfig;
      const {
        warehouseStatus,
        orderType,
        arrivalStatus,
        status,
        isOverseaOrders,
        registerStatus,
      } = row;
      const arr = (this.statusLists || []).filter((item) => {
        const {
          warehouseStatusArr,
          orderTypeList,
          isTab,
          showArrivalStatus,
          statusArr,
          showIsOverseaOrders,
          isNoShowStatus,
          showRegisterStatus,
          secondStateArr,
        } = item;
        return (
          (warehouseStatusArr
            ? warehouseStatusArr.includes(warehouseStatus)
            : true) &&
          (orderTypeList ? orderTypeList.includes(orderType) : true) &&
          (isTab ? isTab.includes(activeName) : true) &&
          (showArrivalStatus
            ? showArrivalStatus.includes(arrivalStatus)
            : true) &&
          (statusArr ? statusArr.includes(status) : true) &&
          (showIsOverseaOrders
            ? showIsOverseaOrders.includes(isOverseaOrders)
            : true) &&
          (isNoShowStatus ? !isNoShowStatus.includes(status) : true) &&
          (secondStateArr ? secondStateArr.includes(row.secondState) : true) &&
          (showRegisterStatus
            ? showRegisterStatus.includes(registerStatus)
            : true)
        );
      });
      return arr;
    },
    handleDrawer(row) {
      const { joinOrderId, orderNumber, isOverseaOrders, id, ...obj } = row;
      // let params = {};
      // if (isOverseaOrders == 1) {
      //   params = {
      //     ...obj,
      //     operationOrderId: id,
      //     operationOrderNum1: orderNumber,
      //     isOverseaOrders: 1,
      //     moduleName: 120,
      //   };
      // } else {
      //   params = {
      //     ...obj,
      //     operationOrderId: joinOrderId,
      //     operationOrderNum1: orderNumber,
      //   };
      // }
      this.$refs.drawerRef?.show({
        tootId: isOverseaOrders == 1 ? id : joinOrderId,
        pageRemarkNameKey: isOverseaOrders == 1 ? "HWDDQGBZ" : "DSDDQGBZ",
      });
    },
    handleChangeDo(pdo, row) {
      const { joinOrderId, isOverseaOrders, id } = row;
      const params = {
        joinOrderId: isOverseaOrders == 1 ? undefined : joinOrderId,
        id: isOverseaOrders == 1 ? id : undefined,
        pdo,
      };
      updateClearancePdo(params)
        .then(() => {
          this.$message.success("修改成功");
          // this.mixinkeepTable();
        })
        .catch(() => {
          this.mixinkeepTable();
        });
    },
    handleExpectWarehouseType(expectWarehouseType, row) {
      const { joinOrderId, isOverseaOrders, id } = row;
      const params = {
        joinOrderId: isOverseaOrders == 1 ? undefined : joinOrderId,
        expectWarehouseType,
        id: isOverseaOrders == 1 ? id : undefined,
      };
      updateExpectWarehouseType(params)
        .then((res) => {
          this.$message.success("修改成功");
          // this.mixinkeepTable();
        })
        .catch((error) => {
          this.mixinkeepTable();
        });
    },
    handleChangeRegisterStatus(row = {}) {
      //清关登记状态 10未登记  20已登记
      const { id, registerStatus } = row;
      const httpRequest = {
        10: PUTPopClearanceRegisterStatusOver,
        20: PUTPopClearanceRegisterStatusRevoke,
      }[registerStatus];
      httpRequest(id).then((res) => {
        this.mixinkeepTable();
      });
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      return true;
    },
    handleExport() {
      const length = this.selectionRows.length;
      if (length > 0) {
        const ids = this.selectionRows.map((e) => e.id);
        comFileDownload(this, GETExportClearanceAllList, {
          ids: (ids || []).join(","),
        });
      } else {
        const params = this.getQueryParams(this.tabsConfig.activeName);
        comFileDownload(this, GETExportClearanceAllList, params);
      }
    },
    quantityEdit() {
      this.$refs.customDlgRef?.showCustomDialog({
        customFormConfig: batchEditDialogConfig(),
        formModel: {},
        httpRequest: (formModel) => {
          const ids = this.selectionRows.map((e) => e.id);
          const params = {
            ...formModel,
            ids,
          };
          return PUTBatchUpdateEtaTime(params);
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    changeDoDate(row, formData) {
      const { pdo, examineStatus, joinOrderId, id, isOverseaOrders } = formData;
      const params = {
        pdoExpireTime: row,
        pdo,
        examineStatus,
        joinOrderId: isOverseaOrders == 1 ? undefined : joinOrderId,
        id: isOverseaOrders == 1 ? id : undefined,
      };
      updateClearancePdo(params).then((res) => {
        this.msgSuccess("修改成功");
      });
    },
    changeReachTime(row, formData) {
      const { id } = formData;
      const params = {
        etaTime: row,
        ids: [id],
      };
      PUTBatchUpdateEtaTime(params).then((res) => {
        this.msgSuccess("修改成功");
      });
    },
    changeSplitBoxTime(val, { joinOrderId, id, isOverseaOrders }) {
      const params = {
        splitBoxTime: val,
        joinOrderId: isOverseaOrders == 1 ? undefined : joinOrderId,
        id: isOverseaOrders == 1 ? id : undefined,
      };
      putUpdateSplitBoxTime(params).then(() => {
        this.msgSuccess("修改成功");
      });
    },
    handleSendFile(row) {
      popClearanceSendFile(row.id, row.sendFile ? 1 : 0).then(() => {
        this.msgSuccess("修改成功");
        // this.mixinkeepTable();
      });
    },
    handleExamineStatus(val, formData) {
      const { pdo, pdoExpireTime, joinOrderId, id, isOverseaOrders } = formData;
      const params = {
        pdoExpireTime,
        pdo,
        examineStatus: val,
        joinOrderId: isOverseaOrders == 1 ? undefined : joinOrderId,
        id: isOverseaOrders == 1 ? id : undefined,
      };
      updateClearancePdo(params).then((res) => {
        this.msgSuccess("修改成功");
      });
    },
    handleDelivery(row, type) {
      console.log("row", row);
      const { id, nlCode, orderNumber } = row;
      this.activities = {
        id,
        operationOrderNum: nlCode,
        orderType: 50,
        jobNo: orderNumber,
        pageType: 1,
      };
      this.$refs.dispatchRef?.dispatchDialog(type, {
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
