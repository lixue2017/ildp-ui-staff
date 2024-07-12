<template>
  <div :class="`tableData ${!tableData.length && 'noData'}`">
    <!-- 表头前后移动后用于更新DOM结构 -->
    <div v-if="isUpdateShowDomTime === 0" style="opacity: 0">x</div>
    <el-table
      ref="myTable"
      :data="tableData"
      :height="tableHeight"
      :max-height="tableHeight || maxTableHeight"
      border
      :lazy="treeLazyLoad.lazy"
      :load="treeLazyLoad.load"
      :show-header="extraConfig && extraConfig.showHeader !== false"
      :class="extraConfig.tClassName"
      :header-cell-class-name="`table-header-cell ${
        extraConfig && extraConfig.stripe && 'striped'
      }`"
      :header-row-class-name="`table-header-row ${
        extraConfig && extraConfig.multiline && 'table-header-height'
      }`"
      :row-class-name="rowClassName"
      :cell-class-name="`el-table__cell ${
        extraConfig && extraConfig.stripe && 'striped'
      }`"
      v-loading="loading"
      :stripe="
        extraConfig && extraConfig.stripe === false ? extraConfig.stripe : true
      "
      :highlight-current-row="currentRow"
      @current-change="handleCurrentChange"
      @select="onTableSelect"
      @select-all="onTableSelectAll"
      @header-dragend="onMixinHeaderDragend"
      :row-key="(row) => getRowKey(row)"
      @sort-change="handleSort"
      :default-sort="customSort"
      :tree-props="treeProps"
      :default-expand-all="defaultExpandAll"
      :span-method="spanMethod"
      :show-summary="showSummary"
      :summary-method="getSummaries"
    >
      <!-- <slot name="index" v-if="indexColumn.show">
        <el-table-column :label="indexColumn.label" align="center">
          <template slot-scope="scope">
            {{ indexRender(scope.$index) }}
          </template>
        </el-table-column>
      </slot> -->
      <template v-for="(column, colIndex) in columnConfig">
        <el-table-column
          v-if="column.multiHeader"
          :label="column.label"
          :key="`${column.label}_${column.prop}_${colIndex}`"
          :header-align="column.align || 'center'"
          :align="column.align || 'center'"
          :class-name="`${column.className} ${disableMixinDragDrop(column)}`"
        >
          <template v-for="(item, index) in column.list">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :minWidth="item.minWidth"
              :key="index"
              :header-align="item.align || 'center'"
              :align="item.align || 'center'"
              :sortable="item.sortable"
              :class-name="`${item.className} ${
                item.sortable && item.align === 'right' ? 'sortable-right' : ''
              }`"
              :formatter="item.render || ((cRow) => cellShowTxt(cRow, item))"
              :show-overflow-tooltip="item.showOverflowTooltip"
              v-if="!item.customRow"
            >
              <template v-for="(eles, i) in item.list">
                <el-table-column
                  :prop="eles.prop"
                  :label="eles.label"
                  :width="eles.width"
                  :key="i"
                  :header-align="eles.align || 'center'"
                  :align="eles.align || 'center'"
                  :sortable="eles.sortable"
                  :class-name="`${eles.className} ${
                    eles.sortable && eles.align === 'right'
                      ? 'sortable-right'
                      : ''
                  }`"
                  :formatter="eles.render"
                  :show-overflow-tooltip="eles.showOverflowTooltip"
                  v-if="!eles.customRow"
                >
                </el-table-column>
                <el-table-column
                  v-else
                  :prop="eles.prop"
                  :label="eles.label"
                  :width="eles.width"
                  :key="i"
                  :header-align="eles.align || 'center'"
                  :align="eles.align || 'center'"
                  :sortable="eles.sortable"
                  :class-name="`${eles.className} ${
                    eles.sortable && eles.align === 'right'
                      ? 'sortable-right'
                      : ''
                  }`"
                  :show-overflow-tooltip="eles.showOverflowTooltip"
                >
                  <!-- <template v-if="eles.customHeader" slot="header">
                  <slot name="customHeader" :slotProps="{ eles }"> </slot>
                </template> -->
                  <template slot-scope="scope">
                    <slot
                      name="customRow"
                      :slotProps="{
                        prop: eles.prop,
                        row: scope.row,
                        rowIndex: scope.$index,
                        config: eles.config,
                        column: eles,
                        dicsList: slotDicsList(eles, scope),
                      }"
                    />
                  </template>
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :key="index"
              :header-align="item.align || 'center'"
              :align="item.align || 'center'"
              :sortable="item.sortable"
              :show-overflow-tooltip="item.showOverflowTooltip"
              :class-name="`${item.className} ${
                item.sortable && item.align === 'right' ? 'sortable-right' : ''
              }`"
              v-else
            >
              <template slot-scope="scope">
                <slot
                  name="customRow"
                  :slotProps="{
                    prop: item.prop,
                    row: scope.row,
                    rowIndex: scope.$index,
                    config: item.config,
                    column: item,
                    dicsList: slotDicsList(item, scope),
                  }"
                />
              </template>
            </el-table-column>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="column.customRow"
          :align="column.align"
          :fixed="column.fixed"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :formatter="column.render"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :key="`${column.prop}_${colIndex}`"
          :sortable="column.sortable"
          :class-name="`${column.className} ${
            column.sortable && column.align === 'right' ? 'sortable-right' : ''
          } ${disableMixinDragDrop(column)}`"
          :type="column.type"
        >
          <template v-if="column.customHeader" slot="header">
            <slot name="customHeader" :slotProps="{ column }"> </slot>
          </template>
          <template slot="header" v-else-if="column.request">
            <span class="row-request">{{ column.label }}</span>
          </template>

          <template v-if="column.headerTopBottom" slot="header">
            <div
              style="
                display: inline-block;
                text-align: center;
                vertical-align: middle;
              "
            >
              <div>{{ column.labelTop }}</div>
              <div :class="column.classNameBottom">
                {{ column.labelBottom }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <template
              v-if="
                column.editCellKeyName && !scope.row[column.editCellKeyName]
              "
            >
              <!-- 非单独处理时显示文本 -->
              <template v-if="column.basicType">{{
                colDictParams(column, scope.row) || "--"
              }}</template>
              <template v-else>{{
                column.render || cellShowTxt(scope.row, column)
              }}</template>
            </template>
            <template
              v-else-if="
                column.isEditEasyCell &&
                column.editCellKeyName &&
                scope.row[column.editCellKeyName]
              "
            >
              <!-- 简易的单元格编辑 -->
              <EditEasyCell
                :formModel="scope.row"
                :fieldItem="{
                  id: column.prop,
                  placeholder: column.label,
                  required: column.request,
                  decimal: column.decimal,
                  basicType: column.basicType,
                  ...(column.fieldItem || {}),
                }"
                @onRowUpload="
                  () => {
                    $emit('handleRowUpload', scope.row);
                  }
                "
              />
            </template>
            <template v-else>
              <slot
                name="customRow"
                :slotProps="{
                  prop: column.prop,
                  row: scope.row,
                  rowIndex: scope.$index,
                  config: column.config,
                  column,
                  dicsList: slotDicsList(column, scope),
                }"
              />
            </template>
          </template>
        </el-table-column>
        <!-- column.fixed 会导致table重复渲染 -->
        <el-table-column
          v-else
          :align="column.align"
          :fixed="column.fixed"
          :type="column.type"
          :index="indexRender"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :sortable="column.sortable"
          :selectable="selectionRow"
          :class-name="`${column.className} ${
            column.sortable && column.align === 'right' ? 'sortable-right' : ''
          } ${disableMixinDragDrop(column)}`"
          :show-overflow-tooltip="
            column.columnLink && column.columnCopyTxt
              ? false
              : column.showOverflowTooltip
          "
          :formatter="column.render || ((row) => cellShowTxt(row, column))"
          :key="`${column.prop}_${colIndex}`"
        >
          <template v-if="column.customHeader" slot="header">
            <slot name="customHeader" :slotProps="{ column }"> </slot>
          </template>
          <template slot="header" v-else-if="column.request && column.isEdit">
            <span class="row-request">{{ column.label }}</span>
          </template>

          <template v-if="column.headerTopBottom" slot="header">
            <div
              style="
                display: inline-block;
                text-align: center;
                vertical-align: middle;
              "
            >
              <div>{{ column.labelTop }}</div>
              <div :class="column.classNameBottom">
                {{ column.labelBottom }}
              </div>
            </div>
          </template>

          <template
            v-slot="{ row }"
            v-if="
              column.columnOperation ||
              column.basicType ||
              column.customDicsArr ||
              column.columnLink ||
              column.columnTag ||
              column.TagArrConfig ||
              column.customMoney ||
              column.isEdit ||
              column.yesOrNo ||
              column.columnTopBottom ||
              column.colorProp ||
              column.isDiffMark
            "
          >
            <template v-if="column.isDiffMark">
              <DiffMark
                :currentVal="row[column.currentValProp]"
                :verifyVal="row[column.verifyValProp]"
                :decimal="column.decimal"
                :isNumIntercept="column.isNumIntercept || false"
                :showCurrentVal="column.showCurrentVal || false"
                :showVerifyVal="column.showVerifyVal || false"
                v-if="row[column.verifyValProp] !== null"
              />
              <span v-else>{{
                column.render
                  ? column.render(row) || "--"
                  : toFixedNum(row[column.currentValProp], column.decimal)
              }}</span>
            </template>
            <template v-if="column.columnLink">
              <template v-if="row[column.prop] || row[column.prop] === 0">
                <div v-if="column.renderLinkHide && column.renderLinkHide(row)">
                  {{ column.render ? column.render(row) : row[column.prop] }}
                </div>
                <div v-else-if="column.columnCopyTxt" class="base-flex-align">
                  <div
                    @click="handleView(row, column)"
                    style="max-width: calc(100% - 16px)"
                  >
                    <TooltipOver
                      class="primary-text-btn"
                      :content="
                        column.render ? column.render(row) : row[column.prop]
                      "
                    />
                  </div>
                  <!-- 显示复制图标 -->
                  <i
                    style="margin-left: 2px"
                    @click="handleCopyText(row[column.prop])"
                    class="el-icon-document-copy primary-text-color"
                  />
                </div>
                <span
                  v-else
                  class="primary-text-btn"
                  @click="handleView(row, column)"
                >
                  {{ column.render ? column.render(row) : row[column.prop] }}
                </span>
              </template>
              <span
                v-else-if="column.noTxtLink"
                class="primary-text-btn"
                @click="handleView(row, column)"
                >--</span
              >
              <span v-else>--</span>
            </template>

            <!-- 表格上下结构显示 -->
            <template v-if="column.columnTopBottom">
              <div>
                <div class="show-overflow-tooltip">
                  <template v-if="column.render">{{
                    column.render(row)
                  }}</template>
                  <template
                    v-else-if="column.decimal || column.decimal === 0"
                    >{{
                      toFixedNum(row[column.prop], column.decimal)
                    }}</template
                  >
                  <template v-else>{{ row[column.prop] || "--" }}</template>
                </div>

                <div class="show-overflow-tooltip">
                  <template v-if="column.renderBottom">{{
                    column.renderBottom(row)
                  }}</template>
                  <template
                    v-else-if="
                      column.bottomDecimal || column.bottomDecimal === 0
                    "
                    >{{
                      toFixedNum(row[column.bottomProp], column.bottomDecimal)
                    }}</template
                  >
                  <template v-else>{{
                    row[column.bottomProp] || "--"
                  }}</template>
                </div>
              </div>
            </template>

            <template v-if="column.columnOperation">
              <div class="operation-btn-box">
                <template v-if="!rowOperationBtnListFn(row).length"
                  >--</template
                >

                <template v-else-if="column.columnMoreOperation">
                  <template v-for="(iBtn, i) in rowBtnList(row, column)">
                    <el-button
                      :key="`btn_${i}`"
                      size="small"
                      type="text"
                      v-throttle
                      :loading="iBtn.loading"
                      :style="{ color: iBtn.color }"
                      class="operate-icon"
                      @click="
                        iBtn.handleClick
                          ? iBtn.handleClick(row, iBtn)
                          : $emit('handleRowBtnClick', row, iBtn)
                      "
                      >{{
                        iBtn.btnTextRender ? iBtn.btnTextRender(row) : iBtn.text
                      }}</el-button
                    >
                  </template>

                  <el-dropdown
                    v-if="rowBtnList(row, column, true).length"
                    class="drop-down-more"
                  >
                    <el-button size="small" type="text"
                      >更多<i class="el-icon-arrow-down"
                    /></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(drBtn, i) in rowBtnList(row, column, true)"
                        @click.native="
                          drBtn.handleClick
                            ? drBtn.handleClick(row, drBtn)
                            : $emit('handleRowBtnClick', row, drBtn)
                        "
                        :key="`dr_btn_${i}`"
                      >
                        {{
                          drBtn.btnTextRender
                            ? drBtn.btnTextRender(row)
                            : drBtn.text
                        }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>

                <template
                  v-else
                  v-for="(btnItem, btnIndex) in rowOperationBtnListFn(row)"
                >
                  <span :key="btnIndex" v-if="btnItem.isSelectBtns">
                    <slot
                      name="isSelectBtns"
                      :slotProps="{ item: btnItem, row }"
                    />
                  </span>
                  <el-button
                    :key="btnIndex"
                    size="small"
                    type="text"
                    :disabled="btnItem.disabled ? btnItem.disabled : false"
                    v-hasPermi="btnItem.hasPermission"
                    :loading="btnItem.loading"
                    v-throttle
                    :style="{ color: btnItem.color }"
                    v-if="
                      colShowBtnFn(btnItem, row, column) &&
                      !btnItem.isSelectBtns
                    "
                    @click.stop="
                      btnItem.handleClick
                        ? btnItem.handleClick(row, btnItem)
                        : $emit('handleRowBtnClick', row, btnItem)
                    "
                    >{{
                      btnItem.btnTextRender
                        ? btnItem.btnTextRender(row)
                        : btnItem.text
                    }}</el-button
                  >
                </template>
              </div>
            </template>
            <div
              v-if="column.basicType"
              :class="[
                column.colBgColor ? 'tag-do-pod' : '',
                column.showOverflowTooltip ? 'ellipsis-text' : '',
              ]"
              :style="{
                color:
                  column.fontColor && colDictParams(column, row, true).color,
                backgroundColor:
                  column.colBgColor &&
                  `${colDictParams(column, row, true).color}1A`,
              }"
            >
              <i
                v-if="column.dotColor"
                class="status-dot"
                :style="{
                  backgroundColor: colDictParams(column, row, true).color,
                }"
              />
              {{
                column.render
                  ? column.render(row, colDictParams(column, row)) || "--"
                  : colDictParams(column, row) || "--"
              }}
            </div>
            <div
              v-if="column.TagArrConfig"
              class="txt-tagsColor"
              :style="{
                color:
                  column.fontColor &&
                  colDictParams(column.TagArrConfig[0], row, true).color,
                background:
                  column.fontColor &&
                  colDictParams(column.TagArrConfig[0], row, true).nameEn,
              }"
            >
              {{
                column.render
                  ? column.render(
                      row,
                      colDictParams(column.TagArrConfig[0], row)
                    ) || "--"
                  : colDictParams(column.TagArrConfig[0], row) || "--"
              }}
            </div>
            <div
              v-if="column.customDicsArr"
              :style="{
                color:
                  column.fontColor && customDicsName(column, row, true).color,
              }"
            >
              <!-- 自定义字典词 -->
              <i
                v-if="column.dotColor"
                class="status-dot"
                :style="{
                  backgroundColor: customDicsName(column, row, true).color,
                }"
              />
              {{
                column.render
                  ? column.render(row, customDicsName(column, row)) || "--"
                  : customDicsName(column, row) || "--"
              }}
            </div>
            <template v-if="column.customMoney">
              <span>{{ formatMoney(row[column.prop]) }}</span>
            </template>
            <div v-if="column.columnTag">
              <!-- 自定义字典词 -->
              <el-tag
                :type="column.tagType"
                :class="column.tagClass"
                class="tagClass"
                :style="
                  column.tagColor
                    ? {
                        color: column.tagColor,
                        backgroundColor: `${column.tagColor}0D`,
                        borderColor: column.tagColor,
                      }
                    : {}
                "
                size="small"
                v-if="row[column.prop] || row[column.prop] === 0"
                >{{ row[column.prop] }}</el-tag
              >
              <span v-else>--</span>
            </div>
            <template v-if="column.fieldItem && column.isEdit">
              <FormSingle
                :formData="row"
                :fieldItem="{
                  id: column.prop,
                  placeholder: column.label,
                  ...column.fieldItem,
                }"
                :dictionary="dictionary"
                @handleChange="handleChange"
              />
            </template>
            <template v-if="column.yesOrNo">
              <template v-if="[0, 1, false, true].includes(row[column.prop])">
                <span class="green-text-color" v-if="row[column.prop]">
                  是
                </span>
                <span v-else>否</span>
              </template>
              <span v-else>--</span>
            </template>
            <template v-if="column.colorProp">
              <span :style="{ color: row[column.colorProp] || '' }">{{
                row[column.prop] || "--"
              }}</span>
            </template>
          </template>
        </el-table-column>
      </template>
      <slot name="default" />
      <template slot="empty">
        <div class="table-empty">
          <img :src="noDataImg" alt="" srcset="" width="150px" />
          <div>
            {{ overseaLangObj.no_table_data || "暂无数据～" }}
          </div>
        </div>
      </template>
    </el-table>
    <div class="bottom-pagination">
      <slot name="bottomTotal" />
      <my-pagination
        v-if="
          pagination &&
          total > (paginationConfig.total || paginationConfig.limit)
        "
        :page="start"
        :limit="paginationConfig.limit"
        :total="total"
        :small="paginationConfig.small"
        :className="paginationConfig.className"
        :layout="paginationConfig.layout"
        :pageSizes="paginationConfig.pageSizes"
        @pagination="handlePagination"
      />
    </div>

    <!-- <el-backtop
      v-if="total > 20"
      target=".tableData .el-table__body-wrapper"
      :right="0"
      :bottom="55"
      style="
        background: linear-gradient(180deg, #68c5fc 0%, #00adb2 100%);
        color: #fff;
        border: 2px solid #fff;
        position: absolute;
      "
    ></el-backtop> -->
  </div>
</template>

<script>
import MyPagination from "./MyPagination";
import { mapState } from "vuex";
import { DICTIONARY_Obj } from "@/comModel/dictionary";
import { delLastPageUp, typeConversion } from "@/utils/index";
import { handleCopyText } from "@/utils/confirmBox.js";
import noDataImg from "@/assets/image/noData.png";
import { mixinElTableCols } from "./mixinElTable.js";
export default {
  mixins: [mixinElTableCols],
  components: {
    MyPagination,
    TooltipOver: () => import("_comp/TooltipOver"),
    FormSingle: () => import("./FormSingle"),
    EditEasyCell: () => import("./EditEasyCell"),
    DiffMark: () => import("_comp/DiffMark"),
  },
  props: {
    // indexColumn: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       show: false,
    //       label: "序号",
    //     };
    //   },
    // },
    rowKey: {
      type: String,
      default: "id",
    },
    selectionKey: {
      type: String,
      default: "id",
    },
    tableHeight: {
      type: String,
      default: null,
    },
    maxTableHeight: {
      type: String,
      default: () => `${10 * 49}px`, // 需要截图时传null, 不能出现表格内部滚动条
    },
    columnConfig: {
      type: Array,
      default: () => [], // 只能直接渲染, 不能赋值, 赋值后有些动态获取的值只会渲染一次(无法动态更改)
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    loadMore: {
      type: Boolean,
      default: false,
    },
    extraConfig: {
      type: Object,
      default: () => ({}),
    },
    httpRequest: {
      type: Function,
      default: () => {},
    },
    customSort: {
      type: Object, // 默认排序值
      default: () => ({}),
    },
    columnData: {
      type: Array,
      default: null,
    },
    getQueryParams: {
      type: Function,
      default: () => ({}),
    },
    selectionRow: {
      // 多选时不同类型是否可勾选
      type: Function,
      default: (row, index) => {
        return true;
      },
    },
    currentRow: {
      // 单选时高亮当前行
      type: Boolean,
      default: true,
    },
    isMountedRequest: {
      // 初始化时是否调用表格接口
      type: Boolean,
      default: true,
    },
    selectionTableRow: {
      type: Array,
      default: () => [],
    },
    selectionRowConfig: {
      // 选择行配置
      type: Object,
      default: () => ({}),
    },
    treeProps: {
      type: Object,
      default: () => ({ children: "children", hasChildren: "hasChildren" }),
    },
    treeLazyLoad: {
      type: Object,
      default: () => ({
        lazy: false,
        load: () => ({}),
      }),
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    rowOperationBtnListFn: {
      // 操作按钮
      type: Function,
      default: () => [],
    },
    colShowBtnFn: {
      // 按钮是否显示
      type: Function,
      default: (btnItem, row, column) => true,
    },
    spanMethod: {
      type: Function,
      default: null,
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    getSummaries: {
      type: Function,
      default: () => [],
    },
    paginationConfig: {
      type: Object,
      default: () => {
        return {
          limit: 20,
          layout: "total, sizes, prev, pager, next, jumper",
          className: "",
          small: false,
          total: 20,
        };
      },
    },
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
  data() {
    return {
      noDataImg,
      start: 1,
      tableData: [],
      total: 0,
      query: {},
      loading: false,
      checkRowList: this.selectionTableRow, // 多选的值
      tabNameArr: ["1"], // 初始值，默认选中第一个tab页签，用于列表缓存
      sortParam: {}, // 排序参数
      handleCopyText,
    };
  },
  mounted() {
    if (this.customSort.prop && this.customSort.order) {
      // 排序默认值
      this.handleSort(this.customSort);
    } else if (this.isMountedRequest) {
      this.getTableData(this.getQueryParams());
    }
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.myTable?.doLayout(); // 重新计算Table布局，防止fixed导致样式错位
    });
    if (this.columnConfig.some((e) => e.type === "selection")) {
      this._toggleRowSelectionMixin({ newCheckRows: this.selectionTableRow });
    }
  },
  methods: {
    customDicsName(cItem, row = {}, isObj) {
      const val = cItem.customDicsVal || cItem.prop;
      let dictObj = {};
      cItem.customDicsArr.forEach((e) => {
        const ele =
          typeof e === "number" && cItem.dicsStr ? `${cItem.dicsStr}_${e}` : e;
        if (DICTIONARY_Obj[ele]?.value === typeConversion(row[val])) {
          dictObj = DICTIONARY_Obj[ele];
        }
      });
      if (isObj) {
        return dictObj;
      }
      return dictObj?.nameCn || "--";
    },
    slotDicsList(colItem, scope) {
      // 返回字典词
      if (colItem.basicType) {
        // return this.dicsList(
        //   this.dicsListParams(
        //     colItem.basicType,
        //     scope.row,
        //     colItem.basicTypeVal || colItem.prop
        //   )
        // );
        const fColDict = this.getDictObj(
          colItem.basicType,
          scope.row[colItem.basicTypeVal || colItem.prop],
          false
        );
        return {
          nameCn: fColDict.nameCn,
          color: fColDict.color,
        };
      } else if (colItem.customDicsArr) {
        return this.customDicsName(colItem, scope.row, true);
      }
      return {};
    },
    colDictParams(col, row, isObj) {
      // const { [col.basicType]: dictColArr = [] } = this.dictionary.dicsData;
      // const dictObj =
      //   dictColArr.find((e) => row[col.basicTypeVal || col.prop] == e.value) ||
      //   {};
      const dictObj = this.getDictObj(
        col.basicType,
        row[col.basicTypeVal || col.prop],
        false
      );
      if (dictObj.constructor === Array) {
        return dictObj.map((e) => e.nameCn).join(",");
      }
      if (isObj) {
        return dictObj;
      }
      // 不能给默认值，会影响有些render函数的显示
      return dictObj.nameCn;
    },
    indexRender($index) {
      return (
        (this.start - 1) * (this.paginationConfig?.limit || 0) + ($index + 1)
      );
    },
    cellShowTxt(row, column) {
      let value = row[column.prop];
      if (column.prop && column.prop.indexOf(".") > -1) {
        const arr = column.prop.split(".");
        value = row[arr[0]];
        arr.forEach((key, i) => {
          if (i !== 0) {
            value = value && value[key];
          }
        });
      }
      if (column.decimal || column.decimal === 0) {
        value =
          column.colFormat === "thousandthMark"
            ? this.formatMoney(value, column.decimal)
            : this.toFixedNum(value, column.decimal);
      }
      return value === 0 ? value : value || "--";
    },
    getTableData(params) {
      if (params) {
        this.query = params;
      }
      this.loading = true;
      if (this.columnData) {
        this.tableData = this.columnData;
        this.loading = false;
        this.$emit("getResult", {
          tableData: this.tableData || [],
          total: (this.tableData || []).length || 0,
        });
        this.doLayout();
      } else {
        this.httpRequest({
          ...this.sortParam,
          ...this.query,
          pageNum: this.start,
          pageSize:
            this.pagination || this.loadMore
              ? this.paginationConfig.limit
              : 99991,
          //新增了一个this.loadMore判断，我下次上传代码前没出现问题删除备注
        })
          .then((result) => {
            this.loading = false;
            if (result.data && !result.rows) {
              this.tableData = result.data.map((e) => ({
                // 产品信息 - 申报价格 / 单位
                declaredNum: e.cusProduct?.declaredNum,
                ...e,
              }));
            } else {
              this.tableData = result.rows.map((e, i) => {
                let resRow = {
                  // 产品信息 - 申报价格 / 单位
                  declaredNum: e.cusProduct?.declaredNum,
                  ...e,
                };
                if (this.extraConfig.tempKeyList?.length) {
                  // 临时数值, 如输入时的最大/最小值限制
                  this.extraConfig.tempKeyList.forEach((keyName) => {
                    resRow[`temp_${keyName}`] = e[keyName];
                  });
                }
                return resRow;
              });
            }

            // this.tableData = [...result.rows];
            this.total = parseInt(result.total) || 0;
            if (this.columnConfig.some((e) => e.type === "selection")) {
              this._toggleRowSelectionMixin(); // 多选时表格回显
            }
            // 删除当前页面最后一条数据时，自动向上翻页
            const nPage = delLastPageUp(
              this.total,
              this.start,
              this.paginationConfig.limit,
              0
            );
            if (nPage === this.start - 1) {
              this.start = nPage;
              this.getTableData(this.getQueryParams());
            }
            // console.log(this.tableData);
            this.$emit("getResult", {
              tableData: this.tableData || [],
              total: this.total || (this.tableData || []).length || 0,
              resultData: result,
            });
            this.doLayout();
          })
          .catch((err) => (this.loading = false));
      }
    },
    doLayout() {
      this.$nextTick(() => {
        this.$refs.myTable?.doLayout();
      });
    },
    refreshKeepTable(restart = true, activeName) {
      if (this.tabNameArr.includes(activeName)) {
        // 防止页面缓存后第一次tab切换时调两次接口
        this.refreshTable(restart);
      } else {
        this.tabNameArr.push(activeName);
        if (!this.isMountedRequest) {
          this.refreshTable(restart);
        }
      }
    },
    refreshTable(restart = true) {
      if (restart) {
        this.start = 1;
      }
      this.getTableData(this.getQueryParams());
      // this.clearSort();
    },
    handlePagination({ page, limit }) {
      this.start = page;
      this.paginationConfig.limit = limit;
      this.refreshTable(false);
    },
    handleCurrentChange(currentRow) {
      this.$emit("onCurrentChange", currentRow);
      // this.clearSort();
    },
    // 单选高亮行
    setComCurrentRow(row) {
      this.$refs.myTable?.setCurrentRow(row);
    },
    /**
     * 跨页面多选
     * checkRowList 接口返回的默认勾选数组
     * id 列表唯一标识
     */
    onTableSelect(rows, row) {
      const index = this.checkRowList.findIndex(
        (item) => item[this.selectionKey] === row[this.selectionKey]
      );
      if (this.selectionRowConfig.isSameSelection) {
        // 是否勾选全部同类型数据
        if (index !== -1) {
          this.checkRowList = this.checkRowList.filter(
            (c) => c[this.selectionKey] !== row[this.selectionKey]
          );
        } else {
          const sameRows =
            this.tableData.filter(
              (s) => s[this.selectionKey] === row[this.selectionKey]
            ) || [];
          this.checkRowList.push(...sameRows);
        }
      } else {
        if (index !== -1) {
          this.checkRowList.splice(index, 1);
        } else {
          this.checkRowList.push(row);
        }
      }
      this.$emit("onSelectionChange", this.checkRowList, this.tableData);
      this._toggleRowSelectionMixin(); // 排柜选择一个需要同时勾选多个相同的操作单
    },
    /** 同时勾选多个相同行，批量操作，（有分页时不可用） */
    rowsTableSelectMultiple() {
      let mRowList = [];
      this.checkRowList.forEach((s) => {
        const sRows = this.tableData.filter(
          (f) => f[this.selectionKey] === s[this.selectionKey]
        );
        mRowList.push(...sRows);
      });
      return mRowList;
    },
    clearCheckRowList() {
      this.checkRowList = [];
    },
    // 全选操作
    onTableSelectAll(arr) {
      if (!arr.length) {
        // 取消全选
        if (this.selectionRowConfig.isSameSelection) {
          // 是否取消全部同类型数据
          this.checkRowList = this.checkRowList.filter(
            (c) =>
              !this.tableData.some(
                (t) => c[this.selectionKey] === t[this.selectionKey]
              )
          );
        } else {
          this.tableData.forEach((v) => {
            const index = this.checkRowList.findIndex(
              (i) => i[this.selectionKey] === v[this.selectionKey]
            );
            if (index !== -1) {
              this.checkRowList.splice(index, 1);
            }
          });
        }
      } else {
        // 全选
        if (this.selectionRowConfig.isSameSelection) {
          // 是否勾选全部同类型数据
          const sameRows =
            this.tableData.filter(
              (s) =>
                !this.checkRowList.some(
                  (t) => s[this.selectionKey] === t[this.selectionKey]
                )
            ) || [];
          this.checkRowList.push(...sameRows);
        } else {
          this.tableData.forEach((v) => {
            const index = this.checkRowList.findIndex(
              (i) => i[this.selectionKey] === v[this.selectionKey]
            );
            if (index === -1) {
              this.checkRowList.push(v);
            }
          });
        }
      }
      this.$emit("onSelectionChange", this.checkRowList, this.tableData);
    },
    _toggleRowSelectionMixin(nCheckObj = {}) {
      const _this = this;
      if (nCheckObj.newCheckRows) {
        _this.checkRowList = nCheckObj.newCheckRows; // 初始全选时不同条件需要过滤与重置
        if (!nCheckObj.newCheckRows.length) {
          this.$refs.myTable.clearSelection();
          return;
        }
      }
      this.tableData.forEach((e) => {
        const rSome = _this.checkRowList.some(
          (ele) => ele[this.selectionKey] === e[this.selectionKey]
        );
        if (rSome) {
          _this.$nextTick(() => {
            _this.$refs.myTable.toggleRowSelection(e, true); // 选中回显
          });
        } else {
          const { children } = this.treeProps;
          // 展开行多选
          if (
            this.selectionRowConfig.childrenSelection &&
            e[children]?.length
          ) {
            e[children].forEach((cEle) => {
              const cSome = _this.checkRowList.some(
                (sEle) => sEle[this.selectionKey] === cEle[this.selectionKey]
              );
              if (cSome) {
                _this.$nextTick(() => {
                  _this.$refs.myTable.toggleRowSelection(cEle, true); // 选中回显
                });
              } else {
                this.$refs.myTable.clearSelection();
              }
            });
            return;
          }
          this.$refs.myTable.clearSelection();
        }
      });
    },
    clearSelection() {
      this.$refs.myTable.clearSelection();
    },
    toggleRowSelection(list, type = true) {
      this.$refs.myTable.toggleRowSelection(list, type); // 选中回显
    },
    getNewTableData() {
      return this.tableData;
    },
    getTableDataNum() {
      return this.total;
    },
    setNewTableData(arr = []) {
      this.tableData = arr;
      this.loading = false;
      this.$nextTick(() => {
        this.$emit("setTableSuccess");
        this.doLayout();
      });
    },
    // 改变表格属性值，更新视图
    setUpdateTableVal(row, rKey, nVal) {
      // 需要用唯一key计算排序后的index值
      const sIndex = this.tableData.findIndex(
        (e) => e.temp_secondId === row.temp_secondId
      );
      if (sIndex > -1) {
        this.$set(this.tableData[sIndex], rKey, nVal);
      }
    },
    rowClassName({ row, rowIndex }) {
      const { isFirstTake } = row; //是否首次入仓
      const rowSelection = this.checkRowList.some(
        (e) => row[this.selectionKey] === e[this.selectionKey]
      );
      const rowStripe =
        this.extraConfig &&
        this.extraConfig.stripeList &&
        this.extraConfig.stripeList.test(rowIndex);
      return `table-row ${
        rowSelection ? "row-selection" : rowStripe ? "row-stripe" : ""
      } ${isFirstTake ? "first-instorage" : ""} ${
        row.trClassName ? row.trClassName : ""
      }`;
    },
    // 排序
    handleSort(column) {
      const { prop, order } = column;
      // console.log('column==', column)
      const sortValue = order ? order.slice(0, -6) : undefined;
      const sortField = prop && sortValue ? prop : undefined;
      this.sortParam = {
        sortField,
        sortValue,
      };
      // const params = { sortField, sortValue, ...this.getQueryParams() };
      this.getTableData(this.getQueryParams());
      this.$emit("handleSort", {
        sortField,
        sortValue,
      });
    },
    clearSort() {
      this.$refs.myTable.clearSort();
    },
    getRowKey(row) {
      /** 检查是否有重复key，异步加载多个列表时传对象名称防止不同列表的key值相同影响到其他配置，如: default-expand-all展开行 */
      const repeatName = this.extraConfig.rowKeyName || "checkRepeatObj";
      if (!this[repeatName]) {
        this[repeatName] = {};
      }
      if (row) {
        const nKey = row[this.rowKey];
        if (nKey) {
          if (this[repeatName][nKey]) {
            // key值重复时
            if (!row.temp_secondId) {
              row.temp_secondId = Math.random() + "";
            }
            return row.temp_secondId;
          } else {
            this[repeatName][nKey] = true;
            return nKey;
          }
        }
        if (!row.temp_secondId) {
          row.temp_secondId = Math.random() + "";
        }
        return row.temp_secondId;
      } else {
        return Math.random() + "";
      }
    },
    getPaging() {
      //获取最新分页信息
      return {
        ...this.paginationConfig,
        start: this.start,
      };
    },
    rowBtnList(row, column, isMore) {
      const btnLen = column.moreBtnLen || 1;
      const nBtnArr = [...this.rowOperationBtnListFn(row)];
      if (btnLen < 2) {
        // 单个按钮文字过多的显示
        const btnStr = nBtnArr.map((e) => e.text).join("");
        if (btnStr.length <= 8) {
          // 按钮字符不超过8个不显示更多
          return isMore ? [] : nBtnArr;
        }
      }
      if (nBtnArr.length <= btnLen + 1) {
        return isMore ? [] : nBtnArr;
      } else {
        const showBtnArr = nBtnArr.splice(0, btnLen);
        return isMore ? nBtnArr : showBtnArr;
      }
    },
    handleView(row, column) {
      this.$emit("handleTableView", row, column);
    },
    /** 输入框失焦、选择框改变事件，oninput输入触发事件不要用此方法 */
    handleChange(e, type, row) {
      this.$emit("handleChange", e, type, row);
    },
  },
};
</script>

<style lang="scss">
.tableData {
  // position: relative; // 不能加定位, 会影响侧边栏的分页
  // ----------修改elementui表格的默认样式-----------
  &.noData {
    .el-table__body-wrapper {
      position: initial;
    }
  }
  .row-request {
    &::before {
      content: "*";
      color: #ff6767;
      margin-right: 4px;
    }
  }
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      height: 15px;
      width: 15px;
    }
  }
  .el-table {
    // border-top: 1px solid #e2e2e2;
  }
  .el-table--border:not(.border-show-right) {
    td,
    th {
      border-right: none;
    }
  }
  .el-table--border th {
    border-bottom: none;
  }
  .table-header-cell {
    .header_bottom_no_weight {
      font-weight: 400;
    }
    .header_bottom_blue {
      color: #5094ff;
    }
  }
  .table-header-cell.border-right {
    border-right: 1px solid #e2e2e2;
  }
  .el-table__cell.border-left {
    border-left: 1px solid #e2e2e2;
  }

  // 解决表格固定列问题
  .el-table__fixed,
  .el-table__fixed-right {
    background-color: #fff;
    // background-color: transparent;
    height: calc(100% - 15px) !important;
    // box-shadow: -5px -2px 10px rgba(0, 0, 0, 0.12) !important;

    // .el-table__fixed-body-wrapper {
    //   height: calc(100% - 36px) !important;
    // }
  }

  // 当表格没有滚动条时
  .el-table__body-wrapper.is-scrolling-none {
    & ~ .el-table__fixed,
    & ~ .el-table__fixed-right {
      height: 100% !important;
      bottom: 0 !important;
      box-shadow: none !important;
    }
  }

  // 当表格有纵向滚动条时
  .el-table--scrollable-y .el-table__fixed-right {
    right: 15px !important;
  }

  // 当表格只有横向滚动条，没有纵向滚动条时
  .el-table--scrollable-x:not(.el-table--scrollable-y) .el-table__fixed-right {
    right: 0 !important;
  }
  .el-table__empty-text {
    height: 240px;
  }
  .table-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 28px));
    line-height: 20px;
    img {
      width: 100px;
      padding: 30px 0 14px;
    }
    div {
      padding-bottom: 30px;
    }
  }
  .row-stripe {
    background: rgba(80, 148, 255, 0.12);
  }
  .sortable-right {
    & > div {
      padding-right: 17px;
    }
  }
  .operation-btn-box {
    .el-button {
      margin-left: 0;
      &:not(:last-child) {
        margin-right: 5px;
      }
    }
    .el-dropdown {
      margin-left: 5px;
    }
  }
  .tagClass {
    height: 22px;
    padding: 0 11px;
    line-height: 20px;
  }
  .wrap-cell-remark {
    // 备注换行
    .cell {
      white-space: pre-wrap;
    }
  }
}
</style>
