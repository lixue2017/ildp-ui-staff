<template>
  <ComDialog
    class="order-dialog"
    ref="customDialog"
    :customDialog="customDialogConfig"
  >
    <template v-slot:content>
      <ComForm
        :formConfig="formConfig"
        ref="dialogForm"
        @handleChange="handleChange"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:shipper="slotProps">
          <SelectContacts
            ref="shipperSelect"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              contactsType: 1,
              type: 'contacts',
            }"
            fieldName="shipper"
            :userCustomerId="slotProps.formModel.customerId || undefined"
            @handleSelect="
              (item) => handleContactsSelect(item, slotProps.fieldItem.id)
            "
            @handleSuccess="
              (data) => handleCreateSuccess(data, 'notifierSelect')
            "
          />
        </template>
        <template v-slot:consignee="slotProps">
          <SelectContacts
            ref="consigneeSelect"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              contactsType: 0,
              type: 'contacts',
            }"
            fieldName="consignee"
            :userCustomerId="slotProps.formModel.customerId || undefined"
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
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              type: 'contacts',
              isCusDefault: false,
            }"
            fieldName="notifier"
            :userCustomerId="slotProps.formModel.customerId || undefined"
            @handleSelect="
              (item) => handleContactsSelect(item, slotProps.fieldItem.id)
            "
            @handleSuccess="handleCreateSuccess"
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
        <template v-slot:remark="slotProps">
          <div class="form-remark">
            <span>订单备注</span>
            <el-input
              type="textarea"
              v-model="slotProps.formModel.remark"
              :placeholder="slotProps.fieldItem.placeholder"
              :maxlength="slotProps.fieldItem.maxlength"
              :rows="3"
              show-word-limit
              resize="none"
            />
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { addOtherTradition } from "@/api/trandition/otherOrder";
import { config } from "./model";
export default {
  props: {},
  components: {
    ComForm: () => import("_comp/ComForm"),
    SelectContacts: () => import("_comp/SelectContacts"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      customDialogConfig: {
        title: "业务服务",
        width: "1120px",
        useFooter: "footer",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "补充货物信息",
            type: "primary",
            handleClick: this.handleSubmit,
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "76px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
    };
  },
  methods: {
    addCustomer(form) {
      console.log(this.formConfig);
      console.log(form);
      const cusShipper = this.$refs.shipperSelect.getData() || {};
      const cusConsignee = this.$refs.consigneeSelect.getData() || {};
      const cusNotifier = this.$refs.notifierSelect.getData() || {};
      const params = {
        ...form,
        shipperId: cusShipper.cusContactsId,
        consigneeId: cusConsignee.cusContactsId,
        notifierId: (cusNotifier && cusNotifier.cusContactsId) || null,
        orderType: "5", //这个字段不在页面上显示，但是3是海运订单，4是空运订单,5是其他订单拖车，6是其他订单报关出证
        freightType: "0", //默认lcl
        orderStatus: "0", //草稿状态
        isForecast: "0",
      };
      delete params.shipper;
      delete params.consignee;
      delete params.notifier;
      delete params.customsClearanceId;
      return addOtherTradition(params).then((res) => {
        this.addReturnId = res.data;
        return;
      });
    },
    show() {
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.hide();
      this.$router.push({
        path: "/newOrderManage/editOtherTransport",
        query: {
          id: this.addReturnId,
          backPath: this.$route.path,
        },
      });
    },
    handleSubmit() {
      this.$refs.dialogForm.submitForm();
    },
    handleContactsSelect(item, key) {
      this.$refs.dialogForm.setFormModel({
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
        this.$refs.dialogForm.setFormModel({
          shipper: "",
          consignee: "",
          notifier: "",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-dialog {
  /deep/ {
    .el-dialog__body {
      padding: 30px;
    }
    .form-class .custom-remark .el-form-item .el-form-item__label {
      margin: 0;
    }
  }
  .form-remark {
    span {
      font-size: 14px;
      color: #8b8b8b;
    }
  }
}
</style>
