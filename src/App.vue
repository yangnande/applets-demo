<script>
export default {
  created () {
  },
  pageObj: {},
  methods: {
  },
  onLaunch () {
  },
  onShow () {
  },
  globalData: {
  },
  data: {
    flag: false// 关闭请求
  }
}
</script>

<style>
/**app.wxss**/
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/*灰色*/
.backg1 {
  background-color: #f6f6f6;
}
/*白色*/
.backg2 {
  background-color: #ffffff;
}
/*上边框*/
.bor-top {
  border-top: 1rpx solid #e9e9e9;
}
/*下边框*/
.bor-bot {
  border-bottom: 1rpx solid #e9e9e9;
}
/*深灰色*/
.color1 {
  color: #333333;
}
/*灰色*/
.color2 {
  color: #999999;
}
/*中灰色*/
.color4{
  color:#666666;
}
/*桃红色*/
.color3 {
  color: #e40077;
}
/**/
.color5{
  color:#00a4ff;
}
/***超出一行用...省略***/
.ellipsis1 {
  overflow: hidden!important;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
/***超出俩行用...省略***/
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
/*flex布局*/
.flex-parent {
  display: flex;
}
.flex-child {
  flex: 1;
}

.show {
  display: block;
}
.hidden {
  display: none;
}
/*清除浮动*/
.clearfix:before,
.clearfix:after {
  content: '';
  display: table;
}
.clearfix:after {
  clear: both;
}
/*改变盒子属性*/
.changeboth{
  box-sizing: border-box;
}
/* flex布局下不缩小自身
*/
.flex-shrink{
  flex-shrink: 0;
}
/* flex交叉轴居中对齐 */
.flex-align{
  align-items: center;
}
/* 主轴的俩端对其 */
.flex-between{
  justify-content: space-between;
}
/* 主轴的居中对齐 */
.flex-justify{
  justify-content: center;
}
/* 元素盒子类型改变时，采用透明度隐藏 */
.opacityShow{
  opacity: 1;
}
.opacityHidden{
  opacity: 0;
}

/*弹出框插件样式*/
.load-plug .loading{
  border: 2PX solid #00a4ff;
  border-right: 2PX solid #e9e9e9;
  border-bottom: 2PX solid #e9e9e9;
  height: 16PX;
  width: 16PX;
  margin: auto;
  border-radius: 50%;
  -webkit-animation: loading .6s infinite linear;
  animation: loading .6s infinite linear;
  z-index: 9999;
}
@-webkit-keyframes loading {
  from {
      -webkit-transform: rotate(0deg);
  }
  to {
      -webkit-transform: rotate(360deg);
  }
}

@keyframes loading {
  from {
      transform: rotate(0deg);
  }
  to {
      transform: rotate(360deg);
  }
}
.load-plug{
position: fixed;
z-index: 99;
top: 0;bottom: 0;
width: 100%;
height: 100%;
font-size: 16PX;
color: #333333;
background-color: rgba(225, 225, 225, .3);
}

.load-plug .o-lay{
vertical-align:middle;
  display:table-cell;
}
.load-plug .o-wrap{
width: 100%;
height: 100%;
display:table;
  text-align: center;
}
.load-plug .load-img{
width: 1.5em;
position: relative;
top: -2.5em;
}
@media screen and (min-width: 414PX) {
 .dialog-plug .d-con{max-width: 340PX !important;}
 #confirmPlug #inform{width: 340PX !important;}
}
</style>
