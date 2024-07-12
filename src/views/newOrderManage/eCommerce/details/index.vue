<template>
  <div class="order-detail-box">
    <ComDetailTop
      :title="/* 订单管理详情 */ `电商订单`"
      :formModel="formData"
      :titConfig="leftTopConfig"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <el-tooltip
          :content="
            formData.customerRemark ? formData.customerRemark : '暂无备注'
          "
          placement="bottom"
          popper-class="atooltip"
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
          @handleClick="handleTopClick"
        />
      </template>
    </ComDetailTop>

    <div class="order-content" v-if="isInitRes">
      <div class="order-left">
        <OrderHeadCard
          :infoData="{
            ...formData,
            orderNum: formData.number,
            viewSource: headCardIcon[formData.transportMode],
          }"
        />

        <ComForm
          class="detail-see-form"
          :formConfig="{
            ...formHeadConfig,
            formModel: formData,
          }"
        >
          <template v-slot:encasementWay="slotProps">
            <span>{{ slotProps.dicsData.nameCn }}</span>
            <el-tag
              color="#ff813d1A"
              :style="{ color: '#ff813d' }"
              size="mini"
              :hit="false"
              class="form-tag"
              v-if="
                slotProps.formModel.orderBoxInfo &&
                slotProps.formModel.encasementWay == 0
              "
              >{{ slotProps.formModel.orderBoxInfo }}</el-tag
            >
          </template>
        </ComForm>

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
          <TableInfo ref="tableRef" :formModel="formConfig.formModel" />
        </template>

        <template>
          <keep-alive>
            <!-- 切换页签缓存编辑值 -->
            <CostInfo
              v-if="['30'].includes(tabs.active)"
              ref="chargeTableRef"
              :formModel="formData"
              :extraData="{
                isBussiness: 1, //1是订单
                billingMain: formData.operateMain,
              }"
              :paramObj="{
                isWebEdit: formData.status === 10, // 可编辑状态
              }"
              title="计费信息"
              :addBtnShow="formData.status >= 10"
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
              orderId: formConfig.formModel.id,
              orderType: formConfig.formModel.orderType,
              viewSource: 'ecOrder',
              orderNumId: formConfig.formModel.id,
              orderNumType: formConfig.formModel.orderType,
              operationOrderNum: formConfig.formModel.number,
              hideTitBtn: formData.canUploadFile === 0, // 1/null: 显示上传附件，0：不显示
            }"
          /> -->
        </template>

        <template v-if="['50'].includes(tabs.active)">
          <OperationRecords
            :id="formConfig.formModel.operationOrderId || 0"
            :params="{ orderId: formConfig.formModel.id, orderType: 2 }"
          />
        </template>
        <template v-if="['60'].includes(tabs.active)">
          <VehiclesTable
            :formData="{ orderId: formConfig.formModel.id, orderType: 2 }"
          />
        </template>
      </div>

      <div>
        <OrderRightTrajectory
          :formData="formData"
          @handleMaintainGoods="handleMaintainGoods"
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
    <CostTrial ref="costTrialDialog" @handleSuccess="handleCostTrialSuccess" />
    <BusinessSubmit
      ref="businessSubmitRef"
      @handleSuccess="handleReceivingSuccess"
      @handleError="() => changeTabs('30')"
    />

    <ConfirmDialog ref="confirmDlgRef" />
  </div>
