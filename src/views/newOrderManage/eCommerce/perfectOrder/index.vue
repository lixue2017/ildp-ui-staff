<template>
  <div class="app-container">
    <ComDetailTop
      :title="`补充电商信息(${formConfig.formModel.number})`"
      :formModel="formConfig.formModel"
      :config="tabConfig"
      ref="detailTopRef"
      @handleClick="reBack"
    />
    <ComForm
      class="order-from"
      :formConfig="formConfig"
      ref="myForm"
      v-if="isInitRes"
    >
      <template v-slot:consignerId="slotProps">
        <SelectContacts
          ref="consignerSelect"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            contactsType: 1,
            type: 'contacts',
          }"
          :userCustomerId="slotProps.formModel.customerId"
          fieldName="cusConsigner"
          @handleSelect="
            (item, isit) =>
              handleContactsSelect(item, slotProps.fieldItem, isit)
          "
          @handleSuccess="(data) => handleCreateSuccess(data, 'notifierSelect')"
        />
      </template>
      <template v-slot:consigneeId="slotProps">
        <SelectContacts
          ref="consigneeSelect"
          :formModel="formConfig.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            contactsType: 0,
            type: 'contacts',
          }"
          :userCustomerId="slotProps.formModel.customerId"
          fieldName="cusConsignee"
          @handleSelect="
            (item, isit) =>
              handleContactsSelect(item, slotProps.fieldItem, isit)
          "
          @handleSuccess="(data) => handleCreateSuccess(data, 'notifierSelect')"
          @handleSuccessUpLoad="handleSuccessUpLoad"
        >
          <template v-slot:clearanceType="{ request }">
            <div>
              <div
                v-if="
                  slotProps.formModel.routeCode == 8 ||
                  slotProps.formModel.routeCode == 9
                "
              >
                <div class="clearanceType-class">
                  <span
                    class="method-left"
                    :style="{ width: slotProps.fieldItem.labelWidth }"
                    >VAT：</span
                  >
                  <AutoComplete
                    ref="vatClearanceListRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      id: 'vatClearanceList',
                      placeholder: '请选择VAT',
                      multiple: true,
                      showCreate: slotProps.fieldItem.hideAdd ? false : true,
                      ...request,
                      httpRequest: (row) =>
                        request.httpRequest(row, { clearanceTypes: '1' }),
                      handleCreate: (row) =>
                        request.handleCreate(row, 'vatClearanceListRef'),
                    }"
                    defaultKey="id"
                    v-if="!slotProps.fieldItem.disable"
                  />
                </div>
                <div class="clearanceType-class">
                  <span
                    class="method-left"
                    :style="{ width: slotProps.fieldItem.labelWidth }"
                    >EORI：</span
                  >
                  <AutoComplete
                    ref="eoriClearanceListRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      id: 'eoriClearanceList',
                      placeholder: '请选择EORI',
                      multiple: true,
                      showCreate: slotProps.fieldItem.hideAdd ? false : true,
                      ...request,
                      httpRequest: (row) =>
                        request.httpRequest(row, { clearanceTypes: '2' }),
                      handleCreate: (row) =>
                        request.handleCreate(row, 'eoriClearanceListRef'),
                    }"
                    defaultKey="id"
                    v-if="!slotProps.fieldItem.disable"
                  />
                </div>
              </div>
              <div v-else class="clearanceType-class">
                <span
                  class="method-left"
                  :style="{ width: slotProps.fieldItem.labelWidth }"
                  >POA：</span
                >
                <AutoComplete
                  ref="bondClearanceListRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    id: 'bondClearanceList',
                    placeholder: '请选择POA',
                    multiple: true,
                    showCreate: slotProps.fieldItem.hideAdd ? false : true,
                    ...request,
                    httpRequest: (row) =>
                      request.httpRequest(row, { clearanceTypes: '3,4' }),
                    handleCreate: (row) =>
                      request.handleCreate(row, 'bondClearanceListRef'),
                  }"
                  defaultKey="id"
                  v-if="!slotProps.fieldItem.disable"
                />
              </div>
            </div>
          </template>
        </SelectContacts>
      </template>
      <template v-slot:notifierId="slotProps">
        <SelectContacts
          ref="notifierSelect"
          :formModel="formConfig.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            type: 'contacts',
            isCusDefault: false,
            lastChild: true,
          }"
          :userCustomerId="slotProps.formModel.customerId"
          fieldName="cusNotifier"
          @handleSelect="
            (item, isit) =>
              handleContactsSelect(item, slotProps.fieldItem, isit)
          "
          @handleSuccess="handleCreateSuccess"
        />
      </template>
      <template v-slot:tableData="slotProps">
        <MixinTable ref="mixinTableRef" :formModel="slotProps.formModel" />
      </template>
      <template v-slot:startPort="slotProps">
        <AutoComplete
          ref="startPortRef"
          :formModel="slotProps.formModel"
          :fieldItem="slotProps.fieldItem"
          :additionalParam="{
            typeList: slotProps.formModel.headTransportMode
              ? ['3', '4'].includes(slotProps.formModel.headTransportMode)
                ? 3
                : 0
              : '0,1,2,3,4',
          }"
        />
      </template>
      <template v-slot:endPort="slotProps">
        <AutoComplete
          ref="endPortRef"
          :formModel="slotProps.formModel"
          :fieldItem="slotProps.fieldItem"
          :additionalParam="{
            typeList: slotProps.formModel.headTrarensportMode
              ? ['3', '4'].includes(slotProps.formModel.headTransportMode)
                ? 3
                : 0
              : '0,1,2,3,4',
          }"
        />
      </template>
    </ComForm>
    <div class="order-footer">
      <el-button
        v-debounce
        :loading="isBtnLoading"
        type="primary"
        @click="handleClick()"
      >
        确认
      </el-button>
      <el-button @click="reBack(true)"> 关 闭 </el-button>
    </div>
  </div>
