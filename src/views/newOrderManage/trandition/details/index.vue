<template>
  <div class="order-detail-box">
    <ComDetailTop
      :title="/* 订单管理详情 */ `${title}`"
      :formModel="formData"
      :titConfig="leftTopConfig"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <el-tooltip
          popper-class="atooltip"
          :content="
            formData.customerRemark ? formData.customerRemark : '暂无备注'
          "
          placement="bottom"
        >
          <span class="sub-title">
            ({{ formData.customerShortName || formData.customerName }})</span
          >
        </el-tooltip>
      </template>

      <template v-slot:titContentSlot>
        <TitOrderPageJump
          v-if="isInitRes"
          :titSelectData="formData"
					:titSelectConf="{
						isOrderType: true,
					}"
          @handleClick="handleTopClick"
        />
      </template>
    </ComDetailTop>

    <div class="order-content" v-if="isInitRes">
      <div class="order-left">
        <OrderHeadCard
          :infoData="{
            ...formData,
            viewSource: headCardIcon[formData.transportMode],
          }"
        />

        <ComForm
          class="detail-see-form"
          :formConfig="{
            ...formHeadConfig,
            formModel: formData,
          }"
        />

        <div class="custom-tabs-btn">
          <template v-for="tItem in btnTypeTabsList()">
            <el-button
              size="small"
              plain
              :key="tItem.key"
              @click="changeTabs(tItem.key)"
              :type="tItem.key === tabs.active ? 'activation' : ''"
              >{{ tItem.label }}</el-button
            >
          </template>
        </div>

        <div v-show="['10'].includes(tabs.active)">
          <ComForm
            class="detail-see-form"
            :formConfig="formConfig"
            ref="myFormRef"
          >
            <template v-slot:expansion="slotProps">
              <span
                @click="showToggle(slotProps.fieldItem)"
                class="base-flex-end primary-text-color cursorPointer"
              >
                <span>
                  {{ slotProps.fieldItem.expansion ? "收缩" : "展开" }}
                </span>
                <i
                  :class="`${
                    slotProps.fieldItem.expansion
                      ? 'el-icon-arrow-up'
                      : 'el-icon-arrow-down'
                  } el-icon--right`"
                ></i>
              </span>
            </template>
          </ComForm>
        </div>

        <template v-if="['20'].includes(tabs.active)">
          <!-- 传统空运/海运、拖车 -->
          <TableInfo ref="tableRef" :formModel="formConfig.formModel" />
        </template>

        <template>
          <keep-alive>
            <!-- 切换页签缓存编辑值 -->
            <CostInfo
              v-if="['30'].includes(tabs.active)"
              :formModel="formData"
              :extraData="{
                isBussiness: 1, //1是订单
                billingMain: formData.operateMain,
              }"
              :paramObj="{
                isWebEdit: formData.orderStatus === 10, // 可编辑状态
              }"
              title="计费信息"
              :addBtnShow="formData.orderStatus >= 10"
            />
            <!-- :relatedBtnShow="!formData.quotationSheetId" -->
          </keep-alive>
        </template>

        <template v-if="['40'].includes(tabs.active) && uploadTableConfig.show">
          <FileUploadTable
            ref="uploadTypeRef"
            :uploadTableConfig="uploadTableConfig"
            :uploadFileTableConfig="uploadFileTableConfig"
          />
          <!-- <ComAttachTable
            :paramObj="{
              orderId: formData.id,
              orderType: formData.orderType,
              viewSource: 'trOrder',
              orderNumId: formData.id,
              orderNumType: formData.orderType,
              operationOrderNum: formData.orderNum,
              hideTitBtn: !!formData.sortBoxDone === 1, // 1 - 已排柜
            }"
          /> -->
        </template>

        <template v-if="['50'].includes(tabs.active)">
          <OperationRecords
            :id="formData.operationOrderId || 0"
            :params="{ orderId: formData.id, orderType: formData.orderType }"
          />
        </template>
      </div>

      <div>
        <OrderRightTrajectory
          :formData="{ ...formData, status: formData.orderStatus }"
          @handleSuccess="handleReceivingSuccess"
        />
      </div>
    </div>

    <template v-if="isInitRes">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in footerBtnList()">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>

    <OrderReceiving
      ref="orderReceiving"
      @handleSuccess="handleReceivingSuccess"
    />
    <BusinessSubmit
      ref="businessSubmitRef"
      @handleSuccess="handleReceivingSuccess"
      @handleError="() => changeTabs('30')"
    />
    <ConfirmDialog ref="confirmDlgRef" />
  </div>
</template>
<script>
import { getSeaTraditionDetail } from "@/api/trandition/oceanModel";
import { getOrderOtherDetail } from "@/api/trandition/otherModel";
import { httpDictRequest } from "@/api/performance/dictRecord.js";
import { POSTCancelDelivery } from "@/api/container/arrange.js";
import {
  businessSubmitGather,
  getRouteByOrderId,
  businessRemarkSubmit,
  getOrderConfigList,
  operateById,
  businessRepulse,
} from "@/api/order/firstTransport.js";
import {
  seaOrder,
  airOrder,
  draftOrder,
  certificateOrder,
  seaHeadCols,
  airHeadCols,
  otherHeadCols,
  headCols,
} from "./model";
import { mapActions, mapState } from "vuex";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { getBasicDataList } from "@/api/operationalData/index.js";
import {
  updateAttachListByOrderIdNew,
  getOrderAttachList,
} from "@/api/common.js";
import { msgBox, customMessageBox } from "@/utils/confirmBox.js";
export default {
  name: "TranditionDetails",
  mixins: [mixinEditCache],
  components: {
    ComForm: () => import("_comp/ComForm"),
    OrderHeadCard: () =>
      import("@/views/newOrderManage/eCommerce/details/orderHeadCard.vue"),
    TableInfo: () => import("./components/TableInfo"),
    CostInfo: () => import("_comp/CostInfo"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
    OrderReceiving: () =>
      import(
        "@/views/newOrderManage/seaTransport/components/orderReceive/index.vue"
      ),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    OrderRightTrajectory: () =>
      import("@/views/newOrderManage/components/orderTrajectory/index.vue"),
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
    BusinessSubmit: () =>
      import("@/views/newOrderManage/components/BusinessSubmit/index.vue"),
    TitOrderPageJump: () =>
      import("@/views/operateManage/components/TitPageJump/orderJump.vue"),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  provide() {
    return {
      PROVIDECURRFILTER: true,
    };
  },
  data() {
    return {
      title: "",
      leftTopConfig: {
        columnConfig: [
          // 标题左侧label，数据取值formModel
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
          {
            label: "文件员",
            prop: "fileMemberName",
          },
          {
            label: "操作员",
            prop: "operatorName",
          },
        ],
      },
      btnTabsList: [
        {
          label: "基本信息",
          key: "10",
        },
        {
          label: "货物信息",
          key: "20",
        },
        {
          label: "账单信息",
          key: "30",
        },
        {
          label: "附件信息",
          key: "40",
        },
        {
          label: "操作记录",
          key: "50",
        },
      ],
      tabs: {
        active: "10",
      },
      headCardIcon: {
        0: "oceanShipping",
        3: "airTransport",
      },
      formHeadConfig: {
        labelWidth: "86px",
        lists: [], // 表单渲染列表
      },

      formData: {},
      formConfig: {
        formModel: {},
        isAttachFileId: true, // 显示航次附件
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "92px",
        lists: [], // 表单渲染列表
      },
      footerBtn: [
        {
          text: "保存备注",
          btnType: [10],
          handleClick: () => this.handleSaveRemark(),
        },
        {
          text: "业务接单",
          btnType: [1],
          handleClick: () => this.handleReceiving(),
        },
        {
          text: "撤回提交",
          btnType: [15],
          handleClick: this.handleWithdraw,
        },
        {
          text: "取消出货",
          btnType: [10, 15],
          handleClick: () => {
            const title = "确认提示";
            const html = `
            <div class="base-flex-align">
              <div><i class="el-icon-warning text-warning"></i></div>
              <div>
                <div class='tips-title'>是否确定取消出货？</div>
                <div class='tips-content'>订单已产生费用，且取消出货后该订单状态变为取消出货</div>
              </div>
            </div>
              `;
            msgBox(this, { title, html, showCancelButton: true }, () => {
              this.handleCancelDelivery();
            });
          },
        },
        {
          text: "业务提交",
          btnType: [10],
          handleClick: () => {
            // 业务提交
            const { orderType, id, businessRemark } =
              this.$refs.myFormRef?.getFormParams();
            if ([3, 4].includes(orderType)) {
              this.$refs.businessSubmitRef?.show({
                ...this.formData,
                businessRemark,
              });
            } else {
              businessSubmitGather(orderType, id, businessRemark)
                .then(() => {
                  this.getDetails(id);
                })
                .catch((error) => {
                  this.changeTabs("30");
                });
            }
          },
        },
        {
          text: "打回",
          btnType: [1, 10],
          color: "#FF6767",
          handleClick: this.handleVoid,
        },
        {
          text: "关闭",
          handleClick: () => this.reBack(),
        },
      ],
      isInitRes: false,
      uploadTableConfig: {
        show: false,
      },
      uploadFileTableConfig: {},
      queryTypeList: "",
    };
  },
  methods: {
    changeTabs(tKey) {
      this.tabs.active = tKey;
      if (tKey == 40) {
        this.initGetUploadInfo();
      }
    },
    handleMixinCacheChange() {
      this.handleMixinTestChange({
        testHttpRequest: [3, 4].includes(this.formData.orderType)
          ? getSeaTraditionDetail
          : getOrderOtherDetail,
        testParams: this.formData.id,
        testChangeKeys: ["orderStatus"],
        cacheTestData: this.formData,
      });
    },
    mixinInitData() {
      const { id } = this.$route.query;
      if (this.viewTab) {
        this.changeTabs("30");
        this["operateDetails/storeUrlTempParam"]({});
      }
      this["dictionary/getDictionary"]("tranditionTypeEn").then(() => {
        this.getDetails(id);
      });
    },
    getDetails(id) {
      if (id) {
        this.isInitRes = false;
        const { orderType: oType } = this.$route.query;
				this.title = ["海运订单", "空运订单"][oType - 3] || "其他订单";
        const httpRequest = {
          3: getSeaTraditionDetail,
          4: getSeaTraditionDetail,
          5: getOrderOtherDetail,
          6: getOrderOtherDetail,
        };
        httpRequest[oType](id).then(async ({ data = {} }) => {
          const { orderType, orderStatus, transportMode } = data;

          if (
            (orderType === 6 && this.tabs.active === "20") ||
            ([0, 11].includes(orderStatus) && this.tabs.active === "30")
          ) {
            // 上下页切换 6-报关出证无货物, 草稿/打回无费用
            this.tabs.active = "10";
          }

          const routeParams = {
            //订单获取航次信息传参
            orderId: id,
            type: orderType,
          };
          const routeData =
            [3, 4].includes(orderType) && !!data.airLineId
              ? (await getRouteByOrderId(routeParams)).data || {}
              : {};
          if ([3, 4].includes(orderType)) {
            this.formHeadConfig.lists = headCols();
          } else {
            this.formHeadConfig.lists = otherHeadCols();
          }
          // if ([3].includes(orderType)) {
          //   this.formHeadConfig.lists = seaHeadCols();
          // } else if ([4].includes(orderType)) {
          //   this.formHeadConfig.lists = airHeadCols(transportMode);
          // } else {
          //   this.formHeadConfig.lists = otherHeadCols();
          // }

          if (orderType == 3) {
            this.formConfig.lists = seaOrder({
              orderStatus,
              routeDataId: routeData.id,
            });
          } else if (orderType == 4) {
            this.formConfig.lists = airOrder({
              orderStatus,
              routeDataId: routeData.id,
              transportMode,
            });
          } else if (orderType == 5) {
            this.formConfig.lists = draftOrder(orderStatus);
          } else if (orderType == 6) {
            this.formConfig.lists = certificateOrder(orderStatus);
          }

          data.reportCustomsWay = this.typeConversion(data.reportCustomsWay);
          data.customsClearanceType = this.typeConversion(
            data.customsClearanceType
          );
          data.pickUpHome = !!data.pickUpHome;
          data.isHomeDelivery = !!data.isHomeDelivery;
          data.freightType = data.freightType || "1";

          this.formData = {
            ...data,
            code: routeData.code,
            flightName: routeData.flightName,
            sono: routeData.sono,
            name: routeData.name,
          };

          this.formConfig.formModel = {
            ...data,
            routeOrderAttachList: routeData.attachList, // 航次订舱资料
            routeResData: {
              ...routeData,
              routeOrderCodeName: `${routeData.routeCode || "--"}[${
                routeData.routeName || "--"
              }]`,
            },
          };
          if (this.tabs.active == 40) {
            this.initGetUploadInfo();
          }
          this.isInitRes = true;
        });
      } else {
        this.reBack();
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    async handleReceiving() {
      const row = this.formData;
      // console.log(row);
      let type = 4; // 接单：传统-其他
      let dicts = [];
      if ([3, 4].includes(row.orderType)) {
        await getOrderConfigList(row.id, 2).then((res) => {
          dicts = res.data || [];
          if (row.freightType == 0) {
            type = 1; // 接单：传统-整柜
          } else {
            type = 2; // 接单：传统-散货
          }
          if (row.orderType == 3) {
            row.operationOrderType = 0; // 海运操作单
          } else {
            row.operationOrderType = 1; // 空运操作单
          }
        });
      } else {
        row.operationOrderType = 2; // 其他操作单
      }
      row.bailorPeople = row.customerName;
      this.$refs.orderReceiving.show(row, type, { proxyTypeDicts: dicts });
    },
    handleSaveRemark() {
      const { id, businessRemark, orderType } =
        this.$refs.myFormRef?.getFormParams();
      // const params = {
      //   id,
      //   businessRemark,
      //   type: orderType,
      // };
      // businessRemarkSubmit(params)
      httpDictRequest(
        {
          pageRemarkNameKey: [3, 4].includes(orderType)
            ? "CTDDYWBZ"
            : "QTDDYWBZ",
          requestKey: "postAddBusinessRemark",
        },
        {
          remark: businessRemark,
          businessId: id,
        }
      ).then(() => {
        this.msgSuccess("业务备注保存成功");
      });
    },
    handleReceivingSuccess() {
      this.getDetails(this.formData.id);
    },
    handleTopClick({ type, id }) {
      if (["pre", "next", "titJump"].includes(type)) {
        this.getDetails(id);
      }
    },
    showToggle(item) {
      item.expansion = !item.expansion;
      this.formConfig.lists[0].fieldList[item.changeIndex].className =
        item.expansion ? "expansion-show" : "expansion-hide";
    },
    btnTypeTabsList() {
      let fTab = [];
      if (this.formData.orderType === 6) {
        // 报关出证无货物
        fTab.push("20");
      }
      if ([0, 11].includes(this.formData.orderStatus)) {
        // 草稿/打回无费用
        fTab.push("30");
      }
      return this.btnTabsList.filter((e) => !fTab.includes(e.key));
    },
    footerBtnList() {
      return this.footerBtn.filter((e) =>
        e.btnType ? e.btnType.includes(this.formData.orderStatus) : true
      );
    },
    initGetUploadInfo() {
      const { id, orderType } = this.formData;
      this.uploadFileTableConfig = {
        noLengthHide: true, //没有附件时隐藏table
      };
      this.uploadTableConfig = {
        onFileChange: this.uploadChange, //附件文件变动(上传删除)回调
        isAttachIdGetList: false,
        isGetUploadFileTypes: true,
        onGetFileType: "CTDD",
        show: true, //等接口数据都获取后再调用这个接口展示页面内容
        httpGetFileRequest: (result = {}) => {
          //初始化附件
          const { explains } = result;
          return getOrderAttachList({
            orderId: id,
            orderType: orderType,
            queryType: !!id ? 2 : 3,
            queryTypeList: explains,
          });
        },
        onFileChange: (arr) => {
          const { deleteAttachIdList = [] } =
            this.$refs.uploadTypeRef?.getAttachmentParams({
              isGetDeleteIds: true,
            });
          const params = [
            {
              attachDeleteIds: deleteAttachIdList,
              attachIds: arr.join(","),
              orderId: id,
              orderType: orderType,
              queryType: !!id ? 2 : 3,
            },
          ];
          updateAttachListByOrderIdNew(params).then((res) => {
            this.$refs.uploadTypeRef?.getAttachRequestFiles();
          });
        },
      };
    },
    handleCancelDelivery(row = {}) {
      const { id, orderType } = this.formConfig.formModel;
      const params = {
        orderId: id,
        orderType,
        ...row,
      };
      POSTCancelDelivery(params)
        .then((res) => {
          this.msgSuccess("取消出货成功");
          this.handleReceivingSuccess();
        })
        .catch((error) => {
          const { code } = error;
          if (code == 1002) {
            this.handleCancelDelivery({ confirm: 1 });
          }
        });
    },
    // 撤回提交
    handleWithdraw() {
      const { operationOrderId } = this.formData;
      this.withdraw().then(() => {
        operateById(operationOrderId, 1, { callbackType: 1 }).then(() => {
          this.getDetails(this.$route.query.id);
        });
      });
    },
    withdraw() {
      return new Promise((resolve) => {
        const title = "撤回提示";
        const className = "el-icon-warning text-warning";
        const msg = "撤回操作不可逆！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    handleVoid() {
      const type = 0;
      const { id, orderType, orderNum, number, operationOrderId, status } =
        this.formData;
      const obj = {
        0: "打回",
        1: "作废",
      };
      const repulseType = status === 1 ? 1 : 2;
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: obj[type],
          label: `${obj[type]}说明：`,
          message: `请输入${obj[type]}说明`,
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          const opt = {
            id,
            type: orderType,
            repulseRemark: remark,
            orderNum: orderNum || number,
            repulseType,
          };
          if (type === 0 && repulseType === 2) {
            opt.operationOrderId = operationOrderId;
          }
          return new Promise((resolve, reject) => {
            businessRepulse(opt)
              .then((res) => {
                this.getDetails(this.$route.query.id);
                resolve(res);
              })
              .catch((err) => {
                resolve();
                if (err.code === 1002) {
                  this.handleNotRepulse();
                }
              });
          });
        },
        successFunction: () => {},
      });
    },
    /** 打回失败 */
    handleNotRepulse() {
      customMessageBox(this, {
        msgTitle: "订单已有费用，无法打回",
        msgTxt1: "如需打回",
        msgTxt2: "，请先删除费用信息!",
        msgTxtColor: "#FF6767",
        showCancelButton: false,
        confirmButtonText: "关 闭",
      });
    },
    ...mapActions([
      "dictionary/getDictionary",
      "operateDetails/storeUrlTempParam",
    ]),
  },
  computed: {
    ...mapState({
      viewTab: (state) => state.operateDetails.tempUrlParam?.pageTab,
      attachType: (state) => state.dictionary.dicsData.attachType,
      attachConfig: (state) => state.dictionary.dicsData.attachConfig,
    }),
  },
};
</script>

<style lang="scss" scoped>
.order-detail-box {
  margin: 10px;
  background: #fff;
  .detail-see-form {
    /deep/ {
      .form-rows-box {
        padding: 14px 0;
        border-bottom: 1px solid #e2e2e2;
      }
      .form-rows-bottom-border {
        padding-bottom: 14px;
        border-bottom: 1px solid #e2e2e2;
      }
      .form-rows-expansion-top {
        padding-top: 14px;
      }
      .expansion-show {
        display: block;
      }
      .expansion-hide {
        display: none;
      }
      .form-rows-remark-box {
        .custom-remark .el-form-item .el-form-item__label {
          margin-top: 14px;
        }
      }
    }
  }

  .order-content {
    display: flex;
    .order-left {
      min-width: 900px;
      flex: 0 1 100%;
      padding: 0 40px 20px 20px;
    }
  }
}
</style>
