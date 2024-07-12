import { mapActions } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import {
  orderRepulse,
  orderBusinessSubmit,
  recallSubmit,
} from "@/api/order/overSeaOther";
import { warehousingFormConfig } from "@/views/overseasBusiness/components/model";
import { warehousingRegistration } from "@/api/operateRecord/customsClearance";
export const mixinTableConf = {
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    OrderReceive: () => import("./orderReceive/index.vue"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
  },
  data() {
    return {
      searchFromData: {},
      statusList: [
        {
          statusArr: [2],
          text: "业务接单",
          type: "receive",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [3],
          text: "业务提交",
          type: "submit",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [2, 3],
          text: "打回",
          color: "#FF6767",
          type: "repulse",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [14],
          text: "撤回提交",
          type: "withdraw",
          handleClick: this.handleBtnClick,
        },
        {
          warehouseStatusArr: [0],
          text: "预计提拆柜",
          type: "devanning",
          freightType: 0, // 0=整柜；1=散货；
          handleClick: this.handleBtnClick,
        },
      ],
    };
  },
  created() {
    this["dictionary/getDictionary"]("overSeaOther").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchList(searchFrom = {}) {
      const { createTime, ...params } = searchFrom;
      const [createStartTime, createEndTime] = createTime || [];
      return new Promise((resolve) => {
        this.searchFromData = {
          ...params,
          createStartTime,
          createEndTime,
        };
        this.mixinkeepTable(true);
        resolve();
      });
    },
    getQueryParams() {
      const { overallStatusIn } = this.searchFromData;
      return {
        ...this.searchFromData,
        overallStatusIn: overallStatusIn
          ? overallStatusIn.join(",")
          : undefined,
      };
    },
    editTrailerSuccess() {
      this.msgSuccess("更新成功");
      this.mixinkeepTable();
    },
    handleView(row = {}) {
      const { detailPageUrl, menuType } = this.menuConfObj || {};
      sessionStorage.removeItem("detailTabActive");
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${+activeName}`][0]?.tableData.map(
        (e) => e.id
      );
      this.$router.push({
        path: detailPageUrl,
        query: {
          id: row.id,
          menuType,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","),
        },
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
            orderRepulse(opt)
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
    handleWithdraw({ id }) {
      const msg = "撤回操作不可逆！";
      const title = "撤回提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        this.comRepeatedRequest(this, recallSubmit, { id }).then(() => {
          this.msgSuccess("业务提交撤回成功");
          this.mixinkeepTable();
        });
      });
    },
    handleBtnClick(row, iBtn) {
      const { type: type_num } = iBtn;
      const { id } = row;
      switch (type_num) {
        case "receive": // 业务接单
          this.$refs.orderReceiveRef.show(row);
          break;
        case "submit": // 业务提交
          this.comRepeatedRequest(this, orderBusinessSubmit, { id })
            .then(() => {
              this.msgSuccess("业务提交成功");
              this.mixinkeepTable();
            })
            .catch(() => {
              this.handleView(row);
              sessionStorage.setItem("detailTabActive", 2);
            });
          break;
        case "repulse": // 打回
          this.handleRepulse(row);
          break;
        case "withdraw": // 撤回提交
          this.handleWithdraw(row);
          break;
        case "devanning": // 预计提拆柜
          const {
            jobNo,
            bailorPeopleName,
            operationMainName,
            warehouseComName: businessUnitName,
            warehouseId,
            warehouseName,
            salesman,
          } = row;
          this.$refs.customDlgRef?.showCustomDialog({
            formModel: {
              jobNo,
              bailorPeopleName,
              operationMainName,
              businessUnitName,
              warehouseId,
              warehouseName,
            },
            httpRequest: (formData) => {
              return warehousingRegistration({
                ...formData,
                id,
              });
            },
            successFunction: this.mixinkeepTable,
            customFormConfig: warehousingFormConfig({
              mType: 0,
              salesman,
              isDelivery: true,
            }),
          });
          break;
        default:
          break;
      }
    },
  },
};
