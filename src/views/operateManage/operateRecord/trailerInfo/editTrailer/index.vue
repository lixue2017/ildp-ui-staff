<template>
  <ComDialog
    ref="customDialog"
    class="edit-trailer-dlg"
    :customDialog="customDialogConfig"
    :confirmClose="!isSee"
    :dialogBoxCenter="true"
		:dlgPreviewConfig="previewDownloadConfig()"
  >
    <template v-slot:content>
      <ComTabs :tabsConfig="tabsConfig">
        <template v-for="tab in tabsConfig.tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            <ComForm
              :ref="`dialogFormRef${tab.name}`"
              :formConfig="getFormConfig(tab.name)"
              class="dialog-form"
              v-if="
                $refs.customDialog && $refs.customDialog.dialogVisible && isInit
              "
            >
              <!-- 查看slot -->
              <template v-slot:trailerRowId="slotProps">
                {{ slotProps.formModel.shortName || "--" }}
              </template>

              <template v-slot:slotGoodsAddress>
                <TrailerAddress
                  ref="goodsAddressRef"
                  v-if="isAddressTable"
                  :isEdit="!isSee"
                  :formModel="updateFormConfig.formModel"
                />
              </template>
              <template v-slot:slotDestinationAddress>
                <TrailerAddress
                  ref="destinationRef"
                  v-if="isAddressTable"
                  :isEdit="!isSee"
                  :formModel="updateFormConfig.formModel"
                />
              </template>
              <template v-slot:slotImgList="{ formModel }">
                <div class="custom-preview-image">
                  <template v-for="(item, index) in formModel.picUrls">
                    <el-image
                      v-if="item"
                      :src="item"
                      :key="index"
                      :preview-src-list="formModel.picUrls"
                    >
                    </el-image>
                  </template>
                </div>
              </template>
            </ComForm>
          </el-tab-pane>
        </template>
        <template v-slot:slotTabsRight>
          <span
            class="tag-blue-color"
            v-if="isSee && updateFormConfig.formModel.id"
          >
            {{
							getDictObj('trailerStatus', updateFormConfig.formModel.status)
            }}
          </span>
        </template>
      </ComTabs>
    </template>
  </ComDialog>
</template>

