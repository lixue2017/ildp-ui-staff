<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      class="airline-dialog"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="{
            ...formConfig,
            ...config({isSortBox:formConfig.formModel.isSortBox}),
          }"
          class="dialog-form"
          @handleChange="handleChange"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        >
        <template v-slot:boxCustomerId="slotProps">
            <AutoComplete
              ref="boxCustomerIdRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle:changeBoxCustomerId
              }"
            />
          </template>
          <template v-slot:boxOperateMain="slotProps">
            <AutoComplete
              ref="boxOperateMainRef"
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                idNotIn:slotProps.formModel.boxCustomerId
              }"
            />
          </template>
          <template v-slot:boxBookingSpaceProxy="slotProps">
            <AutoComplete
              ref="boxBookingSpaceProxyRef"
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                ids:slotProps.formModel.boxBookingSpaceProxyRequestIds||undefined
              }"
            />
          </template>

          <template v-slot:routeCodeId="slotProps">
            <AutoComplete
              ref="routeCodeIdRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle:(row)=>changeRouteCodeId(row),
                getSearchOptions:(rows)=>isintRouteCodeId(rows,formConfig.formModel)
                }"
              :additionalParam="{}"
            />
          </template>
          <template v-for="item in ['startPort','endPort','transfer']" v-slot:[item]="slotProps">
            <AutoComplete
              :ref="`${item}Ref`"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                disabled:slotProps.formModel.routeCodeId?false:true
              }"
              :additionalParam="{
                typeList:slotProps.formModel.lineType?slotProps.formModel.lineType:'0,3'
              }"
            />
          </template>
          <template v-for="bItem in ['boxConsigneeId','boxConsignerId','boxNotifierId']" v-slot:[bItem]="slotProps">
            <AutoComplete
              :ref="`${bItem}Ref`"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                disabled:slotProps.formModel.boxCustomerId?false:true
              }"
              :additionalParam="{
                customerId:slotProps.formModel.boxCustomerId
              }"
            />
          </template>
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>


