import { mapActions } from "vuex";
import {
  getDirecrClearanceInfo,
  getDeliveryClearanceInfo,
  getWarehouseClearanceInfo,
  removeClearance,
  clearanceRelease,
  warehousingRegistration,
  clearanceRepulse,
} from "@/api/operateRecord/customsClearance";
import { actualityDevann } from "@/api/warehouse/prediction";
import { getOverseaClearanceSalesman } from "@/api/performance/record";
import { msgBox } from "@/utils/confirmBox.js";
import { releaseFormConfig, warehousingFormConfig } from "./model";
import { realityCabinetCols } from "@/views/warehouseManage/devanning/model.js";
import { handleDetailData } from "@/views/overseasBusiness/components/utils.js";
import { formatDate } from "@/utils/index";

export const mixinTableConf = {
  components: {
    editDialogForm: () =>
      import("@/views/operateManage/operateRecord/customsClearance/editDialog"),
    editTrailer: () =>
      import("@/views/operateManage/operateRecord/trailerInfo/editTrailer"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    PlaceOrderDialog: () =>
      import("@/views/overseasBusiness/components/PlaceOrderDialog"),
    RegistrationDialog: () =>
      import("@/views/overseasBusiness/components/RegistrationDialog"),
  },
  data() {
    return {
      config: {
        1: {
          title: "海外清关",
          req: getDirecrClearanceInfo,
          path: "/overseasBusiness/overseasClearanceDetail",
        },
        2: {
          title: "海外提派",
          req: getDeliveryClearanceInfo,
          path: "/warehouseManage/deliveryPlan/overseasdeliverydetails",
        },
        3: {
          title: "海外入仓",
          req: getWarehouseClearanceInfo,
          path: "/warehouseManage/inStorage/overseasWarehouseDetails",
        },
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("customsClearance").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchList(searchFrom = {}) {
      const {
        createTime,
        customsRleaseTime,
        intendDevannTime,
        actualityDevannTime,
        ...params
      } = searchFrom;
      const [createStartTime, createEndTime] = createTime || [];
      const [startCustomsRleaseTime, endCustomsRleaseTime] =
        customsRleaseTime || [];
      const [startIntendDevannTime, endIntendDevannTime] =
        intendDevannTime || [];
      const [startActualityDevannTime, endActualityDevannTime] =
        actualityDevannTime || [];
      return new Promise((resolve) => {
        this.searchFromData = {
          ...params,
          createStartTime,
          createEndTime,
          startCustomsRleaseTime,
          endCustomsRleaseTime,
          startIntendDevannTime,
          endIntendDevannTime,
          startActualityDevannTime,
          endActualityDevannTime,
        };
        this.mixinkeepTable(true);
        resolve();
      });
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
      };
    },
    editTrailerSuccess() {
      this.msgSuccess("更新成功");
      this.mixinkeepTable();
    },
    handleView(row = {}, pageType) {
      const { activeName } = this.tabsConfig;
      const path = this.config[pageType].path;
      const idList = this.$refs[`tableRef${+activeName}`][0]?.tableData.map(
        (e) => e.id
      );
      sessionStorage.removeItem("tabActive");
      this.$router.push({
        path: path,
        query: {
          id: row.id,
          pageType,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","),
        },
      });
    },
    handleDelete({ id }) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        this.comRepeatedRequest(this, removeClearance, {
          id,
          removeSource: this.pageType,
        }).then(() => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        });
      });
    },
    // getDetails(id) {
    //   const req = this.config[this.pageType].req;
    //   return req(id).then((res) => {
    //     return handleDetailData(res.data)
    //   });
    // },
    handleBtnClick(row, iBtn) {
      const { type: type_num, freightType } = iBtn;
      const {
        id,
        nlCode,
        bailorPeopleName,
        operationMainName,
        warehouseComName: businessUnitName,
        warehouseId,
        warehouseName,
        salesman,
      } = row;
      switch (type_num) {
        case "registration": // 清关登记
          this.$refs.registrationRef?.show(row);
          break;
        case "release": // 清关放行
          this.$refs.customDlgRef?.showCustomDialog({
            httpRequest: (formData) => {
              return clearanceRelease({
                ...formData,
                id,
              });
            },
            successFunction: this.mixinkeepTable,
            customFormConfig: releaseFormConfig,
          });
          break;
        case "devanning": // 预计提拆柜
        case "warehousing": // 入仓登记
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
            successFunction: this.mixinkeepTable,
            customFormConfig: warehousingFormConfig({
              mType: freightType,
              salesman,
            }),
          });
          break;
        case "realityUnpack": // FCL-实际提拆柜
          this.handleRealityUnpack(id);
          break;
        case "repulse": // 打回清关
          this.handleRepulse(row);
          break;
        default:
          break;
      }
    },
    async handleRealityUnpack(id) {
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
    },
    handleRepulse(row) {
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: "打回",
          label: `打回说明：`,
          message: `请输入打回说明`,
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          console.log(remark);
          const opt = {
            id: row.id,
            remark,
            source: this.source,
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
        successFunction: this.mixinkeepTable,
      });
    },
    /** 打回失败 */
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
    handlePlaceOrder(_, dItem) {
      //海外提派下单已经删除
      this.$refs.placeOrderRef?.show({ types: dItem.types });
    },
  },
};
