<template>
  <div class="app-container">
    <ComDetailTop
      title="航线组信息"
      :formModel="formModel"
      :orderIdList="orderIdList"
      @handleClick="handleTopClick"
    />
    <ComForm
      class="airline-from"
      :formConfig="formConfig"
      ref="myForm"
      v-if="Object.keys(dictionary.dicsData).length"
    >
      <template v-slot:isPublic="slotProps">
        <span class="">
          <i
            :class="[slotProps.formModel.isPublic && 'el-icon-circle-check']"
          ></i>
          {{ slotProps.formModel.isPublic ? "是" : "否" }}
        </span>
      </template>
      <template v-slot:airlineType="slotProps">
        <span class="">
          {{ slotProps.dicsList.nameCn }}
        </span>
      </template>
    </ComForm>
  </div>
</template>

<script>
import { config } from "./model";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  computed: {},
  data() {
    return {
      formModel: {
        createBy: "Kylian",
        createTime: "2022/10/21 10:00",
      },
      orderIdList: [],
      formConfig: {
        formModel: {
          code: "YB",
          nameCn: "航线名称(CN)",
          nameEn: "航线名称(EN)",
          isPublic: 1,
          airlineType: 0,
          remark: "",
        },
        labelWidth: "115px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.formLists,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("consigneeTypeEn");
    if (localStorage.getItem("airlineGroupIdList"))
      this.orderIdList = JSON.parse(localStorage.getItem("airlineGroupIdList"));
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDetails(id) {
      if (id) {
        const newUrl = this.$route.path + `?id=${id}`;
        window.history.replaceState("", "", newUrl);
        console.log(id);
      } else {
        this.reBack();
      }
    },
    reBack() {
      this.$router.push("/marketManage/marketBData/airlineGroupInfo");
    },
    handleTopClick({ type, id }) {
      if (type === "back") {
        this.reBack();
        return;
      }
      if (type === "pre" || type === "next") {
        this.$route.query.id = id;
        this.getDetails(id);
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.airline-from {
  padding: 10px 50px;
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
