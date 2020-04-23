<template>
  <div>
    <!-- 搜索框 -->
    <div class="search">
        <span class="icon-search"></span>
        <input placeholder="搜索你想听的节目">
    </div>
    <!-- 轮播图 -->
    <div class="swiper-container">
      <swiper class="swiper" autoplay="true" circular="true"
        interval="3000" easing-function="easeOutCubic"
        bindchange="swiperChange">
        <!-- 轮播图图片 -->
        <swiper-item class="swiperItem" v-for="(v,i) in imgList" :key="i">
          <!-- 加上widthFix可以使图片自适应 -->
          <img :src="v">
        </swiper-item>
      </swiper>
      <!-- 为了和喜马拉雅一致，自己需定制轮播图dots -->
      <div class="dots">
        <block v-for="(v,i) in imgList" :key="i">
          <div class="dotsItem" :class="i == swiperCurrent ? ' dotActive' : ''"></div>
        </block>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      imgList: [
        '../../assets/images/index/ad1.jpg',
        '../../assets/images/index/ad2.jpg',
        '../../assets/images/index/ad3.jpg',
        '../../assets/images/index/ad4.jpg',
        '../../assets/images/index/ad5.jpg',
        '../../assets/images/index/ad6.jpg',
        '../../assets/images/index/ad7.jpg'
      ],
      swiperCurrent: 0
    }
  },
  components: {
  },
  created () {

  },
  computed: {
  },
  mounted () {
  },
  onShow () {
  },
  onLoad () {
  },
  onHide () {
  },
  onUnload () {
  },
  methods: {
    // 轮播图改变事件
    swiperChange (e) {
      this.setData({
        swiperCurrent: e.detail.current
      })
    }
  }
}
</script>
<style lang="scss">
  page {
    // background-color: #0f0;
    height: 100%;
  }
  /* 搜索框 */
  .search{
    width: 90%;
    display: flex;
    align-items: center;
    margin: 20rpx auto 30rpx;
    background-color: rgb(240, 240, 240);
    padding: 10rpx 20rpx;
    border-radius: 15rpx;
  }
  .search-left{
    // flex: 4;
    background-color: rgb(240, 240, 240);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10rpx 20rpx;
    border-radius: 15rpx;
  }

  .search input{
    width: 90%;
    height: 100%;
    font-size: 29rpx;
    margin-left: 20rpx;
  }
  // 轮播图
  .swiper-container{
    width: 90%;
    height: 280rpx;
    margin: 0rpx auto;
    position: relative;
    border-radius: 15rpx;
    overflow: hidden;
  }
  .swiper{
    width: 100%;
    height: 100%;
    border-radius: 15rpx;
  }
  .swiperItem{
    width: 100%;
    height: 100%;
    border-radius: 15rpx;
  }
  .swiperItem>img{
    width: 100%;
    height: 100%;
    border-radius: 15rpx;
  }
  .dots{
    width: auto;
    height: 10rpx;
    position: absolute;
    bottom: 20rpx;
    border-radius: 50rpx;
    left: 240rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3rpx 10rpx;
  }
  .dotsItem{
    width: 8rpx;
    height: 8rpx;
    margin: 0rpx 8rpx;
    border-radius: 50%;
    background-color: #cdcdcd;
    transition: all .3s;
  }
  .dotActive{
    width: 10rpx;
    height: 10rpx;
    background-color: #fff;
  }
</style>
