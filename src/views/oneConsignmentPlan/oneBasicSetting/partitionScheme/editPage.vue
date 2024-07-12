<template>
	<div>
		<EditDetailView ref="editRef" :pageViewType="'edit'" />
	</div>
</template>

<script>
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
	name: "EditPartitionScheme",
	mixins: [mixinEditCache],
	data() {
		return {
			isMixinCreatedMounted: 'mounted',
		}
	},
	methods: {
		mixinInitData() {
			setTimeout(() => {
				this.$refs.editRef?.getDetailInfo();
			}, 20)
		},
	},
	components: {
		EditDetailView: () => import("./components/detailView"),
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>