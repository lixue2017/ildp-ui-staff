<template>
  <div class="operate-details" v-if="isInitRes">
    <div class="operate-content">
      <ComDetailTop
        :title="/* 其他详情 */ '操作单信息'"
        :formModel="initInfo"
        :config="topConfig"
        ref="detailTopRef"
        @handleClick="handleTopClick"
        v-if="veryList.operateDetail"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{
              veryList.operateDetail.customerShortName
                ? `(${veryList.operateDetail.customerShortName})`
                : ""
            }}
          </span>
        </template>

        <template v-slot:titContentSlot>
          <TitPageJump
            :titSelectData="initInfo"
            @handleClick="handleTopClick"
          />
        </template>
      </ComDetailTop>
      <div class="flex">
        <div class="order-left">
          <div class="top-box">
            <ComCard
              v-if="basicInfoConfig.formModel.id"
              :initInfo="{
                ...basicInfoConfig.formModel,
                ...veryList.operateDetail,
              }"
            />

            <div class="tabs">
              <template v-for="item in tabColumns()">
                <el-button
                  size="small"
                  plain
                  :key="item.key"
                  class="tabs-change"
                  :type="item.key === tabs.active ? 'activation' : ''"
                  @click="changeTabs(item.key)"
                >
                  <!-- v-if="showTabs(item)" -->
                  {{ item.label }}
                </el-button>
              </template>
            </div>
          </div>

          <!-- 基本信息 -->
          <div v-show="tabs.active === 1">
            <ComForm
              class="basic-info"
              ref="basicInfoForm"
              :formConfig="basicInfoConfig"
              v-if="
                Object.keys(dictionary.dicsData).length &&
                basicInfoConfig.formModel.id
              "
            >
              <template v-slot:expansion="slotProps">
                <span
                  @click="showToggle(slotProps.fieldItem)"
                  class="expansion-btn"
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
          <!-- 货物信息 -->
          <div v-if="tabs.active === 2">
            <!-- <TableInfo
              ref="tableRef"
              :formModel="{
                ...basicInfoConfig.formModel,
                orderId: initInfo.orderId,
                orderType: initInfo.orderType,
              }"
            /> -->
            <TableInfo
              ref="tableRef"
              :formModel="{
                ...basicInfoConfig.formModel,
                orderId: initInfo.orderId,
                operationOrderId: initInfo.id,
                operationOrderNum: initInfo.operationOrderNum,
                orderType: initInfo.orderType,
                bailorPeople: initInfo.bailorPeople,
                createTime: initInfo.createTime,
                freightType: initInfo.freightType,
              }"
              @tableList="handleVeryList"
              @handleTraditionGoods="
                () =>
                  handleOperateSuccess() /* 改变货物报关方式，需要更新节点 */
              "
            />
          </div>
          <!-- 拖车信息 -->
          <div v-if="tabs.active === 3">
            <operateTrailerInfo :operateId="initInfo.id" />
          </div>
          <!-- 报关信息 -->
          <div v-if="tabs.active === 4">
            <ComForm
              ref="customClear"
              class="custom-info"
              :formConfig="customsConfig"
              v-if="Object.keys(dictionary.dicsData).length"
            >
              <template v-slot:exportInfo="slotProps">
                <div v-if="slotProps.formModel.id">
                  <span class="mark-icon green-mark">
                    {{ slotProps.dicsList[0].label }}
                  </span>
                  <span class="mark-icon blue-mark">
                    {{
                      dictionary.dicsData.freightType &&
                      dictionary.dicsData.freightType[
                        slotProps.formModel.freightType
                      ] &&
                      dictionary.dicsData.freightType[
                        slotProps.formModel.freightType
                      ].nameCn
                    }}
                  </span>
                </div>
                <div v-else>--</div>
              </template>
              <template v-slot:accessory>
                <ComUpload
                  :uploadConfig="customsConfig.uploadConfig"
                  v-if="customsConfig.uploadConfig.fileList.length"
                >
                </ComUpload>
                <span v-else>--</span>
              </template>
            </ComForm>
          </div>
          <!-- 账单信息 -->
					<template v-if="mixinDetailCacheTabList.includes(5)">
            <CostInfo
							v-show="tabs.active === 5"
              ref="chargeTableRef"
              :formModel="{
                ...initInfo,
                webViewSource:'ecTradOther',
              }"
              :paramObj="{
                businessType: '0,2',
              }"
              :extraData="{
                billingMain: initInfo.operateMain,
              }"
            />
          </template>
          <!-- 附件信息 -->
          <div v-if="tabs.active === 10&&uploadTableConfig.show">
            <FileUploadTable
              ref="uploadTypeRef"
              :uploadTableConfig="uploadTableConfig"
              :uploadFileTableConfig="uploadFileTableConfig"
            />
            <!-- <ComAttachTable
              :paramObj="{
                operationOrderId: initInfo.id,
                orderNumId: initInfo.orderId,
                orderNumType: initInfo.orderType,
                operationOrderNum: initInfo.operationOrderNum,
              }"
              :uploadFileModel="
                operationalInsuranceFile({
                  operationOrderId: initInfo.id,
                })
              "
            /> -->
          </div>
          <!-- 操作记录 -->
          <div v-if="tabs.active === 11">
            <OperationRecords
              :id="initInfo.id || 0"
              :params="{
                orderId: initInfo.orderId,
                orderType: initInfo.orderType,
              }"
            />
          </div>
        </div>
        <div class="order-right">
          <ComOperate
            ref="operateDetail"
            v-if="veryList.operateDetail"
            :listData="{ ...veryList }"
            :basicData="{
              ...basicInfoConfig.formModel,
              operationOrderId: initInfo.id,
            }"
            :selectionRows="selectionRows"
            :orderStatus="initInfo.operationOrderStatus"
            @handleSuccess="handleOperateSuccess"
            @handleAddBill="addBill"
          />
        </div>
      </div>
    </div>

    <!-- <template v-if="getFootBtn().length > 1">
			<div class="footer-seize-seat"></div>
			<div class="order-footer">
				<template v-for="(btn, index) in getFootBtn()">
					<el-button :type="btn.type" @click="btn.handleClick" :key="index">
						{{ btn.text }}
					</el-button>
				</template>
			</div>
		</template> -->

    <!-- 新增、编辑账单 -->
    <BillEditDialog
      ref="billEditDialog"
      @handleSuccess="handleBillSuccess"
      :appendToBody="true"
    />
    <OrderSubmit ref="OrderSubmit" @handleSuccess="handleOrderSubmitSuccess" />
  </div>
