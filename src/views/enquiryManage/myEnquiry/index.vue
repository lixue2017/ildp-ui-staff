<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              :dictionary="dictionary"
              @searchHeight="searchHeight"
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
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => tableConfig.getQueryParams(tab.name)"
              :rowOperationBtnListFn="rowOperationBtnListFn"
              :colShowBtnFn="
                (rItem, row) =>
                  operationBtn(
                    rItem,
                    row.state,
                    row.domesticQuotationSheetState,
                    row.foreignQuotationSheetState
                  )
              "
              @handleTableView="togoView"
              :isMountedRequest="isMountedRequest"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <EnquiryDialog
      ref="enquiryDialogRef"
      @handleSuccess="() => mixinkeepTable(true)"
    />
  </div>
</template>

<script>
import {
  getEnquiryList,
  deleteEnquiry,
  updateEnquiryState,
  getEnquiryInfo,
} from "@/api/enquiryManage";
import { msgBox } from "@/utils/confirmBox.js";
import {
  mySearchConfig,
  mySeaTableColumns,
  myAirTableColumns,
} from "../components/model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinEnquiry } from "../components/mixinEnquiry";
export default {
  name: "MyEnquiry",
  mixins: [mixinColsConf, mixinEnquiry],
  components: {
    EnquiryDialog: () =>
      import("@/views/enquiryManage/components/EnquiryDialog"),
  },
  data() {
    return {
      isMountedRequest: true,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "我的海运询价",
            name: "1",
          },
          {
            label: "我的空运询价",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "海运询价",
            btnType: "dropdown",
            showTabName: "1",
            dropdownArr: [
              {
                name: "海运出口询价",
                value: 2,
                data: {
                  shippingMode: 1, // 1=海运；2=空运；
                  tradeType: 2, // 1=进口；2=出口；
                  packingMode: "0",
                  overseasToDoor: false,
                },
              },
              {
                name: "海运进口询价",
                value: 1,
                data: {
                  shippingMode: 1, // 1=海运；2=空运；
                  tradeType: 1, // 1=进口；2=出口；
                  packingMode: "0",
                  overseasToDoor: false,
                },
              },
            ],
            handleClick: (_, dItem) => this.handleShowDrawer(dItem.data),
          },
          {
            table: "空运询价",
            btnType: "dropdown",
            showTabName: "2",
            dropdownArr: [
              {
                name: "空运出口询价",
                value: 2,
                data: {
                  shippingMode: 2, // 1=海运；2=空运；
                  tradeType: 2, // 1=进口；2=出口；
                  overseasToDoor: false,
                },
              },
              {
                name: "空运进口询价",
                value: 1,
                data: {
                  shippingMode: 2, // 1=海运；2=空运；
                  tradeType: 1, // 1=进口；2=出口；
                  overseasToDoor: false,
                },
              },
            ],
            handleClick: (_, dItem) => this.handleShowDrawer(dItem.data),
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getEnquiryList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "85px",
        ...mySearchConfig,
      },
      tableConfig: {
        getQueryParams: this.getQueryParams,
        httpRequest: getEnquiryList,
        statusBtnList: [
          {
            text: "提交",
            showState: [0],
            handleClick: (row) => this.handleUpdate(row, 1),
          },
          {
            text: "编辑",
            showState: [0],
            handleClick: this.handleShowDrawer,
          },
          {
            text: "删除",
            color: "#FF6767",
            showState: [0],
            handleClick: this.handleDelete,
          },
          {
            text: "撤回提交",
            showState: [1],
            handleClick: this.handleRecall,
          },
          {
            text: "设置报价方案",
            showState: [2],
            showDomesticState: [3, 6],
            showForeignState: [3, 6],
            handleClick: this.togoView,
          },
          {
            text: "复制",
            showState: [0, 1, 2, 3, 4, 6, 7],
            handleClick: (row) => {
              this.handleShowDrawer(row, "copy");
            },
          },
        ],
      },
      mixinTableColArr: [mySeaTableColumns, myAirTableColumns],
      queryPage: 1,
    };
  },
  methods: {
    rowOperationBtnListFn(row) {
      const { state, domesticQuotationSheetState, foreignQuotationSheetState } =
        row;
      // if (state === 3) {
      //   // 3=已完结
      //   return [];
      // }
      // if (
      //   state === 2 &&
      //   ![3, 6].includes(domesticQuotationSheetState) &&
      //   ![3, 6].includes(foreignQuotationSheetState)
      // ) {
      //   return [];
      // }
      return this.tableConfig.statusBtnList;
    },
    handleShowDrawer(row = {}, handleType) {
      const { id } = row;
      if (id) {
        getEnquiryInfo({ id, queryPage: this.queryPage }).then(({ data }) => {
          const {
            packingMode,
            overseasShippingMode,
            productType,
            tradeClause,
            type,
            overseasToDoor,
            id: editId,
            ...item
          } = data;
          this.$refs.enquiryDialogRef.show({
            ...item,
            type: type || (overseasToDoor ? 3 : 1),
            packingMode: packingMode !== null && `${packingMode}`,
            overseasShippingMode: overseasShippingMode
              ? overseasShippingMode.split(",")
              : [],
            productType: productType !== null && `${productType}`,
            tradeClause: tradeClause !== null && `${tradeClause}`,
            id: handleType == "copy" ? undefined : editId, //复制时去掉ID,编辑时保存ID
          });
        });
      } else {
        this.$refs.enquiryDialogRef.show({
          ...row,
          type: "1", // 1=国内;2=海外;3=国内+海外;
          pickupAddressType: "",
          country: "",
        });
      }
    },
    togoView(row) {
      this.handleView(row, "/enquiryManage/myEnquiryDetail");
    },
    handleUpdate({ id }, state, msg = "提交成功") {
      // 状态：0=草稿；1=已提交；2=报价中；3=已完结
      updateEnquiryState({
        id,
        state,
      }).then(() => {
        this.msgSuccess(msg);
        this.mixinkeepTable();
      });
    },
    handleDelete({ id }) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        this.comRepeatedRequest(this, deleteEnquiry, { id }).then(() => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        });
      });
    },
    handleRecall(row) {
      const msg = "撤回后报价人无法查看询价单！";
      const title = "确定撤回询价";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        this.handleUpdate(row, 0, "撤回成功");
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
