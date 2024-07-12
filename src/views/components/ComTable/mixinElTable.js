import { systemColumnList, saveSystemColumn } from "@/api/common.js";
import Sortable from "sortablejs";

/** 表头前后移动更改显示位置 */
export const mixinElTableCols = {
  props: {
    setColumnParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isUpdateShowDomTime: 1,
    };
  },
  mounted() {
    if (this.setColumnParams.routeType) {
      this.$nextTick(() => {
        this.mixinColumnDragSort();
      });
    }
  },
  methods: {
    mixinColumnDragSort() {
      new Sortable(document.querySelector(".el-table__header-wrapper tr"), {
        sort: true,
        animation: 150,
        // handle: '.handle', // handle's class
        filter: ".ignore-elements", // 过滤器，不需要进行拖动的元素
        onEnd: (evt) => {
          // console.log("==", evt);
          if (evt.newIndex === evt.oldIndex) {
            return;
          }
          const { fixed, type, prop } = this.columnConfig[evt.newIndex];
          // 固定列/操作列不可移动
          if (
            !fixed &&
            prop &&
            !["index", "selection", "expand"].includes(type) &&
            !["operation"].includes(prop)
          ) {
            this.columnConfig.splice(
              evt.newIndex,
              0,
              this.columnConfig.splice(evt.oldIndex, 1)[0]
            ); // 重置全部数据会使页面卡顿与其他问题
            // const newItem = { ...this.columnConfig[evt.newIndex] };
            // this.$set(
            //   this.columnConfig[evt.newIndex],
            //   "prop",
            //   `temp_${newItem.prop}` // 使用set改变已有属性更新DOM显示, 电商流程拖拽后点击查询再次拖拽时$set更新DOM失效
            // );
            this.isUpdateShowDomTime = 0;
            this.$nextTick(() => {
              this.isUpdateShowDomTime = 1;
              // this.$set(this.columnConfig[evt.newIndex], "prop", newItem.prop);
              this.setColumnSave(true);
            });
          }
        },
      });
    },
    onMixinHeaderDragend(newWidth, oldWidth, col, event) {
      // console.log("col==", col);
      if (
        newWidth === oldWidth ||
        !col.property ||
        ["index", "selection", "expand"].includes(col.type) ||
        ["operation"].includes(col.property) ||
        !this.setColumnParams.routeType
      ) {
        return;
      }
      const cIndex = this.columnConfig.findIndex(
        (e) => e.prop === col.property
      );
      if (cIndex > -1) {
        if (this.columnConfig[cIndex].minWidth) {
          this.$set(this.columnConfig[cIndex], "minWidth", newWidth);
        } else {
          this.$set(this.columnConfig[cIndex], "width", newWidth);
        }
        this.setColumnSave();
      }
    },
    async setColumnSave(isChange = false) {
      this.loading = true;
      if (!this.setColumnParams.id) {
        const { id } =
          (await systemColumnList(this.setColumnParams)).data || {};
        this.setColumnParams.id = id;
      }
      this.$nextTick(() => {
        this.$refs.myTable?.doLayout(); // 重新计算Table布局，防止fixed导致样式错位
      });
      const nCols = this.columnConfig.filter(
        (e) =>
          !["index", "selection", "expand"].includes(e.type) &&
          !["operation"].includes(e.prop)
      );
      const opt = {
        ...(this.setColumnParams || {}),
        columnFields: nCols.map((ele) => {
          return {
            ...ele,
            showEnable: 1,
          };
        }),
      };
      saveSystemColumn(opt)
        .then((res) => {
          // 防止动态传入的数据列覆盖更新后的列设置
          if (isChange) {
            this.$emit("updateColumnConf", opt.columnFields);
          }
          if (res.data?.id) {
            this.setColumnParams.id = res.data.id;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    disableMixinDragDrop(col) {
      if (
        col.fixed ||
        ["index", "selection", "expand"].includes(col.type) ||
        ["operation"].includes(col.prop)
      ) {
        return "ignore-elements";
      }
      return "";
    },
  },
};
