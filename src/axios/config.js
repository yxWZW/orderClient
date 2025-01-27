/*
 * @Author: jiruili 2813507978@qq.com
 * @Date: 2025-01-23 21:17:59
 * @LastEditors: jiruili 2813507978@qq.com
 * @LastEditTime: 2025-01-25 22:06:09
 * @FilePath: \orderClient\src\axios\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  // 上线地址
  // socketUrl: 'http://47.115.220.120:3030', // socket路径
  // baseUrl: 'http://47.115.220.120:3000',   // 服务器路径

  // 测试地址
  // socketUrl: "http://192.168.31.8:3030", // socket路径
  baseUrl: "http://192.168.31.27:3000", // 服务器路径

  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: {},
  timeout: 10000,
  withCredentials: true,
  responseType: "json",
};
