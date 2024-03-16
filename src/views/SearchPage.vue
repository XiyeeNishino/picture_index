<template>
  <el-button @click="goToResultPage" type="primary">跳转到结果页面</el-button>
</template>

<script>

export default {
  methods: {
    goToResultPage() {
      this.$router.push('/resultpage');
    }
  }
}
</script>