import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Button, Cell, Field, Input, Form, Textarea } from "@taroify/core";
import HeaderTitle from "@/components/HeaderTitle";
import { addClientInfo } from "@/axios/index";
import { toast } from "@/tool/index";

import "./index.less";

const Index = () => {
  return (
    <View>这里是客户详情页面</View>
  )
};

export default Index;
