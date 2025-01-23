import $axios from "./api.js";

// 登录
export const login = (data) => {
  return $axios({
    url: "/user/login",
    method: "post",
    data,
  });
};

// 获取tag配置信息
export const getTagInfo = (data) => {
  return $axios({
    url: "/user/get/tag",
    method: "post",
    data,
  });
};

// 添加客户信息
export const addClientInfo = (data) => {
  return $axios({
    url: "/client/add",
    method: "post",
    data,
  });
};

// 分页查询客户信息
export const toLoadClientInfo = (data) => {
  return $axios({
    url: "/client/find",
    method: "post",
    data,
  });
};

// 分页查询商品信息
export const toLoadProductInfo = (data) => {
  return $axios({
    url: "/product/find",
    method: "post",
    data,
  });
};

// 获取商品品牌信息
export const getBrandInfo = (data) => {
  return $axios({
    url: "/product/get/brand",
    method: "post",
    data,
  });
};

// 获取商品规格信息
export const getSizeInfo = (data) => {
  return $axios({
    url: "/product/get/size",
    method: "post",
    data,
  });
};

// 分页查询货单信息
export const toLoadWaybillInfo = (data) => {
  return $axios({
    url: "/waybill/find",
    method: "post",
    data,
  });
};

// 分页查询货单信息
export const searchWaybillInfo = (data) => {
  return $axios({
    url: "/waybill/search",
    method: "post",
    data,
  });
};

// 新增货单信息
export const addWaybillInfo = (data) => {
  return $axios({
    url: "/waybill/add",
    method: "post",
    data,
  });
};

// 货单详情信息
export const getWaybillDetail = (data) => {
  return $axios({
    url: "/waybill/detail",
    method: "post",
    data,
  });
};
