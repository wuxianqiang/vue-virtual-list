<template>
  <div class="hello">
    <virtual-list
      :size="40"
      :remain="8"
      :variable="true"
      :items="items">
      <template slot-scope="{item}">
        <div class="item">
          {{item.value}}
        </div>
      </template>
    </virtual-list>
  </div>
</template>

<script>
import VirtualList from './VirtualList'
let items = []
for (let i = 0; i < 1000; i++) {
  items.push({id: i, value: i})
}
export default {
  name: "HelloWorld",
  components: {
    VirtualList
  },
  props: {
    msg: String
  },
  data() {
    return {
      currentTab: 'About',
      items: items
    };
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
* {
  margin: 0;
  padding: 0;
}
.item {
  padding: 20px 0;
  box-sizing: border-box;
  border: 1px solid red;
}
</style>
