<template>
  <agingAnalysisTable :cusIde="3" />
</template>
<script>
export default {
  name: "ServiceProviderAging",
  components: {
    agingAnalysisTable: () => import("./index"),
  },
};
</script>
