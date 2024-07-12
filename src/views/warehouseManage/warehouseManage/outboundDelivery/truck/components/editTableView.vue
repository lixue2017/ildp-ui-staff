<template>
  <div>
    <template v-for="(item, index) in tableConfigList">
      <div :key="item.tIndex">
        <div class="base-flex-between footer-btn">
          <div class="title">{{ item.label }}</div>
          <el-button
            type="primary"
            size="small"
            @click="addContainerEvt"
            v-if="index === 0 && !formData.isWebSee"
            class="add-btn"
          >
            <i class="el-icon-plus"></i>
            {{ overseaLangObj.xz_add("添 加") }}
          </el-button>
        </div>

        <ComTable
          v-if="item.tIndex === 1"
          :ref="`tableRef`"
          :columnConfig="trayTable.tableColumns"
          :tableHeight="tableTrayHeight"
          :columnData="trayTable.columnData"
          :treeProps="{ children: 'trayList' }"
          :extraConfig="{
            rowKeyName: 'trayKeyObj',
          }"
          :defaultExpandAll="true"
          :rowOperationBtnListFn="
            (row) => {
              return !row.trayList && tableLength > 1
                ? trayTable.statusBtnList
                : [];
            }
          "
        />
        <!-- 
					:selectionRowConfig="{ childrenSelection: true }"
					:selectionRow="selectionRowEvt"
          @onSelectionChange="onTableSelectionChange" -->

        <ComTable
          v-else
          :ref="`gTableRef${item.tIndex}`"
          :tableHeight="tableAutoHeight(index)"
          :columnConfig="item.columnConfig"
          :columnData="item.columnData"
          :pagination="false"
        >
          <template v-slot:bottomTotal>
            <div class="grand-total">
              <template v-for="(tItem, i) in tableSubtotal(index)">
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

    <div class="base-flex-between footer-btn">
      <div class="title">
        {{ overseaLangObj.wgl_tp || "未关联托盘货物信息" }}
      </div>
      <el-button
        type="primary"
        size="small"
        @click="handleSaveAll"
        v-if="!formData.isWebSee"
      >
        {{ overseaLangObj.batch_save || "批量保存" }}
      </el-button>
    </div>
    <ComTable
      :ref="`wTableRef`"
      :tableHeight="tableComputedHeight"
      :columnConfig="tableConfig.columnConfig"
      :columnData="[]"
      :pagination="false"
      :rowOperationBtnListFn="
        (row) => {
          /** 最少保留一条数据 */
          return rowBtnList(row);
        }
      "
      :colShowBtnFn="
        (btnItem, row) => btnItem.btnUpdate === (row.rBtnUpdate || false)
      "
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-for="(nItem, nIdx) in ['num', 'pltNum']">
          <template v-if="slotProps.prop == nItem">
            <div :key="nIdx">
              <!-- 大货中转不可修改 -->
              <template v-if="[1, 4].includes(slotProps.row.businessType)">{{
                slotProps.row[nItem]
              }}</template>
              <template v-else-if="!slotProps.row.rBtnUpdate">
                {{ toFixedNum(slotProps.row[nItem], slotProps.column.decimal) }}
              </template>
              <template v-else>
                <el-input-number
                  size="small"
                  :min="slotProps.column.min || 0"
                  v-model="slotProps.row[nItem]"
                  v-input-number-limit="{
                    value: slotProps.column.decimal,
                    maxNumber: slotProps.column.maxKey
                      ? slotProps.row[slotProps.column.maxKey]
                      : 9999,
                  }"
                  :placeholder="slotProps.column.label"
                  :controls="false"
                  @change="
                    (val) => handleNumberChange(slotProps.row, val, nItem)
                  "
                />
              </template>
            </div>
          </template>
        </template>
      </template>
      <template v-slot:bottomTotal>
        <div class="grand-total">
          <template v-for="(tItem, i) in tableComputedTotal">
            <span :key="`t_${i}`">
              <span>{{ tItem.totalLabel }}：</span>
              <span>{{ tItem.totalNum }}</span>
            </span>
          </template>
        </div>
      </template>
    </ComTable>

    <addDrawerOrder ref="addDrawerRef" @handleCheckClick="addTableClick" />
  </div>
</template>

<script>
import {
  accumulationFn,
  multiplicationFn,
  deleteOrAddArr,
} from "@/utils/instructions";
import { duplicateRemoval } from "@/utils/index";
import { customMessageBox } from "@/utils/confirmBox.js";
import {
  getTruckDeliveryPlan,
  getTruckListPlan,
  getTruckCargoList,
  addTruckCargoItem,
  updTruckCargoItem,
  delTruckCargoItem,
  putItemByTrayPlan,
} from "@/api/warehouse/manage";
import { addTableColumns, trayTableColumns, editTableColumns } from "../model";
import { mixinTableOperationRow } from "_comp/ComTable/tableOperation/rowOperationMixin.js";