<script>
import {
  popTrailerPost,
  getSelectTrailerByLcl,
  getTrailerDetail,
  popTrailerPut,
  getTrailerPreview,
  getTrailerAddressList,
} from "@/api/performance/record";
import { mapActions, mapState } from "vuex";
import { filesPreview } from "@/utils/index";
import { WAREHOUSE_TYPE } from "@/utils/mixin";
import { editTrailerForm, formRules, feedbackFormRules } from "./model";
const tabList = [
  {
    label: "集装箱到港",
    name: "1",
  },
  {
    label: "集装箱离港",
    name: "2",
  },
  {
    label: "一般拖车",
    name: "3",
  },
];
export default {
  data() {
    return {
      WAREHOUSE_TYPE,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
      },
      customDialogConfig: {
        width: "1000px",
        appendToBody: true,
        useFooter: "footer",
      },
      footerBtnArr: [
        {
          text: "保存并预览",
          type: "primary",
          btnType: "savePreview",
          handleClick: () => {
            this.footerBtnType = "savePreview";
            this.saveEvt();
          },
        },
        {
          text: "保存",
          type: "primary",
          btnType: "save",
          handleClick: () => this.saveEvt(),
        },
        {
          text: "预览",
          type: "primary",
          btnType: "preview",
					btnPreview: "btnDownload",
					marginDirection: 'margin: 0 10px',
          handleClick: () => {},
        },
        {
          text: "修改",
          type: "primary",
          btnType: "seeEdit",
          handleClick: () => {
            this.isInit = false; // 重新加载表单模板
            this.tempRow.isSee = false;
            this.$nextTick(() => {
              this.show(this.tempRow);
            });
          },
        },
        {
          text: "取消",
          plain: true,
          btnType: "cancel",
          handleClick: () => {
            this.$refs.customDialog.handleClose();
          },
        },
      ],
      updateFormConfig: {
        formModel: {},
        isAttachFileId: true,
        httpRequest: this.addOrEditTrailerInfo, // 表单提交接口
        successFunction: (res) => {
          if (this.footerBtnType === "savePreview") {
            this.footerBtnType = "";
            this.previewEvt(res.data);
          }
          this.$refs.customDialog.hide();
          this.$emit("handleSuccess", res);
        }, // 表单提交成功回调
        size: "small",
        labelWidth: "102px",
        uploadFormConfig: {
          type: "picture-card",
          className: "card-uploader",
          accept: ".jpg,.png",
        },
      },
      footerBtnType: "",
      tempRow: {}, // 临时数据
      isAddressTable: true, // 一般拖车改变BS单号重置地址列表
      isInit: true,
      isSee: false, // 是否为查看状态
      operationBtn: 0, //是否点击的是进度反馈或拖车完结
    };
  },
  methods: {
    saveEvt() {
      const is_address_1 = this.$refs.goodsAddressRef
        ? this.$refs.goodsAddressRef[0]?.formSubmitRules()
        : true;
      const is_address_2 = this.$refs.destinationRef
        ? this.$refs.destinationRef[0]?.formSubmitRules()
        : true;
      console.log(
        111111111,
        is_address_1,
        is_address_2,
        this.$refs.goodsAddressRef,
        this.$refs.destinationRef
      );
      if (is_address_1 && is_address_2) {
        this.$refs[
          `dialogFormRef${+this.tabsConfig.activeName}`
        ][0]?.submitForm();
      }
    },
    addOrEditTrailerInfo(formModel) {
      const {
        weighStifling = [],
        boxCode_obj,
				shortName,
        operationOrderObj,
        attachId,
        ...nFormModel
      } = formModel;
      const pickAddressArr = this.$refs.goodsAddressRef
        ? this.$refs.goodsAddressRef[0]?.listFormData
        : []; // 提货地址
      const finalAddressArr = this.$refs.destinationRef
        ? this.$refs.destinationRef[0]?.listFormData
        : []; // 目的地址
      // console.log("formModel", formModel);
      let params = {
        ...nFormModel,
        goodsId: boxCode_obj?.value,
        pickAddressList: pickAddressArr.map((e) => {
          const { isColEdit, temp_key, address_obj, ...t_e } = e;
          return {
            ...t_e,
            type: 0, // 0：提货地址  1：目的地地址
            trailerType: formModel.type, // 0-集装箱 1-一般拖车
            addressId: address_obj.value,
            addressType: address_obj.shipperType, // 地址类型  0提货地址   3私人仓    5仓库
          };
        }),
        finalAddressList: finalAddressArr.map((e) => {
          const { isColEdit, temp_key, address_obj, ...t_e } = e;
          return {
            ...t_e,
            type: 1,
            trailerType: formModel.type, // 0-集装箱 1-一般拖车
            addressId: address_obj.value,
            addressType: address_obj.shipperType, // 地址类型  0提货地址   3私人仓    5仓库
          };
        }),
        weigh: weighStifling.includes(1) ? 1 : 0,
        stifling: weighStifling.includes(2) ? 1 : 0,
        status: this.operationBtn ? 1 : 0, // 拖车登记
        attachIds: attachId,
      };
      // console.log("formModel===", params, formModel);
      if (formModel.type === 1) {
        // 一般拖车
        params.operationOrderId = operationOrderObj.value;
      }
      if (params.id) {
        return popTrailerPut(params);
      }
      return popTrailerPost(params);
    },
    previewEvt(tId) {
      // 预览
      getTrailerPreview({tId}).then((res) => {
        res.data && filesPreview(res.data);
      });
    },
		// 预览、下载参数与接口
    previewDownloadConfig() {
      return {
        previewParam: {
          tId: this.updateFormConfig.formModel?.id
        },
        previewHttp: getTrailerPreview,
      };
    },
    async show(obj) {
      /**
       * type: 0 集装箱拖车  1 一般拖车
       * trailerType 拖车类型  0 集装箱到港 1集装箱离港   2拖车到仓  3拖车离仓  4其他
       */
			const { webViewSource, ...row } = obj || {};
      const { isSee = false, type = 0, trailerType = 0, operationBtn } = row;
      let nRow = {};
      this.tempRow = obj || {};
      if (row.id) {
        // 有拖车ID
        nRow = (await getTrailerDetail(row.id)).data || {};
      } else {
        if (row.operationOrderId) {
          nRow = await this.addInitRow(row);
        }
      }
      this.tabsConfig.activeName = trailerType + 1 + "";
      this.tabsConfig.tabs = [tabList[trailerType]];
      this.isSee = isSee;
      this.operationBtn = operationBtn;
      let footerBtns = ["savePreview", "save", "cancel"];
      if (isSee) {
        if (row.status == 0) {
          footerBtns = ["preview", "seeEdit", "cancel"];
        } else {
          footerBtns = ["preview", "cancel"];
        }
      }
      this.isAddressTable = true;
      if (type === 1) {
        // 一般拖车没有预览
        if (!row.id) {
          // 新增默认不显示地址列表
          this.isAddressTable = false;
        }
        footerBtns = footerBtns.filter(
          (e) => !["savePreview", "preview"].includes(e)
        );
      }
      if (row.operationBtn) {
        //row.operationBtn用来区分是详情查看还是进度反馈，有就是进度反馈，没有就是查看详情
        footerBtns = ["save", "preview", "cancel"];
      }
      // console.log("footerBtns", footerBtns);
      this.customDialogConfig = {
        ...this.customDialogConfig,
        title: `拖车信息(${isSee ? "查看" : "编辑"})`,
        footer: this.footerBtnArr.filter((e) => footerBtns.includes(e.btnType)),
      };
      let weighStifling = [];
      const {
        weigh,
        stifling,
        pickAddressList,
        finalAddressList,
        boxSizeCode, //新加入字段，仅仅只用于拼接整柜信息
        boxCode,
        sono,
        ...tRow
      } = nRow;
      if (weigh === 1) {
        weighStifling.push(1);
      }
      if (stifling === 1) {
        weighStifling.push(2);
      }
      this.updateFormConfig = {
        ...this.updateFormConfig,
        formModel: row.id
          ? {
              ...tRow,
              boxCode: isSee
                ? `${sono ? `${sono}#` : ""}${boxSizeCode ? boxSizeCode : ""}`
                : boxCode,
              sono,
              type,
              trailerType,
              boxCode_obj: {
                value: nRow.goodsId,
              },
              operationOrderObj: {
                value: nRow.operationOrderId,
              },
              weighStifling,
              picUrls: (nRow.attachList || []).map((e) => e.filePath),
            }
          : {
              ...row,
              ...nRow,
              sono: "",
            },
        formRules: isSee
          ? feedbackFormRules(row.operationBtn)
          : formRules(type || 0),
        afterMounted: () => {
          setTimeout(() => {
            // 子组件加载后再调用
						if (type === 1 && webViewSource === 'operationTrailer' && !row.id) {
							// 节点操作一般拖车，默认选中当前操作单
							this.operationGeneralTrailer({value: nRow.operationOrderId})
						}
            this.setAddressTable(pickAddressList, finalAddressList);
          }, 20);
        },
      };
			if (type === 1 && webViewSource === 'operationTrailer' && !row.id) {
				// 一般拖车操作节点
				this.updateFormConfig.formModel.operationOrderObj = {
					value: nRow.operationOrderId
				}
			}
			this["dictionary/getDictionary"](["trailerStatus"]);
      this.isInit = true; // 查看时点击修改改变模板
      this.$refs.customDialog.show();
    },
    getFormConfig(tName) {
      const { operationOrderId, orderId, orderType } =
        this.updateFormConfig.formModel;
			const { webViewSource }	= this.tempRow;
      return {
        ...this.updateFormConfig,
        isAttachFileId: true,
        lists: editTrailerForm({
          tName,
					webViewSource, // 页面来源
          isSee: this.isSee,
          operationId: operationOrderId,
          orderId,
          isAttachFileId: !!this.operationBtn,
          operationBtn: this.operationBtn,
          orderType,
          boxFn: (boxObj) => {
            // console.log("选择柜型==", boxObj);
            const {
              totalWeight = "",
              ontainerSno = "",
              sealingStripSno = "",
              sono = "",
            } = boxObj;
            this.$refs[`dialogFormRef${tName}`][0]?.setFormModel({
              totalWeight,
              ontainerSno,
              sealingStripSno,
              sono,
            });
          },
          operationFn: this.operationGeneralTrailer,
        }),
      };
    },
		operationGeneralTrailer(operation_obj) {
			// 一般拖车选择操作单
			this.isAddressTable = false;
			const { value } = operation_obj;
			this.updateFormConfig.formModel.operationOrderId = value;
			this.$refs[`dialogFormRef${this.tabsConfig.activeName}`][0]?.setFormModel({
				operationOrderId: value,
			});
			this.operationChange(value);
		},
    addInitRow(row = {}) {
      // 集装箱拖车新增初始化数据
      const opt = {
        operationOrderId: row.operationOrderId, // 操作单ID
        type: row.trailerType,
      };
      return getSelectTrailerByLcl(opt).then((res) => {
        const keyArr = [
					"shortName",
          "operationOrderNum",
          "registerNo",
          "shipCompany",
          "shipName",
          "pickBoxId",
          "returnBoxId",
          "shipSecond",
          "customerId",
          "cabinOpenTime",
          "orderId",
          "orderType",
          "cutGateTime",
          "pickAddressList",
          "finalAddressList",
          "sono",
        ];
        const resData = res.data || {};
        const addObj = keyArr.reduce(
          (item, e) => {
            item[e] = resData[e];
            return item;
          },
          {
            operationOrderId: row.operationOrderId,
          }
        );
        return addObj;
      });
    },
    handleUploadSuccess(row, file) {
      //上传成功
    },
    async operationChange(oVal) {
      const opt = {
        operationOrderId: oVal, // 操作单ID
        type: 1, // 1-默认地址
      };
      const pickAddressList = (await getTrailerAddressList(opt)).data || {};
      this.isAddressTable = true;
      setTimeout(() => {
        this.setAddressTable(pickAddressList);
      }, 20);
    },
    setAddressTable(pickList, finalList) {
      this.$refs.goodsAddressRef &&
        this.$refs.goodsAddressRef[0]?.setTableData({
          mode_type: 0,
          addressList: (pickList || []).map((e) => {
            return {
              ...e,
              address_obj: {
                value: e.addressId,
                shipperType: [undefined, null].includes(e.addressType)
                  ? e.shipperType
                  : e.addressType,
              },
            };
          }),
        });
      this.$refs.destinationRef &&
        this.$refs.destinationRef[0]?.setTableData({
          mode_type: 1,
          addressList: (finalList || []).map((e) => {
            return {
              ...e,
              address_obj: {
                value: e.addressId,
                shipperType: e.addressType,
              },
            };
          }),
        });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  components: {
    TrailerAddress: () => import("./trailerAddress"),
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  created() {
  },
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.edit-trailer-dlg {
  /deep/ .el-dialog__body {
    padding-top: 20px;
    .tabs-right-btn {
      top: 5px;
    }
  }
  /deep/ .el-tabs__header {
    .el-tabs__nav-scroll {
      padding-bottom: 15px;
    }
    .el-tabs__active-bar {
      background-color: transparent;
    }
    .el-tabs__item {
      padding: 4px 15px;
      font-weight: 500;
      color: $tabBtnTxt;
      line-height: 20px;
      font-size: 14px;
      border-radius: 2px;
      border: 1px solid $tabBtnBorder;
      margin-right: 12px;
      transition: 0.2s all;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        border: 1px solid $text-btn-primary;
        color: $text-btn-primary;
      }
      &.is-active {
        border: 1px solid $text-btn-primary;
        color: $text-btn-primary;
      }
    }
  }
  .business-num {
    margin-right: 10px;
  }
  .contacts {
    .full-name {
      flex: 2;
      margin-right: 5px;
    }
    .phone-number {
      flex: 3;
    }
  }
  /deep/ .form-item-slot-label {
    .el-form-item__label {
      position: relative;
      .tag-grey-color {
        position: absolute;
        bottom: -14px;
        right: 20px;
      }
      .dashed-icon-arrow {
        position: absolute;
        height: 52px;
        width: 86px;
        top: 2px;
        right: 0;
        &.see-icon-arrow {
          height: 60px;
          top: -14px;
        }
      }
    }
  }
  /deep/ {
    .card-uploader {
      .el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item {
        width: 80px;
        height: 80px;
        line-height: 85px;
        margin: 0 18px 0 0;
      }
    }
  }
  .auto-slot-complete {
    flex: 1;
    margin-right: 5px;
  }
}
</style>
