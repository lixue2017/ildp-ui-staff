<template>
		<CompanyDimension :paymentReportObj="paymentReportObj" />
</template>

<script>
import { mapActions } from "vuex";
import { postCostReimbursementList, postCostReimbursementExport } from "@/api/settlementManage/paymentReceived.js";
import { searchFormCols, formRules, tableColumns } from "./model";

export default {
	name: "CostReimbursement",
  data() {
    return {
			paymentReportObj: {
				title: "费用报销明细表",
				paymentType: -1,
				tableRequest: postCostReimbursementList,
				exportRequest: postCostReimbursementExport,
				searchFormCols,
				formRules,
				tableColumns
			},
    };
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
  },
	created() {
		this["dictionary/getDictionary"](["billType"]);
	},
	components: {
    CompanyDimension: () => import("../costDetails/components/company.vue"),
  },
};
</script>

<style lang="scss" scoped>

</style>
