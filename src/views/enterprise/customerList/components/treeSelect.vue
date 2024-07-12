<template>
  <!-- 目前只用于企业管理-员工列表中的新增与修改中的所属部门 -->
  <div class="treeSelect">
    <el-select
      class="select"
      multiple
      v-model="formModel.businessOwnership"
      :placeholder="config.placeholder"
      @remove-tag="removeSelect"
    >
      <el-option
        hidden
        v-for="item in deptLists"
        :key="item.deptId"
        :value="item.deptId"
        :label="item.deptName"
      ></el-option>
      <el-input
        v-model="treeSearch"
        placeholder="请输入部门名称"
        style="margin: 10px 0px; padding: 0px 10px"
      ></el-input>
      <!-- 如果需要多选，check-strictly="false" -->
      <el-tree
        ref="tree"
        :data="deptTreeList"
        show-checkbox
        node-key="deptId"
        :check-strictly="true"
        :filter-node-method="filterNode"
        :props="defaultProps"
        @check="getTreeSelect"
      >
      </el-tree>
    </el-select>
  </div>
</template>


<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    formModel: {
      type: Object,
      required: true,
    },
  },
  // name: "treeSelect",
  data() {
    return {
      deptLists: [], //options选项
      deptTreeList: [], //树形图展示的部门节点
      filterText: [], //用户最终选择的数据结果
      treeSearch: "", //树形图搜索字段
      hiddenOptions: {
        //隐藏的OPTIONS
        value: "",
        label: "",
      },
      defaultProps: {
        //树形展示结构
        children: "children",
        label: "deptName",
      },
    };
  },
  watch: {
    treeSearch: {
      deep: true,
      handler: function (newVal, oldVal) {
        //监听输入搜索字段触发filterNode()
        this.$refs.tree.filter(newVal);
      },
    },
  },
  computed: {},
  created() {},
  mounted() {
    const { httpRequest } = this.config;
    httpRequest().then((response) => {
      this.deptLists = response.data;
      this.deptTreeList = this.handleTree(response.data, "deptId");
      this.$refs.tree.setCheckedKeys(this.formModel.businessOwnership);
    });
  },
  methods: {
    filterNode(value, data) {
      //树形图根据搜索字段过滤数据
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    // getTreeSelect(row, rows) {
    //树形图多选
    //   //树形图勾选数据
    //   let arr = [];
    //   rows.checkedNodes.map((e) => {
    //     arr.push(e.deptId);
    //   });
    //   this.formModel.businessOwnership = arr;
    // },
    getTreeSelect(row, rows) {
      //树形图单选
      this.formModel.businessOwnership = [row.deptId];
      this.$refs.tree.setCheckedKeys(this.formModel.businessOwnership);
    },
    removeSelect(row) {
      //手动取消勾选时触发
      //如果取消勾选的是父节点，与之相关的所有子节点一同取消勾选，
      //如果取消勾选的是子节点，需要将父节点的勾选状态修改为非全选
      const removeRow = this.deptLists.find((e) => e.deptId === row);
      const parentIds = removeRow.ancestors
        .split(",")
        .filter((e, index) => index > 0);
      const sonsIds = [];
      this.deptLists.filter((e) => {
        if (e.ancestors.includes(removeRow.deptId)) {
          sonsIds.push(e.deptId);
        }
      });
      const removeLists = parentIds.concat(sonsIds); //合并父节点与子节点，目前的数据结构合并后数值不会重复
      this.formModel.businessOwnership =
        this.formModel.businessOwnership.filter(
          (e) => !removeLists.some((item) => item == e && e != removeRow)
        );
      this.$refs.tree.setCheckedKeys(this.formModel.businessOwnership);
    },
  },
};
</script>

  <style rel="stylesheet/scss" lang="scss" scoped>
.treeSelect {
  .select {
    width: 100%;
  }
}
</style>
