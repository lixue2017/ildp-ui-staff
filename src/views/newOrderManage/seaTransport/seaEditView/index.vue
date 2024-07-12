<template>
  <div class="app-container">
    <ComDetailTop
      :title="`海运订单(${formConfig.formModel.orderNum})`"
      :formModel="formConfig.formModel"
      :config="tabConfig"
      ref="detailTopRef"
      @handleClick="reBack"
    />
    <ComForm
      class="order-from"
      :formConfig="{
        ...formConfig,
        ...config(tradeClauseShow[formConfig.formModel.transportMode]),
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
          v-if="
            formConfig.formModel.freightType ||
            formConfig.formModel.isHomeDelivery
          "
          :formModel="formConfig.formModel"
        />
        <!-- 有值的时候再渲染 -->
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
        <FileUploadTable
            ref="uploadTypeRef"
            :uploadTableConfig="uploadTableConfig"
            :uploadFileTableConfig="uploadFileTableConfig"
            v-if="uploadTableConfig.show"
          />
        <!-- <UploadFiles
          :uploadFilesModelData="{
            filesLists: slotProps.formModel.attachList || [],
            filesIds: slotProps.formModel.attachId || '',
          }"
          :uploadFilesModelConfig="{
            isDetail: 0,
            tableShowTable: false,
          }"
          @attachIdList="getAttachId"
        /> -->
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
import { config } from "./model";
import { mapActions, mapState, mapGetters } from "vuex";
import { traditionId, putTradition } from "@/api/trandition/seaAirTransport.js";
import { permissionClick } from "@/utils/index.js";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import mixinEditOrder from "@/views/newOrderManage/components/mixinEditOrder";
import {getOrderAttachList } from "@/api/common.js"
export default {
  name: "EditSeaTransport",
  mixins: [mixinEditCache, mixinEditOrder],
  components: {
    UploadFiles: () => import("@/views/newOrderManage/components/uploadFiles"),
    ComForm: () => import("_comp/ComForm"),
    SelectContacts: () => import("_comp/SelectContacts"),
    MixinTable: () => import("../components/SeaMixinTable"),
    ComUpload: () => import("_comp/ComUpload"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
      attachConfig: (state) => state.dictionary.dicsData.attachConfig,
      attachType: (state) => state.dictionary.dicsData.attachType,
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
      config,
      formConfig: {
        formModel: {},
        dataStatus: 0,
        httpRequest: this.putTradition, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        isAttachFileId: true,
        // httpRequest: traditionId,
        labelWidth: "76px",
      },
      // unitList: [],
      isInitRes: false,
      attIds: "",
      delIds: [],
      tradeClauseShow: {},
      uploadTableConfig:{
        show:false
      },
      uploadFileTableConfig:{},
      queryTypeList:""
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
      const { id } = this.$route.query;
      this.traditionId(id);
    },
    traditionId(id) {
      this.isInitRes = false;
      traditionId(id).then((res) => {
        const { customsClearanceId, customsClearanceType } = res.data;
        this.getInitUploadConfig(res?.data)
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
        };
        this.isInitRes = true;
        // console.log(1111, res.data);
        // this.$refs.myForm?.setFormModel({ ...res.data });
      });
    },
    putTradition(form) {
      const {
        isHomeDelivery,
        freightType,
        customsClearanceId,
        insuranceAmountCurrency,
      } = this.formConfig.formModel;
      const {
        customerId,
        transportMode,
        orderBusinessType,
        tradeClause,
        countryId,
        portOfLoadingId,
        destinationPortId,
        declareCurrencyId,
        insuranceAmount,
        remark,
        deleteAttachIdList,
        customsClearanceType,
        customerOrderSn,
        insured,
        attachId,
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
        portOfLoadingId,
        destinationPortId,
        declareCurrencyId,
        insuranceAmount,
        insuranceAmountCurrency,
        remark,
        customsClearanceType,
        customsClearanceId: customsClearanceId && customsClearanceId.toString(), //清关方式
        consigneeId: cusConsignee.cusContactsId
          ? cusConsignee.cusContactsId
          : form.consigneeId,
        shipperId: cusShipper.cusContactsId
          ? cusShipper.cusContactsId
          : form.shipperId,
        notifierId: (cusNotifier && cusNotifier.cusContactsId) || null,
        isHomeDelivery: isHomeDelivery ? 1 : 0,
        orderType: "3",
        freightType,
        orderStatus: this.formConfig.dataStatus,
        attachId: this.attIds == "" ? "-1" : this.attIds,
        deleteAttachIdList: this.delIds,
        customerOrderSn,
        insured: !!insured,
        forecastType: 0,
      };
      return putTradition(params);
    },
    handleClick(status) {
      if (!this.$refs.mixinTable.handleSaveCheck()) {
        return;
      }
      this.formConfig.dataStatus = status;
      this.$refs.myForm.submitForm();
    },
    handleSuccess() {
      this.reBack();
    },
    // getAttachId(rows, delIds) {
    //   this.attIds = rows.join(",");
    //   this.delIds = delIds;
    // },
    handleClose() {
      this.reBack("type");
    },
    reBack(type) {
      this.$refs.detailTopRef?.comReBack({
        isBackTip: type === "close",
      });
    },
    updateTable(tab) {
      const activeName = tab || this.tabsConfig.activeName;
      this.$refs[`tableConfig${+activeName}`][0].refreshTable(true).then(() => {
        if (this.parentId) {
          this.$refs[`expandTable${+this.parentId}`][0].refreshTable(true);
          this.parentId = 0;
        }
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
    handleChange(val, prop) {
      if (prop === "customerId") {
        this.customerConfirmBox(val);
      } else if (prop === "transportMode") {
        this.formConfig.formModel.transportMode = val;
        this.$refs.myForm.setFormModel({
          tradeClause: "",
        });
        this.$nextTick(() => {
          this.$refs.myForm.renewForm();
        });
      }
    },
    async getInitUploadConfig(row) {
      //explains：查看权限   expandVal：上传权限
      const { expandVal, explains } = this.attachConfig.find(
        (e) => e.nameEn == "CTDD"
      );
      this.queryTypeList=explains;
      const {attachList,attachId} = await this.getUploadFiles(row);
      this.attIds=attachId
      // let webFileTypeArr = [];
      // this.attachType.map((e) => {
      //   const { nameCn = undefined, value = undefined } = e || {};
      //   if (expandVal.split(",").includes(value)) {
      //     webFileTypeArr.push({
      //       label: nameCn,
      //       btnFileParams: {
      //         type: value,
      //       },
      //     });
      //   }
      // });
      // const delShowFileRowType=((expandVal || []).split(",")).map(Number)
      this.uploadFileTableConfig = {
        ...this.uploadFileTableConfig,
        delShowFileRowType:(expandVal.split(',')).map(Number), //可以删除哪些类型的附件，从接口动态获取
      };
      // const showFileTypeArr=(expandVal || []).split(",")
      this.uploadTableConfig = {
        ...this.uploadTableConfig,
        // showFileTypeArr, //从接口动态获取
        // webFileTypeArr, //从接口动态获取
        attachList,
        onFileChange: this.uploadChange, //附件文件变动(上传删除)回调
        isAttachIdGetList: false,
        isGetUploadFileTypes:true,
        onGetFileType:'CTDD',
        show:true,
      };
    },
    async getUploadFiles(row) {
      //获取附件列表
      const {id,orderType,orderNum,sortBoxDone}=row||this.formConfig.formModel
      const params = {
        orderId: id,
        orderType: orderType,
        viewSource: 'trOrder',
        orderNumId: id,
        orderNumType: orderType,
        operationOrderNum: orderNum,
        hideTitBtn: !!sortBoxDone === 1,
        queryType: !!id ? 2 : 3,
        queryTypeList:this.queryTypeList
      };
      const { data } = await getOrderAttachList(params);
      return {
        attachId:(data.map((e)=>e.id)).join(','),
        attachList:data
      };
    },
    async uploadChange(rows){
      let {attachId=undefined}=this.formConfig.formModel
      const attachIds=attachId?(attachId.split(',')).map(Number):[]
      this.delIds=attachIds.filter((e)=>!rows.includes(e))
      this.attIds = rows.join(",");
      this.$refs.uploadTypeRef?.getAttachListFiles({attachId:this.attIds});
    }
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
