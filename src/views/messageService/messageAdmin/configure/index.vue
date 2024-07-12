<template>
  <div class="app-container">
    <div class="flex" v-if="showListForm">
      <div class="right">
        <div
          v-for="(item, key) in dataList"
          :key="key"
          :class="activeTree === key && 'active'"
          @click="handleClick(key)"
        >
          {{ messageModule[key] || "--" }}
        </div>
      </div>
      <div class="left">
        <ComTabs :tabsConfig="tabsConfig">
          <template v-for="(tab, key) in dataList[activeTree]">
            <el-tab-pane
              :label="tab.triggerName"
              :name="key"
              :key="key"
              v-if="tabsList.includes(key) || tabsConfig.activeName == key"
            >
              <keep-alive>
                {{ key }}
                <ComForm
                  :ref="`myForm_${key}`"
                  :formConfig="{ ...formConfig, formModel: tab }"
                  v-if="tabsConfig.activeName == key"
                >
                  <template v-slot:msgContent="slotProps">
                    <div class="template">
                      <div class="">
                        <span class="">操作人：</span>
                        <el-radio-group v-model="slotProps.formModel.flagPush">
                          <el-radio key="y" label="y">推送</el-radio>
                          <el-radio key="n" label="n">不推送</el-radio>
                        </el-radio-group>
                      </div>
                      <div>
                        {{ slotProps.formModel.msgTypeCode }} |
                        {{ slotProps.dicsData.nameCn || "--" }}
                      </div>
                    </div>
                    <quill-editor
                      v-model="slotProps.formModel.msgContent"
                      class="message-template"
                      :ref="`quillEditor_${key}`"
                      :options="editorOption"
                      @change="onEditorChange($event, key)"
                      @ready="onEditorReady($event, key)"
                    >
                    </quill-editor>
                  </template>
                </ComForm>
              </keep-alive>
              <div class="tab-right">
                <div class="btn-title">可选字段(点击添加)</div>
                <div
                  class="btn"
                  v-if="
                    paramList[tab.msgModu] &&
                    Object.keys(paramList[tab.msgModu]).length
                  "
                >
                  <div
                    v-for="(item, i) in paramList[tab.msgModu]"
                    :key="i"
                    @click="selectCode(i, key)"
                  >
                    {{ i }}
                  </div>
                </div>
                <div class="no-data" v-else>暂无可选字段</div>
              </div>
            </el-tab-pane>
          </template>
          <template
            v-slot:slotTabsRight
            v-if="
              dataList[activeTree] &&
              Object.keys(dataList[activeTree]).length > 6
            "
          >
            <el-dropdown @command="handleCommand">
              <el-button type="text" size="small" class="tab-more">
                更多<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <template v-for="(tab, key) in dataList[activeTree]">
                  <el-dropdown-item
                    v-if="
                      !tabsList.includes(key) && tabsConfig.activeName != key
                    "
                    :key="key"
                    :command="
                      () => {
                        tabsConfig.activeName = key;
                      }
                    "
                    :class="tabsConfig.activeName == key ? 'select-tab' : ''"
                  >
                    {{ tab.triggerName }}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </ComTabs>
        <div class="footer-btn">
          <el-button type="info" @click="reBack"> 取 消 </el-button>
          <el-button type="primary" @click="handleSave" v-debounce>
            确 定
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { formConfig } from "./model";
import {
  getConfigList,
  updateConfig,
  getMsgModuleParamEnum,
  getMsgConfigModuleEnum,
} from "@/api/messageService";
import { mapActions, mapState } from "vuex";
export default {
  name: "Configure",
  mixins: [mixinColsConf],
  components: {
    quillEditor,
  },
  data() {
    return {
      editorOption: {
        //编辑器的样式
        modules: {
          toolbar: null,
        },
        placeholder: "请输入内容",
      },
      activeTree: null,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.getMsgModuleParamEnum();
          });
        },
        tabs: [],
        btnArr: [],
      },
      formConfig: {
        formModel: {
          pushStatus: 0,
        },
        httpRequest: () => {}, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        size: "small",
        labelWidth: "76px",
        formRules: formConfig.formRules, // 表单校验规则
        lists: formConfig.lists,
      },
      messageModule: {},
      dataList: [],
      showListForm: false,
      paramList: {},
      tabsMax: 6,
      tabsList: [],
    };
  },
  created() {
    this.getMsgConfigModuleEnum();
  },
  mounted() {
    this.handleReSize();
    window.addEventListener("resize", this.handleReSize);
  },
  methods: {
    handleReSize() {
      const tabsMax = Math.round(
        (document.documentElement.clientWidth - 440) / 150
      );
      this.tabsMax = tabsMax < 4 ? 4 : tabsMax;
      if (this.dataList && this.dataList[this.activeTree]) {
        this.tabsList = this.handleTabsMore(this.dataList[this.activeTree]);
      }
    },
    getMsgConfigModuleEnum() {
      getMsgConfigModuleEnum().then(({ data }) => {
        this.messageModule = data;
        this.showListForm = true;
        this.getConfigList();
      });
    },
    getConfigList() {
      getConfigList().then(({ data }) => {
        if (this.activeTree === null) {
          this.activeTree = Object.keys(data)[0];
          this.tabsConfig.activeName = Object.keys(data[this.activeTree])[0];
          this.tabsList = this.handleTabsMore(data[this.activeTree]);
        }
        this.dataList = data;
        this.getMsgModuleParamEnum();
      });
    },
    getMsgModuleParamEnum() {
      const { msgModu } =
        this.dataList[this.activeTree][this.tabsConfig.activeName];
      if (this.paramList[msgModu]) return;
      getMsgModuleParamEnum({ msgModu }).then(({ data }) => {
        this.paramList = {
          ...this.paramList,
          [msgModu]: data,
        };
      });
    },
    selectCode(label, key) {
      console.log(this.$refs[`quillEditor_${key}`]);
      let quill = this.$refs[`quillEditor_${key}`][0].quill;
      let index = quill.selection.savedRange.index;
      quill.clipboard.dangerouslyPasteHTML(index, `{<u>${label}</u>}`);
      console.log(quill);
    },
    onEditorReady(data) {
      //编辑器初始化,也可以选择在这编辑样式
      console.log("------------------", data);
    },
    onEditorChange(data, key) {
      //编辑器内容改变
      console.log(refs);
    },
    handleClick(key) {
      this.activeTree = key;
      this.tabsConfig.activeName = Object.keys(this.dataList[key])[0];
      this.tabsList = this.handleTabsMore(this.dataList[key]);
      this.getMsgModuleParamEnum();
    },
    handleSave() {
      const params =
        this.$refs[`myForm_${this.tabsConfig.activeName}`][0]?.getFormParams();
      updateConfig(params).then(() => {
        this.$message.success("修改成功");
        this.getConfigList();
      });
    },
    reBack() {
      history.go(-1);
    },
    handleCommand(cb) {
      cb && cb();
    },
    handleTabsMore(obj = {}) {
      const list = Object.keys(obj);
      if (list.length <= this.tabsMax) return list;
      return list.slice(0, this.tabsMax);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .select-tab {
    background-color: #e8f0ff;
  }
}
.app-container {
  min-width: 897px;
  padding: 0;
  .flex {
    display: flex;
    min-height: calc(100vh - 80px);
    .right {
      width: 160px;
      padding-top: 13px;
      border-right: 1px solid #e2e2e2;

      & > div {
        height: 30px;
        line-height: 30px;
        padding-left: 27px;
        border-left: 3px solid transparent;
        cursor: pointer;
        &.active {
          border-left-color: #5094ff;
          background: rgba(80, 148, 255, 0.15);
        }
      }
    }
    .left {
      width: calc(100% - 160px);
      padding: 13px 20px;
      position: relative;
      /deep/ {
        .el-tabs__header {
          margin-bottom: 20px;
        }
        .tabs-right-btn {
          top: 0;
          .tab-more i {
            margin-left: 0;
          }
        }
      }
      .el-tab-pane {
        display: flex;
        .form-class {
          flex: 1;
          margin-top: 10px;
        }
        .tab-right {
          width: 226px;
          min-height: 234px;
          padding: 15px;
          border-radius: 4px;
          background: #f8f8f8;
          margin-left: 20px;
          .btn-title {
            font-weight: bold;
            margin-bottom: 20px;
          }
          .btn {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            div {
              width: 93px;
              height: 26px;
              line-height: 26px;
              text-align: center;
              border-radius: 2px;
              color: #5094ff;
              background: rgba(80, 148, 255, 0.1);
              margin-bottom: 10px;
              cursor: pointer;
            }
          }
          .no-data {
            color: #8b8b8b;
          }
        }
      }
      .template {
        display: flex;
        justify-content: space-between;
        span {
          color: #8b8b8b;
          margin-right: 70px;
        }
      }
      .message-template {
        height: 120px;
        line-height: 18px;
        /deep/.ql-container {
          border: 1px solid #bcbcbc;
          border-radius: 4px;

          .ql-editor {
            u {
              color: #5094ff;
            }
          }
        }

        span {
          color: #5094ff;
          text-decoration: underline;
        }
      }
      .footer-btn {
        position: absolute;
        bottom: 0;
        width: calc(100% - 40px);
        padding: 20px 0 30px;
        border-top: 1px solid #e2e2e2;
        text-align: right;
      }
    }
  }
}
</style>