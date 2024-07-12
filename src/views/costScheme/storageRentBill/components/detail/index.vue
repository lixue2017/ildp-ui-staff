<template>
  <div class="app-container" v-if="showSearchForm">
    <div alt="顶部信息">
      <ComDetailTop
        :title="/*仓租日账单信息详情*/ `仓租日账单信息`"
        :formModel="formConfig.formModel"
        ref="detailTopRef"
        :config="comDetailTopConfig"
        class="margin-right-32"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{
              formConfig.formModel.customerName
                ? `(${formConfig.formModel.customerName})`
                : ""
            }}
          </span>
        </template>
      </ComDetailTop>
    </div>
    <div alt="4个卡片展示">
      <HeadCard :formModel="formConfig.formModel" :formConfig="cardConfig" />
    </div>
    <div alt="form">
      <ComForm ref="formRef" :formConfig="formConfig">
        <template v-slot:slotTable="slotProps">
          <div class="tabs">
            <div>
              <template
                v-for="(item, index) in tabsConfig.tabs"
              >
                <el-button
                  :key="index"
                  size="small"
                  plain
                  class="tabs-change"
                  :type="tabsConfig.activeName == item.name ? 'activation' : ''"
                  @click="changeTabs(item.name)"
                >
                  {{ item.label }}
                </el-button>
              </template>
            </div>
          </div>

          <div v-if="tabsConfig.activeName == '1'">
            <!-- 应收应付 -->
            <CostInfo
              ref="chargeTableRef"
              :formModel="{
                ...formConfig.formModel,
                billingMain:
                  orderSource == 3
                    ? formConfig.formModel.billCompanyId //海外仓
                    : formConfig.formModel.customerBelongCompanyId, //订单操作单
                id: formConfig.formModel.id,
                jobNo:formConfig.formModel.businessNum,
                businessType: 40,
              }"
               @handleJumpGoods="handleJumpGoods"
            />
          </div>
          <div v-if="tabsConfig.activeName == '2'">
            <!-- 货物信息 -->
            <GoodsInfo
            ref="goodsInfoRef"
              :goodsInfo="goodsInfoConfig"
              :formModel="formConfig.formModel"
              :webParams="webParams"
            />
          </div>
          <div v-if="tabsConfig.activeName == '3'">
            <!-- 附件上传 -->
            <!-- <Attachment
              ref="attachmentRef"
              :fileData="{
                id: extraData.routeId,
                attachIds: formConfig.formModel.attachIds,
              }"
              :attachmentInfo="attachmentConfig"
            /> -->

            <UploadFiles
              :fileData="{
                ...formConfig.formModel,
              }"
              :uploadFileModel="uploadFileModel"
              @attachIdList="getAttachIdList"
            >
            </UploadFiles>
          </div>
        </template>
        <template v-slot:warehouseBelongCompany="slotProps">
          <div>
            <span>{{ slotProps.formModel.warehouseBelongCompany }}</span>
            <el-tag>标签一</el-tag>
          </div>
        </template>
        <template v-slot:formSlot="slotProps">
          <div>
            <!-- 页面数据太多导致输入严重卡顿 -->
            <inputPage
              :fileData="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
            />
          </div>
        </template>
      </ComForm>
    </div>
    <template v-if="footerBtn.length > 0">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in footerBtn">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
  </div>
</template>

  <script>