<script>
import { config } from "./model";
import { mapActions, mapState } from "vuex";
import {
  addOperateRoute,
  putOperateRoute,
} from "@/api/marketManage/airline.js";
import { comSaveRepeatedRequest } from "@/api/common";
import {
  POSTOrderIsolateConfig
} from "@/api/marketManage/airline";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      config,
      status: 0,
      customDialogConfig: {
        title: "航次信息",
        width: "850px",
        dataStatus: 0,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "保存并启用",
            type: "primary",
            handleClick: () => {
              this.submitType = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "暂存",
            type: "primary",
            handleClick: () => {
              this.submitType = 0;
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
        type: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "120px",
        visibleAll: true,
      },
      submitType: "",
    };
  },
  created() {
    this["dictionary/getDictionary"]("marketManage");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    async show(row={}) {
      const {isSortBox,boxSalesman,boxSalesmanName,lineType}=row
      const {data:boxBookingSpaceProxyRequestIds}=await POSTOrderIsolateConfig()
      this.formConfig.formModel = {
        ...row,
        shipCompany: row?.shipCompany?JSON.parse(row?.shipCompany):'',
        isSortBox,
        boxSalesman,
        boxSalesmanName,
        lineType:lineType||null,
        boxBookingSpaceProxyRequestIds
      };
      // this.$refs.dialogForm?.setFormModel(this.formConfig.formModel)
      // this.changeAirlineManage(row);
      this.$refs.customDialog.show();
    },
    hide() {
      this.$emit("handleSuccess");
      this.$refs.customDialog.hide();
    },
    handleSuccess(res = {}) {
      this.hide();
    },
    // changeAirlineManage(row) {
    //   const {isSortBox=false}=this.formConfig.formModel
    //   config({isSortBox}).lists[0].fieldList[0].rows[0].cols[0].handle = (e) => {
    //     this.$refs.dialogForm.setFormModel({
    //       lineTypeName: e.lineTypeName,
    //     });
    //   };
    //     config({isSortBox}).lists[0].fieldList[0].rows[0].cols[0].getSearchOptions = (e) => {
    //       let list;
    //       if (row?.routeCodeId) {
    //         list = e.find((item) => item.id == row.routeCodeId);
    //       } else {
    //         return
    //       }
    //       this.$refs.dialogForm.setFormModel({
    //         route: list,
    //         routeCodeId: list?.label,
    //         lineTypeName: list?.lineTypeName,
    //       });
    //     };
    // },
    submitFormRequest(formModel) {
      const{isSortBox,boxSalesmanName,...obj}=formModel
      const params = {
        ...obj,
        status: this.submitType,
        startPort: formModel.startPort, //起运港
        endPort: formModel.endPort, //目的港
        transfer: formModel.transfer, //中转港
        routeCodeId: formModel.routeCodeId?.id, //航线组id，
        shipCompany: formModel.shipCompany, //航空/船公司,
        isSortBox,
        boxCwmId:isSortBox?formModel.boxCwmId:undefined,
        boxCustomerId:isSortBox?formModel?.boxCustomerId:undefined,
        boxCountryId:isSortBox?formModel?.boxCountryId:undefined,
        boxOperateMain:isSortBox?formModel?.boxOperateMain:undefined,
        boxConsigneeId:isSortBox?formModel?.boxConsigneeId:undefined,
        boxBookingSpaceProxy:isSortBox?formModel?.boxBookingSpaceProxy:undefined,
        boxConsignerId:isSortBox?formModel?.boxConsignerId:undefined,
        // boxSalesman:isSortBox?formModel?.boxSalesman:undefined,
        boxNotifierId:isSortBox?formModel?.boxNotifierId:undefined
      };
      delete params.undefined;
      if (formModel.id) {
        return comSaveRepeatedRequest(putOperateRoute, params)
        // return new Promise((resolve) => {
        //   putOperateRoute(params).then((res) => {
        //     resolve();
        //   });
        // });
      } else {
        return comSaveRepeatedRequest(addOperateRoute, params)
        // return new Promise((resolve) => {
        //   addOperateRoute(params).then((res) => {
        //     resolve();
        //   });
        // });
      }
    },
    handleChange(val, key) {
      if (key == "isSortBox") {
        this.formConfig.formModel.isSortBox = val;
        this.$nextTick(() => {
          this.$refs.dialogForm.renewForm();
        });
      }
    },
    changeBoxCustomerId(row={}) {
      if (row.id) {
        const { salesman: boxSalesmanName, salesmanId: boxSalesman } = row;
        this.$refs.boxOperateMainRef?.changeFocusRequest();
        console.log('this.$refs',this.$refs)
        this.$refs.boxConsigneeIdRef[0]?.changeFocusRequest();//收
        this.$refs.boxConsignerIdRef[0]?.changeFocusRequest();//发
        this.$refs.boxNotifierIdRef[0]?.changeFocusRequest();//通
        this.$refs.dialogForm?.setFormModel({
          boxSalesmanName,
          boxSalesman,
        });
      } else {
        this.$refs.boxOperateMainRef?.changeFocusRequest();
        this.$refs.dialogForm?.setFormModel({
          boxConsigneeId: "",
          boxConsignerId: "",
          boxNotifierId: "",
          boxSalesmanName:"",
          boxSalesman:"",
        });
      }
    },
    changeRouteCodeId(row) {
      console.log('row',row)
      if (!row.id) {
        this.$refs.dialogForm?.setFormModel({
          startPort:'',
          endPort:'',
          transfer:'',
          lineTypeName:'',
          lineType:''
        });
      }else{
        this.$refs.startPortRef[0]?.changeFocusRequest();//起运
        this.$refs.endPortRef[0]?.changeFocusRequest();//目的
        this.$refs.transferRef[0]?.changeFocusRequest();//中转
        this.$refs.dialogForm.setFormModel({
          lineTypeName: row.lineTypeName,
          lineType:row.lineType
        });
      }
    },
    isintRouteCodeId(rows, formModel) {
      const { routeCodeId } = formModel;
      let list;
      if (routeCodeId) {
        list = rows.find((item) => item.id == routeCodeId);
      } else {
        return;
      }
      this.$refs.dialogForm.setFormModel({
        route: list,
        routeCodeId: list?.label,
        lineTypeName: list?.lineTypeName,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.airline-dialog {
  /deep/ {
    .el-radio {
      margin-right: 10px;
    }
  }
  .mark-icon {
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 12px;
    margin-left: 5px;
    border: 1px solid #66a5ff;
  }
}
.diaLogPortType {
  display: flex;
  align-items: center;
  .el-tag {
    margin-left: 10px;
  }
}
</style>
