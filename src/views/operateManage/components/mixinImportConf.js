import { defaultParams, importCusProductInvoice } from "_comp/ComUpload/model";
import { comFileDownload } from "@/utils/download.js";
import { FullscreenLoading } from "@/utils/loading";
import { msgBox } from "@/utils/confirmBox.js";
import { mapActions, mapState } from "vuex";
import { exportGoodsRelationProduct } from "@/api/operateManage/details";
import { exportClearanceInvoice } from "@/api/operateRecord/clearanceGoods.js";
import qs from "qs";
export const mixinImportConf = {
  components: {
    ComUpload: () => import("_comp/ComUpload"),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      productUploadConfig: {
        ...defaultParams,
        url: importCusProductInvoice,
        fragmentationUpload: false,
        type: "text",
        className: "text-uploader",
        name: "file",
        showFileList: false,
        fileList: [],
        accept: ".xlsx,.xls",
        uploadData: {},
        successTip: false,
        limit: undefined,
        isPrediction: false,
      },
    };
  },
  methods: {
    ...mapActions(["dataImport/setECommerceImport"]),
    handleImport(isPrediction) {
      this.isPrediction = !!isPrediction;
      this.$refs.productUploadRef?.handleUploadClick();
    },
    handleUploading() {
      this.fullscreenLoading.show("正在上传中...");
    },
    handleDownloadNew() {
      const html = `<div class="base-flex-align margin-bottom">
          <i class="el-icon-warning"></i>
          当前模板已升级：最新模板于2023.12.07版本上线
        </div>`;
      // <div class="margin-left">
      //   <span class="text-info-color">具体修订以下2点：</span>
      // </div>
      // <div class="margin-left">
      //   ①模板增加一列SKU（必填）；
      // </div>
      // <div class="margin-left">
      //   ②导入校验规则变更；
      // </div>
      if (html) {
        msgBox(
          this,
          {
            customClass: "confirm-class import-msg-box",
            html,
            confirmButtonText: "去下载",
            showClose: false,
            showCancelButton: true,
          },
          () => {
            this.importUrlXlsx();
          }
        );
      }
    },
    handleImportErr({ requiredInfo, matchingInfo, templateInfo, checkInfo }) {
      this.fullscreenLoading.hide();
      let html = "";
      if (templateInfo) {
        this.handleDownloadNew();
      } else if (requiredInfo) {
        html = `<div class="base-flex-align">
          <i class="el-icon-warning"></i>
          第${requiredInfo}行产品信息必填项未完善，请核对信息后再导入
        </div>`;
      } else if (matchingInfo) {
        html = `<div class="base-flex-align">
          <i class="el-icon-warning"></i>
          ${matchingInfo}
        </div>`;
      } else if (checkInfo) {
        const arr = checkInfo.split("\n");
        arr.forEach((m, i) => {
          if (i === 0) {
            html = `<div class="base-flex-align"><i class="el-icon-warning"></i>${m}</div>`;
          } else {
            html += `<div class="base-flex-align margin-left">${m}</div>`;
          }
        });
      }
      if (html) {
        msgBox(
          this,
          {
            customClass: "confirm-class import-msg-box",
            html,
            confirmButtonText: "确 定",
            showClose: false,
          },
          () => {}
        );
      }
    },
    detailUploadSuccess({ successGoodsCount, successProductCount }) {
      let html = "";
      if (successGoodsCount || successProductCount) {
        html = `<div class="base-flex-align">
          <i class="el-icon-success"></i>
          导入成功，共导入${successGoodsCount}条货物信息，${successProductCount}个产品信息
        </div>`;
        this.handleUpdateView();
      }
      if (html) {
        msgBox(
          this,
          {
            customClass: "confirm-class import-msg-box",
            html,
            confirmButtonText: "确 定",
            showClose: false,
          },
          () => {}
        );
      }
    },
    uploadSuccess(res, isDetail) {
      this.fullscreenLoading?.hide();
      const { otherInfo = {} } = res.data;
      if (
        otherInfo.requiredInfo ||
        otherInfo.matchingInfo ||
        otherInfo.templateInfo ||
        otherInfo.checkInfo
      ) {
        this.handleImportErr(otherInfo);
        return;
      }
      if (
        isDetail &&
        (otherInfo.successGoodsCount || otherInfo.successProductCount)
      ) {
        this.detailUploadSuccess(otherInfo);
      }
      if (!isDetail) {
        if (this.importType === 5) {
          this.goImportInvoiceCustomer(res.data);
        } else {
          this.goImportInvoice(res.data);
        }
      }
    },
    goImportInvoice(data = {}, isCustomerInvoice) {
      const { orderId, operationOrderId, countryId, encasementWay } =
        this.formModel;
      const query = {
        id: orderId,
        operationOrderId,
        countryId,
        encasementWay,
        importType: this.importType,
        backPath: this.$route.path,
        data: encodeURI(qs.stringify(this.$route.query)),
      };
      if (isCustomerInvoice) {
        query.isCustomerInvoice = true;
      }
      if (this.isPrediction) {
        query.isPrediction = 1;
      }
      this["dataImport/setECommerceImport"](data);
      this.$router.push({
        path: "/operateManage/verifiedImportInvoice",
        query,
      });
    },
    // 数据模板导入-客户箱单发票
    goImportInvoiceCustomer(data) {
      const { operationOrderId, headTransportMode, encasementWay } =
        this.formModel;
      const query = {
        importType: this.importType,
        isOperationOrder: true,
        backPath: this.$route.path,
        data: qs.stringify(this.$route.query),
      };
      if (this.operationOrderId || this.originOperationOrderId) {
        data.invoiceEcVo.headTransportMode = headTransportMode;
        data.invoiceEcVo.encasementWay = 1;
        this.operationOrderId &&
          (query.operationOrderId = this.operationOrderId);
        this.originOperationOrderId &&
          (query.originOperationOrderId = this.originOperationOrderId);
        query.tabsActive = 13;
      } else {
        data.invoiceEcVo.headTransportMode = headTransportMode;
        data.invoiceEcVo.encasementWay = encasementWay;
        query.operationOrderId = operationOrderId;
      }
      this["dataImport/setECommerceImport"](data);
      this.$router.push({
        path: "/operateManage/onLineImport",
        query,
      });
    },
    importUrlXlsx() {
      const { id, operationOrderId } = this.formModel;
      console.log(this.formModel);
      comFileDownload(this, exportGoodsRelationProduct, {
        orderId: operationOrderId || id,
      });
      // exportGoodsRelationProduct({
      //   orderId: operationOrderId || id,
      // }).then((res) => {
      //   const url = res.data?.msg || res.msg;
      //   url && download(url);
      // });
    },
    // 数据模板导出-客户箱单发票
    importUrlXlsxCustomer() {
      const { operationOrderId } = this.formModel;
      comFileDownload(this, exportClearanceInvoice, {
        operationOrderId: operationOrderId,
        importType: 5,
      });
    },
    // 维护货物信息-客户箱单发票
    handleMaintainGoods(id, isCopy) {
      const { operationOrderId } = this.formModel;
      const query = {
        operationOrderId: id || operationOrderId,
        importType: 5,
        isImport: true,
        isOperationOrder: true,
        backPath: this.$route.path,
        data: qs.stringify(this.$route.query),
      };
      if (id) {
        query.tabsActive = 13;
      }
      if (isCopy) {
        query.isCopy = 1;
        query.originOperationOrderId = operationOrderId;
      }
      this.$router.push({
        path: "/operateManage/onLineImport",
        query,
      });
    },
  },
};
