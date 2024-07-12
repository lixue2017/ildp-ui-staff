<template>
  <agingAnalysisTable :cusIde="2" />
</template>
<script>
export default {
  name: "CustomAging",
  components: {
    agingAnalysisTable: () => import("./index"),
  },
};
</script>
