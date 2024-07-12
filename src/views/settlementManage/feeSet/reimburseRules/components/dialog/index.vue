<template>
  <!-- 清关交接专用 -->
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        @handleChange="handleChange"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template
          v-for="(sItem, sIndex) in ['levelId30', 'levelId20', 'levelId10']"
          v-slot:[sItem]="slotProps"
        >
          <AutoComplete
            :ref="`${sItem}Ref`"
            :key="sIndex"
            :formModel="slotProps.formModel"
            :fieldItem="slotProps.fieldItem"
            :additionalParam="{
              deptId: slotProps.formModel.deptMainId,
            }"
          />
        </template>
        <template v-slot:defaultSlot="slotProps">
          <el-tooltip
            class="item"
            effect="dark"
            content="审核最小金额：如果选择审核人对应审核金额必填，填写后如'账单金额'大于等于'审核最小金额'则直接走对应审核人，审核人最终只会生效一个"
            placement="bottom"
          >
            <i class="iconfont bangzhu2"></i>
          </el-tooltip>
        </template>
        <template v-slot:deptMainNameSlot="slotProps">
          <el-tooltip
            class="item"
            effect="dark"
            content="审核人非必填，填写后如'账单金额'小于等于'审核最小金额'则跳过审核，如没填写'审核最小金额'正常走审核流程’"
            placement="bottom"
          >
            <i class="iconfont bangzhu2"></i>
          </el-tooltip>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { takeOrders } from "@/api/operateManage/common.js";