</template>
<script>
import {
  tabsConfig,
  draftInfo,
  certificateInfo,
  basicInfoConfig,
  cardConfig,
  customsConfig,
} from "./model";
import { defaultTextParams } from "_comp/ComUpload/model";
import { mapActions, mapState } from "vuex";
import commonMixin from "@/utils/mixin";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { getOrderOtherDetail } from "@/api/trandition/otherModel";
import { getCustomInfo } from "@/api/operateManage/details.js";
import { getTakeOrders } from "@/api/operateManage/common";
import mixinOperationDetail from "../../components/mixinOperationDetail";
import {getOrderAttachList,updateAttachListByOrderIdNew} from "@/api/common.js"
const formConfig = {
  formModel: {},
  httpRequest: () => {}, // 表单提交接口
  successFunction: () => {}, // 表单提交成功回调
  size: "small",
  labelWidth: "90px",
  formRules: {}, // 表单校验规则
  visibleAll: true,
};
export default {
  // name: "OtherDetails",
  mixins: [commonMixin, mixinOperationDetail, mixinEditCache],
  components: {
    ComUpload: () => import("_comp/ComUpload"),
    ModulsTitle: () => import("@/components/ModulsTitle"),
    // TableInfo: () => import("./components/TableInfoOld"),
    TableInfo: () => import("@/views/operateManage/components/TableInfo"),
    ComCard: () =>
      import("@/views/operateManage/components/CardOrder/index.vue"),
    BillEditDialog: () =>
      import(
        "@/views/settlementManage/statementManage/billDetailed/components/EditDialog"
      ),
    // chargeInfo: () =>
    //   import("@/views/operateManage/components/chargeInfo/index.vue"),
    CostInfo: () => import("_comp/CostInfo"),
    operateTrailerInfo: () =>
      import("@/views/operateManage/components/TrailerInfo/index.vue"), // 拖车信息
    OrderSubmit: () =>
      import("@/views/newOrderManage/components/OrderSubmit/index.vue"),
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  provide() {
    return {
      PROVIDECURRFILTER:true,
    };
  },
  data() {
    const accessoryConfig = {
      ...defaultTextParams,
      fileList: [],
      disabled: true,
    };
    return {
      initInfo: {},
      orderList: [],
      cardConfig,
      tabs: tabsConfig,
      basicInfoConfig: {
        ...formConfig,
        lists: basicInfoConfig.lists,
      },
      customsConfig: {
        ...formConfig,
        lists: customsConfig.lists,
        uploadConfig: {
          ...accessoryConfig,
        },
      },
      opts: {
        5: {
          config: draftInfo,
        },
        6: {
          config: certificateInfo,
        },
      },
      veryList: {},
      selectionRows: [], //对账管理中所选择的对账信息
      isInitRes: false,
      uploadTableConfig:{
        show:false,
      },
      uploadFileTableConfig:{},
    };
  },
  created() {
    this["dictionary/getDictionary"]("operateDetails");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDetails(id, type) {
      const {active=1}=this.$route.query
      this.tabs.active=this.typeConversion(active,'number')
      this.isInitRes = false;
      this.mixinDetailCacheTabList = []; // 重置
      this.basicInfoConfig.formModel = {};
      // console.log("headerInfo", this.initInfo);
      getTakeOrders(id).then((res) => {
        this.initInfo = res.data;
        const operateDetail = res.data;
        this.veryList = {
          ...this.veryList,
          operateDetail,
        };
				this.mixinDetailCacheTabList = [this.tabs.active];
        this.isInitRes = true;
        const { orderId, id: operateId } = operateDetail;
        Promise.all([
          getOrderOtherDetail(orderId),
          getCustomInfo({ operationOrderId: operateId }),
        ]).then(([basicInfo, customInfo]) => {
          this.$refs.operateDetail.getData(operateId);
          //基本信息
          this.veryList = {
            ...this.veryList,
            basicInfo: basicInfo.data,
            customInfo: customInfo.data,
          };
          const { data } = basicInfo;
          if (data.customsClearanceId) {
            data.customsClearanceId = data.customsClearanceId
              .split(",")
              .map((item) => +item);
          } else {
            data.customsClearanceId = [];
          }
          data.reportCustomsWay = data.reportCustomsWay + "";
          data.pickUpHome = data.pickUpHome ? true : false;
          data.isHomeDelivery = data.isHomeDelivery ? true : false;
          data.freightType = data.freightType ? data.freightType : "1";
          const models = {
            ...data,
            orderRemark: data.remark,
            operationRemark: this.initInfo.operationRemark,
            insureNo: res.data.insureNo,
          };
          this.basicInfoConfig.formModel = models;
          this.$refs.basicInfoForm &&
            this.$refs.basicInfoForm.setFormModel(models);
          //报关信息
          const customData = customInfo.data || {};
          // console.log("customInfo", customData);
          this.customsConfig.uploadConfig.fileList =
            customData.attachList || [];
          this.customsConfig.formModel = customData;
          this.$refs.customClear &&
            this.$refs.customClear.setFormModel(customData);
        });
      });
    },
    reBack() {
      this.$router.push(`/operateManage/otherOperate`);
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next" || type === "titJump") {
        // this.tabs.active = 1;
        this.getDetails(id);
      }
    },
    mixinInitData(cacheObj = {}) {
      if (!cacheObj.goRefreshBackPage) {
        this.tabs.active = 1;
      }
      const { id } = this.$route.query;
      if (!id) {
        this.reBack();
        return;
      }
      this.getDetails(id);
    },
    changeTabs(key) {
      this.tabs.active = key;
      if(key==10){
        this.initGetUploadInfo()
      }
			this.mixinDetailCacheTabList.push(key);
    },
    initGetUploadInfo() {
      const {id,orderId,orderType}=this.initInfo
      this.uploadFileTableConfig = {
          noLengthHide: false, //没有附件时隐藏table
        };
      this.uploadTableConfig = {
        show:true,
        webEditUpload: true,
        isGetUploadFileTypes:true,
        onGetFileType:'CTCZD',
        isAttachIdGetList: false,
        onFileChange: (arr) => {
          const {deleteAttachIdList=[]}=this.$refs.uploadTypeRef?.getAttachmentParams({isGetDeleteIds:true});
          const params=[{
            attachDeleteIds: deleteAttachIdList,
            attachIds: arr.join(','),
            orderId:id,
            orderType: 1,//1操作订单ID    2 电商头程订单ID  3传统订单id    4其他订单id   如果传1 orderId取操作单ID，否则取订单ID
            queryType: 3,
          }]
          updateAttachListByOrderIdNew(params).then((res)=>{
            this.$refs.uploadTypeRef?.getAttachRequestFiles()
          })
        },
        httpGetFileRequest: (result = {}) => {
          //初始化附件
          const { explains } = result;
          return getOrderAttachList({
            orderId: orderId,
            operationOrderId:id,
            orderType: orderType,
            queryType: !!orderId ? 2 : 3,
            queryTypeList:explains,
          });
        },
      };
    },
    showToggle(item) {
      item.expansion = !item.expansion;
      this.basicInfoConfig.lists[0].fieldList[item.changeIndex].className =
        item.expansion ? "expansion-show" : "expansion-hide";
    },
    getMarkIconColor(dics) {
      return dics && dics.color;
    },
    // 核实数据回调
    handleVeryList(data) {
      this.veryList = {
        ...this.veryList,
        ...data,
      };
    },
    handleOperateSuccess() {
      const { id } = this.$route.query;
      this.getDetails(id);
    },
    // 新增账单
    addBill() {
      const {
        operationOrderNum: orderNum,
        id: orderId,
        deptId,
        accMain: billingMain,
        customerName: dealingsCompanyName,
        customerId: dealingsCompanyId,
      } = this.initInfo;
      this.$refs.billEditDialog.show({
        businessType: 0, //0操作单 1订舱单 2拼柜单 3清关单 4订单
        orderId, //订单id
        orderNum, //订单号
        deptId,
        billingMain,
        dealingsCompanyId,
        dealingsCompanyName,
      });
    },
    // 编辑账单
    handleUpdateBill(row) {
      const {
        operationOrderNum: orderNum,
        id: orderId,
        deptId,
        accMain: billingMain,
      } = this.initInfo;
      this.$refs.billEditDialog.show({
        ...row,
        businessType: 0, //0操作单 1订舱单 2拼柜单 3清关单 4订单
        orderId, //订单id
        orderNum, //订单号
        deptId,
        billingMain,
      });
    },
    // 账单添加编辑成功回调
    handleBillSuccess() {
      this.$refs.chargeTableRef?.refreshTable();
    },
    createdBill(rows) {
      //获取用户选择的对账信息
      this.selectionRows = rows;
    },
    // showTabs(item) {
    //   const { orderBusinessType } = this.basicInfoConfig.formModel;
    //   const { freightType } = this.veryList.operateDetail || {};
    //   const { orderType } = this.initInfo;
    //   const isOne = orderType == 5 || (orderType == 6 && item.key != 2);
    //   let isTwoArr = [];
    //   if (orderBusinessType == 2) {
    //     // 仅拖车-2： 不显示“报关”页签
    //     isTwoArr = [4];
    //   }
    //   if (orderBusinessType == 4) {
    //     // 仅报关-4：不显示”货物” & “拖车信息”
    //     isTwoArr = [2, 3];
    //   }
    //   if (orderBusinessType == 5) {
    //     // 仅出证-5：不显示”货物” & “拖车信息”&“报关信息”
    //     isTwoArr = [2, 3, 4];
    //   }
    //   if (freightType !== "0") {
    //     // FCL整柜才显示拖车
    //     isTwoArr.push(3);
    //   }
    //   return isOne && !isTwoArr.includes(item.key);
    // },
    tabColumns() {
      const { orderBusinessType } = this.basicInfoConfig.formModel;
      const { freightType } = this.veryList.operateDetail || {};
      const { orderType } = this.initInfo;
      let filterTabs = [];
      if (orderBusinessType == 2) {
        // 仅拖车-2： 不显示“报关”页签
        filterTabs = [4];
      }
      if (orderBusinessType == 4) {
        // 仅报关-4：不显示”货物” & “拖车信息”
        filterTabs = [2, 3];
      }
      if (orderBusinessType == 5) {
        // 仅出证-5：不显示”货物” & “拖车信息”&“报关信息”
        filterTabs = [2, 3, 4];
      }
      if (freightType !== "0") {
        // FCL整柜才显示拖车
        filterTabs.push(3);
      }
      if (orderType == 6) {
        filterTabs.push(2);
      }
      if (filterTabs.includes(this.tabs.active)) {
        this.tabs.active = 1;
      }
      return this.tabs.columns.filter((e) => !filterTabs.includes(e.key));
    },
  },
};
</script>

