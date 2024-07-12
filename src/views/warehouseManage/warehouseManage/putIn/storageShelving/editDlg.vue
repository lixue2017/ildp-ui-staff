<template>
  <ComDialog
    ref="editDialogRef"
    :customDialog="editDialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
        <template v-slot:namePhone="slotProps">
          {{ slotProps.fieldItem.isStart }}
        </template>

        <template v-slot:slotPhj>
          <div class="base-flex-align">
            <el-button
              size="small"
              type="text"
              v-if="
                layerList.length && layerFormModel.id !== layerList[0].value
              "
              @click="handleArrowClick(1)"
            >
              <i class="el-icon-arrow-left" />
              上一层
            </el-button>
            <AutoComplete
              class="form-class put-shelf-form"
              :formModel="layerFormModel"
              :fieldItem="layerFieldItem"
            />
            <el-button
              size="small"
              type="text"
              v-if="
                layerList.length &&
                layerFormModel.id !== layerList[layerList.length - 1].value
              "
              @click="handleArrowClick(2)"
            >
              下一层
              <i class="el-icon-arrow-right el-icon--right" />
            </el-button>
          </div>
        </template>

        <template v-slot:slotTag>
          <div class="base-flex-align" style="width: 206px">
            <span class="put-shelf-tag put-shelf-tag_1"></span>
            <span>可用</span>
            <span class="put-shelf-tag put-shelf-tag_2"></span>
            <span>SKU存仓</span>
            <!-- 不可用 -->
            <span class="put-shelf-tag put-shelf-tag_3"></span>
            <span>整箱存仓</span>
          </div>
        </template>

        <template v-slot:slotWtr>
          <div class="base-flex-align">
            <span class="put-shelf-tag put-shelf-tag_4"></span>
            <span>SKU存仓</span>
            <span class="put-shelf-tag put-shelf-tag_5"></span>
            <span>整箱存仓</span>
          </div>
        </template>
      </ComForm>
      <div class="base-flex-center-grid" v-if="shelfGridArr.length">
        <template v-for="(item, i) in shelfGridArr">
          <div
            :key="i"
            class="base-flex-center goods-shelves"
            :class="[
              { 'disable-shelves': item.storageType !== null },
              layerItemclassName(item),
              `put-shelf_${colorNum(item)}`,
            ]"
            @click="handleLayerClick(item, i)"
          >
            <!-- , `put-shelf_${i%5}` -->
            <div>{{ item.code }}</div>
            <i class="icon-font-checked" :class="['iconfont', 'wanzheng2']" />
          </div>
        </template>
      </div>
      <div v-else>暂无数据</div>
    </template>
  </ComDialog>
</template>

