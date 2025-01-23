import { View } from "@tarojs/components";
import { Button, Cell, Field, Input, Form } from "@taroify/core";
import Taro from "@tarojs/taro";
import { login } from "@/axios/index";
import { toast } from "@/tool/index";
import "./login.less";

const Index = () => {

  // 登录
  const onSubmit = async (event) => {
    const { username, password } = event.detail.value;
    // 发送请求登录
    const res = await login({ username, password });
    await toast(res.mess, "success", 2000);
    Taro.setStorageSync("token", res.data.token);
    Taro.setStorageSync("userId", res.data.id);
    Taro.setStorageSync("userName", res.data.name);
    Taro.switchTab({ url: "/pages/index/index" });
  };

  return (
    <View className="form-page">
      <View className="form-box">
        <Form onSubmit={onSubmit}>
          <Cell.Group inset>
            <Field
              label="用户名"
              name="username"
              required
              rules={[{ required: true, message: "请填写用户名" }]}
            >
              <Input placeholder="用户名" color="danger" />
            </Field>
            <Field
              label="密码"
              name="password"
              required
              rules={[{ required: true, message: "请填写密码" }]}
            >
              <Input password placeholder="密码" />
            </Field>
          </Cell.Group>
          <View className="button-box">
            <Button shape="round" block color="primary" formType="submit">登录</Button>
            <Button shape="round" block formType="reset">重置</Button>
          </View>
        </Form>
      </View>
    </View>
  );
};

export default Index;
