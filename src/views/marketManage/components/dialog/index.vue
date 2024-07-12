<template>
  <div>
    <ComDialog ref="customDialog" :customDialog="customDialogConfig">
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form content-padding-20"
          v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
          @handleChange="handleChange"
        >
          <template v-slot:routeNoManageId="slotProps">
            <AutoComplete
              ref="routeNoManageIdRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                getSearchOptions: getstatus,
                handleCreate: _handleAddRouteInfo,
                refreshRequest: refreshRequestRoute,
                selectLabelKey:formConfig.formModel.id?'routeNoMangeName':undefined,
              }"
            />
          </template>
          <template v-slot:soNoTip>
            <div class="sono_tip">
              SoNo支持输入多个，用逗号和空格分隔，最多支持5000字
            </div>
          </template>
        </ComForm>
      </template>
    </ComDialog>
    <AddEditDialog ref="dialog" @handleAddSuccess="handleAddSuccess"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getFormConfig, FORMRULES_CONFIG } from "./model.js";
import { editOperateSono, addOperateSono } from "@/api/marketManage/airline.js";
import { typeConversion } from "@/utils/index"; // 数据类型转换
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    AddEditDialog: () =>
      import(
        "@/views/marketManage/airlineFlight/components/AddEditDialog/index.vue"
      ),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    WEB_ids: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      formConfig: {
        isAttachFileId: true,
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
        formRules: {}, // 表单校验规则
      },
      customDialogConfig: {
        title: "",
        width: "830px",
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
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
      },
      httpRequest: addOperateSono,
      type: "add",
      refreshRequestRoute: false,
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const {
        id,
        sono,
        boxModelId,
        remark,
        isCabinRelease,
        attachId,
        routeNoManageId,
      } = formModel;
      const { routeNoManageStatus } = this.formConfig.formModel;
      const params = {
        id,
        routeNoManageId: routeNoManageId.id,
        sono,
        boxModelId,
        remark,
        isCabinRelease,
        attachId,
        statusList: routeNoManageStatus || [routeNoManageId.status],
      };
      if (this.type === "add") {
        params.sono = sono
          .trim()
          .replace(/[\r\n， ]/g, ",")
          .split(",")
          .filter((item) => item)
          .join(",");
      }
      return this.httpRequest(params);
    },
    show(row, type, isRoute) {
      const { routeNoManageId, isCabinRelease, routeNoMangeName,...obj } = row;
      const { lists, formRules, title } = getFormConfig({
        type,
        isCabinRelease,
        isRoute,
      });
      this.formConfig = {
        ...this.formConfig,
        lists: lists,
        formRules: formRules,
      };
      this.customDialogConfig.title = title;
      this.type = type;
      this.httpRequest = type == "edit" ? editOperateSono : addOperateSono;
      this.formConfig.formModel = {
        ...obj,
        routeNoManageId: routeNoManageId
          ? {
              id: routeNoManageId,
            }
          : "",
        routeNoMangeName,
        isCabinRelease:
          isCabinRelease == 0 ? typeConversion(isCabinRelease) : "1",
      };
      // this.handleAddSuccess(routeNoManageId)
      // this.refreshRequestRoute = !this.refreshRequestRoute;
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleChange(row, type) {
      if (type == "isCabinRelease") {
        let ruleValide = {}; //ruleValide需要新增的表单校验
        let removeRule = []; //removeRule需要移除的表单校验
        switch (row) {
          case "0":
            removeRule = ["attachId"];
            break;
          case "1":
            ruleValide = FORMRULES_CONFIG(["attachId"]);
            break;
          default:
            break;
        }
        this.$refs.dialogForm?.setFormRules(ruleValide, removeRule); //根据用户的选择新增与删除校验
      }
    },
    getstatus(row) {
      //获取关联航次的状态，后端需要这个值
      const { id } = this.formConfig.formModel.routeNoManageId;
      if (id) {
        const obj = row.filter((e) => id === e.id)[0];
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          routeNoManageStatus: obj?.status ? [obj.status] : "",
        };
      }
    },
    _handleAddRouteInfo() {
      //新增航次信息
      this.$refs.dialog?.show({ WEB_ids: this.WEB_ids }, true);
    },
    handleSuccess(res) {
      this.$emit("handleSuccess", res);
      this.hide();
    },
    handleAddSuccess(id,row={}) {
      const {routeNoMangeName}=row
      this.$refs.dialogForm?.setFormModel({
        routeNoManageId: { id },
        routeNoMangeName
      });
      this.refreshRequestRoute = !this.refreshRequestRoute;
    },
  },
};
</script>

<style lang="scss" scoped>
.sono_tip {
  color: #bcbcbc;
  &::before {
    content: "*";
    color: #ffa676;
  }
}
</style>
