<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :columnData="columnData"
      :rowOperationBtnListFn="() => operationBtn"
      @handleChange="handleChange"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.column.fieldItem">
          <FormSingle
            :formData="slotProps.row"
            :fieldItem="{
              id: slotProps.prop,
              placeholder: slotProps.column.label,
              disabled: slotProps.prop === 'beginValue',
              ...slotProps.column.fieldItem,
            }"
            :disabled="
              [
                'beginValue',
                'endValue',
                'minPrice',
                'maxPrice',
                'unitNum',
              ].includes(slotProps.prop) && slotProps.row.costTypeId == 2021
            "
            :dictionary="dictionary"
            @handleChange="
              (val, prop) =>
                handleChange(val, prop, slotProps.row, slotProps.rowIndex)
            "
          />
        </template>
        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content-btn">
            <span v-if="!getStatusList(slotProps.row, slotProps.rowIndex)"
              >--</span
            >
            <template
              v-for="(item, index) in getStatusList(
                slotProps.row,
                slotProps.rowIndex
              )"
            >
              <el-button
                :key="index"
                size="small"
                type="text"
                :style="{ color: item.color }"
                v-throttle
                @click="item.handleClick(slotProps.row, slotProps.rowIndex)"
                >{{ item.text }}</el-button
              >
            </template>
          </div>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { handleColumns, handleRule } from "./model.js";
import { mapState } from "vuex";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    renewalFee: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
  },
  data() {
    return {
      operationBtn: [
        {
          text: "删除",
          type: "delete",
          color: "#ff6767",
          handleClick: this.handleDelete,
        },
      ],
      tableConfig: {
        tableColumns: handleColumns(this.isDetail),
      },
      columnData: this.formData.itemList || [
        {
          unitNum: 1,
          temp_only_key: Math.random() + "",
          newId: 1,
          beginValue: 0,
          costTypeId: "2020", // 费用类型 2020=操作费；2021=续件费
          chargeUnit: "1",
        },
      ],
      newId: 1,
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  watch: {
    renewalFee(val) {
      if (val) {
        this.handleAdd(false, false, true);
      } else {
        const list = this.$refs.tableRef.getNewTableData();
        const len = list.length;
        const { costTypeId } = list[len - 1];
        if (costTypeId == 2021) {
          this.handleDelete(null, len - 1);
        }
      }
    },
  },
  methods: {
    handleChange(val, prop, row, index) {
      switch (prop) {
        case "singlePrice":
          if (row.costTypeId == 2020) {
            row.maxPrice = val;
            row.minPrice = val;
          }
          break;
        case "endValue":
          const list = this.$refs.tableRef.getNewTableData();
          const len = list.length;
          if (list.length > 1) {
            for (let i = index + 1; i < len; i++) {
              if (list[i].costTypeId == 2020) {
                list[i].beginValue = val;
                this.$refs.tableRef.setNewTableData(list);
                break;
              }
            }
          }
          break;
        default:
          break;
      }
    },
    getStatusList(row, index) {
      if (row.costTypeId == 2021) {
        return null;
      }
      return [
        {
          text: "新增",
          handleClick: this.handleAdd,
        },
        ...(index !== 0
          ? [
              {
                text: "删除",
                color: "#ff6767",
                handleClick: this.handleDelete,
              },
            ]
          : []),
      ];
    },
    getTableList() {
      const lists = this.$refs.tableRef.getNewTableData();
      let len = lists.length;
      const { singlePrice } = lists[len - 1];
      if (this.renewalFee) {
        len -= 1;
      }
      for (let i = 0; i < len; i++) {
        const error = handleRule(lists[i]);
        if (error) {
          this.$message.error(`第${i + 1}行，${error}`);
          return false;
        }
      }
      if (this.renewalFee && !singlePrice) {
        this.$message.error(`第${lists.length}行，单价不能为空`);
      }
      return lists;
    },
    handleAdd(row, index, renewalFee) {
      this.newId += 1;
      const [...list] = this.$refs.tableRef.getNewTableData();
      const params = {
        unitNum: 1,
        temp_only_key: Math.random() + "",
        newId: this.newId,
      };
      if (!renewalFee && (index || index === 0)) {
        params.costTypeId = "2020"; // 费用类型 2020=操作费；2021=续件费
        params.chargeUnit = "1";
      }
      if (renewalFee) {
        params.costTypeId = "2021"; // 费用类型 2020=操作费；2021=续件费
        params.chargeUnit = "3";
      }
      if (!renewalFee && row) {
        params.beginValue = row.endValue;
      }
      if (!index && index !== 0) {
        list.push(params);
      } else {
        list.splice(index + 1, 0, params);
      }
      this.$refs.tableRef.setNewTableData(list);
    },
    handleDelete(_, index) {
      const list = this.$refs.tableRef.getNewTableData();
      const [currRow] = list.splice(index, 1);
      const len = list.length;
      if (currRow.costTypeId == 2020) {
        let endValue = undefined;
        for (let i = index - 1; i >= 0; i--) {
          if (list[i].costTypeId == 2020) {
            endValue = list[i].endValue;
            break;
          }
        }
        for (let i = index; i < len; i++) {
          if (list[i].costTypeId == 2020) {
            list[i].beginValue = endValue;
            break;
          }
        }
      }
      this.$refs.tableRef.setNewTableData(list);
    },
  },
};
</script>

<style lang="scss" scoped></style>
