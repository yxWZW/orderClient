import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, { useReachBottom, getCurrentInstance } from "@tarojs/taro";
import HeaderTitle from "@/components/HeaderTitle";
import { toLoadClientInfo } from "@/axios/index";
import { Button, Cell, Field, Input, Form, Divider } from "@taroify/core";
import { useEventTrigger } from "@/tool/index";
import { Phone, Chat } from "@taroify/icons";

import "./index.less";

const Index = () => {
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [current, setCurrent] = useState(1); // 当前页数
  const [isFinish, setIsFinish] = useState(false); // 是否加载完毕
  const [list, setList] = useState([]); // 客户列表

  const [isLoading, setIsLoading] = useState(false); // 是否加载中
  const [sourceType, setSourceType] = useState(""); // 上一个页面的类型

  const changeName = (val) => setName(val.detail.value);
  const changeTelephone = (val) => setTelephone(val.detail.value);
  const changeAddress = (val) => setAddress(val.detail.value);

  // 判断是从哪个页面跳转到客户列表的
  useEffect(() => {
    const { router } = getCurrentInstance();
    setSourceType(router.params.type | "");
  }, []);

  // 监听客户新增页面
  useEventTrigger("refresh-client-list-page", () => {
    resetConditions();
    toLoadClientInfoSync(list, 1);
  });

  // 页面初始加载数据
  useEffect(() => {
    toLoadClientInfoSync(list, 1);
  }, []);

  // 上拉加载
  useReachBottom(() => {
    if (!isFinish) {
      setCurrent(current + 1);
      toLoadClientInfoSync(list, current + 1);
    }
  });

  /**
   * 加载客户列表数据
   */
  const toLoadClientInfoSync = async (map, currentNum) => {
    setIsLoading(true);
    const res = await toLoadClientInfo({
      current: currentNum,
      name,
      telephone,
      address,
    });
    setList([...map, ...res.data]);
    if (!res.data.length) setIsFinish(true);
    setIsLoading(false);
  };

  /**
   * 重置查询条件
   */
  const resetConditions = () => {
    setName("");
    setTelephone("");
    setAddress("");
  };

  /**
   * 查询客户信息
   */
  const searchSync = () => {
    setIsFinish(false);
    setCurrent(1);
    toLoadClientInfoSync([], 1);
  };

  /**
   * 回到顶部
   */
  const toTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  };

  /**
   * 跳转新增客户页面
   */
  const toAddClient = () => {
    Taro.navigateTo({ url: "/pages/addClient/index" });
  };

  /**
   * 点击客户item进行跳转
   */
  const toClientDetails = (info) => {
    if (sourceType) {
      // 选择客户信息，并返回上一页面
      Taro.navigateBack({
        delta: 1,
        success: () => {
          Taro.eventCenter.trigger("create-waybill-page-client-info", info); // 触发事件
        },
      });
    } else {
      // 进入客户详情页面
      Taro.navigateTo({ url: "/pages/clientDetails/index" });
    }
  };

  /**
   * 拨打客户电话，发送短信
   */
  const phoneClient = (e, phoneNumber, isPhone) => {
    e.stopPropagation();
    isPhone
      ? Taro.makePhoneCall({ phoneNumber })
      : Taro.sendSms({ phoneNumber });
  };

  return (
    <View className="client-page">
      <HeaderTitle title="筛选条件" icon="search" />
      <Form onSubmit={searchSync} onReset={resetConditions}>
        <Cell.Group inset>
          <Field name="name">
            <Input
              value={name}
              placeholder="请输入姓名"
              onChange={changeName}
            />
          </Field>
          <Field name="telephone">
            <Input
              value={telephone}
              placeholder="请输入电话"
              onChange={changeTelephone}
            />
          </Field>
          <Field name="address">
            <Input
              value={address}
              placeholder="请输入地址"
              onChange={changeAddress}
            />
          </Field>
        </Cell.Group>
        <View className="button-box">
          <Button shape="round" block formType="reset">
            重置
          </Button>
          <Button
            loading={isLoading}
            className="search-btn"
            shape="round"
            block
            color="primary"
            formType="submit"
          >
            查询
          </Button>
        </View>
      </Form>
      <HeaderTitle title="信息列表" icon="bars" />
      <View className="list-box">
        {list.map((item) => (
          <View
            className="card-item"
            key={item.id}
            onClick={() => toClientDetails(item)}
          >
            <View className="card-header">
              <Text>{item.name}</Text>
              <Text>{item.telephone}</Text>
            </View>
            <View className="card-footer">
              <Text>{item.address}</Text>
              <View>
                <Chat
                  style={{ color: "#00b26a" }}
                  size="30"
                  onClick={(e) => phoneClient(e, item.telephone, false)}
                />
                <Phone
                  style={{ color: "#1989fa", marginLeft: "20px" }}
                  size="30"
                  onClick={(e) => phoneClient(e, item.telephone, true)}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
      {isFinish ? <Divider>加载完毕</Divider> : null}

      <View className="suspension go-top-box" onClick={toTop}>
        回到顶部
      </View>
      <View className="suspension add-client-box" onClick={toAddClient}>
        添加客户
      </View>
    </View>
  );
};

export default Index;