</template>
<script>
import {
  getECDetail,
  businessSubmitGather,
  getRouteByOrderId,
  businessRemarkSubmit,
  getOrderConfigList,
  operateById,
  businessRepulse,
} from "@/api/order/firstTransport.js";
import {
  getBoxSortByOperationId,
  POSTCancelDelivery,
} from "@/api/container/arrange.js";
import { eCommerceOrder, ecBasicCols } from "./model";
import { mapState, mapActions } from "vuex";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import {
  updateAttachListByOrderIdNew,
  getOrderAttachList,
} from "@/api/common.js";
import { httpDictRequest } from "@/api/performance/dictRecord.js";
import { msgBox, customMessageBox } from "@/utils/confirmBox.js";
export default {
  name: "ECommerceDetails",
  mixins: [mixinEditCache],
  components: {
    ComForm: () => import("_comp/ComForm"),
    TableInfo: () => import("./components/TableInfo"),
    CostInfo: () => import("_comp/CostInfo"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
    OrderReceiving: () => import(".././components/orderReceive"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    OrderRightTrajectory: () =>
      import("@/views/newOrderManage/components/orderTrajectory/index.vue"),
    CostTrial: () => import("./components/costTrial/index"),
    OrderHeadCard: () => import("./orderHeadCard"),
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
    BusinessSubmit: () =>
      import("@/views/newOrderManage/components/BusinessSubmit/index.vue"),
    TitOrderPageJump: () =>
      import("@/views/operateManage/components/TitPageJump/orderJump.vue"),
    VehiclesTable: () =>
      import(
        "@/views/newOrderManage/eCommerce/details/components/vehiclesTable"
      ),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  provide() {
    return {
      PROVIDECURRFILTER: true,
    };
  },
  data() {
    const label_30 = "账单信息";
    return {
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
          label: label_30,
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
        // {
        //   label: "预约信息",
        //   key: "60",
        // },
      ],
      tabs: {
        active: "10",
      },
      headCardIcon: {
        0: "oceanShipping",
        3: "airTransport",
      },

      formData: {},
      formHeadConfig: {
        labelWidth: "88px",
        lists: ecBasicCols(), // 表单渲染列表
      },
      formConfig: {
        formModel: {},
        isAttachFileId: true, // 显示航次附件
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "98px",
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
          text: "费用试算",
          btnType: [10],
          handleClick: () => {
            if (this.tabs.active === "30") {
              const { operateMain } = this.formConfig.formModel;
              this.handleCostTrial({ operateMain });
            } else {
              this.msgWarning(`请先把页签切换到${label_30}`);
            }
          },
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
          handleClick: () => this.handleReceiving("businessSubmit"),
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
    async mixinInitData() {
      if (this.viewTab) {
        this.changeTabs("30");
        this["operateDetails/storeUrlTempParam"]({});
      }
      await this["dictionary/getDictionary"]("eCommerceTypeEn");
      this.getDetails(this.$route.query.id);
    },
    handleMixinCacheChange() {
      this.handleMixinTestChange({
        testHttpRequest: getECDetail,
        testParams: this.formData.id,
        testChangeKeys: ["status"],
        cacheTestData: this.formData,
      });
    },
    changeTabs(tKey) {
      this.tabs.active = tKey;
      if (tKey == 40) {
        this.initGetUploadInfo();
      }
    },
    getDetails(id) {
      if (id) {
        this.isInitRes = false;
        getECDetail(id).then(async ({ data = {} }) => {
          if ([0, 9].includes(data.status) && this.tabs.active === "30") {
            // 草稿/打回无费用
            this.tabs.active = "10";
          }

          const routeParams = {
            //订单获取航次信息传参
            orderId: data.id,
            type: 2,
          };

          const routeData = !!data.airLineId
            ? (await getRouteByOrderId(routeParams)).data || {}
            : {};
          const sortBoxData = !!data.sortBoxId
            ? (await getBoxSortByOperationId(data.operationOrderId)).data || {}
            : {};

          this.formConfig.lists = eCommerceOrder({
            detailData: data,
            routeDataId: routeData.id,
            sortBoxDataId: sortBoxData.id,
          });
          data.reportCustomsWay = this.typeConversion(data.reportCustomsWay);
          data.pickUpHome = !!data.pickUpHome;
          data.customsClearanceType = this.typeConversion(
            data.customsClearanceType
          );

          this.formData = data;
          this.formConfig.formModel = {
            ...data,
            routeOrderAttachList: routeData.attachList, // 航次订舱资料
            routeResData: {
              ...routeData,
              routeOrderCodeName: `${routeData.routeCode || "--"}[${
                routeData.routeName || "--"
              }]`,
            },
            sortBoxResData: sortBoxData,
          };
          // console.log("formConfig", this.formConfig.formModel);
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
      const {
        id,
        orderType = 2,
        orderNum,
        number,
        operationOrderId,
        status,
      } = this.formData;
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
            type: orderType || 2,
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
    // 接单
    async handleReceiving(type) {
      const row = this.formData;
      if (type === "businessSubmit") {
        //业务提交
        const { businessRemark } = this.$refs.myFormRef?.getFormParams();
        if (row.isMainBill !== 9) {
          this.$refs.businessSubmitRef?.show({
            ...this.formData,
            businessRemark,
          });
        } else {
          const { id } = row;
          businessSubmitGather("2", id, businessRemark)
            .then(() => {
              this.handleReceivingSuccess();
            })
            .catch((error) => {
              this.changeTabs("30");
            });
        }
      } else {
        const { id } = row;
        let dicts = [];
        await getOrderConfigList(id, 1).then((res) => {
          console.log("res", res);
          dicts = res.data || [];
        });
        row.operationOrderType = row.transportType == 3 ? 1 : 0; // 1是空运，0是海运
        row.bailorPeople = row.companyNameCn;
        if (row.operationOrderType && +row.encasementWay) {
          row.proxyType = 1;
        }
        this.$refs.orderReceiving.show(row, `3-${row.encasementWay}`, {
          proxyTypeDicts: dicts,
        });
      }
    },
    handleReceivingSuccess() {
      this.getDetails(this.$route.query.id);
    },
    handleTopClick({ type, id }) {
      if (["pre", "next", "titJump"].includes(type)) {
        this.getDetails(id);
      }
    },
    handleSaveRemark() {
      const { id, businessRemark } = this.$refs.myFormRef?.getFormParams();
      // const params = {
      //   id,
      //   businessRemark,
      //   type: 2,
      // };
      // businessRemarkSubmit(params).then(() => {
      //   this.msgSuccess("备注保存成功");
      // });
      httpDictRequest(
        {
          pageRemarkNameKey: "DSDDYWBZ",
          requestKey: "postAddBusinessRemark",
        },
        {
          remark: businessRemark,
          businessId: id,
        }
      ).then(() => {
        this.msgSuccess("备注保存成功");
      });
    },
    showToggle(item) {
      item.expansion = !item.expansion;
      this.formConfig.lists[0].fieldList[item.changeIndex].className =
        item.expansion ? "expansion-show" : "expansion-hide";
    },
    handleCostTrial(row) {
      this.$refs.costTrialDialog?.show(row);
    },
    handleCostTrialSuccess(row) {
      this.$refs.chargeTableRef?.costTrial(row);
    },
    handleMaintainGoods() {
      this.$refs.tableRef?.reUpdate([0, 3]);
    },
    btnTypeTabsList() {
      if ([0, 9].includes(this.formData.status)) {
        // 草稿/打回无费用
        return this.btnTabsList.filter((e) => e.key !== "30");
      }
      return this.btnTabsList;
    },
    footerBtnList() {
      return this.footerBtn.filter((e) =>
        e.btnType ? e.btnType.includes(this.formData.status) : true
      );
    },
    initGetUploadInfo() {
      const { id, orderType } = this.formConfig.formModel;
      this.uploadFileTableConfig = {
        noLengthHide: true, //没有附件时隐藏table
      };
      this.uploadTableConfig = {
        onFileChange: this.uploadChange, //附件文件变动(上传删除)回调
        isAttachIdGetList: false,
        isGetUploadFileTypes: true,
        onGetFileType: "DD",
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
