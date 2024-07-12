<template>
  <InvoicingDetails ref="invoicingRef" pageType='invoicing' />
</template>

<script>
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";

export default {
	name: "Invoicing",
	mixins: [mixinEditCache],
	data() {
		return {
			isMixinCreatedMounted: 'mounted'
		}
	},
	methods: {
		mixinInitData() {
			setTimeout(() => {
				// 保存子组件加载完成
				this.$refs.invoicingRef?._getInvoiceDetails();
			})
		}
	},
  components: {
    InvoicingDetails: () => import("./components/invoicingDetails")
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>