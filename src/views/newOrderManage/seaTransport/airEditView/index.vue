<template>
  <div class="app-container">
    <ComDetailTop
      :title="`空运订单 (${formConfig.formModel.orderNum || ''})`"
      :formModel="formConfig.formModel"
      :config="tabConfig"
      ref="detailTopRef"
      @handleClick="reBack"
    />
    <ComForm
      class="order-from"
      :formConfig="{
        ...formConfig,
        ...formConfigModel(
          formConfig.formModel.transportMode,
          tradeClauseShow[formConfig.formModel.transportMode]
        ),
      }"
      ref="myForm"
      @handleChange="handleChange"
      v-if="isInitRes"
    >
      <template v-slot:consignee="slotProps">
        <SelectContacts
          ref="consigneeSelect"
          :formModel="formConfig.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            contactsType: 0,
            type: 'contacts',
          }"
          fieldName="consignee"
          :userCustomerId="formConfig.formModel.customerId || undefined"
          @handleSelect="
            (item) => handleContactsSelect(item, slotProps.fieldItem.id)
          "
          @handleSuccess="(data) => handleCreateSuccess(data, 'notifierSelect')"
        />
      </template>
      <template v-slot:shipper="slotProps">
        <SelectContacts
          ref="shipperSelect"
          :formModel="formConfig.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            contactsType: 1,
            type: 'contacts',
          }"
          fieldName="shipper"
          :userCustomerId="formConfig.formModel.customerId || undefined"
          @handleSelect="
            (item) => handleContactsSelect(item, slotProps.fieldItem.id)
          "
          @handleSuccess="(data) => handleCreateSuccess(data, 'notifierSelect')"
        />
      </template>
      <template v-slot:notifier="slotProps">
        <SelectContacts
          ref="notifierSelect"
          :formModel="formConfig.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            type: 'contacts',
            lastChild: true,
            isCusDefault: false,
          }"
          fieldName="notifier"
          :userCustomerId="formConfig.formModel.customerId || undefined"
          @handleSelect="
            (item) => handleContactsSelect(item, slotProps.fieldItem.id)
          "
          @handleSuccess="handleCreateSuccess"
        />
      </template>
      <template v-slot:tableData="slotProps">
        <MixinTable
          ref="mixinTable"
          :data="slotProps"
          :formModel="formConfig.formModel"
          v-if="formConfig.formModel"
        />
      </template>

      <!-- <template v-slot:insuranceAmount="slotProps">
          <div class="flex input-slot">
            <el-input
              v-model="slotProps.formModel.insuranceAmount"
              type="number"
              class="input-slot-left figure-type"
            />
            <el-select
              slot="append"
              v-model="formConfig.formModel.insuranceAmountCurrency"
              class="input-slot-right"
            >
              <el-option
                v-for="selectItem in unitList"
                :key="selectItem.value"
                :label="selectItem.label"
                :value="selectItem.value"
              ></el-option>
            </el-select>
          </div>
        </template> -->
      <template v-slot:slotFiles="slotProps">
        <UploadFiles
          :uploadFilesModelData="{
            filesLists: slotProps.formModel.attachList || [],
            filesIds: slotProps.formModel.attachId || '',
          }"
          :uploadFilesModelConfig="{
            isDetail: 0,
            tableShowTable: false,
          }"
          @attachIdList="getAttachId"
        />
      </template>
    </ComForm>
    <div class="order-footer">
      <el-button
        v-debounce
        :loading="isBtnLoading"
        type="primary"
        @click="handleClick(0)"
      >
        保存草稿
      </el-button>
      <el-button
        v-debounce
        :loading="isBtnLoading"
        type="primary"
        @click="handleClick(1)"
      >
        提交预报
      </el-button>
      <el-button @click="handleClose"> 关 闭 </el-button>
    </div>
  </div>
</template>
<script>
import { traditionId, putTradition } from "@/api/trandition/seaAirTransport";
import { config } from "./model";
import { mapActions, mapState, mapGetters } from "vuex";
import { permissionClick } from "@/utils/index.js";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import mixinEditOrder from "@/views/newOrderManage/components/mixinEditOrder";

