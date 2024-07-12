<template>
  <!-- 自定义弹窗模板 / 审核弹窗，通过、驳回显示不同模板 -->
  <div>
    <ComDialog
      ref="customDlgRef"
      :customDialog="dialogConfig"
      :confirmClose="false"
      :dialogBoxCenter="true"
      :class="dlgClassName"
    >
      <template v-slot:content>
        <div :class="formConfig.className">
          <ComForm
            ref="formRef"
            v-if="$refs.customDlgRef && $refs.customDlgRef.dialogVisible"
            :formConfig="formConfig"
            @handleChange="handleChange"
          >
            <template
              v-for="sItem in slotDlgFormIds"
              v-slot:[sItem]="slotProps"
            >
              <slot
                :name="sItem"
                :fieldItem="slotProps.fieldItem"
                :formModel="slotProps.formModel"
              />
            </template>
          </ComForm>
        </div>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    dlgClassName: {
      type: String,
      default: () => "",
    },
    slotDlgFormIds: {
      type: Array,
      default: () => [], // type: "slot"的fieldItem.id集合
    },
  },
  data() {
    return {
      dialogConfig: {
        appendToBody: true,
        footer: [],
      },
      dialogFooter: [
        {
          text: this.overseaLangObj.qx_cancel() || "取消",
          plain: true,
          btnType: "fBtnCancel",
          handleClick: () => {
            this.$refs.customDlgRef.hide();
          },
        },
        {
          text: this.overseaLangObj.qr_confirm() || "确定",
          type: "primary",
          btnType: "fBtnConfirm",
          handleClick: () => {
            if (this.customConfig.confirmCheckFunction) {
              // 先校验，后保存
              this.customConfig.confirmCheckFunction(() => {
                this.$refs.formRef.submitForm();
              });
            } else {
              this.$refs.formRef.submitForm();
            }
          },
        },
      ],
      formConfig: {},
      customConfig: {},
    };
  },
  methods: {
    handleChange(cVal, cKey) {
      // console.log('cVal, v, c==', cVal, cKey)
      const {
        customFormConfig,
        listsObj,
        rulesObj,
        changeKey,
        isRetainModelVal,
        handleFormChange,
      } = this.customConfig;
      if (handleFormChange) {
        handleFormChange(cVal, cKey);
      }
      if (changeKey && changeKey === cKey) {
        // 先获取值做为切换后的模板初始数据
        const changeFormData = isRetainModelVal
          ? this.$refs.formRef.getFormParams()
          : {
              ...this.formConfig.formModel,
              [changeKey]: cVal,
            };
        this.$set(this.formConfig, "formModel", changeFormData);
        this.$set(this.formConfig, "lists", customFormConfig[listsObj[cVal]]);
        // 先移除再添加校验
        this.$refs.formRef.setFormRules(
          {},
          Object.keys(this.formConfig.formRules)
        );
        this.formConfig.formRules = customFormConfig[rulesObj[cVal]] || {};
        this.$refs.formRef.setFormRules(this.formConfig.formRules);
        this.$refs.formRef.changeModelFormData(); // 切换模板重置初始数据
      }
    },
    showCustomDialog({
      dialogTitle,
      httpRequest = (params) => {
        return new Promise((resolve, reject) => {
          resolve(params); // 流文件下载-把参数当成接口返回数据
        });
      },
      successFunction,
      errorFunction,
      footer = [],
      customFtBtnList,
      formModel = {},
      customFormConfig,
      listsKey = "lists",
      rulesKey = "formRules",
      listsObj = {
        0: "lists", // changeKey的值(value): 显示的模板名
        1: "rejectLists",
      },
      rulesObj = {
        0: "formRules", // changeKey的值(value): 显示的校验名
        1: "rejectFormRules",
      },
      changeKey = "status", // 切换的属性名。如：审核结果的key，changeKey与radio的id不同时不切换模板，
      isRetainModelVal = false, // 切换模板是否保留改变的值，默认不保留改变值，只保留初始值
      handleFormChange,
      uploadFormConfig,
      confirmCheckFunction,
    }) {
      if (!customFormConfig) return;
      this.customConfig = {
        customFormConfig,
        listsObj,
        rulesObj,
        changeKey,
        isRetainModelVal,
        handleFormChange,
        confirmCheckFunction,
      };
      this.dialogConfig.title = dialogTitle || customFormConfig.title;
      this.dialogConfig.width = customFormConfig.width;
      this.formConfig = {
        size: customFormConfig.size || "small",
        formModel: {
          ...formModel,
        },
        httpRequest,
        isAttachFileId: customFormConfig.isAttachFileId || false,
        uploadFormConfig,
        // labelPosition: customFormConfig.labelPosition && customFormConfig.labelPosition,
        successFunction: (res) => {
          this.$refs.customDlgRef.hide();
          successFunction && successFunction(res);
        },
        errorFunction: (err) => {
          errorFunction && errorFunction(err);
        },
        className: customFormConfig.className,
        labelWidth: customFormConfig.labelWidth || "90px",
        lists: customFormConfig.simpleCustomCols
          ? [
              {
                fieldList: [
                  {
                    rows: [
                      {
                        cols: customFormConfig.simpleCustomCols, // 简单的模板
                      },
                    ],
                  },
                ],
              },
            ]
          : customFormConfig[listsKey],
        formRules: customFormConfig[rulesKey] || {},
      };
      if (footer.length) {
        this.dialogConfig.footer = footer;
      } else {
        const ftBtn = customFormConfig.ftShowBtnArr
          ? this.dialogFooter.filter((e) =>
              customFormConfig.ftShowBtnArr.includes(e.btnType)
            )
          : this.dialogFooter;
        this.dialogConfig.footer = (customFtBtnList || []).concat(ftBtn);
      }
      // 可传入字典词数组
      this["dictionary/getDictionary"](
        customFormConfig.dictionaryWords || []
      ).then(() => {
        this.$refs.customDlgRef.show();
      });
    },
    setDlgFormModel(obj) {
      this.$refs.formRef.setFormModel(obj || {});
    },
    customDialogHide() {
      // 父组件调用关闭弹窗
      this.$refs.customDlgRef.hide();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