<style lang="scss" scoped>
.operate-details {
  background: #f9f9f9;
  /deep/ {
    .el-radio {
      margin-right: 10px;
    }
    .form-title-1 {
      display: flex;
      flex-direction: column;
      &::before {
        display: inline-block;
        content: "";
        width: calc(100% - 12px);
        height: 1px;
        // background-color: #e2e2e2;
        margin-bottom: 14px;
      }
    }
    .el-form-item__label {
      color: #8b8b8b;
    }
    .el-form-item__content {
      color: #515151;
    }
    .border-bottom-solid {
      margin-bottom: 0;
    }
    .border-top-solid {
      &::before {
        margin-top: 14px;
        margin-bottom: 10px;
      }
    }
    .select-contacts {
      &.lastChild {
        padding-bottom: 10px;
      }
    }
    .expansion-btn {
      display: flex;
      color: #5094ff;
      align-items: center;
    }
    .expansion-show {
      display: block;
    }
    .expansion-hide {
      display: none;
    }
    .mark-icon {
      border-radius: 12px;
      padding: 2px 11px;
      font-size: 12px;
      margin-right: 5px;
      border: 1px solid #66a5ff;
      color: #66a5ff;
    }
    .blue-mark {
      border: 1px solid #66a5ff;
      color: #66a5ff;
    }
    .green-mark {
      border: 1px solid #35d06f;
      color: #35d06f;
    }
    .shipper-address {
      float: left;
      line-height: 20px;
      margin-top: 5px;
    }
    .mark-info {
      margin-top: -10px;
    }
    .trailer-info {
      margin-bottom: 20px;
    }
    .title-show {
      .form-title-1 {
        display: block;
      }
    }
    .title-hide {
      .form-title-1 {
        display: none;
      }
    }
  }
  // content
  .operate-content {
    min-height: calc(100vh - 108px);
    margin: 10px;
    background: #fff;
    .flex {
      display: flex;
      .order-left {
        min-width: 900px;
        flex: 0 1 100%;
        padding: 0 20px 114px;
        .detail-card {
          display: flex;
          justify-content: space-between;
          & > div {
            display: flex;
            align-items: center;
            padding: 19px 26px 19px 12px;
            margin-right: 13px;
            .iconfont {
              font-size: 35px;
              margin-right: 10px;
            }
            .label {
              font-size: 12px;
              margin-bottom: 6px;
            }
            .value {
              font-size: 16px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          & > div:nth-of-type(1),
          & > div:nth-of-type(2) {
            padding-right: 12px;
          }
          .card-addr {
            flex: 1;
            font-size: 15px;
            .value {
              display: flex;
              width: 100%;
              justify-content: flex-start;
              align-items: center;
              font-size: 16px;
              font-weight: 500;
            }
            .line {
              width: 21px;
              height: 1px;
              border-bottom: 1px #5094ff dashed;
              margin: 0 5px;
            }
            .order-no {
              display: flex;
              flex-direction: column;
            }
            .order-label {
              font-size: 12px;
            }
          }
        }
        .tabs {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          // margin: 14px 0;
          padding: 14px 0;
          // border-bottom: 1px solid #e2e2e2;
          // .tabs-btn {
          //   color: #515151;
          //   &:hover,
          //   &:focus {
          //     color: #5094ff;
          //   }
          //   &.isActive {
          //     color: #5094ff;
          //     border-color: #5094ff;
          //   }
          // }
        }

        /deep/ .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
