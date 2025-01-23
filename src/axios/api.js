import { TaroAdapter } from "axios-taro-adapter";
import config from "./config.js";
import Taro from "@tarojs/taro";
import { toast } from "@/tool/index";
import axios from "axios";

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      adapter: TaroAdapter,
      headers: {},
    });

    // 请求拦截
    instance.interceptors.request.use(
      (conf) => {
        // 带上 token 给后端
        // conf.headers['Authorization'] = `${Taro.getStorageSync('token') || ''}`;
        conf.data['userId'] = `${Taro.getStorageSync('userId') || ''}`;
        return conf;
      },
      (error) => {
        console.log(error);
      }
    );

    // 响应拦截
    instance.interceptors.response.use(
      (response) => {
        let data = response.data;
        if (data.code !== 200) {
          // 业务逻辑错误
          if (data.mess) toast(data.mess, "fail");
          return Promise.reject(data);
        }
        return data;
      },
      (err) => {
        // 后端服务器错误
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.mess = "请求错误";
              break;
            case 401:
              err.mess = "账号已过期,请重新登录";
              toast(err.mess, "fail", 1000);
              Taro.redirectTo({ url: "/pages/login/login" });
              break;
            case 404:
              err.mess = "请求地址错误";
              break;
            default:
          }
        }
        return Promise.reject(err);
      }
    );

    // 发生请求
    instance(options)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
