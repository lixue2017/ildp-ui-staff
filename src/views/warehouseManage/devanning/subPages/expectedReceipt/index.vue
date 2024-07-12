<template>
  <div class="app-content-container" v-if="initRes">
    <ComDetailTop
      class="title-sides-margin-none"
      ref="detailTopRef"
      :title="`预收货上架`"
      :config="{}"
    >
      <template v-slot:titContentSlot>
        <el-button
          v-if="
            headFormConfig.formModel.paisong || headFormConfig.formModel.cuncang
          "
          type="primary"
          plain
          round
          @click="handleExport"
          size="small"
          v-throttle
        >
          下 载
        </el-button>
      </template>
    </ComDetailTop>

    <div class="content-box">
      <div>
        <ComForm class="detail-see-form" :formConfig="headFormConfig" />
      </div>
      <template>
        <div class="tabs-group base-flex-between">
          <div class="base-flex-align">
            <div class="custom-tabs-btn">
              <template v-for="tItem in btnTabsList">
                <el-button
                  size="small"
                  plain
                  :key="tItem.name"
                  @click="() => handleChangeTab(tItem)"
                  :type="tItem.name === activeName ? 'activation' : ''"
                  >{{ tItem.label }}</el-button
                >
              </template>
              <span style="margin-left: 10px; color: #8b8b8b"
                >* 点击输入框获取起始位置,
                再按住shift+鼠标在结束位置点击后可批量输入上架数</span
              >
            </div>
          </div>
          <div class="base-flex-align">
            <div style="white-space: nowrap">批量选择上架时间：</div>
            <el-date-picker
              size="mini"
              v-model="batchDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="批量选择时间"
              @change="handleBatchDateChange"
            />
          </div>
        </div>

        <div v-for="tab in btnTabsList" :key="tab.name">
          <template v-if="showTabs.includes(tab.name)">
            <div v-show="activeName === tab.name">
              <ComTable
                :ref="`tableRef${tab.name}`"
                :columnConfig="tableColumns(tab.name)"
                :extraConfig="{ tClassName: 'border-show-right' }"
                :columnData="[]"
                :maxTableHeight="'570px'"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template
                    v-if="
                      [
                        'psfs',
                        'sku',
                        'huowu',
                        'skuNameCn',
                        'skuNameEn',
                        'dsjzs',
                        'newGoods',
                        'length',
                        'width',
                        'height',
                        'weight',
                        'mdcCode',
                        'pszxs',
                        'psyjsj',
                        'psgzh',
                      ].includes(slotProps.prop)
                    "
                  >
                    <div
                      v-for="(item, index) in slotProps.row.itemList || []"
                      :key="`i_${index}`"
                      class="second-cell-txt base-flex-align"
                      :style="secondCellHeight(item)"
                    >
                      <span
                        v-if="
                          isCellEdit &&
                          ['psfs', 'newGoods'].includes(slotProps.prop)
                        "
                        :style="{
                          color: slotProps.column.fontColor
                            ? `${
                                getDictObj(
                                  slotProps.column.basicType,
                                  item[slotProps.prop],
                                  false
                                ).color
                              }`
                            : '',
                        }"
                        >{{
                          getDictObj(
                            slotProps.column.basicType,
                            item[slotProps.prop]
                          )
                        }}</span
                      >
                      <template
                        v-else-if="
                          isCellEdit &&
                          item.isFirstSku &&
                          ['length', 'width', 'height', 'weight'].includes(
                            slotProps.prop
                          )
                        "
                      >
                        <el-input-number
                          size="mini"
                          v-model="item[slotProps.column.verifyProp]"
                          v-input-number-limit="{
                            value: slotProps.column.decimal || 0, // 几位小数限制
                            maxNumber: slotProps.column.fieldItem.max,
                          }"
                          :min="minLimitNumber(slotProps.column.decimal || 0)"
                          :controls="false"
                          :disabled="!item.isFirstSku"
                          :placeholder="slotProps.column.label"
                          @change="
                            (val) =>
                              changeMinNumber(
                                val,
                                item,
                                slotProps.column.verifyProp,
                                slotProps.column.decimal
                              )
                          "
                        />
                      </template>

                      <template v-else>
                        <TooltipOver
                          :textLineClamp="(item.itemList || []).length"
                          :content="
                            showCellTxt(
                              item[slotProps.prop],
                              slotProps.column.decimal
                            )
                          "
                        />
                      </template>
                    </div>
                  </template>

                  <template
                    v-if="
                      [
                        'traySn',
                        'kwSn',
                        'remark',
                        'num',
                        'time',
                        'operation',
                      ].includes(slotProps.prop)
                    "
                  >
                    <div
                      v-for="(item, index) in slotProps.row.itemList || []"
                      :key="`g_${index}`"
                      class="third-cell-box"
                    >
                      <div
                        v-for="(cItem, cIndex) in isItemListLen(item)
                          ? item.itemList
                          : [{}]"
                        :key="`k_${cIndex}`"
                        class="third-cell-txt base-flex-align"
                        @click="
                          () =>
                            onClick(
                              `${slotProps.rowIndex + 100}${index + 100}${
                                cIndex + 100
                              }`
                            )
                        "
                      >
                        <template
                          v-if="
                            isItemListLen(item) &&
                            isCellEdit &&
                            ['kwSn'].includes(slotProps.prop)
                          "
                        >
                          <AutoComplete
                            :formModel="cItem"
                            :fieldItem="{
                              size: 'mini',
                              disabledArr: selectDisabledIds,
                              ...(slotProps.column.fieldItem || {}),
                            }"
                            :additionalParam="{
                              warehouseId: headFormConfig.formModel.rkcId,
                            }"
                          />
                        </template>

                        <template
                          v-else-if="
                            isItemListLen(item) &&
                            isCellEdit &&
                            ['num'].includes(slotProps.prop)
                          "
                        >
                          <el-input-number
                            :class="`${
                              startEndIndex(
                                `${slotProps.rowIndex + 100}${index + 100}${
                                  cIndex + 100
                                }`
                              )
                                ? 'third-cell-bg'
                                : ''
                            }`"
                            size="mini"
                            v-model="
                              slotPropsRow(cItem, slotProps.prop)[
                                slotProps.prop
                              ]
                            "
                            v-input-number-limit="{
                              value: slotProps.column.decimal || 0, // 几位小数限制
                              maxNumber: slotProps.column.fieldItem.max,
                            }"
                            :min="0"
                            :controls="false"
                            :placeholder="
                              slotProps.column.label ||
                              slotProps.column.labelBottom
                            "
                            @blur="
                              () =>
                                onNumBlur(
                                  `${slotProps.rowIndex + 100}${index + 100}${
                                    cIndex + 100
                                  }`
                                )
                            "
                            @paste.native="($event) => onPasteUpload($event)"
                            @change="onChange"
                          />
                        </template>

                        <template
                          v-else-if="
                            isItemListLen(item) &&
                            isCellEdit &&
                            ['time'].includes(slotProps.prop)
                          "
                        >
                          <el-date-picker
                            class="date-cell-time"
                            size="mini"
                            v-model="cItem[slotProps.prop]"
                            type="datetime"
                            :value-format="slotProps.column.valueFormat"
                            :placeholder="slotProps.column.label"
                          />
                        </template>

                        <template
                          v-else-if="
                            isItemListLen(item) &&
                            isCellEdit &&
                            ['remark'].includes(slotProps.prop)
                          "
                        >
                          <el-input
                            type="textarea"
                            size="mini"
                            :autosize="{ minRows: 1, maxRows: 1 }"
                            resize="none"
                            :placeholder="slotProps.column.labelBottom"
                            maxlength="500"
                            v-model="cItem[slotProps.prop]"
                          />
                        </template>

                        <template
                          v-else-if="
                            isCellEdit && ['operation'].includes(slotProps.prop)
                          "
                        >
                          <template v-for="rBtn in tableBtnList">
                            <el-button
                              :key="rBtn.text"
                              size="small"
                              type="text"
                              v-throttle
                              v-if="
                                isItemListLen(item) || rBtn.btnType !== 'del'
                              "
                              :style="{ color: rBtn.color }"
                              @click.stop="
                                () =>
                                  rBtn.handleClick(
                                    item,
                                    cIndex,
                                    cItem,
                                    slotProps.row
                                  )
                              "
                              >{{ rBtn.text }}</el-button
                            >
                          </template>
                        </template>

                        <template v-else>
                          {{
                            showCellTxt(
                              cItem[slotProps.prop],
                              slotProps.column.decimal
                            )
                          }}
                        </template>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-slot:bottomTotal>
                  <div
                    class="grand-total"
                    v-if="
                      activeName === tab.name && $refs[`tableRef${tab.name}`]
                    "
                  >
                    <span>合计：</span>
                    <template v-for="(tItem, i) in tableSubtotalTwo(tab.name)">
                      <span :key="`t_${i}`">
                        <span>{{ tItem.totalLabel }}：</span>
                        <span>{{ tItem.totalNum }}</span>
                      </span>
                    </template>
                  </div>
                </template>
              </ComTable>
            </div>
          </template>
        </div>
      </template>
    </div>

    <template>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in footBtnList">
          <el-button
            v-if="btn.isShowState ? isCellEdit : true"
            :type="btn.type"
            @click="btn.handleClick"
            :key="index"
            :loading="isBtnLoading"
          >
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { detailColumns, ysTableCols } from "./model";
import { mapActions, mapState } from "vuex";
import { accumulationFn, subtractFn } from "@/utils/instructions";
import { getStreamFileDownload } from "@/utils/zipdownload";
import { validateTreeList } from "@/utils/objOrArr";
import { fullLoading } from "@/utils/loading.js";
import {
  comSaveRepeatedRequest,
  comContinuityRepeatedRequest,
} from "@/api/common";
import {
  getExpectedInfo,
  getExpectedGoods,
  putSaveExpectedGoods,
  postConfirmListing,
  getInventoryById,
  delKwShelvePlan,
  addKwShelvePlan,
  exportPlanTrayLabel,
} from "@/api/warehouse/process";

export default {
  data() {
    return {
      headFormConfig: {
        formModel: {}, // 表单数据
        labelWidth: "128px",
        lists: detailColumns(),
      },
      btnTabsList: [],
      batchDate: "",
      footBtnList: [
        {
          text: "保存",
          isShowState: true,
          handleClick: () => {
            this.handleRowSave();
          },
        },
        {
          text: "保存并上架",
          isShowState: true,
          handleClick: () => {
            this.handleRowSave("sj_2");
          },
        },
        {
          text: "托盘标打印",
          handleClick: () => {
            const { shelvePlanId } = this.headFormConfig.formModel;
            getStreamFileDownload(
              `/shelvePlan/exportTrayLabel`,
              {
                shelvePlanId,
              },
              {
                method: "post",
              }
            );
          },
        },
        {
          text: "取 消",
          handleClick: this.reBack,
        },
      ],
      tableBtnList: [
        {
          text: "新增",
          handleClick: this.handleAdd,
        },
        {
          text: "删除",
          btnType: "del",
          color: "#FF6767",
          handleClick: this.handleDelete,
        },
      ],
      initRes: false,
      activeName: "1",
      showTabs: [],
      initTwoTabList: [], // 第二个tab的初始值, 用于限制选择与校验
      indexObj: {
        endIndex: null,
        startIndex: null,
      },
      shiftKey: false,
    };
  },
  methods: {
    handleChangeTab(tabItem) {
      if (tabItem) {
        this.activeName = tabItem.name;
        if (this.showTabs.includes(tabItem.name)) {
          return; // 已加载过的编辑数据防止被覆盖
        } else {
          this.showTabs.push(tabItem.name);
        }
      }
      const { shelvePlanId } = this.headFormConfig.formModel;
      getExpectedGoods({
        shelvePlanId,
        storageWay: [2, 1][this.activeName - 1],
      }).then((res) => {
        let nos = res.data || [];
        let skuFirstIds = [];
        (nos || []).forEach((oEle) => {
          (oEle.itemList || []).forEach((item) => {
            if (
              item.newGoods &&
              !skuFirstIds.includes(`${item.type}_${item.goodsId}`)
            ) {
              item.isFirstSku = true; // 相同SKU核实时第一条数据可编辑
              item.verifyLength = item.length;
              item.verifyWidth = item.width;
              item.verifyHeight = item.height;
              item.verifyWeight = item.weight;
              skuFirstIds.push(`${item.type}_${item.goodsId}`);
            }
          });
        });
        setTimeout(() => {
          this.$refs[`tableRef${this.activeName}`][0]?.setNewTableData(nos);
          if (this.activeName === "2") {
            this.initTwoTabList = []; // 使computed计算更新
          }
        }, 50);
      });
    },
    handleRowSave(btnStr) {
      if (this.showTabs.length !== this.btnTabsList.length) {
        return this.msgError("请填充存仓上架信息");
      }
      const { paisong, cuncang } = this.headFormConfig.formModel || {};
      const table_1 = paisong
        ? this.$refs[`tableRef${1}`][0].getNewTableData()
        : [];
      const table_check_1 = this.handleTreeCheck(table_1, {
        label: "大货中转",
        ruleMsg: {
          3: {
            kwId: "库位号",
          },
        },
      });

      const table_2 = cuncang
        ? this.$refs[`tableRef${2}`][0].getNewTableData()
        : [];
      const table_check_2 = this.handleTreeCheck(table_2, {
        label: "存仓上架",
        ruleMsg: {
          3: {
            kwId: "库位号",
          },
        },
      });

      // console.log("is=", table_check_1, table_check_2, {
      //   table_1,
      //   table_2,
      // });
      if (table_check_1 && table_check_2) {
        // 保存接口
        const { shelvePlanId } = this.headFormConfig.formModel;
        comSaveRepeatedRequest(putSaveExpectedGoods, {
          shelvePlanId,
          psList: table_1,
          ccList: table_2,
        }).then((res) => {
          if (btnStr === "sj_2") {
            // 上架
            comContinuityRepeatedRequest(postConfirmListing, {
              shelvePlanId,
            }).then(() => {
              this.msgSuccess("保存并上架成功");
              this.reBack();
            });
          } else {
            this.msgSuccess("保存成功");
            this.reBack();
          }
        });
      }
    },
    handleTreeCheck(list, obj) {
      if (!list.length) {
        return true;
      }
      const { ruleMsg, label } = obj || {};
      const treeCheckObj = validateTreeList(list, {
        ruleMsg,
        childKey: "itemList",
      });
      for (let rIndex in treeCheckObj) {
        if (treeCheckObj[rIndex].length) {
          this.msgError(
            `${label} 序号${Number(rIndex) + 1}行 ${treeCheckObj[rIndex].join(
              "、"
            )} 必填`
          );
          return false;
        }
      }
      return true;
    },
    handleInit() {
      const { planId, id, ywType } = this.$route.query;
      fullLoading.show();
      let getHttp = null;
      if (id && ywType) {
        getHttp = getExpectedInfo({
          businessId: id,
          businessType: ywType,
        });
      }
      if (planId) {
        getHttp = getInventoryById(planId);
      }
      if (!getHttp) {
        return this.msgError("无可用计划");
      }
      getHttp
        .then((res) => {
          if (!res.data) {
            return this.msgError("无可用计划");
          }
          this.headFormConfig.formModel = res.data;
          if (res.data?.paisong) {
            this.btnTabsList.push({
              label: "大货中转",
              name: "1",
            });
          }
          if (res.data?.cuncang) {
            this.btnTabsList.push({
              label: "存仓上架",
              name: "2",
            });
          }
          this.initRes = true;
          this.handleChangeTab(this.btnTabsList[0] || {});
          if (this.btnTabsList[1] && res.data.state !== 2) {
            const { shelvePlanId } = res.data;
            getExpectedGoods({
              shelvePlanId,
              storageWay: 1, // 1-存仓
            }).then((cRes) => {
              this.initTwoTabList = cRes.data || [];
            });
          }
        })
        .finally(() => {
          fullLoading?.hide();
        });
    },
    handleExport() {
      const { shelvePlanId } = this.headFormConfig.formModel;
      getStreamFileDownload(
        `/shelvePlan/export/${shelvePlanId}`,
        {},
        {
          customFileName: "file.xlsx",
        }
      );
    },
    handleAdd(item, cIndex, cItem, row) {
      const { shelvePlanId } = this.headFormConfig.formModel;
      addKwShelvePlan({
        groupTag: item.groupTag,
        shelvePlanOrderId: row.shelvePlanOrderId,
        shelvePlanId,
      }).then((res) => {
        this.msgSuccess("新增成功");
        item.itemList.push(res.data || {});
      });
    },
    handleDelete(item, cIndex, cItem) {
      delKwShelvePlan(cItem.id).then(() => {
        this.msgSuccess("删除成功");
        item.itemList.splice(cIndex, 1);
      });
      // if (!item.itemList.length) {
      // 	row.itemList.splice(index, 1);
      // }
    },
    onNumBlur(sIndex) {
      this.indexObj = { startIndex: Number(sIndex), endIndex: null };
    },
    onClick(nIndex) {
      if (this.shiftKey) {
        this.numIndex = Number(nIndex);
        this.indexObj.endIndex = Number(nIndex);
      }
    },
    onPasteUpload(event) {
      let items = event.clipboardData && event.clipboardData.items;
      // console.log("x=", items);
      for (var index in items) {
        var item = items[index];
        if (item.kind === "string" && item.type === "text/plain") {
          item.getAsString((string) => {
            // console.log("Pasted content:", string);
            if (Number(string) != string) {
              this.indexObj = { startIndex: null, endIndex: null };
              return this.msgError("请粘贴数字");
            }
            this.onChange(string);
          });
        }
      }
    },
    onChange(numVal) {
      const { startIndex, endIndex } = this.indexObj;
      // console.log("x=", numVal, startIndex, endIndex);
      if (startIndex === null || endIndex === null) {
        return;
      }

      const ref_tab = this.$refs[`tableRef${this.activeName}`];
      const table_tab = ref_tab ? ref_tab[0].getNewTableData() : [];
      if (!table_tab.length) {
        return;
      }
      table_tab.forEach((oEle, rIdx) => {
        (oEle.itemList || []).forEach((erEle, tIndx) => {
          (erEle.itemList || []).forEach((sanEle, cIndx) => {
            const indexNum = Number(
              `${rIdx + 100}${tIndx + 100}${cIndx + 100}`
            );
            // 加100防止下标大于9时计算不对
            if (
              (indexNum >= startIndex && indexNum <= endIndex) ||
              (indexNum <= startIndex && indexNum >= endIndex)
            ) {
              sanEle.num = numVal ? Number(numVal) : undefined;
            }
          });
        });
      });

      setTimeout(() => {
        ref_tab[0]?.setNewTableData(table_tab);
        this.indexObj = { startIndex: null, endIndex: null };
      }, 50);
    },
    handleBatchDateChange(val) {
      if (val) {
        const ref_tab = this.$refs[`tableRef${this.activeName}`];
        const table_tab = ref_tab ? ref_tab[0].getNewTableData() : [];
        if (!table_tab.length) {
          return;
        }
        table_tab.forEach((oEle) => {
          (oEle.itemList || []).forEach((erEle) => {
            (erEle.itemList || []).forEach((sanEle) => {
              sanEle.time = val;
            });
          });
        });

        setTimeout(() => {
          ref_tab[0]?.setNewTableData(table_tab);
        }, 50);
      }
      this.batchDate = "";
    },
    tableSubtotalTwo(tName) {
      const ref_tab = this.$refs[`tableRef${tName}`];
      const table_tab = ref_tab ? ref_tab[0].getNewTableData() : [];
      let boxTotal = [];
      table_tab.forEach((oEle) => {
        (oEle.itemList || []).forEach((erEle) => {
          (erEle.itemList || []).forEach((sanEle) => {
            boxTotal.push(sanEle.num);
          });
        });
      });
      // console.log(`box=${tName}`, table_tab, boxTotal);
      let tableSubtotal = [];
      if (tName === "1") {
        tableSubtotal.push({
          totalLabel: "派送箱数",
          totalNum: this.headFormConfig.formModel.psBoxNum || 0,
        });
      }
      if (tName === "2") {
        tableSubtotal.push(
          {
            totalLabel: "存仓箱数",
            totalNum: this.headFormConfig.formModel.ccBoxNum || 0,
          },
          {
            totalLabel: "存仓sku数",
            totalNum: this.headFormConfig.formModel.ccSkuNum || 0,
          }
        );
      }
      return [
        ...tableSubtotal,
        {
          totalLabel: "上架数",
          totalNum: accumulationFn(boxTotal),
        },
      ];
    },
    changeMinNumber(val, row, prop, cDecimal) {
      if (!val) {
        this.$nextTick(() => {
          row[prop] = this.minLimitNumber(cDecimal || 0); // 视图更新后重置
        });
      }
    },
    slotPropsRow(row, key) {
      // 无值时改为undefined，否则会显示数字 0
      row[key] = [null, ""].includes(row[key]) ? undefined : row[key];
      return row;
    },
    showCellTxt(val, decimal) {
      if (decimal || decimal === 0) {
        return this.toFixedNum(val, decimal);
      }
      return val || val === 0 ? val : "--";
    },
    secondCellHeight(item) {
      return {
        height: `${((item.itemList || []).length || 1) * 36}px`,
      };
    },
    isItemListLen(cItem) {
      return cItem.itemList && cItem.itemList.length;
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    tableColumns(tName) {
      return ysTableCols(tName, this.isCellEdit);
    },
    startEndIndex(indexNum) {
      const { startIndex, endIndex } = this.indexObj;
      // console.log("x=1", startIndex, endIndex, indexNum);
      if (startIndex !== null && endIndex !== null) {
        if (
          (indexNum >= startIndex && indexNum <= endIndex) ||
          (indexNum <= startIndex && indexNum >= endIndex)
        ) {
          return true;
        }
      }
      return false;
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "warehousePartitionType",
      "trueOrFalse",
      "distributionType",
    ]).then(() => {
      this.handleInit();
    });
  },
  mounted() {
    const _self = this;
    document.addEventListener("keydown", function (event) {
      // console.log("key:", event);
      if (event.shiftKey) {
        _self.shiftKey = true;
      }
    });
    document.addEventListener("keyup", function (event) {
      _self.shiftKey = false;
    });
  },
  computed: {
    selectDisabledIds() {
      const ref_1 = this.$refs[`tableRef${1}`];
      const table_1 = ref_1 ? ref_1[0].getNewTableData() : [];
      const ref_2 = this.$refs[`tableRef${2}`];
      const table_2 = ref_2 ? ref_2[0].getNewTableData() : this.initTwoTabList;
      const table_all = table_1.concat(table_2);
      let table_kw = [];
      table_all.forEach((oEle) => {
        (oEle.itemList || []).forEach((erEle) => {
          (erEle.itemList || []).forEach((sanEle) => {
            table_kw.push(sanEle.kwId);
          });
        });
      });
      // console.log(122222, table_kw);
      return table_kw;
    },
    isCellEdit() {
      return [null, 0, 1].includes(this.headFormConfig.formModel.state);
    },
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
  },
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
};
</script>

<style lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 82px);
  .content-box {
    .custom-tabs-btn {
      border-bottom: none;
    }
  }
  .second-cell-txt,
  .third-cell-box {
    width: 100%;
    &:not(:last-child) {
      border-bottom: 1px solid #8b8b8b;
      padding-bottom: 4px;
      margin-bottom: 4px;
      box-sizing: content-box; //使分割线对齐
    }
  }
  .third-cell-txt {
    height: 36px;
    &:not(:last-child) {
      border-bottom: 1px solid #e2e2e2;
      // padding-bottom: 2px;
    }
    .third-cell-bg {
      /deep/ {
        .el-input__inner {
          border-color: #5094ff;
          background-color: #e8f0ff;
        }
      }
    }
  }
  /deep/ {
    .com-detail-top {
      border-bottom: none;
      .page-turn {
        padding: 0;
      }
    }
    .second-layer-css,
    .third-layer-css {
      & > .cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .date-cell-time {
    /deep/ .el-input__inner {
      padding-right: 15px;
    }
  }
}
</style>
