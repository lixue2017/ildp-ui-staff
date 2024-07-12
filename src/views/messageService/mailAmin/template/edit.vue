<template>
  <div class="app-content-container">
    <ComDetailTop
      title="邮件模板"
      :config="[1, 2].includes(currPage) ? {} : undefined"
      :formModel="formConfig.formModel"
      class="title-sides-margin-none"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <template v-if="currPage === 1">(编辑)</template>
        <span v-else class="sub-title">
          ({{ formConfig.formModel.tag || "--" }})
        </span>
      </template>
    </ComDetailTop>

    <template v-if="isInitRes">
      <ComForm class="template-from" :formConfig="formConfig" ref="formRef">
        <template v-slot:subjectSlot="slotProps">
          <div
            class="mail-content ql-editor"
            v-html="slotProps.formModel.subject"
          ></div>
        </template>

        <template v-slot:optionTitleSlot>
          <div class="btn">
            <template v-if="titleParams.length">
              <div
                class="options-txt"
                v-for="(item, idx) in titleParams"
                :key="idx"
                @click="() => selectTitCode(item)"
              >
                <span>{{ item.name }}</span>
              </div>
            </template>
            <span class="noData" v-else>暂无主题参数</span>
          </div>
        </template>

        <template v-slot:selectedTitleSlot>
          <div id="moveTitSort" class="btn">
            <template v-if="selectedTitList.length">
              <div
                class="selected-txt"
                v-for="(item, idx) in selectedTitList"
                :key="idx"
              >
                <span>{{ item.name }}</span>
                <i @click="() => delTitSelect(idx)" class="el-icon-error"></i>
              </div>
            </template>
            <span class="noData" v-else>暂无已选主题参数</span>
          </div>
        </template>

        <template v-slot:optionContentSlot>
          <div class="btn">
            <template v-if="optionalParams.length">
              <template v-for="(item, idx) in optionalParams">
                <div
                  class="options-txt"
                  :key="idx"
                  @click="() => selectConCode(item)"
                >
                  <span>{{ item.name }}</span>
                </div>
              </template>
            </template>
            <span class="noData" v-else>暂无可选参数</span>
          </div>
        </template>

        <template v-slot:selectedContentSlot>
          <div id="moveSort" class="btn">
            <template v-if="selectedConList.length">
              <div
                class="selected-txt"
                v-for="(item, idx) in selectedConList"
                :key="idx"
              >
                <span>{{ item.name }}</span>
                <i @click="() => delConSelect(idx)" class="el-icon-error"></i>
              </div>
            </template>
            <span class="noData" v-else>暂无已选参数</span>
          </div>
        </template>

        <template v-slot:content="slotProps">
          <quill-editor
            v-if="currPage !== 3"
            v-model="slotProps.formModel.content"
            class="editor"
            ref="editorRef"
            :options="editorOption"
            @change="onEditorChange($event)"
            @ready="onEditorReady($event)"
          >
          </quill-editor>
          <div
            class="mail-content ql-editor"
            v-html="slotProps.formModel.content"
            v-else
          ></div>
        </template>
      </ComForm>

      <template>
        <div class="footer-seize-seat"></div>
        <div class="order-footer">
          <template v-if="currPage !== 3">
            <template v-for="(btn, index) in footerBtn">
              <el-button @click="btn.handleClick" :key="index" v-debounce>
                {{ btn.text }}
              </el-button>
            </template>
          </template>
          <template v-else>
            <template v-for="(btn, index) in detailFooterBtn">
              <el-button
                @click="btn.handleClick"
                :key="index"
                v-if="btn.status.includes(formConfig.formModel.state)"
                v-debounce
              >
                {{ btn.text }}
              </el-button>
            </template>
          </template>
        </div>
      </template>
    </template>

    <el-dialog
      v-if="dialogVisible"
      class="tip-over-txt"
      title="模板内容预览"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <div
        style="padding-bottom: 30px; font-size: 16px"
        v-html="previewHtml.subject || ''"
      ></div>
      <div v-html="previewHtml.content || ''"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import Sortable from "sortablejs";
