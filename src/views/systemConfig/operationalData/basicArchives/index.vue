<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComTree
              :data="treeConfig.treeData"
              :handleNodeClick="handleTreeClick"
              :defaultProps="treeConfig.defaultProps"
              :nodeKey="treeConfig.nodeKey"
              :searchConfig="treeConfig.searchConfig"
              :rgWidth="55"
              :className="'tree-basic-archives'"
            >
              <template v-slot:treeContent="{ data }">
                <svg-icon
                  icon-class="tree-circle-plus"
                  @click.stop="
                    () =>
                      handleUpdate({
                        ...data,
                        btnDictionaryType: 2,
                      })
                  "
                />
                <svg-icon
                  icon-class="tree-icon-edit"
                  @click.stop="
                    () =>
                      handleUpdate({
                        ...data,
                        btnDictionaryType: 1,
                      })
                  "
                  class-name="tree-edit-icon"
                />
                <svg-icon
                  icon-class="tree-delete-solid"
                  @click.stop="
                    () =>
                      handleDelete({
                        ...data,
                        btnDictionaryType: 1,
                      })
                  "
                />
              </template>
              <template v-slot:treeFooter>
                <!-- v-if="treeTotal > treePaginationConfig.limit" -->
                <my-pagination
                  :page="treeStart"
                  :limit="treePaginationConfig.limit"
                  :total="treeTotal"
                  :small="true"
                  v-if="!!treeTotal"
                  className="small-paging"
                  :layout="treePaginationConfig.layout"
                  @pagination="handlePagination"
                />
              </template>
              <template v-slot:default>
                <ComForm
                  ref="mySearchForm"
                  :formConfig="searchFormConfig"
                  v-if="showSearchForm && tabsConfig.activeName === tab.name"
                >
                </ComForm>
                <keep-alive v-if="mixinShowTable">
                  <ComTable
                    :ref="`tableRef${tab.name}`"
                    v-if="tabsConfig.activeName === tab.name"
                    :tableHeight="addressTable.tableHeight"
                    :columnConfig="addressTable.columnConfig"
                    :httpRequest="addressTable.httpRequest"
                    :getQueryParams="getQueryParams"
                    :rowOperationBtnListFn="() => customerTable.statusBtnList"
                  />
                </keep-alive>
              </template>
            </ComTree>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig.addOrEdit"
      :dialogBoxCenter="true"
      :class="[
        this.btnDictionaryType === 1 ? 'dictionary-type' : 'dictionaries-data',
      ]"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="updateFormConfig"
          class="dialog-form"
          v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
        />
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getBasicDataList,
  getBasicArchivesTreeList,
  addOperateDataType,
  updateOperateDataType,
  delOperateDataType,
  addOperateData,
  updateOperateData,
  delOperateData,
} from "@/api/operationalData";
import { msgBox } from "@/utils/confirmBox.js";
import { delLastPageUp } from "@/utils/index";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  searchColumns,
  tableColumns,
  dictionaryType,
  dataDictionary,
} from "./model";