</template>
<script>
import { getECDetailNew, editEC } from "@/api/order/firstTransport.js";
import { getOrderAttachList } from "@/api/common";
import { config } from "./model";
import { mapActions, mapState } from "vuex";
import { permissionClick } from "@/utils/index.js";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";

export default {
  name: "ECPerfectOrder",
  mixins: [mixinEditCache],
  components: {
    SelectContacts: () => import("_comp/SelectContacts/newEdit"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    UploadFileTable: () => import("_comp/ComFileTable/uploadFileTable.vue"),
    MixinTable: () => import("./MixinTable"),
  },
  data() {
    return {
      permissionClick,
      tabConfig: {
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
        isAttachFileId: true,
        httpRequest: this.handleEdit, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "102px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
      currencyList: [],
      isInitRes: false,
      attIds: "",
      delIds: [],
      goodsTableLength: 0, // 货物列表
      uploadFilesOtherConfig: {},
      importType: 1,
    };
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    async mixinInitData() {
      const { id } = this.$route.query;
      await this["dictionary/getDictionary"]("orderTypeEn");
      if (id) {
        getECDetailNew(id).then(({ data = {} }) => {
          const { vatClearanceList, eoriClearanceList, bondClearanceList } =
            data;
          data.reportCustomsWay = this.typeConversion(data.reportCustomsWay);
          data.customsClearanceType = this.typeConversion(
            data.customsClearanceType
          );
          this.formConfig.formModel = {
            ...data,
            vatClearanceList: (vatClearanceList || []).map((e) => e.id),
            eoriClearanceList: (eoriClearanceList || []).map((e) => e.id),
            bondClearanceList: (bondClearanceList || []).map((e) => e.id),
            cusConsignee: {
              ...data.cusConsignee,
              cusContactsId: data.cusConsignee.id,
              id: data.cusConsignee.cusContactsMainId,
            },
            cusConsigner: {
              ...data.cusConsigner,
              cusContactsId: data.cusConsigner.id,
              id: data.cusConsigner.cusContactsMainId,
            },
            cusNotifier: data.cusNotifier && {
              ...data.cusNotifier,
              cusContactsId: data.cusNotifier.id,
              id: data.cusNotifier.cusContactsMainId,
            },
          };
          if (data.encasementWay == "0") {
            this.formConfig.formRules = config.fclFormRules;
          }
          if (data.encasementWay == "1") {
            this.formConfig.formRules = config.lclFormRules;
          }
          this.isInitRes = true;
        });
      } else {
        this.reBack();
      }
    },
    handleClick() {
      this.$refs.myForm.submitForm();
    },
    handleContactsSelect(item, fieldItem, isit) {
      const { id, showClearanceCustoms } = fieldItem;
      let obj = {};
      this.formConfig.formModel[id] = item.label;
      if (showClearanceCustoms && !isit) {
        obj = {
          vatClearanceList: [],
          eoriClearanceList: [],
          bondClearanceList: [],
        };
        this.$refs.vatClearanceListRef?.querySearchAsync();
        this.$refs.eoriClearanceListRef?.querySearchAsync();
        this.$refs.bondClearanceListRef?.querySearchAsync();
      }
      this.$refs.myForm.setFormModel({
        [id]: item.label,
        ...obj,
      });
    },
    handleCreateSuccess(data, refName) {
      if (!refName) {
        refName = !data.contactsType ? "consigneeSelect" : "consignerSelect";
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
    handleEdit(formData) {
      const {
        routeCode,
        vatClearanceList,
        eoriClearanceList,
        bondClearanceList,
        cusConsignee: cusConsigneeData,
        cusConsigner: cusConsignerData,
        cusNotifier: cusNotifierData,
        ...data
      } = formData;
      let customsClearanceId = [];
      if (routeCode == 8 || routeCode == 9) {
        if (vatClearanceList.length == 0 || eoriClearanceList.length == 0) {
          this.msgError("请选择VAT与EORI清关方式");
          return Promise.reject();
        } else {
          customsClearanceId = [...vatClearanceList, ...eoriClearanceList];
        }
      } else {
        if (bondClearanceList.length == 0) {
          this.msgError("请选择POA清关方式");
          return Promise.reject();
        } else {
          customsClearanceId = [...bondClearanceList];
        }
      }
      const freightObj = this.$refs.mixinTableRef.handleSave();
      if (!freightObj) {
        return Promise.reject();
      }
      const cusConsigner = this.$refs.consignerSelect.getData() || {};
      const cusConsignee = this.$refs.consigneeSelect.getData() || {};
      const cusNotifier = this.$refs.notifierSelect.getData() || {};
      const params = {
        ...data,
        consignerId: cusConsigner.cusContactsId, //发货人
        consigneeId: cusConsignee.cusContactsId, //收货人
        notifierId: (cusNotifier && cusNotifier.cusContactsId) || null, // 通知人
        customsClearanceId: customsClearanceId && customsClearanceId.join(","), //清关方式
        ...freightObj, // 货物列表
        forecastType: 0,
        quickOrder: data.status === 1 ? 9 : 2,
        isStaff: 2, // 员工端编辑订单
        isCompleteInfo: 1,
      };
      return editEC(params);
    },
    handleSuccess() {
      this.reBack();
    },
    handleSuccessUpLoad(row) {
      const { ref, res } = row;
      this.$refs[ref]?.querySearchAsync("", {
        addSelectVal: res?.data ? [res.data] : undefined,
      });
    },
    reBack(confirmClose) {
      this.$refs.detailTopRef?.comReBack({
        isBackTip: confirmClose,
        isBackRefresh: true,
      });
    },
    changeServiceChannelId(row) {
      const { id, value } = this.formConfig.formModel.serviceChannelId;
      let freightType;
      if (row.length) {
        //初始化
        const obj = row.filter((e) => e.id == id && e.value == value);
        freightType = obj[0]?.freightType;
      } else {
        //手动选择
        freightType = row.freightType;
      }
      this.formConfig.formModel.encasementWay = freightType;
    },
    handleChangeFileType(val) {
      if (![2, 3, "2", "3"].includes(val)) {
        this.uploadFilesOtherConfig = {
          showFileTypeArr: [],
          webEditUpload: false,
        };
      } else {
        // 根据报关方式隐藏客户报关附件
        this.uploadFilesOtherConfig = {
          webEditUpload: true,
          isGetUploadFileTypes: true,
          dicsFileType: "KHD",
          httpGetFileRequest: (row = {}) => {
            //初始化附件
            const { explains } = row;
            const { id, orderType } = this.formConfig.formModel;
            return getOrderAttachList({
              orderId: id,
              orderType: orderType,
              queryType: 1,
              queryTypeList: explains, //只查这些附件类型的附件
            });
          },
          // showFileTypeArr: ["100"],
          // webFileTypeArr: [
          //   {
          //     label: "客户报关资料",
          //     btnFileParams: {
          //       type: "100",
          //     },
          //     uploadOtherConfig: {
          //       beforeCheckCallBack: (file) => {
          //         if (!file.name.includes("报关资料")) {
          //           this.msgError(`客户报关资料文件名需要有‘报关资料’字符`);
          //           return false;
          //         }
          //       },
          //     },
          //   },
          // ],
        };
      }
    },
    getGoodsTableLength(len) {
      this.goodsTableLength = len || 0;
    },
    changeCountry(row) {
      const { id, routeCode } = row;
      this.$refs.myForm.setFormModel({
        countryId: {
          id,
        },
        routeCode: routeCode ? routeCode : "",
        vatClearanceList: [],
        eoriClearanceList: [],
        bondClearanceList: [],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../components/comStyle.scss";
.app-container {
  margin-bottom: 80px;
  /deep/ .com-detail-top {
    padding: 0;
    margin: 0 0 15px;
  }
}
</style>
