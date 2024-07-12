<template>
  <!-- 新页面 -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive>
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'name'">
                  <span
                    class="primary-text-btn"
                    @click="
                      handleView(slotProps.row, {
                        path: '/costScheme/costSchemeDetails',
                      })
                    "
                  >
                    {{ slotProps.row.name || "--" }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content">
                    <div class="btn">
                      <template v-for="(item, index) in statusList">
                        <el-button
                          :class="`operate-icon ${
                            item.info ? 'operate-icon-info' : ''
                          }`"
                          :style="{
                            color: item.color ? item.color : '#5094ff',
                          }"
                          size="small"
                          type="text"
                          @click="item.handleClick(slotProps.row)"
                          :key="index"
                          v-debounce
                          v-if="
                            item.status.includes(slotProps.row.status) &&
                            item.type != 'preview'
                          "
                        >
                          {{ item.text }}
                        </el-button>
                        <span
                          class="btn-preview"
                          :key="index"
                          v-else-if="
                            item.status.includes(slotProps.row.status) &&
                            item.type == 'preview'
                          "
                        >
                          <PreviewOrDownload
                            btnTxt="预览"
                            :previewDownloadConf="
                              previewDownloadConfig(slotProps.row)
                            "
                          />
                        </span>
                      </template>
                    </div>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialog" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { customerPrice } from "../components/model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinCostScheme } from "../components/costSchemeMixin.js";
import {
  getSchemePage,
  deleteScheme,
  updateSchemeStatus,
  copyScheme,
  putSchemeUpdEnablingTime,
  putSchemeCancelUp,
  upgradeScheme
} from "@/api/costScheme/index.js";
export default {
  name: "CustomerPrice",
  mixins: [mixinCostScheme, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        type: "customerPrice",
        handleTabsClick: () => {},
        tabs: [
          {
            label: "客户项目费用价格",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: (row) => {
              this.handleAdd(row, {
                path: "/costScheme/costSchemeAddEdit",
                operationType: "add",
                costType: 2,
              });
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.searchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "100px",
        lists: customerPrice.formLists, // 表单渲染列表
        formRules: {}, // 表单校验规则
      },

      tableConfig: {
        httpRequest: getSchemePage,
        tableHeight: "calc(100vh - 264px)",
        columnData: [],
      },
      statusList: [
        //1-草稿 2-已启用 3-已禁用 4-已过期
        {
          text: "复制",
          status: [1, 2, 3, 4],
          handleClick: (row) => {
            const { id } = row;
            this.handleCopy(
              { id },
              {
                httpRequest: copyScheme,
                path: "/costScheme/costSchemeAddEdit",
                operationType: "edit",
              }
            );
          },
        },
        {
          text: "修改",
          status: [1],
          handleClick: (formModel) => {
            this.handleAdd(formModel, {
              path: "/costScheme/costSchemeAddEdit",
              operationType: "edit",
            });
          },
        },
        {
          text: "升级",
          status: [2],
          handleClick: (formModel) => {
            this.upgradeScheme(formModel,{
              httpRequest:upgradeScheme,
              path: "/costScheme/costSchemeAddEdit",
              operationType: "edit",
            });
          },
        },
        {
          text: "修改生效时间",
          status: [5],
          handleClick: (formModel) => {
            this.handleChangeState(formModel, {
              type: 1,
              httpRequest: putSchemeUpdEnablingTime,
            });
          },
        },
        {
          text: "取消",
          status: [5],
          handleClick: (formModel) => {
            this.handleCancel(formModel, {
              httpRequest: putSchemeCancelUp,
            });
          },
        },
        {
          text: "删除",
          status: [1],
          color: "#FF6767",
          handleClick: (formModel) => {
            this.handleDelete(formModel, {
              httpRequest: deleteScheme,
            });
          },
        },
        {
          text: "启用",
          status: [1, 3],
          handleClick: (formModel) => {
            const { status } = formModel;
            if (status == 3) {
              this.handleEffectuate(formModel,{
                  httpRequest: updateSchemeStatus,
                  requestParams:{
                    status:2
                  }
                })
            } else {
              this.handleChangeState(formModel, {
                type: 0,
                httpRequest: updateSchemeStatus,
              });
            }
          },
        },
        {
          text: "禁用",
          status: [2],
          color: "#FF6767",
          handleClick: (formModel) => {
            this.handleChangeStatus(formModel, {
              status: 3,
              httpRequest: updateSchemeStatus,
            });
          },
        },
        // {
        //   text: "预览",
        //   type: "preview",
        //   status: [1, 2, 3, 4],
        //   handleClick: (formModel) => {
        //     // this.handlePreview(formModel);
        //   },
        // },
      ],
      mixinTableColArr: [customerPrice.tableLists],
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this.searchFromData={
      status:['1','2']
    }
    this.searchFormConfig.formModel=this.searchFromData
    this["dictionary/getDictionary"]("customsClearance").then((res) => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .btn-color {
    background: #ff813d;
    font-weight: bold;
    /deep/.el-icon-plus {
      font-weight: bold;
    }
  }
  .btn {
    &-preview {
      margin-left: 10px;
    }
  }
}
</style>
