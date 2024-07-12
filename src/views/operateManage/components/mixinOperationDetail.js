import { getAttachListByOrderId } from "@/api/common";
import { postUploadInsurance } from "@/api/operateManage/details.js";
import { mapGetters,mapState } from "vuex";
import qs from "qs";
export default {
  data() {
    return {
      topConfig: {
        columnConfig: [
          // 标题右侧label，数据取值formModel
          {
            label: "创建人",
            prop: "createBy",
          },
          {
            label: "创建时间",
            prop: "createTime",
          },
          {
            label: "业务员",
            prop: "salesmanName",
          },
        ],
        rightBtn: [
          // 右侧按钮集合
          {
            icon: "el-icon-arrow-left",
            text: "上一条",
            iconPosition: "left",
            type: "pre",
          },
          {
            icon: "el-icon-arrow-right el-icon--right",
            text: "下一条",
            type: "next",
          },
          {
            icon: "iconfont icon-fanhui",
            text: "返回",
            type: "back",
            className: "back",
          },
        ],
      },
      cLeftTopConfig: {
        columnConfig: [
          // 标题左侧
          {
            label: "创建人",
            prop: "operationCreateBy",
          },
          {
            label: "创建时间",
            prop: "operationCreateTime",
          },
          {
            label: "业务员",
            prop: "salesmanName",
          },
        ],
      },
      footerBtn: [
        {
          text: "操作接单",
          type: "primary",
          btnStatus: [15],
          handleClick: this.operationSubmit,
        },
        {
          text: "关 闭",
          handleClick: this.reBack,
        },
      ],
      fileTabTypeArr: [
        {
          label: "客户下单",
          fBtnParam: {
            type: "30",
          },
        },
        {
          label: "客户报关资料",
          fBtnParam: {
            type: "100",
          },
        },
        {
          label: "自提附件",
          fBtnParam: {
            type: "4",
          },
        },
        {
          label: "订单POD",
          fBtnParam: {
            type: "20",
          },
        },
        {
          label: "快递面单",
          fBtnParam: {
            type: "150",
          },
        },
        {
          label: "报关放行资料",
          fBtnParam: {
            type: "60",
          },
        },
        {
          label: "税金单",
          fBtnParam: {
            type: "90",
          },
        },
      ],
      tabsActive: null,
    };
  },
  computed: {
    ...mapGetters(["importChange"]),
    ...mapState({
      attachConfig: (state) => state.dictionary.dicsData.attachConfig,
      attachType: (state) => state.dictionary.dicsData.attachType,
    }),
  },
  watch: {
    importChange(val) {
      this.$refs.tableRef?.handleUpdateView();
    },
  },
  mounted() {
    const { tabsActive, ...params } = this.$route.query;
    if (tabsActive) {
      this.changeTabs(Number(tabsActive));
      let url = this.$route.path;
      if (Object.keys(params).length) {
        url += `?${qs.stringify(params)}`;
      }
      window.history.replaceState("", "", url);
      if (tabsActive == 5) {
        this.tabsActive = tabsActive;
      }
    }
  },
  methods: {
    getFootBtn() {
      //根据当前状态获取当前操作单详情底部操作按钮
      const { operationOrderStatus } = this.initInfo || {};
      return this.footerBtn.filter((e) =>
        e.btnStatus ? e.btnStatus.includes(operationOrderStatus) : true
      );
    },
    operationSubmit() {
      //操作接单
      const { operationRemark } = this.$refs.basicInfoForm?.getFormModelVal();
      const { id, orderType } = this.initInfo || {};
      const params = {
        id,
        operationRemark,
        isOperation: 1,
      };
      this.$refs.OrderSubmit.show(params, {}, orderType);
    },
    // 保险附件
    operationalInsuranceFile(fObj) {
      const { operationOrderId } = fObj;
      return {
        isUploadBtn: true,
        isBtnRound: true,
        btnTxt: "保险资料上传",
        uploadModelCols: {
          fileKey: "noRequired",
          fileLabel: "保险资料",
        },
        uploadModelData: {
          attachFilesFn: () =>
            getAttachListByOrderId({
              orderId: operationOrderId,
              orderType: 1, // 查询操作单
              attachType: 110, // 保险类型
            }),
        },
        uploadFileRequest: (opt) => {
          return postUploadInsurance({
            insuranceAttachId: opt.attachId,
            deleteAttachIdList: opt.deleteAttachIdList,
            operationOrderId,
          });
        },
        successUploadFn: this.handleOrderSubmitSuccess,
        fileTypeArr: this.fileTabTypeArr,
        queryTypeList: ["30", "100", "4", "20", "150", "60", "90"],
      };
    },
    handleOrderSubmitSuccess() {
      this.handleOperateSuccess();
    },
    handleCustomDetails(row) {
      this.$router.push({
        path: "/operateManage/operateRecord/declareCustomsDetails",
        query: {
          id: `${row.id}_${row.busType}`, // 与详情的上下页对应
          backPath: this.$route.path,
        },
      });
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ComOperate: () => import("_comp/ComOperate"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
    TitPageJump: () => import("./TitPageJump"),
    VehiclesTable: () =>
      import(
        "@/views/newOrderManage/eCommerce/details/components/vehiclesTable"
      ),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
  },
};