<script>
import {
  warehouseFreightShelfList,
  warehousePutawayPut,
  dhzzWarehouseStorage,
	postLocationPushShelf,
} from "@/api/warehouse/manage";
import { httpFreightShelSelect } from "@/comModel/warehouse";
import { editDlgFormCols } from "./model";
export default {
  data() {
    return {
      isInitRequest: true,
      editDialogConfig: {
        width: "905px",
        title: "上架",
        useFooter: "footer",
        footer: [
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogFormRef.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.editDialogRef.handleClose();
            },
          },
        ],
      },
      editFormConfig: {
        formModel: {},
        httpRequest: this.examineRequest, // 表单提交接口
        labelWidth: "90px",
        formRules: editDlgFormCols().formRules,
      },
      layerFormModel: {},
      layerList: [],
      layerFieldItem: {
        id: "id",
        placeholder: "排柜架",
        noClearable: true,
        isAutoInitRequest: true,
        handle: (val) => {
          this.handleChangeLayer(val);
        },
      },
      currentValue: undefined, // 当前选择项
      layerFormObj: {},
      shelfGridArr: [],
    };
  },

  watch: {
    "editFormConfig.formModel": {
      deep: true,
      handler: function (newVal, oldVal) {
        //如果切换了所在仓，就把上个所在仓上架选中的派货架区域清空，避免把上个所在仓的参数带到当前所在仓上架进行查询
        const { warehouseId: newId } = newVal;
        const { warehouseId: oldId } = oldVal;
        if (newId != oldId) {
          this.currentValue = undefined;
        }
      },
    },
  },
  methods: {
    handleLayerClick(row = {}, idx) {
      // 0-sku，1-箱，null-可用
      if (row.storageType !== null) {
        return;
      }
      const { id } = this.layerFormObj;
      this.layerFormObj = id === row.id ? {} : row;
      // 更新显示选择项
      this.$set(this.shelfGridArr, idx, row);
    },
    // 上下层
    handleArrowClick(num) {
      const { id } = this.layerFormModel;
      const lIndex = this.layerList.findIndex((e) => e.value === id);
      if (lIndex !== -1) {
        const nIndex = num === 1 ? lIndex - 1 : lIndex + 1;
        const { value } = this.layerList[nIndex];
        this.$set(this.layerFormModel, "id", value);
        this.handleChangeLayer(value);
      }
    },
    handleChangeLayer(val) {
      // 调接口获取排货架
      this.currentValue = val;
      const WebCurrentData = val?.split("_");
      if (!WebCurrentData) {
        this.shelfGridArr = [];
        return;
      }
      const opt = {
        warehousePartitionId: WebCurrentData && WebCurrentData[0],
        freightShelfId: WebCurrentData && WebCurrentData[1],
        rowNo: WebCurrentData && WebCurrentData[2],
      };
       // const layer_obj = this.layerList.find((e) => e.value === val);
      // if (!layer_obj) {
      //   return;
      // }
      // const opt = {
      //   warehousePartitionId: layer_obj.warehousePartitionId,
      //   freightShelfId: layer_obj.freightShelfId,
      //   rowNo: layer_obj.rowNo,
      // };
      this.shelfGridArr = [];
      warehouseFreightShelfList(opt).then((res) => {
        this.shelfGridArr = res.data;
      });
    },
    editShow(row, { editSuccess }) {
      this.isInitRequest = true; // 再次上架更新数据
      this.layerFieldItem = {
        ...this.layerFieldItem,
        ...httpFreightShelSelect({
          ...row,
          partitionType: row.webPartitionType || 0,
        }),
        getSearchOptions: (arr) => {
          // console.log('调取接口后获取的下拉列表值---', arr)
          if (this.isInitRequest) {
            this.isInitRequest = false;
            const curId = this.currentValue || arr[0]?.value;
            this.layerFormModel = {
              id: curId,
            }; // 初始化获取排货架id
            this.layerList = arr || [];
            this.handleChangeLayer(curId);
          }
        },
      };
      this.editFormConfig = {
        ...this.editFormConfig,
        formModel: {
          ...row,
        },
        successFunction: () => {
          editSuccess && editSuccess();
          this.msgSuccess("保存成功");
          this.$refs.editDialogRef.hide();
        },
      };
      this.$set(this.editFormConfig, "lists", [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: editDlgFormCols(row.webPartitionType).columns,
                },
              ],
            },
          ],
        },
      ]);
      this.layerFormObj = {}; // 清空选中层
      this.$refs.editDialogRef.show();
    },
    examineRequest(formOpt) {
      const { id, code } = this.layerFormObj;
      const { orderType, businessId, trayInfoParamList } = formOpt;
      if (id) {
        if (formOpt.webPartitionType === 4) {
          // 大货中转上架
          const params = {
            locationId: id,
            wtblrIds: formOpt.trayIds?.length
              ? formOpt.trayIds.join(",")
              : formOpt.wtblrIds,
          };
          return dhzzWarehouseStorage(params);
        }
        if (orderType == 2 || orderType == 4 || orderType == 1) {
          // 入库单和和海外入仓单，电商头程 20230602
          const params = {
            locationId: id,
            trayInfoParamList: trayInfoParamList.map((e) => {
              const { traySn } = e;
              return {
                traySn,
              };
            }),
          };
          return postLocationPushShelf(params);
        }
        const params = {
          locationId: id,
          locationCode: code,
          type: formOpt.activeType,
          trayIds: formOpt.trayIds?.length ? formOpt.trayIds : [formOpt.trayId],
        };
        return warehousePutawayPut(params);
      } else {
        this.msgError("请选择库位上架");
        return new Promise((resolve, reject) => {
          return reject();
        });
      }
    },
    layerItemclassName(row = {}) {
      const fSome = this.layerFormObj.id === row.id;
      if (fSome) {
        return "available-checked";
      }
      return "available-option";
    },
    colorNum(row = {}) {
      // 库位颜色显示：0-sku，1-箱，null-可用
      return row.storageType === null ? 0 : [1, 2][row.storageType];
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.disable-change {
  color: $disableBtnTxt;
  cursor: no-drop;
}
.put-shelf-form {
  margin: 0 7px;
}
.put-shelf-tag {
  width: 12px;
  height: 8px;
  margin-left: 8px;
  margin-right: 3px;
  border-radius: 1px;
  display: inline-block;
}
.put-shelf-tag_1 {
  border: 1px solid $putshelf_borderColor_1;
}
.put-shelf-tag_2 {
  border: 1px solid $putshelf_borderColor_2;
  background-color: $putshelf_bgColor_2;
}
.put-shelf-tag_3 {
  border: 1px solid $putshelf_borderColor_3;
  background-color: $putshelf_bgColor_3;
}
.put-shelf-tag_4 {
  border: 1px solid $putshelf_borderColor_4;
  background-color: $putshelf_bgColor_4;
}
.put-shelf-tag_5 {
  border: 1px solid $putshelf_borderColor_5;
  background-color: $putshelf_bgColor_5;
}
.base-flex-center-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 120px));
  grid-auto-rows: 50px;
  grid-gap: 5px;
}
.goods-shelves {
  position: relative;
  cursor: pointer;
  border: 1px solid;
  border-color: $putshelf_borderColor_1;
  border-radius: 4px;
	overflow: hidden;
  &.put-shelf_0 {
    border-color: $putshelf_borderColor_1;
    color: $putshelf_textColor_1;
    background-color: $putshelf_bgColor_1;
  }
  &.put-shelf_1 {
    border-color: $putshelf_borderColor_2;
    color: $putshelf_textColor_2;
    background-color: $putshelf_bgColor_2;
  }
  &.put-shelf_2 {
    border-color: $putshelf_borderColor_3;
    color: $putshelf_textColor_3;
    background-color: $putshelf_bgColor_3;
  }
  &.put-shelf_3 {
    border-color: $putshelf_borderColor_4;
    color: $putshelf_textColor_4;
    background-color: $putshelf_bgColor_4;
  }
  &.put-shelf_4 {
    border-color: $putshelf_borderColor_5;
    color: $putshelf_textColor_5;
    background-color: $putshelf_bgColor_5;
  }
  &.disable-shelves {
    cursor: no-drop;
  }
  .icon-font-checked {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    color: $green;
  }
}
.available-option {
  color: $disableBtnTxt;
}
.available-checked {
  color: red;
  .icon-font-checked {
    opacity: 1;
  }
}
</style>