import { formConfig } from "./model";
import {
  getMailTemplateInfo,
  updateMailTemplate,
  deleteMailTemplate,
  getMsgParamEntity,
  previewMsgTemplate,
  postMsgTemplate,
} from "@/api/messageService";
import { customMessageBox } from "@/utils/confirmBox.js";
import { mapActions } from "vuex";
export default {
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    quillEditor,
  },
  data() {
    return {
      editorOption: {
        //编辑器的样式
        modules: {
          toolbar: [
            [{ font: [] }],
            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            ["bold", "italic", "underline"], // toggled buttons

            [{ align: [] }],

            [{ list: "ordered" }],
            [{ direction: "rtl" }], // text direction
            ["link", "image"],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme

            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          ],
        },
        placeholder: "请输入内容（输入‘%s’进行转译已选参数）",
      },
      formConfig: {
        formModel: {
          versionNo: "v1.0.0",
        },
        httpRequest: this.handleSubmit, // 表单提交接口
        successFunction: this.reBack, // 表单提交成功回调
        labelWidth: "120px",
        lists: formConfig(true).lists, // 表单渲染列表
        formRules: formConfig(true).formRules, // 表单校验规则
      },
      titleParams: [],
      optionalParams: [],
      selectedConList: [],
      selectedTitList: [],
      previewHtml: {},
      dialogVisible: false,
      templateStatus: 0,
      pageType: {
        AddTemplate: 1, // 新增
        EditTemplate: 2, // 编辑
        TemplateDetail: 3, // 详情
      },
      currPage: 1,
      isInitRes: false,
      footerBtn: [
        {
          text: "模板预览",
          handleClick: () => this.handlePreview(),
        },
        {
          text: "保 存",
          handleClick: () => this.handleSave(2),
        },
        {
          text: "保存并启用",
          handleClick: () => this.handleSave(1),
        },
        {
          text: "取 消",
          handleClick: this.reBack,
        },
      ],
      detailFooterBtn: [
        {
          text: "禁 用",
          status: [1],
          handleClick: () => this.handleStatus(2),
        },
        {
          text: "启 用",
          status: [0, 2],
          handleClick: () => this.handleStatus(1),
        },
        {
          text: "修 改",
          status: [0, 2],
          handleClick: this.goEdit,
        },
        {
          text: "删 除",
          status: [0, 2],
          handleClick: this.handleDelete,
        },
        {
          text: "返 回",
          status: [0, 1, 2],
          handleClick: this.reBack,
        },
      ],
    };
  },
  created() {
    this["dictionary/getDictionary"](["status"]);
    const curPage = this.pageType[this.$route.name];
    // console.log('n==', curPage);
    this.currPage = curPage;
    const { lists, formRules } = formConfig(curPage);
    this.formConfig = {
      ...this.formConfig,
      lists,
      formRules,
      afterMounted: () => {
        if ([1, 2].includes(curPage)) {
          this.handleMoveSort();
        }
      },
    };
    this.handleInitRes();
  },
  methods: {
    async handleInitRes() {
      this.isInitRes = false;
      if ([2, 3].includes(this.currPage)) {
        const { id } = this.$route.query;
        const resData = (await getMailTemplateInfo(id)).data;
        const { contentMpeList, subjectMpeList, createUserName, ...initData } =
          resData;
        this.selectedTitList = subjectMpeList || [];
        this.selectedConList = contentMpeList || [];
        this.formConfig.formModel = {
          ...initData,
          createBy: createUserName,
        };
        if (this.currPage === 3) {
          if (resData.content) {
            const vOpt = {
              content: this.handleContent(resData.content),
              subject: resData.subject,
              contentMpeIdList: contentMpeList.map((e) => e.id),
              subjectMpeIdList: subjectMpeList.map((e) => e.id),
            };
            await previewMsgTemplate(vOpt).then((vRes) => {
              const { content, subject } = vRes.data || {};
              this.formConfig.formModel = {
                ...this.formConfig.formModel,
                content,
                subject,
              };
            });
          }
        }
      }
      this.isInitRes = true;
      if ([1, 2].includes(this.currPage)) {
        getMsgParamEntity({
          pageNum: 1,
          pageSize: 99999,
          stateEq: 1,
        }).then((res) => {
          this.optionalParams = res.rows || [];
          this.titleParams = res.rows || [];
        });
      }
    },
    titParamsChange(tItem) {
      // console.log("tItem, tIdx===", tItem);
      // const { subject } = this.$refs.formRef?.getFormParams();
      // this.$refs.formRef.setFormModel({
      //   subject: `${subject}%s`, // 需要获取鼠标位置
      // });
    },

    selectTitCode(tItem) {
      this.selectedTitList.push(tItem);
    },

    selectConCode(oItem, oIdx) {
      // this.optionalParams.splice(oIdx, 1);
      this.selectedConList.push(oItem);
      // let { quill } = this.$refs.editorRef;
      // let { index } = quill.selection.savedRange;
      // quill.clipboard.dangerouslyPasteHTML(index, "%s"); // `<u>%s</u>`

      // console.log(quill);
    },
    delTitSelect(tIndex) {
      this.selectedTitList.splice(tIndex, 1);
    },
    delConSelect(sIndex) {
      this.selectedConList.splice(sIndex, 1);
    },

    onEditorReady(data) {
      //编辑器初始化,也可以选择在这编辑样式
    },
    onEditorChange(data, row) {
      //编辑器内容改变
      // console.log(data);
    },
    handlePreview() {
      const { content, subject } = this.$refs.formRef?.getFormParams();
      if (content && subject) {
        const vOpt = {
          content: this.handleContent(content),
          subject,
          contentMpeIdList: this.selectedConList.map((e) => e.id),
          subjectMpeIdList: this.selectedTitList.map((e) => e.id),
        };
        previewMsgTemplate(vOpt).then((vRes) => {
          this.previewHtml = vRes.data;
          this.dialogVisible = true;
        });
      } else {
        this.msgError("请输入邮件主题与模板内容");
      }
    },
    handleSave(tStatus) {
      this.templateStatus = tStatus;
      this.$refs.formRef.submitForm();
    },
    handleSubmit(formModel) {
      // console.log("------------------", formModel);
      const { content, title, subject, defaultCcRecipient } = formModel;
      const { id } = this.$route.query;
      return this.comRepeatedRequest(this, postMsgTemplate, {
        id,
        content: this.handleContent(content),
        title,
        subject,
        defaultCcRecipient,
        state: this.templateStatus,
        contentMpeIdList: this.selectedConList.map((e) => e.id),
        subjectMpeIdList: this.selectedTitList.map((e) => e.id),
      });
    },
    handleContent(mailContent) {
      const arr = mailContent.match(/ql-indent-[1-9]/g);
      let str = mailContent;
      if (arr) {
        arr.forEach((i) => {
          const num = Number(i.replace("ql-indent-", ""));
          str = str.replaceAll(i, `padding-left:${3 * num}em;`);
        });
      }

      return str
        .replaceAll("class", "style")
        .replaceAll(
          "ql-font-serif",
          "font-family:Georgia, Times New Roman, serif;"
        )
        .replaceAll(
          "ql-font-monospace",
          "font-family:Monaco, Courier New, monospace;"
        )
        .replaceAll("ql-size-small", "font-size:0.75em;")
        .replaceAll("ql-size-large", "font-size:1.5em;")
        .replaceAll("ql-size-huge", "font-size:2.5em;")
        .replaceAll("ql-align-center", "text-align:center;")
        .replaceAll("ql-align-right", "text-align:right;");
    },
    handleStatus() {
      const { id } = this.$route.query;
      this.comRepeatedRequest(this, updateMailTemplate, id).then(() => {
        this.msgSuccess("操作成功");
        this.handleInitRes();
      });
    },
    handleDelete() {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => deleteMailTemplate(this.$route.query.id),
        },
        () => {
          this.msgSuccess("删除成功");
          this.reBack();
        }
      );
    },
    handleMoveSort() {
      // 拖拽排序
      setTimeout(() => {
        let that = this;
        new Sortable(document.getElementById("moveSort"), {
          sort: true,
          animation: 150,
          onEnd: function (evt) {
            that.selectedConList.splice(
              evt.newIndex,
              0,
              that.selectedConList.splice(evt.oldIndex, 1)[0]
            );
            let newArr = that.selectedConList.slice(0);
            that.selectedConList = [];
            that.$nextTick(() => {
              that.selectedConList = newArr;
            });
          },
        });

        new Sortable(document.getElementById("moveTitSort"), {
          sort: true,
          animation: 150,
          onEnd: function (evt) {
            that.selectedTitList.splice(
              evt.newIndex,
              0,
              that.selectedTitList.splice(evt.oldIndex, 1)[0]
            );
            let newArr = that.selectedTitList.slice(0);
            that.selectedTitList = [];
            that.$nextTick(() => {
              that.selectedTitList = newArr;
            });
          },
        });
      }, 300);
    },
    goEdit() {
      this.$refs.detailTopRef?.toPageRoute(
        "/messageService/mailAmin/editTemplate",
        this.$route.query
      );
    },
    handleTopClick({ type, id }) {
      if (["pre", "next"].includes(type)) {
        this.handleInitRes();
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .ql-snow .ql-picker-label::before {
    vertical-align: top;
  }
  .ql-snow .ql-color-picker .ql-picker-label svg,
  .ql-snow .ql-icon-picker .ql-picker-label svg {
    vertical-align: top;
  }
}
.app-content-container {
  min-height: calc(100vh - 80px);

  .template-from {
    // width: 920px;
    .quill-editor {
      height: 360px;
      /deep/ .ql-container {
        height: calc(100% - 50px);
        .ql-editor {
        }
      }
    }
    /deep/ u {
      color: #5094ff;
    }
    .mail-content {
      background: #f0f6ff;
      border-radius: 4px;
      max-height: 500px;
      overflow-y: auto;
      padding: 20px 20px 30px;
      &::-webkit-scrollbar {
        width: 6px;
      }
    }
    .btn {
      display: flex;
      flex-wrap: wrap;
      padding: 15px;
      border-radius: 4px;
      background: #f8f8f8;
      div {
        min-width: 93px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        padding: 0 10px;
        border-radius: 2px;
        cursor: pointer;
        background: rgba(80, 148, 255, 0.1);
        margin-bottom: 10px;
        margin-right: 10px;
      }
      // .options-txt {
      //   cursor: pointer;
      // }
      .selected-txt {
        color: #5094ff;
        position: relative;
        .el-icon-error {
          position: absolute;
          right: -3px;
          top: -3px;
          color: #ff6767;
          cursor: pointer;
        }
      }
      .noData {
        color: #8b8b8b;
      }
    }
  }
}
</style>
