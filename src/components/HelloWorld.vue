<!-- src/components/HelloWorld.vue -->
<template>
  <div class="hello-world">
    <h1>{{ msg }}</h1>
    <el-button type="primary" @click="handleClick">Click Me</el-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    handleClick() {
      this.$message({
        message: 'Hello from Element Plus!',
        type: 'success'
      });
    }
  }
}
</script>

<style scoped>
.hello-world {
  text-align: center;
  margin-top: 20px;
}
</style>