import { mapActions } from "vuex";
import {
  getMonthlyBillDetail,
  updateMonthlyBill,
} from "@/api/costScheme/index.js";
import {
  cardConfig,
  formConfig,
  goodsFormInfoConfig,
  goodsTableInfoConfig,
  comDetailTopConfig,
} from "./model.js";
import {
  getHeaderTotalBill,
} from "@/api/operateRecord/customsClearance";
import { comFileDownload } from "@/utils/download.js";
import {EXPORTOrderBillListAndDetail,getMonthlyBillAttachInfos,GetListByBill} from "@/api/costScheme/index.js"
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    HeadCard: () => import("../headCard/index.vue"),
    StorageMonthlyBill: () =>
      import("_comp/CostInfo/billings/storageMonthlyBill.vue"),
    ComTabs: () => import("_comp/ComTabs"),
    GoodsInfo: () => import("../goodsInfo/index.vue"),
    // Attachment: () => import("../attachment/index.vue"),
    StorageMonthlyBill: () =>
      import("_comp/CostInfo/billings/storageMonthlyBill"),
    CostInfo: () => import("_comp/CostInfo/billings/warehouseMonthly.vue"),
    UploadFiles: () =>
      import("@/views/operateManage/components/uploadFiles/index.vue"),
      inputPage: () =>
      import("../childPage/input.vue"),
  },
  data() {
    return {
      cardConfig,
      showSearchForm: false,
      comDetailTopConfig,
      tabsConfig: {
        activeName: "1",
        // slotTabs: true,
        // handleTabsClick: (row) => {
        //   const { activeName } = this.tabsConfig;
        //   if (activeName !== 1) {
        //     this.webParams = {
        //       queryType: 1,
        //     };
        //   }
        // },
        tabs: [
          {
            label: "应收应付",
            name: "1",
          },
          {
            label: "货物信息",
            name: "2",
          },
          {
            label: "附件信息",
            name: "3",
          },
        ],
      },
      formConfig: {
        formModel: {}, // 表单数据
        httpRequest: this.addCustomer, // 表单提交接口
        className: "detail-see-form",
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "98px",
      },
      // attachmentConfig: {
      //   formConfig: attachmentInfoConfig,
      // },
      goodsInfoConfig: {
        formConfig: goodsFormInfoConfig,
        tableConfig: goodsTableInfoConfig,
      },
      // extraData: {
      //   routeId: "",
      // },
      footerBtn: [
      {
          text: "导出账单",
          type: "primary",
          handleClick: () => {
            this.exportBill()
          },
        },
        {
          text: "保存备注",
          type: "primary",
          handleClick: () => {
            this.$refs.formRef?.submitForm();
          },
        },
        {
          text: "关 闭",
          handleClick: () => {
            this.reBack();
          },
        },
      ],
      webParams: {
        queryType: 2,
      },
      isBussinessList: {
        30: 1, //海外
        31: 1,
        10: 0, //操作单
        11: 0,
        20: 0, //订单间接客户
        21: 1, //订单直接客户
      },
      //1操作单 2订单 3海外仓
      orderSource:null,
      uploadFileModel: {
        fileTypeArr: [
          {
            label: "仓租账单资料",
            fBtnParam: {
              type: "210",
            },
          },
        ],
      },
    };
  },
  created() {
    const {
      id,
      orderSource,
      isBussiness: routeIsBussiness,
      active=1
    } = this.$route.query;
    this.orderSource=orderSource
    // this.extraData.routeId = id;
    this["dictionary/getDictionary"]([
      "trueOrFalse",
      "warehouseBusinessType",
      "warehouseCustomerType",
      'stockNumType'
    ]).then(() => {
      this.tabsConfig.activeName=this.typeConversion(active,'number')
      this.getDetailsData({ id, orderSource, routeIsBussiness });
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDetailsData(row) {
      //isBussiness 从列表进入自己判断，从对账单调过来直接取路由
      this.showSearchForm = false;
      const { id, orderSource, routeIsBussiness } = row;
      let isBussiness = undefined;
      getMonthlyBillDetail(id).then(async (res) => {
        const {data:attachList}= await getMonthlyBillAttachInfos(id)//如果报错就让后端把附件列表返回到详情接口
        if (orderSource) {
          const { isDirect=undefined } = res.data||{};
          isBussiness = this.isBussinessList["" + orderSource + isDirect];
        } else {
          isBussiness = routeIsBussiness;
        }
        this.formConfig = {
          ...this.formConfig,
          formModel: {
            ...res.data,
            isBussiness,
            salesmanNameBelong:`${res.data?.salesmanName}(${res.data?.customerBelongCompany})`,
            attachList
          },
          lists: formConfig(),
        };
        this.changeCostRequest();
        this.showSearchForm = true;
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        const { orderSource } = this.$route.query;
        this.tabsConfig.activeName = "1";
        this.getDetailsData({ id, orderSource });
      }
    },
    // handleViewGoods(row) {
    //   const { queryType, businessNum, accountingTime, matchId } = row;
    //   this.webParams = {
    //     queryType,
    //     // businessNum,
    //     matchId,
    //     accountingTime,
    //   };
    //   this.tabsConfig.activeName = "2";
    // },
    addCustomer(formModel) {
      const { id, remark } = formModel;
      const params = {
        id,
        remark,
      };
      return updateMonthlyBill(params);
    },
    chengeData() {
      const { id } = this.$route.query;
      getMonthlyBillDetail(id).then((res) => {
        const { totalReceivables, totalPayable, totalReceived, totalPayabled } =
          res.data;
        // console.log();
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          totalReceivables,
          totalPayable,
          totalReceived,
          totalPayabled,
        };
      });
    },
    handleSuccess() {
      const { id, orderSource } = this.$route.query;
      this.getDetailsData({ id, orderSource });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    changeTabs(key,rows) {
      //标签切换
      if (key != 1) {
        this.webParams = {
          queryType: 1,
          tableData:rows
        };
      }
      this.tabsConfig.activeName = key;
    },
    exportBill(){
      const {id,orderSource}=this.$route.query
      const params={
        id,
        querySource:orderSource == 3 ? 2 : 1
      }
      comFileDownload(this, EXPORTOrderBillListAndDetail, params);
    },
    changeCostRequest() {
      const { id, customerBelongCompanyId,billCompanyId } = this.formConfig.formModel;
      const opt = {
        orderId: id,
        billingMain:this.orderSource == 3 ? billCompanyId : customerBelongCompanyId,
        businessType: 40,
      };
      getHeaderTotalBill(opt).then((res) => {
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          ...res.data,
        };
      });
    },
    handleJumpGoods(row){
      const {bsId}=row
      const {id}=this.formConfig.formModel
      const params={
        wmsInfoId:bsId,
        monthlyBillId:id
      }
      GetListByBill(params).then((res)=>{
        const {rows=[]}=res
        this.changeTabs(2,rows)
      })
    },
    getAttachIdList(row) {
      //附件发生更改后更新当前账单绑定附件信息
      const { id } = this.formConfig.formModel
      const params = {
        id,
        attachIds:(row||[]).join(','),
      };
      updateMonthlyBill(params)
    },
  },
};
</script>
  <style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  padding: 20px;
  .com-detail-top {
    margin-left: 0px;
    margin-right: 0px;
    padding-top: 0px;
  }
  .details-tabs-btn {
    padding-top: 15px;
  }
  .tabs {
    padding: 10px 0px;
    border-bottom: none;
    display: flex;
    align-items: center;
    border-bottom:1px solid #E2E2E2;
    i {
      color: #ff813d !important;
      opacity: 0.8;
      margin-left: 10px;
    }
    span {
      margin-left: 5px;
      color: #a5a5a5;
    }
  }
}
</style>
