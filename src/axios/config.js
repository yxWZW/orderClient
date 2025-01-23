export default {
  // 上线地址
  // socketUrl: 'http://47.115.220.120:3030', // socket路径
  // baseUrl: 'http://47.115.220.120:3000',   // 服务器路径

  // 测试地址
  // socketUrl: "http://192.168.31.8:3030", // socket路径
  baseUrl: "http://192.168.31.186:3000", // 服务器路径

  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: {},
  timeout: 10000,
  withCredentials: true,
  responseType: "json",
};