export default {
  name: "EditAirTransport",
  mixins: [mixinEditCache, mixinEditOrder],
  components: {
    ComForm: () => import("_comp/ComForm"),
    SelectContacts: () => import("_comp/SelectContacts"),
    MixinTable: () => import("../components/AirMixinTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    UploadFiles: () => import("@/views/newOrderManage/components/uploadFiles"),
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
    ...mapGetters(["dictData"]),
  },
  data() {
    return {
      permissionClick,
      tabConfig: {
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
        ],
        rightBtn: [
          // 右侧按钮集合
          {
            icon: "iconfont icon-fanhui",
            text: "返回上一页",
            type: "back",
            className: "back",
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.putTradition, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "76px",
        isAttachFileId: true,
      },
      formConfigModel: config,
      // unitList: [],
      goodsTransportMode: "", //用来决定新增货物信息的时候的标题
      isInitRes: false,
      attIds: "",
      delIds: [],
      tradeClauseShow: {},
    };
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    async mixinInitData() {
      await this["dictionary/getDictionary"]("tranditionTypeEn");
      if (
        !Object.keys(this.tradeClauseShow).length &&
        this.dictData.transportMode
      ) {
        this.dictData.transportMode.forEach((item) => {
          this.tradeClauseShow[item.value] = (item.expandVal || "").split(",");
        });
      }
      this.traditionId(); //根据ID获取数据详情
    },
    traditionId() {
      traditionId(this.$route.query.id).then((res) => {
        const { transportMode, customsClearanceId, customsClearanceType } =
          res.data;

        this.goodsTransportMode = transportMode;
        this.formConfig.formModel = {
          ...res.data,
          customsClearanceId: customsClearanceId
            ? customsClearanceId
                .toString()
                .split(",")
                .map((item) => +item)
            : [],
          customsClearanceType: this.typeConversion(customsClearanceType),
          consignee: res.data.consignee && {
            ...res.data.consignee,
            cusContactsId: res.data.consignee.id,
            id: res.data.consignee.cusContactsMainId,
          },
          shipper: res.data.shipper && {
            ...res.data.shipper,
            cusContactsId: res.data.shipper.id,
            id: res.data.shipper.cusContactsMainId,
          },
          notifier: res.data.notifier && {
            ...res.data.notifier,
            cusContactsId: res.data.notifier.id,
            id: res.data.notifier.cusContactsMainId,
          },
          isHomeDelivery: res.data.isHomeDelivery ? true : false, //是否上门提货
          freightType: res.data.freightType ? res.data.freightType : "1",
          goodsTransportMode: this.goodsTransportMode,
        };
        this.isInitRes = true;
      });
    },
    getAttachId(rows, delIds) {
      this.attIds = rows.join(",");
      this.delIds = delIds;
    },
    handleClick(status) {
      if (!this.$refs.mixinTable.handleSaveCheck()) {
        return;
      }
      this.formConfig.dataStatus = status;
      this.$refs.myForm.submitForm();
    },
    putTradition(form) {
      const that = this;
      const { customsClearanceId } = this.formConfig.formModel;
      // if (!customsClearanceId.length) {
      //   this.msgError("请选择收货人与清关方式");
      //   return new Promise((resolve, reject) => {
      //     return reject();
      //   });
      // }
      const {
        customerId,
        transportMode,
        orderBusinessType,
        tradeClause,
        countryId,
        startCountryId,
        portOfLoadingId,
        destinationPortId,
        declareCurrencyId,
        insuranceAmount,
        remark,
        deleteAttachIdList,
        customsClearanceType,
        customerOrderSn,
        insured,
      } = form;
      const cusShipper = this.$refs.shipperSelect.getData() || {};
      const cusConsignee = this.$refs.consigneeSelect.getData() || {};
      const cusNotifier = this.$refs.notifierSelect.getData() || {};
      const params = {
        id: this.$route.query.id,
        customerId,
        transportMode,
        orderBusinessType,
        tradeClause,
        countryId,
        startCountryId,
        portOfLoadingId,
        destinationPortId,
        declareCurrencyId,
        insuranceAmount,
        customsClearanceType,
        insuranceAmountCurrency:
          this.formConfig.formModel.insuranceAmountCurrency,
        customsClearanceId: customsClearanceId && customsClearanceId.toString(), //清关方式
        remark,
        consigneeId: cusConsignee.cusContactsId
          ? cusConsignee.cusContactsId
          : that.formConfig.formModel.consigneeId,
        shipperId: cusShipper.cusContactsId
          ? cusShipper.cusContactsId
          : that.formConfig.formModel.shipperId,
        notifierId: (cusNotifier && cusNotifier.cusContactsId) || null,
        isHomeDelivery: this.formConfig.formModel.isHomeDelivery ? "1" : "0",
        orderType: "4",
        orderStatus: this.formConfig.dataStatus,
        attachId: this.attIds == "" ? "-1" : this.attIds,
        deleteAttachIdList: this.delIds,
        freightType: "1", //0是整柜，1是散货，空运只有散货
        customerOrderSn,
        insured: !!insured,
        forecastType: 0,
      };
      return putTradition(params);
    },
    handleSuccess() {
      this.reBack();
    },
    handleClose() {
      this.reBack("type");
    },
    reBack(type) {
      this.$refs.detailTopRef?.comReBack({
        isBackTip: type === "close",
      });
    },
    handleContactsSelect(item, key) {
      this.formConfig.formModel[key] = item.label;
      this.$refs.myForm.setFormModel({
        [key]: item.label,
      });
    },
    handleCreateSuccess(data, refName) {
      //当通知人与收货人或发货人一致时，修改其中一个会连通知人一起修改
      if (!refName) {
        refName = !data.contactsType ? "consigneeSelect" : "shipperSelect";
      }
      const cusNotifier = this.$refs[refName].getData() || {};
      if (data.id && cusNotifier.id === data.id) {
        this.$set(this.$refs[refName].contactsData, "id", data.company);
        setTimeout(() => {
          this.$refs[refName].handleSelect(data);
        }, 500);
      }
      this.$refs[refName].$refs &&
        this.$refs[refName].$refs.autoComplete &&
        this.$refs[refName].$refs.autoComplete.querySearchAsync();
    },
    handleChange(v, k) {
      if (k === "transportMode") {
        this.formConfig.formModel.transportMode = v;
        this.$refs.myForm.setFormModel({
          tradeClause: "",
        });
        this.formConfig.formModel.goodsTransportMode = v;
        this.$nextTick(() => {
          this.$refs.myForm?.renewForm();
        });
      } else if (k === "customerId") {
        this.customerConfirmBox(v);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 15px 20px;
  margin-bottom: 85px;
  .com-detail-top {
    margin: 0 0 15px;
    padding: 0;
  }
}
</style>
