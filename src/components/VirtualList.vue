<template>
  <div class="viewport" ref="viewport" @scroll="handleScroll">
    <div class="scroll-bar" ref="scrollBar">
      <!-- 可以滚动的容器 -->
    </div>
    <div class="scroll-list" :style="{transform: `translate3d(0, ${offset}px, 0)`}">
      <!-- 可视区的列表 -->
      <div v-for="(item, index) in visibleData" :data-id="index" :key="item.id" ref="item">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 0 // 每一项的高度
    },
    remain: {
      type: Number,
      default: 0 // 可视化区域显示多少个
    },
    items: {
      type: Array,
      default: () => [] // 列表
    },
    variable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      start: 0,
      offset: 0,
      end: this.remain // 默认显示8个
    };
  },
  computed: {
    prevCount() {
      return Math.min(this.start, this.remain);
    },
    nextCount() {
      // 总个数不足就使用剩下的个数
      return Math.min(this.end, this.items.length - this.end);
    },
    visibleData() {
      let start = this.start - this.prevCount;
      let end = this.end + this.nextCount;
      return this.items.slice(start, end);
    }
  },
  updated () {
    // 页面渲染完成之后
    this.$nextTick(() => {
      // 重新计算高度
      let domEl = this.$refs.item
      if (domEl) {
        domEl.forEach((node) => {
          let { height } = node.getBoundingClientRect()
          let id = node.dataset.id - 0;
          let oldHeight = this.positionList[id].height;
          let value = oldHeight - height // 高度是否有变化
          if(value) {
            this.positionList[id].height = height;
            this.positionList[id].bottom = this.positionList[id].bottom - value
            // 后面的位置跟着改变
            for(let i = id + 1; i < this.positionList.length; i++) {
              this.positionList[i].top  = this.positionList[i - 1].bottom;
              this.positionList[i].bottom = this.positionList[i].bottom - value;
            }

          }
          this.$refs.scrollBar.style.height = this.positionList[this.positionList.length - 1].bottom + 'px';
          // 设置滚动条的高度
        })
      }
    })
  },
  mounted() {
    this.$refs.viewport.style.height = this.size * this.remain + "px";
    this.$refs.scrollBar.style.height = this.items.length * this.size + "px";
    // 如果加载完毕缓存每一项的高度
    this.cacheList(); // 先保存一个大概高度，渲染DOM更新真实高度，然后再计算滚动条高度
  },
  methods: {
    cacheList() {
      // 高度，top，bottom
      this.positionList = this.items.map((item, index) => {
        return {
          height: this.size,
          top: index * this.size,
          bottom: (index + 1) * this.size
        };
      });
      // size是预估的高度
      console.log(this.positionList)
    },
    getStartIndex(value) {
      let left = 0;
      let right = this.positionList.length - 1;
      let temp = null;
      while (left <= right) {
        let mid = (left + right) >> 1;
        let middleValue = this.positionList[mid].bottom;
        if (middleValue === value) {
          return mid + 1;
        } else if (value < middleValue) {
          if (temp === null || temp > mid) { // 中间值大于这滚动条的高度，找到一个大概的范围
            temp = mid
          }
          right = mid - 1
        } else if (value > middleValue) {
          left = mid + 1
        } else {
          return -1
        }
      }
      return temp
    },
    handleScroll() {
      let scrollTop = this.$refs.viewport.scrollTop; // 滚动了多少距离
      if (this.variable) {
        // 由于高度无法预订，只能找到近似值进行处理
        this.start = this.getStartIndex(scrollTop)
        this.end = this.start + this.remain;
        let target = this.positionList[this.start - this.prevCount]
        this.offset = target.top ? target.top : 0;
      } else {
        this.start = Math.floor(scrollTop / this.size); // 第几个开始,向下取整，因为还有即使还有一半没显示也要保留
        this.end = this.start + this.remain;
        // 去掉滚动完成的那几个
        this.offset = this.start * this.size - this.size * this.prevCount; // 显示三屏，要减去预留渲染
      }
    }
  }
};
</script>

<style>
.viewport {
  overflow: auto;
  position: relative;
}
.scroll-list {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  transform: translate3d(0, 0, 0);
}
</style>
