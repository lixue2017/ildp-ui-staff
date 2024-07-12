<template>
  <div class="good-info">
    <div class="top">
      <div>
        <span class="title">{{
          overseaLangObj.cargo_details || "货物信息"
        }}</span>
        <span class="subtitle" v-if="pageType == 2">
          * Shipment ID({{ overseaLangObj.box_number || "箱序号" }})为唯一标识
        </span>
      </div>
      <div>
        <!-- <el-button size="mini" type="primary" @click="handleAdd" plain round>
          新增
        </el-button> -->
      </div>
    </div>
    <ComTable
      ref="tableRef"
      :columnConfig="goodTableColumns({ onlyDirect, onlyDelivery, pageType })"
      :columnData="columnData"
      :extraConfig="{ stripe: false }"
      :defaultExpandAll="true"
      class="good-table"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'expand'">
          <div
            v-if="!slotProps.row.products || !slotProps.row.products.length"
            class="noData"
          >
            {{ overseaLangObj.no_data("暂无关联产品") }}
          </div>
          <template v-for="(item, index) in slotProps.row.products">
            <ComForm
              :key="`${item.temp_only_key || ''}_${item.id || ''}_${
                item.newId || ''
              }`"
              :formConfig="{
                ...productFormConfig,
                lists: productConfig({
                  item,
                  cusIndex: index,
                  isEdit: slotProps.row.isEdit,
                }),
                formModel: {
                  ...item,
                },
                size: 'mini',
              }"
              :ref="`myComForm_${slotProps.rowIndex}_${index}`"
            >
              <template v-slot:productSlotBtn>
                <el-button
                  size="small"
                  type="text"
                  :style="{
                    color: '#FF6767',
                  }"
                  @click="handleRemoveProduct(slotProps.row, index)"
                  >删 除</el-button
                >
              </template>
              <template v-slot:sku="productProps">
                <AutoComplete
                  v-if="slotProps.row.isEdit"
                  ref="selectProductRef"
                  :formModel="productProps.formModel"
                  :fieldItem="{
                    ...productProps.fieldItem,
                  }"
                  :additionalParam="{ customerId: formData.bailorPeopleId }"
                  @selectHandleChange="
                    (val) =>
                      handleChange(
                        val,
                        productProps.fieldItem.id,
                        productProps.formModel
                      )
                  "
                />
                <TooltipOver
                  v-else
                  :content="productProps.formModel.sku || '--'"
                  :style="{ width: '100%' }"
                  refName="tooltipOverTit"
                />
              </template>
            </ComForm>
          </template>
          <div v-if="slotProps.row.isEdit" class="base-flex-end">
            <el-button
              size="small"
              type="text"
              @click="addProductEvt(slotProps.row)"
              >新增产品</el-button
            >
            <template v-for="(item, index) in btnList">
              <el-button
                :key="index"
                v-if="item.isEdit === true"
                :class="`operate-icon ${item.info ? 'operate-icon-info' : ''}`"
                type="primary"
                size="mini"
                :plain="item.plain"
                @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
              >
                {{ item.text }}
              </el-button>
            </template>
          </div>
        </template>
        <FormSingle
          v-else
          :formData="slotProps.row"
          :fieldItem="{
            id: slotProps.column.prop,
            placeholder: slotProps.column.label,
            render: slotProps.column.render,
            ...slotProps.column.fieldItem,
            ...(slotProps.prop === 'sku' ||
            slotProps.prop === 'consigneeWarehouseId'
              ? {
                  additionalParam: {
                    customerId: formData.bailorPeopleId,
                    ...(slotProps.prop === 'consigneeWarehouseId'
                      ? {
                          includTypeList: '0,1,2,3',
                          typeList: undefined,
                        }
                      : {}),
                  },
                }
              : {}),
          }"
          :dictionary="dictionary"
          :disabled="!slotProps.row.isEdit"
          @handleChange="(val, type) => handleChange(val, type, slotProps.row)"
        />
        <template
          v-if="
            (slotProps.row.isEdit === false || onlyDelivery) &&
            slotProps.prop === 'operation'
          "
        >
          <div class="operate-btn-list">
            <template v-for="(item, index) in btnList">
              <div
                class="btn"
                :key="index"
                v-if="item.isEdit === slotProps.row.isEdit"
              >
                <el-button
                  :class="`operate-icon ${
                    item.info ? 'operate-icon-info' : ''
                  }`"
                  size="small"
                  type="text"
                  :style="{ color: item.color }"
                  :icon="item.icon"
                  @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
                >
                  {{ item.text }}
                </el-button>
              </div>
            </template>
          </div>
        </template>
      </template>
    </ComTable>
    <div class="grand-total">
      <template v-for="gross in goodGrossTotal">
        <span :key="gross.prop">
          <span class="label">{{ gross.label }}</span>
          <span :class="`value ${gross.valClass}`"
            >{{ handleNum(totalData[gross.prop], gross.decimal) || "--"
            }}{{ gross.unit || "" }}</span
          >
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import {
  productConfig,
  goodTableColumns,
  goodGrossTotal,
  handleRule,
} from "../model";
import {
  getBoxProductListVo,
  saveBoxProduct,
  deleteBoxProduct,
} from "@/api/operateRecord/customsClearance";
import { msgBox } from "@/utils/confirmBox.js";
import { mapState } from "vuex";
import { multiplicationFn } from "@/utils/instructions";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    pageType: {
      type: Number,
      default: 1,
      // 1直清
      // 2派送
      // 3入仓
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComTable: () => import("_comp/ComTable"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      productConfig,
      goodTableColumns,
      goodGrossTotal,
      totalData: {},
      columnData: [],
      productFormConfig: {
        formModel: {},
        httpRequest: () => {}, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        labelWidth: this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "90px",
        formRules: {}, // 表单校验规则
      },
      btnList: [
        {
          text: "保存",
          isEdit: true,
          handleClick: this.handleSave,
        },
        {
          text: "取消",
          isEdit: true,
          plain: true,
          handleClick: this.handleCancel,
        },
        {
          text: "修改",
          isEdit: false,
          handleClick: this.handleEdit,
        },
        {
          text: "复制",
          isEdit: false,
          handleClick: this.handleCopy,
        },
        {
          text: "删除",
          color: "#FF6767",
          isEdit: false,
          handleClick: this.handleDelete,
        },
      ],
      addId: 0,
      currData: {},
      onlyDirect: false,
      onlyDelivery: false,
      goodFormRule: {},
      newId: 0,
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    const { overseaBusinessTypes = [] } = this.formData;
    if (overseaBusinessTypes.length === 1) {
      overseaBusinessTypes[0] === 1 && (this.onlyDirect = true); //直清
      overseaBusinessTypes[0] === 2 && (this.onlyDelivery = true); //派送
    }
    this.getList();
  },
  methods: {
    getList() {
      const { id } = this.formData;
      getBoxProductListVo(id).then((res) => {
        const tableData = this.getTableData() || [];
        const addList = [];
        const editList = [];
        tableData
          .filter((item) => item.isEdit)
          .forEach((item) => {
            !item.id ? addList.push(item) : editList.push(id);
          });
        let totalNum = 0,
          totalVolume = 0,
          totalWeight = 0;
        const totalShipmentId = {};
        this.columnData = [
          ...addList,
          ...res.data.map((item) => {
            // if (!totalShipmentId[item.shipmentId]) {
            const { predictionNum, boxVolume, boxWeight } = item;
            totalShipmentId[item.shipmentId] = true;
            totalNum += predictionNum;
            totalVolume += multiplicationFn([predictionNum, boxVolume]);
            totalWeight += multiplicationFn([predictionNum, boxWeight]);
            // }
            return {
              ...item,
              isEdit: editList.includes(item.id),
            };
          }),
        ];
        this.totalData = res.total || {
          totalNum,
          totalVolume,
          totalWeight,
        };
        console.log(this.$refs.tableRef);
        this.$refs.tableRef?.setNewTableData(this.columnData);
      });
    },
    handleNum(num, decimal) {
      if (!num) return "";
      return Number(num).toFixed(decimal);
    },
    getTableData() {
      return this.$refs.tableRef?.getNewTableData();
    },
    handleChange(val, type, row) {
      if (type === "sku") {
        const { productHigh, productLength, productWidth } =
          val.cusProduct || {};
        row.productId = val?.id;
        row.sku = val?.sku;
        row.skuName = val?.declaredNameEn;
        row.skuHigh = productHigh;
        row.skuLong = productLength;
        row.skuWide = productWidth;
      }
    },
    handleSave(row, rIndex) {
      const error = handleRule(row, this.getFormRule());
      if (error) {
        this.$message.error(error);
        return;
      }
      let proErr = "";
      row.products = (row.products || []).map((cusEle, cIdx) => {
        const { productSlotBtn, temp_only_key, ...item } =
          this.$refs[`myComForm_${rIndex}_${cIdx}`][0].getFormParams();
        if (!item.sku && !proErr) {
          proErr = `产品${cIdx + 1},产品不能为空！`;
        }
        if (!item.skuNum && !proErr) {
          proErr = `产品${cIdx + 1},产品数不能为空！`;
        }
        return item;
      });
      if (proErr) {
        this.$message.error(proErr);
        return;
      }
      const { temp_only_key, temp_secondId, isEdit, ...params } = row;
      const { id: clearanceId, nlCode } = this.formData;
      saveBoxProduct({ ...params, clearanceId, nlCode }).then(() => {
        row.isEdit = false;
        this.getList();
      });
    },
    getFormRule() {
      const formRule = [];
      goodTableColumns({
        onlyDirect: this.onlyDirect,
        onlyDelivery: this.onlyDelivery,
      }).forEach((item) => {
        if (item.request) {
          formRule[item.prop] = item.message || `${item.label}不能为空！`;
        }
      });
      return formRule;
    },
    handleCancel(row, index) {
      if (row.id) {
        console.log(this.currData);
        const tableData = this.getTableData().map((item) => {
          if (item.id === row.id) {
            return {
              ...this.currData[row.id],
            };
          }
          return item;
        });
        this.$refs.tableRef.setNewTableData([...tableData]);
      } else {
        const tableData = this.getTableData();
        tableData.splice(index, 1);
        this.$refs.tableRef.setNewTableData([...tableData]);
      }
    },
    handleCopy(row) {
      const tableData = this.getTableData();
      const { id, products, temp_only_key, temp_secondId, ...data } = row;
      this.$refs.tableRef.setNewTableData([
        {
          ...data,
          products:
            products &&
            products.map((item) => {
              this.newId += 1;
              return {
                ...item,
                temp_only_key: Math.random() + "",
                newId: this.newId,
              };
            }),
          isEdit: true,
        },
        ...tableData,
      ]);
    },
    handleAdd() {
      const tableData = this.getTableData();
      this.$refs.tableRef.setNewTableData([
        {
          referenceId: "",
          shipmentId: "",
          predictionNum: undefined,
          boxLong: undefined,
          boxWide: undefined,
          boxHigh: undefined,
          boxVolume: undefined,
          boxWeight: undefined,
          storageType: "",
          consigneeWarehouseId: "",
          products: [],
          isEdit: true,
        },
        ...tableData,
      ]);
    },
    handleEdit(row, rIndex) {
      this.currData = {
        ...this.currData,
        [row.id]: {
          ...JSON.parse(JSON.stringify(row)),
        },
      };
      const products = row.products || [];
      row.products = [];
      row.isEdit = true;
      this.$nextTick(() => {
        row.products = products.map((item) => ({
          ...item,
        }));
      });
    },
    handleDelete({ id }) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        this.comRepeatedRequest(this, deleteBoxProduct, { id }).then(() => {
          this.msgSuccess("删除成功");
          this.getList();
        });
      });
    },
    addProductEvt(row) {
      !row.products && (row.products = []);
      this.newId += 1;
      row.products.push({
        temp_only_key: Math.random() + "",
        skuNum: undefined,
        sku: "",
        skuName: "",
        newId: this.newId,
      });
    },
    handleRemoveProduct(row, index) {
      row.products.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.good-info {
  .good-table {
    .noData {
      line-height: 50px;
      text-align: center;
    }
    /deep/ {
      .el-form-item--mini.el-form-item {
        margin-bottom: 0px;
      }
      .form-class {
        &:not(:first-child) {
          margin-top: 5px;
        }
      }
      .el-table__expanded-cell {
        background: #fdfdfd;
        border-bottom: 1px solid #efefef;
        padding: 8px 50px;
      }
    }
  }
}
</style>
