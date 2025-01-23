export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/login/login",
    "pages/day/index",
    "pages/user/index",
    "pages/createWaybill/index",
    "pages/historyWaybill/index",
    "pages/statusWaybill/index",
    "pages/clientList/index",
    "pages/addClient/index",
    "pages/clientDetails/index",
    "pages/productList/index",
    "pages/waybillDetails/index",
  ],
  tabBar: {
    color: "#000",
    selectedColor: "#56abe4",
    backgroundColor: "#fff",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/day/index",
        text: "日程",
      },
      {
        pagePath: "pages/user/index",
        text: "我的",
      },
    ],
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
});
