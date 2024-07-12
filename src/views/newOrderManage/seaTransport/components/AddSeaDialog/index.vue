<template>
  <ComDialog
    class="order-dialog"
    ref="customDialog"
    :customDialog="customDialogConfig"
  >
    <template v-slot:content>
      <ComForm
        :formConfig="{
          ...formConfig,
          ...config(tradeClauseShow[formConfig.formModel.transportMode]),
        }"
        ref="dialogForm"
        @handleChange="handleChange"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:shipperId="slotProps">
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
        <template v-slot:consigneeId="slotProps">
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
        <template v-slot:notifierId="slotProps">
          <SelectContacts
            ref="notifierSelect"
            :formModel="slotProps.formModel"
            :fieldItem="{
              //通知人不传类型参数
              ...slotProps.fieldItem,
              type: 'contacts',
              lastChild: true,
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
        <template v-slot:insuranceAmount="slotProps">
          <div class="flex input-slot">
            <el-input
              v-model="slotProps.formModel.insuranceAmount"
              type="number"
              class="input-slot-left figure-type"
            />
            <el-select
              slot="append"
              v-model="slotProps.formModel.insuranceAmountCurrency"
              class="input-slot-center"
            >
              <el-option
                v-for="selectItem in slotProps.formModel.unitList"
                :key="selectItem.value"
                :label="selectItem.label"
                :value="selectItem.value"
              ></el-option>
            </el-select>
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { config } from "./model";
import { addTradition } from "@/api/trandition/seaAirTransport";
import { mapGetters } from "vuex";
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
        title: "海运订单",
        width: "1200px",
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
      config,
      formConfig: {
        formModel: {},
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "76px",
      },
      unitList: [],
      addReturnId: "",
      tradeClauseShow: {},
    };
  },
  computed: {
    ...mapGetters(["dictData"]),
  },
  created() {
    // this.portList();
  },
  methods: {
    // portList() {
    //   portList({ pageNum: 1, pageSize: 20, portTypes: "1,2,3" }).then((res) => {
    //   });
    // },
    addCustomer(form) {
      console.log("form", form);
      this.formConfig.formModel = form;
      const cusShipper = this.$refs.shipperSelect.getData() || {};
      const cusConsignee = this.$refs.consigneeSelect.getData() || {};
      const cusNotifier = this.$refs.notifierSelect.getData() || {};
      const params = {
        ...form,
        shipperId: cusShipper.cusContactsId,
        consigneeId: cusConsignee.cusContactsId,
        notifierId: (cusNotifier && cusNotifier.cusContactsId) || null,
        orderType: "3", //这个字段不在页面上显示，但是3是海运订单，4是空运订单
        orderStatus: "0",
        isForecast: "0",
        insured: !!form.insured,
      };
      delete params.customsClearanceId;
      delete params.unitList;
      return addTradition(params).then((res) => {
        this.addReturnId = res.data;
      });
    },
    show() {
      this.formConfig.formModel = {
        transportMode: "0",
        orderBusinessType: "0",
      };
      if (
        !Object.keys(this.tradeClauseShow).length &&
        this.dictData.transportMode
      ) {
        this.dictData.transportMode.forEach((item) => {
          this.tradeClauseShow[item.value] = (item.expandVal || "").split(",");
        });
      }
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.hide();
      this.$router.push({
        path: "/newOrderManage/editSeaTransport",
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
          shipperId: "",
          consigneeId: "",
          notifierId: "",
        });
      } else if (prop === "transportMode") {
        this.formConfig.formModel.transportMode = val;
        this.$refs.dialogForm.setFormModel({
          tradeClause: "",
        });
        this.$nextTick(() => {
          this.$refs.dialogForm.renewForm();
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
}
</style>
