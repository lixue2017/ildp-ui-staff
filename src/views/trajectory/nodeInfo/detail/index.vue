<template>
  <div class="app-container">
    <div>
      <ComDetailTop
        title="轨迹节点配置"
        :config="comDetailConfig"
        ref="detailTopRef"
      />
    </div>
    <div>
      <ComForm
        class="order-from"
        :formConfig="formConfig"
        ref="formRef"
        v-if="showSearchForm"
      >
        <template v-slot:editTitle="{ slotProps }">
          <div class="editTitle">
            <div>
              <span class="labelFontClass">内容：</span>
            </div>
            <div>
              <el-radio-group v-model="typein">
                <el-radio :label="0" disabled>默认生成</el-radio>
                <el-radio :label="1" disabled>页面确认</el-radio>
              </el-radio-group>
            </div>
          </div>
        </template>
        <template v-slot:selectTabs="{ slotProps }">
          <div class="selectTabs">
            <div class="slotTitle">
              <span class="labelFontClass">可选字段(点击添加)</span>
            </div>
            <div class="slotContent">
              <el-tag
                v-for="(item, index) in formConfig.btn"
                class="slotContent-tags"
                :key="index"
                @click="selectCode(item)"
                >{{ item.label }}</el-tag
              >
            </div>
          </div>
        </template>
        <template v-slot:remark="slotProps">
          <quill-editor
            v-model="slotProps.formModel.remark"
            class="editor"
            ref="QuillEditor"
            :options="editorOption"
            @change="onEditorChange($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          >
          </quill-editor>
        </template>
      </ComForm>
    </div>
    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button :type="btn.type" @click="btn.handleClick" :key="index">
          {{ btn.text }}
        </el-button>
      </template>
    </div>

    <!-- <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
        </el-tab-pane>
      </template>
    </ComTabs> -->
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import { config } from "./model";
import { mapActions } from "vuex";
export default {
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComTree: () =>
      import("@/views/trajectory/nodeInfo/components/ComTree/index.vue"),
    ComForm: () => import("_comp/ComForm"),
    ComTreeForm: () =>
      import("@/views/trajectory/nodeInfo/components/ComTreeForm/index.vue"),
    quillEditor,
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  data() {
    return {
      comDetailConfig: {
        rightBtn: [
          {
            icon: "iconfont icon-fanhui",
            text: "返回",
            type: "back",
            className: "back",
          },
        ],
      },
      editorOption: {
        //编辑器的样式
        modules: {
          toolbar: null,
        },
        placeholder: "请输入内容",
      },
      tabsConfig: {
        //tabs页签
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "轨迹节点配置",
            name: "1",
          },
        ],
      },
      formConfig: {
        //FORM表单
        formModel: {},
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "125px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
        btn: [
          { label: "目的港", value: 0, code: "${mudigang}" },
          { label: "凤凰卫视", value: 1, code: "${fenghuangweishi}" },
          { label: "芒果", value: 2, code: "${mangguo}" },
          { label: "目的仓", value: 3, code: "${mudicang}" },
          { label: "层级", value: 4, code: "${cengji}" },
          { label: "操作接单", value: 5, code: "${caozuojiedan}" },
          { label: "拆柜预约", value: 6, code: "${chaiguiyuyue}" },
          { label: "头程运输方式", value: 7, code: "${touchengyunshufangshi}" },
        ],
      },
      footerBtn: [
        {
          text: "取 消",
          handleClick: () => {
            this.handleBack();
          },
        },
      ],
      showSearchForm: false,
      typein: 1,
      // searchFormConfig: {
      //   //右侧FORM表格
      //   formModel: {}, // 表单数据
      //   httpRequest: (formModel) => {
      //     return new Promise((resolve) => {
      //       this.getCategoryList(formModel);
      //       resolve();
      //     });
      //   }, // 表单提交接口
      //   searchForm: false,
      //   // expansion: false,
      //   size: "small",
      //   labelWidth: "85px",
      //   lists: [
      //     {
      //       className: "search-form-width",
      //       fieldList: [
      //         {
      //           rows: [
      //             {
      //               cols: searchColumns,
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ], // 表单渲染列表
      //   formRules: {}, // 表单校验规则
      // },
    };
  },
  created() {
    this["dictionary/getDictionary"]("tranditionTypeEn").then(() => {
      this.getIsintData();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getIsintData() {
      this.formConfig.formModel = {
        GJMC: "12321321",
        KHLX: 1,
        GJCZY: 1,
        KHDW: 1,
        KH: "显示啊",
        YG: "显示吧",
        typein: 1,
        remark: "hello World",
      };
      this.$refs.formRef?.setFormModel(this.formConfig.formModel);
      this.showSearchForm = true;
    },
    handleTreeClick(data) {
      console.log(data);
      console.log("点击了树形结构，可以在此调用结构刷新数据");
    },
    addCustomer(form) {
      //提交数据
    },
    handleSuccess() {},
    selectCode(row) {
      // let quill = this.$refs.QuillEditor.quill;
      // let index = quill.selection.savedRange.index;
      // quill.insertEmbed(index, "text", `【${row.code}】`);
      // this.$refs.myForm &&
      //   this.$refs.myForm[0].setFormModel(this.formConfig.formModel);
    },
    handleUpdate(data, type) {
      if (type === "submit") {
        this.$refs.myForm[0].submitForm();
      }
    },
    onEditorReady(data) {
      //编辑器初始化,也可以选择在这编辑样式
    },
    onEditorFocus(e) {
      //编辑器聚焦
      e.enable(false);
    },
    onEditorChange(data) {
      //编辑器内容改变
      // console.log(data.text.replace(/[\r\n]/g, ""))
      this.formConfig.formModel.remark = JSON.parse(
        JSON.stringify(data.text.replace(/[\r\n]/g, ""))
      );
      // this.$refs.myForm &&
      //   this.$refs.myForm[0].setFormModel(this.formConfig.formModel);
    },
    handleBack() {
      //返回
      this.$refs.detailTopRef?.comReBack();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/.direction-class {
    display: flex;
    .row-class {
      flex: 2;
      &:not(:first-child) {
        margin-left: 20px;
        flex: 4;
      }
    }
  }
  .editTitle {
    display: flex;
    justify-content: space-between;
  }
  .editor {
    height: 250px;
  }
  .selectTabs {
  }
  .slotContent {
    height: 270px;
    background-color: #f9f9f9;
    overflow: auto;
    padding-left: 15px;
    padding-right: 15px;
    .slotContent-tags {
      padding: 0px 24px;
      margin-top: 20px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
  .labelFontClass {
    font-size: 13px;
    font-weight: 500;
    color: #515151;
  }
}
// .container {
//   width: 1214px;
//   min-height: 891px;
//   background: #ffffff;
//   margin: auto;
//   margin-top: 11px;
//   .ComTreeClass {
//     /deep/.el-tree-node__content {
//       margin-top: 5px;
//     }
//   }
//   .slotTitle {
//     margin-bottom: 22px;
//   }
//   .slotContent {
//     text-align: center;
//     height: 264px;
//     background-color: #f8f8f8;
//   }
//   .order-from {
//     height: 95%;
//     border-bottom: 1px solid #e2e2e2;
//   }
//   .slotFooter {
//     margin-top: 20px;
//     text-align: right;
//   }
//   /deep/.el-tabs__header {
//     margin: 0px;
//   }
// }
// .editor {
//   height: 270px;
// }
</style>
