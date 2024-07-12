<template>
  <div>
    <ComDialog ref="customDialog" :customDialog="customDialogConfig">
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        >
          <template v-slot:tags="slotProps">
            <!-- <template v-for="tag in selectTags">
              <el-button type="primary" size="small" :key="tag.id">
                {{ tag.name }}
              </el-button>
            </template> -->
            <el-button type="primary" @click="handleAddTags">
              <template
                v-if="
                  slotProps.formModel.tags && slotProps.formModel.tags.length
                "
              >
                已选{{ slotProps.formModel.tags.length }}个标签
              </template>
              <template v-else>
                <i class="el-icon-plus"></i>
                <span>添加标签</span>
              </template>
            </el-button>
          </template>
        </ComForm>
      </template>
    </ComDialog>
    <TagsDialog
      ref="tagsDialogRef"
      appendToBody
      @handleSuccess="handleSelectTags"
    />
  </div>
</template>

<script>
import { config } from "./model";
import { transferToCustomer } from "@/api/clueManage/salesClue.js";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    TagsDialog: () => import("./TagsDialog"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      customDialogConfig: {
        title: "转为客户",
        width: "750px",
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "提 交",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "85px",
        ...config,
      },
      selectTags: [],
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const {
        address,
        businessType,
        category,
        contactName,
        customerCode,
        id,
        level,
        name,
        ownershipUserId,
        phone,
        shortName,
        source,
        state,
        tags,
      } = formModel;
      return transferToCustomer({
        address,
        businessType,
        category: category.join(","),
        contactName,
        customerCode,
        id,
        level,
        name,
        ownershipUserId,
        phone,
        shortName,
        source,
        state,
        tags,
      });
    },
    show(row = {}) {
      const { state, level, source, businessType, category, ...obj } = row;
      this.formConfig.formModel = {
        ...obj,
        state: this.typeConversion(state),
        level: this.typeConversion(level),
        source: this.typeConversion(source),
        businessType: this.typeConversion(businessType),
        category: this.typeConversion(category),
      };
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    handleAddTags() {
      const { tags } = this.$refs.dialogForm.getFormParams();
      this.$refs.tagsDialogRef.show(tags);
    },
    handleSelectTags(tags, selectTags) {
      this.selectTags = selectTags;
      this.$refs.dialogForm.setFormModel({
        tags,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-button {
  margin-left: 0;
  margin-right: 10px;
}
</style>