import { mapState } from "vuex";
import { dialogConfig } from "./model.js";
import { httpGetUserByDept } from "@/comModel/httpSelect.js";
import { getExpenseBillRule } from "@/api/settlementManage/feeSet.js";
import { querySearchList } from "@/api/common.js";
import { POSTSettleBillRule } from "@/api/settlementManage/feeSet.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      httpGetUserByDept,
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
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
      tagType: "",
    };
  },
  methods: {
    reimburseSubmitBefore(formModel = {}) {
      let isSubmit = true;
      const {
        type,
        levelId30,
        levelId20,
        levelId10,
        levelId1,
        levelId110,
        levelId100,
      } = formModel;
      if (
        type == 10 &&
        !levelId30 &&
        !levelId20 &&
        !levelId10 &&
        !levelId1 &&
        !levelId110 &&
        !levelId100
      ) {
        this.msgError("内部单请至少选择一位审核人！");
        isSubmit = false;
      }
      return {
        isSubmit,
        submitParams: formModel,
        httpRequest: getExpenseBillRule,
      };
    },
    processSubmitBefore(formModel = {}) {
      const {
        type,
        identity,
        isAppoint,
        remark,
        appointUserId,
        reviewerDefault = undefined,
        customerId,
        deptId,
        reviewerTwoLvMoney,
        reviewerThreeLvMoney,
        reviewerFourLvMoney,
      } = formModel;
      const params = {
        appointUserId,
        type,
        identity,
        isAppoint,
        remark,
        deptId,
        customerId,
        auditList: [
          ...(reviewerDefault
            ? [
                {
                  userId: formModel.reviewerDefault, //审核人id
                },
              ]
            : []),
          ...(formModel.reviewerTwoLv
            ? [
                {
                  amount: formModel.reviewerTwoLvMoney, //审核金额
                  currencyId: formModel.reviewerTwoLvCurrent, //审核币别
                  userId: formModel.reviewerTwoLv, //审核人id
                },
              ]
            : []),
          ...(formModel.reviewerThreeLv
            ? [
                {
                  amount: formModel.reviewerThreeLvMoney,
                  currencyId: formModel.reviewerThreeLvCurrent,
                  userId: formModel.reviewerThreeLv,
                },
              ]
            : []),
          ...(formModel.reviewerFourLv
            ? [
                {
                  amount: formModel.reviewerFourLvMoney,
                  currencyId: formModel.reviewerFourLvCurrent,
                  userId: formModel.reviewerFourLv,
                },
              ]
            : []),
        ],
      };

      let isSubmit = true;
      if (reviewerTwoLvMoney >= reviewerThreeLvMoney) {
        this.msgWarning("二级审核人审核最小金额不能大于或等于三级审核人");
        isSubmit = false;
      } else if (reviewerThreeLvMoney >= reviewerFourLvMoney) {
        this.msgWarning("三级审核人审核最小金额不能大于或等于四级审核人");
        isSubmit = false;
      }
      return {
        isSubmit,
        submitParams: params,
        httpRequest: POSTSettleBillRule,
      };
    },
    submitFormRequest(formModel) {
      let data = {};
      if (this.tagType == "reimburseRules") {
        //日常报销规则
        data = this.reimburseSubmitBefore(formModel);
      } else if (this.tagType == "processRules") {
        //对账单审核规则
        data = this.processSubmitBefore(formModel);
      }
      return new Promise((resolve, reject) => {
        const { isSubmit, submitParams, httpRequest } = data;
        if (isSubmit) {
          httpRequest(submitParams)
            .then((res) => {
              return resolve();
            })
            .catch((error) => {
              return reject();
            });
        } else {
          return reject();
        }
      });
      // return getExpenseBillRule(formModel);
    },
    async show(tagType, row) {
      this.tagType = tagType;
      const { rows } = await querySearchList({ type: "currency" });
      const {
        type,
        isAppoint,
        auditList = [],
        appointUserId = [],
        appointUserName = [],
      } = row;
      const { lists, formRules, title, width } = dialogConfig({
        tagType,
        type,
        isAppoint,
      });
      let processObj = {};
      if (tagType == "processRules") {
        processObj = {
          reviewerDefault: (auditList[0] && auditList[0].userId) || undefined,
          appointUserName: (appointUserName || []).join(","),
          // isAppoint == 1 ? appointUserId : (appointUserId || []).join(","), //appointUserId返回数组，1是多选，0是单选
          // appointUserName:(appointUserName||[]).join(','),
          reviewerTwoLv: (auditList[1] && auditList[1].userId) || undefined, //审核人
          reviewerTwoLvName:
            (auditList[1] && auditList[1].userName) || undefined, //审核人中文
          reviewerTwoLvMoney: auditList[1] && auditList[1].amount, //钱
          reviewerTwoLvCurrent: 1, //币别
          reviewerThreeLv: (auditList[2] && auditList[2].userId) || undefined,
          reviewerThreeLvName:
            (auditList[2] && auditList[2].userName) || undefined,
          reviewerThreeLvMoney: auditList[2] && auditList[2].amount,
          reviewerThreeLvCurrent: 1,
          reviewerFourLv: (auditList[3] && auditList[3].userId) || undefined,
          reviewerFourLvName:
            (auditList[3] && auditList[3].userName) || undefined,
          reviewerFourLvMoney: auditList[3] && auditList[3].amount,
          reviewerFourLvCurrent: 1,
        };
      }
      this.formConfig = {
        ...this.formConfig,
        formModel: {
          ...row,
          ...processObj,
          isAppoint,
        },
        lists: lists,
        formRules: formRules,
        selectList: rows.map((e) => {
          return {
            label: e.code,
            value: e.id,
          };
        }),
      };
      this.$refs.dialogForm?.setFormModel(this.formConfig.formModel);
      this.customDialogConfig.title = title;
      this.customDialogConfig.width = width;
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    handleChange(row = {}, type) {
      // const { reviewerTwoLvMoney, reviewerThreeLvMoney, reviewerFourLvMoney } =
      //   this.$refs.dialogForm?.getFormModelVal();
      // if (type == "reviewerTwoLvMoney") {
      //   if (
      //     reviewerTwoLvMoney > reviewerThreeLvMoney
      //   ) {
      //     this.$nextTick(() => {
      //       this.$refs.dialogForm?.setFormModel({
      //         reviewerTwoLvMoney: reviewerThreeLvMoney,
      //       });
      //     });
      //     this.msgWarning(
      //       "二级审核人审核最小金额不能大于三级审核人"
      //     );
      //   }
      // } else if (type == "reviewerThreeLvMoney") {
      //   if (reviewerThreeLvMoney > reviewerFourLvMoney) {
      //     this.$nextTick(() => {
      //       this.$refs.dialogForm?.setFormModel({
      //         reviewerThreeLvMoney: reviewerFourLvMoney,
      //       });
      //     });
      //     this.msgWarning("三级审核人审核最小金额不能大于四级审核人");
      //   }
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-personnel {
  display: flex;
  div {
    &:nth-child(1) {
      flex: 2.5;
    }
    &:nth-child(2) {
      margin-left: 10px;
      flex: 1;
    }
  }
}
</style>
