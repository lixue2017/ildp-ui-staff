<template>
  <div class="table-tag">
    <div class="tag-top tag-flex">
      <div class="title">
        <span>{{ columnConfig.title }}</span>
      </div>
      <template
        v-if="
          Object.keys(dictionary.dicsData).length &&
          dictionary.dicsData[columnConfig.tabConfig]
        "
      >
        <el-radio-group
          size="mini"
          v-model="tabActive"
          @change="handleTabChange"
        >
          <el-radio-button label="">全部</el-radio-button>
          <template v-for="item in dictionary.dicsData[columnConfig.tabConfig]">
            <el-radio-button
              :key="item.value"
              :label="item.value"
              v-if="
                !columnConfig.showList ||
                columnConfig.showList.includes(+item.value)
              "
              >{{ item.nameCn }}</el-radio-button
            >
          </template>
        </el-radio-group>
      </template>
      <div v-else class="title-search">
        <!-- 航次信息详情左边栏搜索 -->
        <el-input v-model="routeSonoSearch" size="small" @keyup.enter.native="getNewSono" @focus="getNewSono" placeholder="请输入SONo或工作单号"></el-input>
      </div>
    </div>
    <div class="content">
      <template v-for="row in tableData">
        <div
          :class="`item tag-flex ${
            row.id === (tableActive && tableActive.id) ? 'active' : ''
          }`"
          :key="row.id"
          @click="handleTableChange(row)"
        >
          <!-- <template v-if="columnConfig.tag">
            dicsList( dicsListParams( fieldItem.basicType, formModel,
            fieldItem.basicTypeVal || fieldItem.id ) )
          </template> -->
          <div
            class="item-left"
            :style="{
              color: handleTag(row).color || '#8B8B8B',
              borderColor: handleTag(row).color || '#E2E2E2',
            }"
          >
            {{ handleTag(row).nameCn || "--" }}
          </div>
          <div class="item-right">
            <div class="item-top tag-flex" v-if="columnConfig.top">
              <template v-for="column in columnConfig.top">
                <TooltipOver
                  v-if="column.type !== 'slot'"
                  :key="column.prop"
                  :content="
                    column.render
                      ? column.render(
                          row,
                          dicsListName(
                            dicsListParams(
                              column.basicType,
                              row,
                              column.basicTypeVal || column.prop
                            )
                          )
                        )
                      : column.basicType
                      ? dicsListName(
                          dicsListParams(
                            column.basicType,
                            row,
                            column.basicTypeVal || column.prop
                          )
                        )
                      : row[column.prop] || '--'
                  "
                  refName="tooltipOver"
                  :style="{ width: `${column.width}px` || '100%' }"
                />
                <slot
                  v-else
                  :name="column.prop"
                  :slotProps="{
                    prop: column.prop,
                    row,
                    dicsList:
                      column.basicType &&
                      dicsList(
                        dicsListParams(
                          column.basicType,
                          row,
                          column.basicTypeVal || column.prop
                        )
                      ),
                  }"
                />
              </template>
            </div>
            <div
              v-for="(fieldItem, index) in columnConfig.Appendix"
              :key="index"
            >
              <template>
                <ComUpload
                  :class="[fieldItem.detailDisplay && 'file-detail-display']"
                  :uploadConfig="
                    Object.assign(
                      { ...uploadConfig, fileList: row.attachList || [] },
                      {
                        disabled: fieldItem.disable,
                        pasteUpload: fieldItem.pasteUpload,
                      }
                    )
                  "
                />
              </template>
              <!-- <slot :name="item.prop" :slotProps="columnConfig"> </slot> -->
            </div>
            <div class="item-bottom tag-flex" v-if="columnConfig.bottom">
              <template v-for="column in columnConfig.bottom">
                <TooltipOver
                  v-if="column.type !== 'slot'"
                  :key="column.prop"
                  :content="
                    column.render
                      ? column.render(
                          row,
                          dicsListName(
                            dicsListParams(
                              column.basicType,
                              row,
                              column.basicTypeVal || column.prop
                            )
                          )
                        )
                      : column.basicType
                      ? dicsListName(
                          dicsListParams(
                            column.basicType,
                            row,
                            column.basicTypeVal || column.prop
                          )
                        )
                      : row[column.prop] || '--'
                  "
                  refName="tooltipOver"
                  :style="{
                    width: `${column.width ? `${column.width}px` : '100%'}`,
                  }"
                />
                <slot
                  v-else
                  :name="column.prop"
                  :slotProps="{
                    prop: column.prop,
                    row,
                    dicsList:
                      column.basicType &&
                      dicsList(
                        dicsListParams(
                          column.basicType,
                          row,
                          column.basicTypeVal || column.prop
                        )
                      ),
                  }"
                />
              </template>
            </div>
          </div>
        </div>
      </template>
      <div class="table-empty" v-if="!tableData.length">
        <img :src="noDataImg" alt="" srcset="" width="150px" />
        <div>
          没有列表数据哦～ <br />
          快去添加吧！
        </div>
      </div>
    </div>
    <my-pagination
      v-if="pagination"
      :page="start"
      :limit="paginationConfig.limit"
      :total="total"
      :layout="paginationConfig.layout"
      @pagination="handlePagination"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import noDataImg from "@/assets/image/noData.png";
import { defaultTextParams } from "_comp/ComUpload/model";

export default {
  components: {
    MyPagination: () => import("_comp/ComTable/MyPagination"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ComUpload: () => import("_comp/ComUpload"),
  },
  props: {
    columnConfig: {
      type: Object,
      default: () => {
        return {
          title: "",
          tabConfig: "",
          tag: null,
          top: [],
          bottom: [],
        };
      },
    },
    httpRequest: {
      type: Function,
      default: () => {},
    },
    getQueryParams: {
      type: Function,
      default: () => {},
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    paginationConfig: {
      type: Object,
      default: () => {
        return {
          limit: 10,
          layout: "total, prev, pager, next",
        };
      },
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      noDataImg,
      tabActive: "",
      tableActive: {},
      start: 1,
      tableData: [],
      total: 0,
      query: {},
      loading: false,
      uploadConfig: {
        ...defaultTextParams,
        fileList: [],
      },
      routeSonoSearch:''
    };
  },
  computed: {
    ...mapState(["dictionary"]),
    dicsListParams() {
      return (basicType, row, rowProp) => {
        return {
          basicType,
          row,
          rowProp,
        };
      };
    },
    dicsList() {
      return (params) => {
        const rowDics = params.row[params.rowProp];
        const basicType = this.dictionary.dicsData[params.basicType];
        const hasBasicType = this.dictionary.dicsData && basicType;
        if (!hasBasicType)
          return {
            nameCn: "",
            color: "",
          };
        let arr = [];
        if (rowDics && rowDics.length > 1) arr = rowDics.split(",");
        else arr = [rowDics];
        const nameCnArr = [];
        const colorArr = [];
        const basicTypeObj = {};
        basicType.forEach((item) => {
          basicTypeObj[item.value] = item;
        });
        arr.forEach((_, index) => {
          if (basicTypeObj[arr[index]]) {
            nameCnArr.push(basicTypeObj[arr[index]].nameCn);
            colorArr.push(basicTypeObj[arr[index]].color);
          }
        });
        return {
          nameCn: nameCnArr.toString(),
          color: colorArr.toString(),
        };
      };
    },
    dicsListName() {
      return (params) => {
        return this.dicsList(params).nameCn;
      };
    },
  },
  mounted() {
    // this.getTableData(this.getQueryParams());
    const {operationOrderNum=undefined}=this.formData||{}
    this.routeSonoSearch=operationOrderNum
    this.getNewSono()
  },
  methods: {
    handleTag(data) {
      //修改为isMainBill=1为拼，isMainBill=0为整,与数据字典对不上
      if (data.type === 10) {
        return {
          nameCn: "拼",
          borderColor: "#E2E2E2",
          color: "#8B8B8B",
        };
      } else if (data.type === 20) {
        return {
          nameCn: "整",
          borderColor: "#E2E2E2",
          color: "#8B8B8B",
        };
      } else {
        return {
          nameCn: "散",
          borderColor: "#E2E2E2",
          color: "#8B8B8B",
        };
      }
      // if (!data) {
      //   return {
      //     color: "",
      //     nameCn: "",
      //   };
      // }
      // console.log(data);
      // console.log(this.columnConfig);
      // const { color, nameCn } = this.columnConfig.tag.basicType
      //   ? this.dicsList(
      //       this.dicsListParams(
      //         this.columnConfig.tag.basicType,
      //         data,
      //         this.columnConfig.tag.basicTypeVal || this.columnConfig.tag.prop
      //       )
      //     )
      //   : {};
      // return {
      //   color,
      //   nameCn: nameCn && nameCn.slice(0, 1),
      // };
    },
    getTableData(params) {
      if (params) {
        this.query = params;
      }
      this.loading = true;
      if (this.columnData) {
        this.tableData = this.columnData;
        this.loading = false;
      } else {
        this.httpRequest({
          ...this.query,
          pageNum: this.start,
          pageSize: this.paginationConfig.limit,
        })
          .then((result) => {
            this.loading = false;
            this.tableData = result.rows || [];
            // this.fileRequest(this.tableData);
            // this.tableData = [...result.rows];
            this.total = parseInt(result.total) || 0;
            // if (this.total) {
            //   this.tableActive = this.tableData[0];
            //   this.$emit("handleClick", this.tableActive);
            // } else {
            //   this.$emit("handleClick");
            // }
            this.$emit("getResult", {
              tableData: this.tableData,
              total: this.total,
            });
            if (this.tableData.length) {
              const changeRow = this.tableData.find(
                (e) => e.id === this.tableActive.id
              );
              if (changeRow) {
                this.handleTableChange(changeRow);
              } else {
                this.handleTableChange(this.tableData[0]); // 初始化默认选择第一行
              }
            }
          })
          .catch((err) => (this.loading = false));
      }
    },
    refreshTable(restart = true) {
      if (restart) {
        this.start = 1;
      }
      this.getTableData(this.getQueryParams());
    },
    handleTabChange() {
      console.log(this.tabActive);
      this.$emit("handleTabChange", this.tabActive);
      this.refreshTable(true);
    },
    handleTableChange(row) {
      this.tableActive = row;
      this.$emit("handleClick", this.tableActive);
    },
    handlePagination({ page, limit }) {
      this.start = page;
      this.paginationConfig.limit = limit;
      this.refreshTable(false);
    },
    getNewSono(){
      const obj = this.getQueryParams()
      const params={
        ...obj,
        operationOrderNumOrSoNo : this.routeSonoSearch,
      }
      this.getTableData(params);
    }
  },
};
</script>

<style lang="scss" scoped>
.table-tag {
  font-size: 13px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .tag-flex {
    display: flex;
    align-items: center;
  }
  .tag-top {
    justify-content: space-between;
    padding: 0 14px;
    .title {
      font-size: 14px;
    }
  }
  .content {
    position: relative;
    flex: 1;
    overflow-y: auto;
    padding-top: 15px;

    .el-button--text {
      padding: 0;
    }
    .item {
      padding: 0 14px;
      cursor: pointer;
      &:first-child {
        .item-right {
          border-top: 1px solid #e2e2e2;
        }
      }
      &:hover {
        background: #f4f8ff;
      }
      &.active {
        background: #e3edff;
      }
      .item-left {
        width: 26px;
        height: 26px;
        line-height: 24px;
        text-align: center;
        border: 1px solid;
        border-radius: 2px;
        margin-right: 9px;
      }
      .item-right {
        width: calc(100% - 38px);
        line-height: 18px;
        padding: 9px 0;
        border-bottom: 1px solid #e2e2e2;

        .item-top > div {
          padding-right: 10px;
          &:last-child {
            padding-right: 0;
          }
        }
        .item-bottom {
          color: #8b8b8b;
          & > div {
            padding-right: 10px;
            &:last-child {
              padding-right: 0;
            }
          }
        }
      }
    }
    .table-empty {
      width: 100%;
      position: absolute;
      top: 40%;
      transform: translateY(-50%);
      text-align: center;
      line-height: 20px;
      color: #919191;
      img {
        padding: 30px 0 14px;
      }
    }
  }
  /deep/.el-upload-list__item:first-child {
    margin: 5px 0px;
  }
}
</style>
