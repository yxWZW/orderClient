import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import HeaderTitle from "@/components/HeaderTitle";
import Taro from "@tarojs/taro";
import { Icon } from "@taroify/icons";
import { Grid, Divider } from "@taroify/core";
import "./index.less";

// 主要功能列表
const list = {
  创建货单: "/pages/createWaybill/index",
  历史货单: "/pages/historyWaybill/index",
  运费结算: "/pages/createWaybill/index",
  客户列表: "/pages/clientList/index",
  司机信息: "/pages/createWaybill/index",
  商品信息: "/pages/productList/index",
};

const Index = () => {
  useEffect(() => {
    // 检测用户是否登录
    if (!Taro.getStorageSync("token"))
      Taro.redirectTo({ url: "/pages/login/login" });
  }, []);

  // 跳转对应功能页面
  const toIconPage = (item) => {
    if (item._relatedInfo.anchorRelatedText) {
      const url = list[item._relatedInfo.anchorRelatedText];
      Taro.navigateTo({ url: url });
    }
  };

  return (
    <View className="index-page">
      <HeaderTitle title="主要功能" icon="bars" />
      <Grid columns={3} onClick={toIconPage}>
        <Grid.Item
          icon={<Icon name="records" size="40" color="#a1ccf8" />}
          text="创建货单"
        />
        <Grid.Item
          icon={<Icon name="description" size="40" color="#a1ccf8" />}
          text="历史货单"
        />
        <Grid.Item
          icon={<Icon name="cash-back-record" size="40" color="#ffbc75" />}
          text="运费结算"
        />
      </Grid>

      <Divider />
      <HeaderTitle title="常用功能" icon="bars" />
      <Grid columns={3} onClick={toIconPage}>
        <Grid.Item
          icon={<Icon name="friends" size="40" color="#00b26a" />}
          text="客户列表"
        />
        <Grid.Item
          icon={<Icon name="logistics" size="40" color="#ffbc75" />}
          text="司机信息"
        />
        <Grid.Item
          icon={<Icon name="send-gift" size="40" color="#a3b9f6" />}
          text="商品信息"
        />
      </Grid>
    </View>
  );
};

export default Index;
