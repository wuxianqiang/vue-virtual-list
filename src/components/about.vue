<template>
  <div class="wrapper">
    <ul>
      <li v-for="(item, index) in 50" :key="index">
        0{{item}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
  .wrapper {
    /* height: 200px;
    overflow: auto; */
  }
</style>
