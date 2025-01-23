import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Button, Cell, Field, Input, Form, Textarea } from "@taroify/core";
import HeaderTitle from "@/components/HeaderTitle";
import { addClientInfo } from "@/axios/index";
import { toast } from "@/tool/index";

import "./index.less";

const Index = () => {
  // 提交客户信息
  const onSubmit = async (event) => {
    const { name, telephone, address, remark } = event.detail.value;

    const res = await addClientInfo({ name, telephone, address, remark });
    await toast(res.mess, "success", 2000);

    Taro.navigateBack({
      delta: 1,
      success: () => {
        Taro.eventCenter.trigger("refresh-client-list-page"); // 触发事件
      },
    });
  };

  return (
    <View className="add-client-page">
      <HeaderTitle title="填写客户信息" icon="bars" />
      <Form onSubmit={onSubmit}>
        <Cell.Group inset>
          <Field
            label="姓名"
            name="name"
            required
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="请输入姓名" color="danger" />
          </Field>
          <Field
            label="电话"
            name="telephone"
            required
            rules={[{ required: true, message: "请输入电话" }]}
          >
            <Input placeholder="请输入电话" color="danger" />
          </Field>
          <Field
            align="start"
            label="地址"
            name="address"
            required
            rules={[{ required: true, message: "请输入地址" }]}
          >
            <Textarea
              style={{ height: "48px" }}
              limit={50}
              placeholder="请输入地址"
            />
          </Field>
          <Field align="start" label="备注" name="remark">
            <Textarea
              style={{ height: "48px" }}
              limit={100}
              placeholder="请输入备注"
            />
          </Field>
        </Cell.Group>
        <View className="button-box">
          <Button shape="round" block color="primary" formType="submit">
            保存
          </Button>
          <Button shape="round" block formType="reset">
            重置
          </Button>
        </View>
      </Form>
    </View>
  );
};

export default Index;
