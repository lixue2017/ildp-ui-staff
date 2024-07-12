<template>
  <div class="app-container">
    <ComDetailTop
      :title="`业务服务${
        formConfig.formModel.orderNum
          ? `(${formConfig.formModel.orderNum})`
          : ''
      }`"
      :formModel="formConfig.formModel"
      :config="tabConfig"
      ref="detailTopRef"
      @handleClick="reBack"
    />
    <div v-if="formConfig.lists.length">
      <ComForm
        class="order-from"
        :formConfig="formConfig"
        ref="myForm"
        @handleChange="handleChange"
      >
        <template v-slot:consignee="slotProps">
          <SelectContacts
            ref="consigneeSelect"
            :formModel="formConfig.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              contactsType: 0,
              type: 'contacts',
              lastChild: false,
              isCusDefault: false,
            }"
            fieldName="consignee"
            :userCustomerId="formConfig.formModel.customerId || undefined"
            @handleSelect="
              (item) => handleContactsSelect(item, slotProps.fieldItem.id)
            "
            @handleSuccess="
              (data) => handleCreateSuccess(data, 'notifierSelect')
            "
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
              lastChild: false,
              isCusDefault: false,
            }"
            fieldName="shipper"
            :userCustomerId="formConfig.formModel.customerId || undefined"
            @handleSelect="
              (item) => handleContactsSelect(item, slotProps.fieldItem.id)
            "
            @handleSuccess="
              (data) => handleCreateSuccess(data, 'notifierSelect')
            "
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
            v-if="
              formConfig.formModel.freightType ||
              formConfig.formModel.isHomeDelivery
            "
          />
        </template>
        <template v-slot:tbje="slotProps">
          <div class="flex input-slot">
            <el-input
              v-model="slotProps.formModel.salesVal"
              type="number"
              class="input-slot-left figure-type"
            />
            <el-select
              slot="append"
              v-model="slotProps.formModel.sales"
              class="input-slot-center"
            >
              <el-option
                v-for="selectItem in slotProps.formModel.unitList"
                :key="selectItem.value"
                :label="selectItem.key"
                :value="selectItem.value"
              ></el-option>
            </el-select>
          </div>
        </template>
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
    </div>
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
import {
  getOrderOtherDetail,
  addOtherTradition,
  putOrderOther,
} from "@/api/trandition/otherOrder";
import { mapActions, mapState } from "vuex";
import { permissionClick } from "@/utils/index.js";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import mixinEditOrder from "@/views/newOrderManage/components/mixinEditOrder";
import {getOrderAttachList } from "@/api/common.js"
export default {
  name: "EditOthers",
  mixins: [mixinEditCache, mixinEditOrder],
  components: {
    ComForm: () => import("_comp/ComForm"),
    SelectContacts: () => import("_comp/SelectContacts"),
    MixinTable: () => import("../components/MixinTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    UploadFiles: () => import("@/views/newOrderManage/components/uploadFiles"),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
      attachConfig: (state) => state.dictionary.dicsData.attachConfig,
      attachType: (state) => state.dictionary.dicsData.attachType,
    }),
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
        httpRequest: this.addOtherTradition, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        isAttachFileId: true,
        size: "small",
        labelWidth: "76px",
        lists: [], // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
        visibleAll: true,
      },
      orderId: this.$route.query.id,
      attIds: "",
      delIds: [],
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
      this.getOrderOtherDetail();
    },
    getOrderOtherDetail() {
      if (this.orderId) {
        getOrderOtherDetail(this.orderId).then((res) => {
          this.getInitUploadConfig(res?.data)
          if (res.data.customsClearanceId) {
            res.data.customsClearanceId = res.data.customsClearanceId
              .toString()
              .split(",")
              .map((item) => +item);
          } else {
            res.data.customsClearanceId = [];
          }
          this.formConfig.formModel = {
            ...res.data,
            consignee: res.data.consignee && {
              ...res.data?.consignee,
              cusContactsId: res.data.consignee?.id,
              id: res.data.consignee?.cusContactsMainId,
            },
            shipper: res.data.shipper && {
              ...res.data?.shipper,
              cusContactsId: res.data.shipper?.id,
              id: res.data.shipper?.cusContactsMainId,
            },
            notifier: res.data.notifier && {
              ...res.data.notifier,
              cusContactsId: res.data.notifier?.id,
              id: res.data.notifier?.cusContactsMainId,
            },
            isHomeDelivery: res.data.isHomeDelivery ? true : false, //是否上门提货
            freightType: res.data.freightType ? res.data.freightType : "1",
          };
          if (
            res.data.orderBusinessType === "4" ||
            res.data.orderBusinessType === "5"
          ) {
            //报关出证

            // if (res.data.orderBusinessType === "4") {
            //   this.formConfig.lists = config.dacLists;
            // } else if (res.data.orderBusinessType === "5") {
            //   this.formConfig.lists = config.icLists;
            // }
            if (res.data.orderBusinessType === "5") {
              this.formConfig.lists = config.icLists;
            } else {
              this.formConfig.lists = config.lists;
            }
          } else if (
            res.data.orderBusinessType === "2" ||
            res.data.orderBusinessType === "3"
          ) {
            //拖车
            this.formConfig.lists = config.trailerLists;
          }
          this.$refs.myForm && this.$refs.myForm.setFormModel({ ...res.data });
        });
      } else {
        this.formConfig.lists = config.lists;
        this.formConfig.formModel = {
          orderBusinessType: "4",
          customsDeclarationType: "",
          customsClearanceId: "",
        };
      }
    },
    // getAttachId(rows, delIds) {
    //   this.attIds = rows.join(",");
    //   this.delIds = delIds;
    // },
    handleClick(status) {
      const isSave = this.$refs.mixinTable
        ? this.$refs.mixinTable.beforeLeave()
        : true;
      if (isSave) {
        this.formConfig.dataStatus = status;
        this.$refs.myForm.submitForm();
      }
    },
    addOtherTradition(form) {
      var that = this;
      const {
        customerId,
        customerOrderSn,
        orderBusinessType,
        countryId,
        customsDeclarationType,
        portOfLoadingId,
        destinationPortId,
        remark,
        currencyId,
        deleteAttachIdList,
      } = form;
      var orderType; //业务类型
      var isForecast; //可预报状态，可预报为1，否则为0
      if (orderBusinessType === "2" || orderBusinessType === "3") {
        orderType = 5;
      } else {
        orderType = 6;
      }
      if (
        !this.$refs.mixinTable ||
        this.$refs.mixinTable.isHaveData().freight
      ) {
        isForecast = 1;
      } else {
        if (orderType === 5 && that.formConfig.dataStatus === 1) {
          this.$message.error("缺少货物信息，无法提交预报");
          return;
        } else if (orderType === 6) {
          isForecast = 1;
        } else {
          isForecast = 0;
        }
      }
      const { isHomeDelivery, freightType, customsClearanceId } =
        this.formConfig.formModel;
      // if (!customsClearanceId.length) {
      //   this.msgError("请选择收货人与清关方式")
      //   return new Promise((resolve, reject) => {
      //     return reject();
      //   })
      // }
      // console.log(this.formConfig.formModel);
      const cusShipper = this.$refs.shipperSelect.getData() || {};
      const cusConsignee = this.$refs.consigneeSelect.getData() || {};
      const cusNotifier = this.$refs.notifierSelect.getData() || {};
      const params = {
        customerId,
        countryId,
        orderBusinessType,
        customsDeclarationType,
        portOfLoadingId,
        destinationPortId,
        remark,
        customsClearanceId: customsClearanceId && customsClearanceId.toString(), //清关方式
        currencyId: currencyId || undefined, //清关币别
        consigneeId: cusConsignee.cusContactsId || null,
        // ? cusConsignee.cusContactsId
        // : form.consigneeId,
        shipperId: cusShipper.cusContactsId || null,
        // ? cusShipper.cusContactsId
        // : form.shipperId,
        notifierId: cusNotifier.cusContactsId || null,
        // ? cusNotifier.cusContactsId
        // : form.notifierId,
        attachId: this.attIds == "" ? "-1" : this.attIds,
        deleteAttachIdList: this.delIds,
        orderType: orderType, //这个字段不在页面上显示，但是3是海运订单，4是空运订单,5是其他订单拖车，6是其他订单报关出证
        orderStatus: this.formConfig.dataStatus, //草稿状态
        id: this.orderId,
        isHomeDelivery: isHomeDelivery ? 1 : 0,
        freightType,
        isForecast: isForecast,
        customerOrderSn,
        forecastType: 0,
      };
      // delete params.shipper;
      // delete params.consignee;
      // delete params.notifier;
      delete params.accessory;
      if (this.orderId) {
        return putOrderOther(params);
      } else {
        return addOtherTradition(params);
      }
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
    handleChange(e, type) {
      if (type === "orderBusinessType") {
        if (e === "4") {
          this.formConfig.lists = config.dacLists;
        } else if (e === "5") {
          this.formConfig.lists = config.icLists;
        }
      } else if (type === "customerId") {
        if (
          !this.formConfig.formModel.orderType ||
          this.formConfig.formModel.orderType === 6
        ) {
          this.formConfig.formModel.customerId = e;
          this.$refs.myForm.setFormModel({
            shipper: "",
            consignee: "",
            notifier: "",
          });
        } else {
          this.customerConfirmBox(e);
        }
      }
    },
    // handleChange(e, type) {
    //   console.log(e, type);
    //   if (type !== "orderBusinessType") return;
    //   if (e == 4) {
    //     const config = {
    //       span: 8,
    //       id: "customsDeclarationType",
    //       label: "报关方式：",
    //       type: "radio",
    //       basicType: "customsDeclarationType",
    //       hideList: [0],
    //     };
    //     this.$refs.myForm.setConfigLists(2, config);
    //   }
    //   if (e == 5) {
    //     const config = {
    //       span: 8,
    //       id: "currencyId",
    //       label: "清关币别：",
    //       placeholder: "-请选择-",
    //       type: "autocomplete",
    //       category: "currency",
    //     };
    //     this.$refs.myForm.setConfigLists(2, config);
    //   }
    //   this.$refs.myForm &&
    //     this.$refs.myForm.setFormModel({
    //       customsDeclarationType: "1",
    //       currencyId: "",
    //     });
    // },
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
