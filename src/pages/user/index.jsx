import { View } from "@tarojs/components";
import { AtAvatar, AtIcon } from "taro-ui";
import { Grid, Divider } from "@taroify/core";
import Taro from "@tarojs/taro";
import { Icon } from "@taroify/icons";
import { useState } from "react";
import "./index.less";

const status = {
  '待派送': 'driver_off',
  '待送达': 'on_deliver',
  '待结算': 'pay_off',
}

const Index = () => {
  const name = Taro.getStorageSync("userName");
  const id = Taro.getStorageSync("userId");

  // 复制用户ID
  const copyText = () => Taro.setClipboardData({ data: id });

  // 显示拟态框
  const handleConfirm = () => {
    Taro.showModal({
      content: "是否退出登录",
      success: (res) => {
        if (res.confirm) pushOut();
      },
    });
  };

  // 用户推出登录
  const pushOut = () => {
    Taro.clearStorage({
      fail: () => {
        Taro.showToast({
          title: "退出失败",
          duration: 3000,
          icon: "error",
        });
      },
      success: () => {
        Taro.redirectTo({ url: "/pages/login/login" });
      },
    });
  };

  // 跳转对应功能页面
  const toIconPage = (item) => {
    const text = item._relatedInfo.anchorRelatedText;
    if (text) {
      if(text == '已完成') {
        Taro.navigateTo({ url: '/pages/historyWaybill/index' });
        return;
      }
      Taro.navigateTo({ url: `/pages/statusWaybill/index?status=${status[text]}` });
    }
  };

  return (
    <View className="user-page">
      <View className="header-box">
        <View className="head-img">
          <AtAvatar
            size="large"
            circle
            image="https://img.tukuppt.com/png_preview/00/05/28/TGbGRvIZAj.jpg!/fw/780"
          />
        </View>
        <View className="user-info">
          <View className="at-article__h1">{name}</View>
          <View className="at-article__info" onClick={copyText}>
            {id}
            <AtIcon value="bookmark" size="18" color="#d6d6d6" />
          </View>
        </View>
      </View>

      <View className="content-box">
        <View className="tool-box">
          <Grid columns={4} onClick={toIconPage}>
            <Grid.Item
              icon={<Icon name="failure" size="40" color="#a1ccf8" />}
              text="待派送"
            />
            <Grid.Item
              icon={<Icon name="logistics" size="40" color="#a1ccf8" />}
              text="待送达"
            />
            <Grid.Item
              icon={<Icon name="after-sale" size="40" color="#ffbc75" />}
              text="待结算"
            />
            <Grid.Item
              icon={<Icon name="passed" size="40" color="#ffbc75" />}
              text="已完成"
            />
          </Grid>
        </View>
        <View className="list-box"></View>
      </View>

      <View className="push-out-box" onClick={handleConfirm}>
        <AtIcon value="close-circle" size="30" color="#F00" />
      </View>
    </View>
  );
};

export default Index;