const dataDictionaryLists = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: dataDictionary.columns,
          },
        ],
      },
    ],
  },
];
const dictionaryTypeLists = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: dictionaryType.columns,
          },
        ],
      },
    ],
  },
];
export default {
  name: "BasicArchives",
  mixins: [mixinColsConf],
  components: {
    ComTree: () => import("_comp/ComTree"),
    ComDialog: () => import("_comp/ComDialog"),
    MyPagination: () => import("_comp/ComTable/MyPagination"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "基础档案",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增类型",
            handleClick: this.handleUpdate.bind(this, {
              btnDictionaryType: 1,
            }),
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getBasicDataList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        // expansion: false,
        size: "small",
        labelWidth: "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      addressTable: {
        tableHeight: "calc(100vh - 262px)",
        httpRequest: (query) => getBasicDataList(query, true),
        columnConfig: tableColumns,
      },
      treeConfig: {
        nodeKey: "id",
        defaultProps: {
          children: "children",
          label: "name",
        },
        treeData: [],
        searchConfig: {
          show: true,
          handleSearch: this.getBasicArchivesTreeList,
        },
      },
      addVisible: false,
      treeStart: 1,
      treeTotal: 0,
      treePaginationConfig: {
        limit: 20,
        layout: "total, prev, jumper, next",
      },
      treeNameCn: "",
      customDialogConfig: {
        addOrEdit: {
          width: "850px",
          dataStatus: 0,
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
              text: "确定",
              type: "primary",
              handleClick: () => {
                this.$refs.dialogForm.submitForm();
              },
            },
          ],
        },
      },
      updateFormConfig: {
        formModel: {},
        httpRequest: this.addOrEditBasicFile, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "110px",
      },
      btnDictionaryType: null,
      customerTable: {
        tableHeight: "calc(100vh - 324px)",
        statusBtnList: [
          {
            text: "修改",
            handleClick: this.handleUpdate,
          },
          {
            text: "删除",
            color: "#FF6767",
            handleClick: this.handleDelete,
          },
        ],
      },
    };
  },
  created() {
    this["dictionary/getDictionary"](["normalShutdown"]);
    this.getBasicArchivesTreeList();
    this.showSearchForm = true;
    this.activeName = `tableRef${this.tabsConfig.activeName}`;
  },
  mounted() {},
  methods: {
    getBasicArchivesTreeList(nameCn) {
      this.treeConfig.treeData = [];
      this.treeNameCn = nameCn;
      getBasicArchivesTreeList({
        name: nameCn,
        pageNum: this.treeStart,
        pageSize: this.treePaginationConfig.limit || 999,
      }).then((res) => {
        this.treeTotal = res.total || 0;
        res.rows.forEach((item) => {
          this.treeConfig.treeData.push({
            id: item.id,
            name: item.name,
            type: item.type,
          });
        });
      });
    },
    getBasicDataList(searchFrom = {}) {
      this.$set(this.searchFromData, "nameCn", searchFrom.name);
      if (searchFrom.createTime) {
        this.searchFromData.beginTime = searchFrom.createTime.join("@");
      } else {
        this.$set(this.searchFromData, "beginTime");
      }
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    handleTreeClick(data) {
      this.searchFromData = {
        type: data.name || "",
      };
      this.$refs.mySearchForm[0].resetForm();
    },
    // 类型树分页
    handlePagination({ page }) {
      this.treeStart = page;
      this.getBasicArchivesTreeList(this.treeNameCn);
    },
    // 新增/编辑 类型/数据字典
    handleUpdate(row = {}) {
      // console.log('handleUpdate===', row)
      let titText = "新增类型";
      if (!row.id) {
        this.updateFormConfig.formModel = {};
      } else {
        if (row.btnDictionaryType === 2) {
          this.updateFormConfig.formModel = {
            type: row.name,
            typeEn: row.type,
          };
        } else {
          this.updateFormConfig.formModel = {
            ...row,
          };
        }
      }
      if (row.btnDictionaryType === 1) {
        titText = "类型";
        this.updateFormConfig.lists = dictionaryTypeLists;
        this.updateFormConfig.formRules = dictionaryType.formRules;
      } else {
        titText = "数据字典";
        this.updateFormConfig.lists = dataDictionaryLists; // 表单渲染列表
        this.updateFormConfig.formRules = dataDictionary.formRules; // 表单校验规则
      }
      this.btnDictionaryType = row.btnDictionaryType;
      this.customDialogConfig.addOrEdit.title =
        (row.id ? "编辑" : "新增") + titText;

      this.$refs.customDialog.show();
    },
    addOrEditBasicFile(formModel) {
      let params = { ...formModel };
      if (formModel.type?.id) {
        params.type = formModel.type.name;
        params.typeEn = formModel.type.type;
      }
      // console.log('formModel===', formModel, params)
      if (this.btnDictionaryType === 1) {
        delete params.btnDictionaryType;
        if (params.id) {
          delete params.type;
          return updateOperateDataType(params);
        }
        return addOperateDataType(params);
      }
      if (params.id) {
        return updateOperateData(params);
      }
      return addOperateData(params);
    },
    handleSuccess() {
      this.$refs.customDialog.hide();
      if (this.btnDictionaryType === 1) {
        // 刷新类型树数据
        this.getBasicArchivesTreeList(this.treeNameCn);
      } else {
        // 更新table数据
        this.mixinkeepTable();
      }
    },
    handleDelete(rows) {
      // console.log('rows===', rows, this.searchFromData)
      if (rows.id) {
        const msg = "删除操作不可逆！";
        const title = "删除提示";
        const className = "el-icon-warning text-warning";

        msgBox(this, { title, className, msg }, () => {
          if (rows.btnDictionaryType === 1) {
            // 刷新类型树数据
            delOperateDataType(rows.id).then(() => {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              // 删除页面最后一条数据，向上翻页
              const page = delLastPageUp(
                this.treeTotal,
                this.treeStart,
                this.treePaginationConfig.limit
              );
              this.handlePagination({ page });
              // 删除当前选中节点，刷新表格
              if (rows.name === this.searchFromData?.type) {
                this.searchFromData = {
                  type: "",
                };
                this.mixinkeepTable();
              }
            });
          } else {
            delOperateData(rows.id).then(() => {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.mixinkeepTable();
            });
          }
        });
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-content {
  .btn {
    display: flex;

    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;

      &.operate-icon-info {
        color: #606060;
      }

      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
.tree-edit-icon {
  margin-left: 6px;
  margin-right: 6px;
}
.dialog-form {
  padding-right: 30px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
.historical-records {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .historical-records-title {
    font-size: 16px;
    margin-right: 21px;
    color: #1f1f1f;
  }

  .historical-records-sub {
    color: #666;

    i {
      margin-right: 10px;
    }
  }
}
.small-paging {
  padding: 15px 10px 20px;
}
</style>
