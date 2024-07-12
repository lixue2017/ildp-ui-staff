import { mapActions } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import {
  orderRepulse,
  orderBusinessSubmit,
  orderBusinessRemark,
  recallSubmit,
} from "@/api/order/overSeaOther";
import { httpDictRequest } from "@/api/performance/dictRecord.js";
export const mixinDetailConf = {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    Card: () => import("./Card"),
    OrderReceive: () => import("./orderReceive/index.vue"),
    TabTable: () => import("./TabTable"),
    RelatedQuotation: () =>
      import(
        "@/views/enquiryManage/customerQuotation/components/RelatedQuotation"
      ), // 关联报价
  },
  data() {
    return {
      footerBtn: [
        {
          statusArr: [2],
          text: "业务接单",
          type: "receive",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [3],
          text: "保存备注",
          type: "saveRemark",
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
          type: "repulse",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [20],
          text: "撤回提交",
          type: "withdraw",
          handleClick: this.handleBtnClick,
        },
        {
          text: "关闭",
          btnType: "info",
          handleClick: this.reBack,
        },
      ],
      tabActive: 6,
      currId: 0,
    };
  },
  created() {
    this["dictionary/getDictionary"]("overSeaOther").then(() => {
      this.showSearchForm = true;
    });
    const { id, active = 6 } = this.$route.query;
    this.currId = id;
    this.getDetails(id);
    const tabActive = sessionStorage.getItem("detailTabActive");
    this.tabActive = Number(tabActive || active);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getOrderFooterBtn(menuType) {
      const { overallStatus, quotationSheetId } = this.formData;
      let isShow = false;
      if (
        menuType === "order" &&
        ![1, 2, 11, 100].includes(overallStatus) &&
        !quotationSheetId
      ) {
        isShow = true;
      }
      return [
        ...(isShow
          ? [
              {
                statusHide: [1, 2, 11, 100],
                text: "关联报价",
                type: "relatedQuotation",
                handleClick: this.handleBtnClick,
              },
            ]
          : []),
        ...this.footerBtn,
      ];
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
        successFunction: () => this.getDetails(row.id),
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
          this.handleEditSuccess(id);
        });
      });
    },
    handleBtnClick(iBtn) {
      const { type: type_num } = iBtn;
      const { id } = this.formData;
      switch (type_num) {
        case "relatedQuotation": // 关联报价
          const { transportMode, bailorPeopleId } = this.formData;
          this.$refs.relatedQuotationRef.show({
            ...this.formData,
            customerId: bailorPeopleId,
            shippingMode: [3, 4].includes(Number(transportMode)) ? 2 : 1,
          });
          break;
        case "receive": // 业务接单
          this.$refs.orderReceiveRef.show(this.formData);
          break;
        case "saveRemark":
          // const { businessRemark: remark } = this.$refs.formRef.getFormParams();
          const { businessRemark: remark } =
            this.$refs.tabContentRef?.getBaseRefFormParams() || {};
          // this.comRepeatedRequest(this, orderBusinessRemark, {
          //   id,
          //   remark,
          // })
          httpDictRequest(
            {
              pageRemarkNameKey: "HWQGDDYWBZ",
              requestKey: "postAddBusinessRemark",
            },
            {
              remark,
              businessId: id,
            }
          ).then(() => {
            this.formData.businessRemark = remark;
            this.msgSuccess("业务备注保存成功");
          });
          break;
        case "submit": // 业务提交
          this.comRepeatedRequest(this, orderBusinessSubmit, { id }).then(
            () => {
              this.msgSuccess("业务提交成功");
              this.handleEditSuccess(id);
            }
          );
          break;
        case "repulse": // 打回
          this.handleRepulse(this.formData);
          break;
        case "withdraw": // 撤回提交
          this.handleWithdraw(this.formData);
          break;
        default:
          break;
      }
    },
    reBack() {
      this.tabActive = 1;
      sessionStorage.removeItem("detailTabActive");
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (["pre", "next", "titJump"].includes(type)) {
        this.handleEditSuccess(id);
        this.currId = id;
      }
    },
    handleEditSuccess(id) {
      // this.tabActive = 1;
      // sessionStorage.removeItem("detailTabActive");
      this.$refs.logisticsRef?.reloadLogisticsNodes();
      this.getDetails(id, () => {
        this.$nextTick(() => {
          this.$refs.goodRef?.getList();
        });
      });
    },
    handleActive(key) {
      console.log("key", key);
      this.tabActive = key;
      sessionStorage.setItem("detailTabActive", key);
    },
  },
};