export default {
  mixins: [mixinTableOperationRow],
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      trayTable: {
        tableColumns: trayTableColumns("edit"),
        columnData: [],
        totalRow: 0,
        statusBtnList: [
          {
            text: this.overseaLangObj.yc_delete("删除"),
            color: "#FF6767",
            handleClick: (row) => {
              // console.log('row==', row)
              customMessageBox(
                this,
                {
                  msgTitle: this.overseaLangObj.ts_tip("删除提示"),
                  msgTxtColor: "#FF6767",
                  httpMsgRequest: () => putItemByTrayPlan(row.id),
                },
                () => {
                  this.msgSuccess(this.overseaLangObj.cg_tip("删除成功"));
                  this.getTableList();
                }
              );
            },
          },
        ],
      },
      selectionRows: [],
      tableConfigList: [
        {
          tIndex: 0,
          label: this.overseaLangObj.ygl_tp || "已关联托盘货物信息",
          columnConfig: addTableColumns(0),
          columnData: [],
        },
        {
          tIndex: 1,
          label: this.overseaLangObj.tp_info || "托盘信息",
        },
      ],

      tableConfig: {
        columnConfig: editTableColumns(),
      },
      mixinTableRef: "wTableRef",
      ruleObj: {
        ruleMsg: {
          num: "箱数", // 保存时的校验
        },
      },
      mixinOperationObj: {
        saveCallBack: () => this.getUnassociatedList(),
        httpDelRequest: (row) => {
          return delTruckCargoItem(row.id).then((res) => {
            if (res.data) {
              // 删除最后一条数据后，返回到列表
              this.$emit("cancelEvt");
            }
            this.resTrayPlan.planIdList = this.resTrayPlan.planIdList.filter(
              (e) => e != row.id
            );
          });
        },
        delMsgBox: true,
        delCallBack: () => this.getUnassociatedList(),
        handleMixinCheckSaveFn: (row, saveFn) => {
          // 单行保存，先校验
          this.handleRowSave(row).then(() => {
            updTruckCargoItem(this.saveParam([row])).then(() => {
              saveFn && saveFn();
            });
          });
        },
        saveTableAllRequest: (eItems) => {
          return updTruckCargoItem(this.saveParam(eItems)).then(() => {
            this.getUnassociatedList();
          });
        },
      },
    };
  },
  methods: {
    // selectionRowEvt(row) {
    //   return !row.trayList;
    // },
    // onTableSelectionChange(rows = []) {
    //   let trayAllArr = [...rows];
    //   rows.forEach((e) => {
    //     if (e.trayList) {
    //       trayAllArr = trayAllArr.concat(e.trayList || []);
    //     }
    //   });
    //   const tempSelection = duplicateRemoval(
    //     trayAllArr.filter((e) => !e.trayList),
    //     "id"
    //   );
    //   this.delCheckedChange(
    //     deleteOrAddArr(tempSelection, this.selectionRows, "id")
    //   );
    //   this.selectionRows = JSON.parse(JSON.stringify(tempSelection));
    //   this.$refs.tableRef[0]?._toggleRowSelectionMixin({
    //     newCheckRows: tempSelection,
    //   });
    // },
    // delCheckedChange(rows) {
    //   if (rows?.length) {
    //     putItemByTrayPlan(rows[0].id).then((res) => {
    //       if (res.data) {
    //         // 删除最后一条数据后，返回到列表
    //         this.$emit("cancelEvt");
    //       } else {
    //         this.getTableList();
    //       }
    //     });
    //   }
    // },
    handleCheckedChange(rows) {
      if (rows?.length) {
        getTruckListPlan({ idList: rows || [] }).then((res) => {
          this.setTableData(0, res.data);
        });
      } else {
        this.setTableData(0, []);
      }
    },
    async getTableList() {
      const { routeId, routePageLocation } = this.formData;
      this.resTrayPlan =
        (
          await getTruckDeliveryPlan({
            idList: routeId.split(","),
            pageLocation: routePageLocation,
          })
        ).data || {};
      const {
        planList, // 关联托盘列表
      } = this.resTrayPlan;

      this.trayTable.columnData = planList || [];
      this.$refs.tableRef[0]?.setNewTableData(planList || []);

      if (planList?.length) {
        let trayAllArr = [];
        planList.forEach((ele) => {
          trayAllArr = trayAllArr.concat(ele.trayList || []);
        });
        this.trayTable.totalRow = accumulationFn([
          planList.length,
          trayAllArr.length,
        ]);
        // this.onTableSelectionChange(trayAllArr);
        this.selectionRows = trayAllArr;
        this.handleCheckedChange(trayAllArr.map((e) => e.id));
      }
      this.getUnassociatedList();
    },
    getUnassociatedList() {
      const {
        planIdList, // 无托盘货物列表
      } = this.resTrayPlan;
      if (planIdList?.length) {
        getTruckCargoList({
          idList: planIdList,
          pageLocation: 1, // routePageLocation,
        }).then((res) => {
          this.mixinChangeTableDataFn(res.data || []);
        });
      } else {
        this.mixinChangeTableDataFn([]);
      }
    },
    setTableData(idx, arr) {
      this.tableConfigList[idx].columnData = arr || [];
      this.$refs[`gTableRef${idx}`][0]?.setNewTableData(arr || []);
    },

    handleSaveAll() {
      this.handleMixinSaveAll(this.ruleObj);
    },
    handleRowSave(row) {
      return this.handleMixinRowSave(row, null, this.ruleObj);
    },
    saveParam(arr, iType) {
      // 列表保存入参
      return {
        id: this.formData.id,
        itemList: (arr || []).map((e) => {
          let opt = {
            id: e.id,
            num: e.num,
            pltNum: e.pltNum,
          };
          if (iType === "t_add") {
            opt.idList = e.idList;
          }
          return opt;
        }),
      };
    },
    addTableClick(arr) {
      if (!arr || !arr.length) {
        return;
      }
      addTruckCargoItem(this.saveParam(arr, "t_add")).then(() => {
        this.getTableList();
      });
    },
    addContainerEvt() {
      this.$refs.addDrawerRef?.show(this.handleTableData(), this.formData);
    },
    getTableData() {
      // 父组件获取表格数据
      const isEdit = this.mixinTableDataArr.some((e) => e.rBtnUpdate);
      if (isEdit) {
        this.msgError(`请先保存未关联托盘货物信息`);
      } else {
        return this.handleTableData();
      }
      return null;
    },
    handleTableData() {
      return [...this.tableConfigList[0].columnData, ...this.mixinTableDataArr];
    },

    tableAutoHeight(idx) {
      const tableLen = this.tableConfigList[idx].columnData.length;
      return tableLen > 6 ? `${7 * 39 + 54}px` : undefined;
    },
    handleNumberChange(row, val, key) {
      if (key === "num") {
        row.totalVolume = multiplicationFn([row.singleVolume, val]);
        row.totalWeight = multiplicationFn([row.singleWeight, val]);
      }
    },
    rowBtnList(r) {
      if (this.tableLength > 1) {
        return [1, 4].includes(r.businessType)
          ? this.mixinTableRowBtnArr().filter((e) => e.opnBtnType === "delRow")
          : this.mixinTableRowBtnArr();
      } else {
        return [1, 4].includes(r.businessType)
          ? []
          : this.mixinTableRowBtnArr().filter((e) => e.opnBtnType !== "delRow");
      }
    },
    tableSubtotal(idx) {
      const arr = this.tableConfigList[idx].columnData || [];
      return [
        {
          totalLabel: this.overseaLangObj.zxs_total("总箱数"),
          totalNum: accumulationFn(arr.map((e) => e.num)),
        },
        {
          totalLabel: "PLT",
          totalNum: duplicateRemoval(this.selectionRows, "trayId").length,
        },
        {
          totalLabel: this.overseaLangObj.total_weight("总重量(KG)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalWeight),
            2
          ),
        },
        {
          totalLabel: this.overseaLangObj.total_volume("总体积(m³)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalVolume),
            2
          ),
        },
      ];
    },
  },
  mounted() {
    this.getTableList();
  },
  computed: {
    tableTrayHeight() {
      return this.trayTable.totalRow > 6 ? `${7 * 39 + 54}px` : undefined;
    },
    tableComputedHeight() {
      const tableLen = this.mixinTableDataArr.length;
      return tableLen > 6 ? `${7 * 39 + 54}px` : undefined;
    },
    tableComputedTotal() {
      const arr = this.mixinTableDataArr || [];
      return [
        {
          totalLabel: this.overseaLangObj.zxs_total("总箱数"),
          totalNum: accumulationFn(arr.map((e) => e.num)),
        },
        {
          totalLabel: "PLT",
          totalNum: accumulationFn(arr.map((e) => e.pltNum)),
        },
        {
          totalLabel: this.overseaLangObj.total_weight("总重量(KG)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalWeight),
            2
          ),
        },
        {
          totalLabel: this.overseaLangObj.total_volume("总体积(m³)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalVolume),
            2
          ),
        },
      ];
    },
    tableLength() {
      return this.selectionRows.length + this.mixinTableDataArr.length;
    },
  },
  components: {
    addDrawerOrder: () => import("../addDrawer.vue"),
  },
  created() {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.footer-btn {
  padding: 10px 0;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
