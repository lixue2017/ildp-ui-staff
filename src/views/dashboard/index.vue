<template>
  <div>
    <!-- 头部 -->
    <template v-if="name === 'headOverview'">
      <PanelGroup :name="name" :compData="homeCompData[name]" />
    </template>
    <template v-else-if="name === 'operationOrderQuantity'">
      <PanelGroupOperate :name="name" :compData="homeCompData[name]" />
    </template>
    <!-- 订单待办、财务流程 -->
    <template v-else-if="['orderPending', 'financialProcess'].includes(name)">
      <DualTable
        v-if="homeCompData[name]"
        :name="name"
        :title="dualTableConfig[name].title"
        :columnConfig="dualTableConfig[name].columnConfig"
        :compData="homeCompData[name]"
        :loading="loading"
      >
        <template
          v-slot:formSlot
          v-if="name === 'financialProcess' && fpFormShow"
        >
          <ComForm
            ref="formRef"
            :formConfig="{
              ...searchFormConfig,
              formModel: homeFromData[name] || {},
              ...searchConfig('dualTable'),
            }"
            @handleChange="handleChange"
          >
          </ComForm>
        </template>
      </DualTable>
    </template>
    <!-- 电商货物信息、传统货物信息 -->
    <template v-else-if="['dsVolumeInfo', 'ctVolumeInfo'].includes(name)">
      <GoodsInfo
        :name="name"
        :title="goodsInfo[name].title"
        :queryType="goodsInfo[name].queryType"
        :labelWidth="goodsInfo[name].labelWidth"
        :compData="homeCompData[name]"
        :gross="goodsTypeObj[homeFromData[name].field]"
        :handleName="(val) => handleName(val, name)"
      >
        <template v-slot:formSlot>
          <ComForm
            ref="formRef"
            :formConfig="{
              ...searchFormConfig,
              formModel: homeFromData[name] || {},
              ...searchConfig('goodsInfo'),
            }"
            @handleChange="handleChange"
          >
          </ComForm>
        </template>
      </GoodsInfo>
    </template>
    <!-- 订单量板块 -->
    <template v-else-if="['orderQuantity'].includes(name)">
      <!-- <GatherCard
        :name="name"
        :cardConfig="gatherCardConfig()[name]"
        :showTitleValue="false"
        :compData="homeCompData[name]"
      />			 -->
      <!-- 海外操作未完结 -->
      <OverseasUnfinished :name="name" :compData="homeCompData[name]" />
    </template>
    <!-- 日常业务（我的）、日常业务（待我审） -->
    <template v-else-if="['dayBusinessMe', 'dayBusinessWaitMe'].includes(name)">
      <DayBusiness
        :title="gatherCardConfig()[name].title"
        :name="name"
        :cardConfig="gatherCardConfig(userId)[name].columns"
        :showTitleValue="gatherCardConfig()[name].showTitleValue"
        :compData="homeCompData[name]"
      />
    </template>
    <!-- 操作流程 -->
    <template v-else-if="name === 'operationProcess'">
      <!-- <ProcessList :name="name" :compData="homeCompData[name]">
        <template v-slot:formSlot>
          <ComForm
            ref="formRef"
            :formConfig="{
              ...searchFormConfig,
              formModel: homeFromData[name] || {},
              ...searchConfig('processList'),
            }"
            @handleChange="handleChange"
          >
          </ComForm>
        </template>
      </ProcessList> -->

      <!-- 进行中操作单 -->
      <OperateLoading
        :name="name"
        :compData="homeCompData[name]"
        @handleTabs="getCompInfo"
      />
    </template>
    <!-- 日实收实付 -->
    <template v-if="name === 'dayPayment'">
      <ReceiptPayment :name="name" :compData="homeCompData[name]">
        <template v-slot:formSlot>
          <ComForm
            ref="formRef"
            :formConfig="{
              ...searchFormConfig,
              formModel: homeFromData[name] || {},
              ...searchConfig('receiptPayment'),
            }"
            @handleChange="handleChange"
          >
            <template v-slot:accountId="slotProps">
              <!-- disabled: !slotProps.formModel.customerIdFromBs, -->
              <AutoComplete
                ref="accountRef"
                :formModel="slotProps.formModel"
                :fieldItem="{
                  ...slotProps.fieldItem,
                  focusLoad: true,
                  className: 'auto-dis-search',
                }"
                :additionalParam="{
                  customerId: slotProps.formModel.customerIdFromBs,
                }"
                @selectHandleChange="handleChange"
              />
            </template>
          </ComForm>
        </template>
      </ReceiptPayment>
    </template>
    <!-- 近半年未收款账单 -->
    <template v-if="name === 'halfYearUncollectedBill'">
      <UncollectedBill :name="name" :compData="homeCompData[name]">
        <template v-slot:formSlot>
          <ComForm
            ref="formRef"
            :formConfig="{
              ...searchFormConfig,
              formModel: homeFromData[name] || {},
              ...searchConfig('uncollectedBill'),
            }"
            @handleChange="handleChange"
          >
          </ComForm>
        </template>
      </UncollectedBill>
    </template>
    <!-- 快捷工具 -->
    <template v-if="name === 'shortcuts'">
      <Shortcuts
        :name="name"
        :compData="homeCompData[name]"
        @handleSelect="getCompInfo"
      />
    </template>
    <!-- 待办 -->
    <template v-else-if="name === 'backlog'">
      <TodoList :name="name" :compData="homeCompData[name]" />
    </template>
    <!-- 货量趋势 -->
    <template v-else-if="name === 'cargoVolumeTrend'">
      <GoodsTrend
        title="货量趋势"
        :name="name"
        :compData="homeCompData[name]"
        :gross="goodsTypeObj[homeFromData[name].field]"
      >
        <template v-slot:formSlot>
          <ComForm
            ref="formRef"
            :formConfig="{
              ...searchFormConfig,
              formModel: homeFromData[name] || {},
              ...searchConfig('goodsTrend'),
            }"
            @handleChange="handleChange"
          >
          </ComForm>
        </template>
      </GoodsTrend>
    </template>
    <!-- 操作待办结算 -->
    <template v-else-if="name === 'operationSettlementQuantity'">
      <PendingSettlement :name="name" :compData="homeCompData[name]" />
    </template>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import {
  gatherCardConfig,
  dualTableConfig,
  searchConfig,
  goodsType,
} from "@/views/dashboard/components/model";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
export default {
  props: {
    name: {
      type: String,
      default: "",
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    PanelGroup: () => import("@/views/dashboard/PanelGroup"), // 头部总览
    PanelGroupOperate: () => import("@/views/dashboard/PanelGroupOperate"), // 头部总览-操作员
    DualTable: () => import("@/views/dashboard/DualTable"), // 订单待办、财务流程
    GoodsInfo: () => import("@/views/dashboard/GoodsInfo"), // 电商货量信息、传统货量信息
    GatherCard: () => import("@/views/dashboard/GatherCard"), // 订单量板块
    DayBusiness: () => import("@/views/dashboard/DayBusiness"), // 日常业务（我的）、日常业务（待我审）
    ProcessList: () => import("@/views/dashboard/processList"), // 操作流程
    financialProcess: () => import("@/views/dashboard/DualTable"), // 财务流程
    ReceiptPayment: () => import("@/views/dashboard/ReceiptPayment"), // 日实收实付
    UncollectedBill: () => import("@/views/dashboard/UncollectedBill"), // 近半年未收款账单
    Shortcuts: () => import("@/views/dashboard/Shortcuts"), // 快捷工具
    TodoList: () => import("@/views/dashboard/todoList"), // 待办
    GoodsTrend: () => import("@/views/dashboard/GoodsTrend"), // 货量趋势
    // LimitationGoods: () => import("@/views/dashboard/LimitationGoods"), // 货物时效
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    OverseasUnfinished: () => import("@/views/dashboard/OverseasUnfinished"), // 海外操作未完结
    PendingSettlement: () => import("@/views/dashboard/PendingSettlement"), // 操作待办结算
    OperateLoading: () => import("@/views/dashboard/OperateLoading"), // 进行中操作单
  },
  data() {
    return {
      gatherCardConfig,
      dualTableConfig,
      searchConfig,
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: this.getCompInfo, // 表单提交接口
        successFunction: this.handleLoading,
        errorFunction: this.handleLoading,
        size: "mini",
        labelWidth: "0px",
        formRules: {}, // 表单校验规则
      },
      goodsInfo: {
        dsVolumeInfo: {
          title: "电商货物信息",
          queryType: 2,
        },
        ctVolumeInfo: {
          title: "传统货物信息",
          queryType: 3,
          labelWidth: 50,
        },
      },
      goodsTypeObj: {},
      loading: false,
      fpFormShow: false,
    };
  },
  computed: {
    ...mapGetters(["homeCompData", "homeFromData", "userId"]),
  },
  watch: {},
  created() {
    goodsType.forEach((item) => {
      this.goodsTypeObj[item.value] = item;
    });
    if (this.name === "financialProcess") {
      logisticsCustomerInfo({}).then((res) => {
        this.fpFormShow = res.total > 1;
      });
    }
  },
  methods: {
    ...mapActions(["home/getCompInfo"]),
    handleChange(val, type) {
      if (type === "field") {
        this.homeFromData[this.name].field = val;
      }
      if (type === "customerIdFromBs") {
        const { accountId } = this.$refs.formRef.getFormParams();
        if (accountId) {
          this.$refs.formRef.setFormModel({
            accountId: "",
          });
        }
      }
      this.$refs.formRef.submitForm();
    },
    getCompInfo(formModel) {
      const { selectDate, ...data } = formModel || {};
      if (selectDate) {
        const [createTimeBegin, createTimeEnd] = selectDate;
        data.createTimeBegin = createTimeBegin;
        data.createTimeEnd = createTimeEnd;
      }
      if (this.name === "operationProcess" && Array.isArray(data.type)) {
        data.type = data.type.join(",");
      }
      const param = {};
      for (let key in data) {
        (data[key] || data[key] === 0) && (param[key] = data[key]);
      }
      this.loading = true;
      return this["home/getCompInfo"]({
        paramsField: {
          [this.name]: param,
        },
      });
    },
    handleLoading() {
      this.loading = false;
    },
    handleName(val, name) {
      if (name !== "ctVolumeInfo") return val;
      const tradeClause = {
        "-1": "其他订单",
        0: "DDP",
        1: "DDU",
        2: "DAP",
        3: "CIF",
        4: "CFR",
        5: "FOB",
        6: "FCA",
      };
      return tradeClause[val] || val;
    },
  },
};
</script>
