<template>
  <div class="home">
    <van-nav-bar>
      <template #left>
        <div class="home-nav">
          <div class="t1">{{ goodText }}</div>
          <div class="t2">{{ userInfo.nickName }}</div>
        </div>
      </template>
      <template #right>
        <div class="home-search">
          <van-search :placeholder="placeholder" @focus="searchFocus" />
        </div>
      </template>
    </van-nav-bar>

    <div class="home-content">
      <!-- 轮播图 -->
      <div class="banner-box">
        <van-swipe @change="changeCurrentIndex" :autoplay="5000" loop>
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <img
              class="auto-img"
              :src="item.bannerImg"
              alt=""
              @click="goDetail(item.pid)"
            />
          </van-swipe-item>
          <template #indicator>
            <div class="index-box">
              <div
                :class="{ active: index == currentIndex }"
                v-for="(item, index) in bannerData"
                :key="index"
              ></div>
            </div>
          </template>
        </van-swipe>
      </div>

      <!-- 商品 -->
      <div class="product-box">
        <div>
          <div class="clearfix pro-title-box">
            <span class="pro-title">热卖推荐</span>
          </div>
          <div class="products clearfix">
            <div
              class="pro-item fl"
              v-for="(item, index) in hotProduct"
              :key="index"
              @click="goDetail(item.pid)"
            >
              <div class="img-box">
                <img class="auto-img" :src="item.smallImg" />
                <!-- hot标签 -->
                <div class="hot">hot</div>
              </div>
              <div class="pro-info">
                <div class="pro-name one-text">{{ item.name }}</div>
                <div class="pro-enname one-text">{{ item.enname }}</div>
                <div class="pro-price">￥{{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
export default {
  name: "Home",
  data() {
    return {
      placeholder: '',
      //当前轮播图片索引
      currentIndex: 0,

      //轮播数据
      bannerData: [],

      //热卖商品数据
      hotProduct: [],

      //用户信息
      userInfo: {},
    };
  },

  created() {
    //获取轮播图数据
    this.getBannerData();

    //获取热卖推荐商品
    this.getHotProduct();

    //查询用户信息
    this.getUserInfo();
  },

  computed: {
    goodText() {
      // 获取当前时间
      let timeNow = new Date();
      // 获取当前小时
      let hours = timeNow.getHours();
      // 设置默认文字
      let text = ``;
      // 判断当前时间段
      if (hours >= 0 && hours <= 10) {
        text = `早上好❤`;
        this.placeholder = "新的一天,喝点啥？"
      } else if (hours > 10 && hours <= 14) {
        text = `中午好❤`;
        this.placeholder = "笑一笑,完美的中午又开始了!"
      } else if (hours > 14 && hours <= 18) {
        text = `下午好❤`;
        this.placeholder= "笑一笑,完美的下午又开始了!"
      } else if (hours > 18 && hours <= 24) {
        text = `晚上好❤`;
        this.placeholder ="忙碌了一整天,进来看看呗！"
      }
      // 返回当前时间段对应的状态
      return text;
    },
  },

  methods: {
    //修改轮播图片索引
    changeCurrentIndex(index) {
      this.currentIndex = index;
    },

    //获取轮播图数据
    getBannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 先判断当前是否有存储数据,有效时间大于当前时间就直接从本地获取数据,不做网络请求。
      const bannerFromLocal = window.localStorage.getItem("banner_data");
      if (bannerFromLocal && JSON.parse(bannerFromLocal).expire > Date.now()) {
        this.$toast.clear();
        this.bannerData = JSON.parse(bannerFromLocal).data;
        return;
      }

      //发起轮播请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/banner",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 300) {
            this.bannerData = result.data.result;

            // 本地存储,实现数据持久化
            window.localStorage.setItem(
              "banner_data",
              JSON.stringify({
                data: result.data.result,
                // 有效时间
                expire: Date.now() + 1 * 60 * 60 * 1000,
              })
            );
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //获取热卖推荐商品
    getHotProduct() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      const hotProductFromLocal = window.localStorage.getItem("hot_product");
      if (
        hotProductFromLocal &&
        JSON.parse(hotProductFromLocal).expire > Date.now()
      ) {
        this.$toast.clear();
        this.hotProduct = JSON.parse(hotProductFromLocal).data;
        return;
      } else {
        this.axios({
          //请求类型
          method: "GET",
          //请求路径
          url: "/typeProducts",

          //GET请求参数, object
          params: {
            appkey: this.appkey,
            key: "isHot",
            value: 1,
          },
        })
          .then((result) => {
            this.$toast.clear();

            if (result.data.code == 500) {
              this.hotProduct = result.data.result;
              window.localStorage.setItem(
                "hot_product",
                JSON.stringify({
                  data: result.data.result,
                  expire: Date.now() + 2 * 60 * 60 * 1000,
                })
              );
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },

    //查看商品详情页面
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    //获取用户信息(早上好xxx)
    getUserInfo() {
      let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //搜索栏获取焦点
    searchFocus() {
      this.$router.push({ name: "Search" });
    },
  },
};
</script>
