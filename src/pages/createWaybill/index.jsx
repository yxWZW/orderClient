import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import HeaderTitle from "@/components/HeaderTitle";
import {
  Button,
  Cell,
  Field,
  Input,
  Form,
  Divider,
  Textarea,
  Empty,
  SwipeCell,
  Stepper,
  Popup,
  Dialog,
  Switch,
  Calendar,
} from "@taroify/core";
import { Arrow, Icon } from "@taroify/icons";
import { useEventTrigger, formatDate } from "@/tool/index";
import { toast, formatDecimal } from "@/tool/index";
import { addWaybillInfo } from "@/axios/index";

import "./index.less";

// 默认当前编辑商品信息
const curProInfo = {
  model_num: "",
  unit_price: 0,
  carton_amount: 1,
  slice_amount: 0,
  stepper_carton_max: 1,
  stepper_slice_max: 0,
  remark: "",
};

const Index = () => {
  // 客户
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [clientRemark, setClientRemark] = useState("");
  const [clientDisabled, setClientDisabled] = useState(false); // 是否禁用客户input

  // 货单
  const [startTime, setStartTime] = useState(); // 送货时间
  const [openCalendar, setOpenCalendar] = useState(false); // 是否显示日历
  const [waybillRemark, setWaybillRemark] = useState(""); // 货单备注

  // 订单
  const [orderList, setOrderList] = useState([]);
  const [integer, setInteger] = useState("0"); // 总价实数部分
  const [farPart, setFarPart] = useState("00"); // 总价小数部分
  const [popupOpen, setPopupOpen] = useState(false); // 是否显示订单编辑弹出层
  const [curProduct, setCurProduct] = useState(curProInfo); // 当前编辑商品信息
  const [curIndex, setCurIndex] = useState(0); // 当前编辑商品信息索引
  const [total, setTotal] = useState(0); // 价格合计
  const [earnestMoney, setEarnestMoney] = useState(0.0); // 定金
  const [isEamoney, setIsEamoney] = useState(false); // 是否显示定金选项

  const changeName = (val) => setName(val.detail.value);
  const changeTelephone = (val) => setTelephone(val.detail.value);
  const changeAddress = (val) => setAddress(val.detail.value);
  const changeClientRemark = (val) => setClientRemark(val.detail.value);
  const changeWaybillRemark = (val) => setWaybillRemark(val.detail.value);

  /***************************客户******************************* */
  /**
   * 监听客户列表页面
   */
  useEventTrigger("create-waybill-page-client-info", (res) => {
    const { id, name, telephone, address, remark } = res;
    setClientId(id);
    setName(name);
    setTelephone(telephone);
    setAddress(address);
    setClientRemark(remark);
    setClientDisabled(true);
  });

  /**
   * 重置客户信息
   */
  const resetClientInfo = () => {
    setClientId("");
    setName("");
    setTelephone("");
    setAddress("");
    setClientRemark("");
    setClientDisabled(false);
  };

  /**
   * 去客户/商品列表页面
   */
  const toList = (e) => Taro.navigateTo({ url: `/pages/${e}/index?type=1` });
  /***************************客户******************************* */

  /***************************订单******************************* */
  /**
   * 监听订单列表，并计算合计
   */
  useEffect(() => {
    let _total = 0;
    orderList.forEach((i) => {
      _total +=
        i.carton_amount * i.slice_num * i.unit_price +
        i.slice_amount * i.unit_price;
    });

    setTotal(formatDecimal(_total.toString()));
    if (Number(earnestMoney)) {
      _total = _total - earnestMoney;
    }

    const [integer, farPart] = (Math.round(_total * 100) / 100)
      .toString()
      .split(".");

    setInteger(integer ? integer : "0");
    setFarPart(farPart ? farPart : "00");

    // 判断订单列表是否为空，为空及时进行 定金状态清零
  }, [orderList, earnestMoney]);

  /**
   * 监听商品列表页面
   */
  useEventTrigger("create-waybill-page-product-info", (res) => {
    const { id, retail_price, model_num, repertory_carton_amount, slice_num, remark } =
      res;
    const obj = {
      product_id: id, // 商品ID
      model_num, // 型号
      unit_price: retail_price, // 单价
      carton_amount: 1, // 箱数
      slice_amount: 0, // 片数
      stepper_carton_max: repertory_carton_amount,
      stepper_slice_max: slice_num,
      slice_num,
      remark,
    };
    setOrderList((prevState) => [...prevState, obj]);
  });

  /**
   * 修改订单数据
   * @param {*} e 新数据
   * @param {*} index 订单索引
   * @param {*} type 数据Key
   */
  const setOrderInfo = (type, value) => {
    setCurProduct({ ...curProduct, [type]: value });
  };

  /**
   * 编辑订单
   * @param {*} index 订单索引
   */
  const editOrder = (index) => {
    setPopupOpen(true);
    setCurIndex(index);
    setCurProduct({ ...orderList[index] });
  };

  /**
   * 删除订单
   * @param {*} index 订单索引
   */
  const deleteOrder = (index) => {
    setOrderList(orderList.filter((_, key) => key != index));
  };

  /**
   * 订单编辑保存
   */
  const popupSave = () => {
    if (!curProduct.unit_price) {
      toast("订单单价不能为空", "fail", 2000);
      return;
    }

    setOrderList(
      orderList.map((item, key) => (key == curIndex ? { ...curProduct } : item))
    );
    popupCancel();
  };

  /**
   * 订单编辑退出
   */
  const popupCancel = () => {
    setPopupOpen(false);
    setCurProduct(curProInfo);
  };

  /***************************订单******************************* */

  /***************************货单******************************* */
  /**
   * 提交货单
   */
  const openSubmitDialog = () => {
    if (!startTime) {
      Dialog.alert("送货时间不能为空！");
      return;
    }
    if (!name) {
      Dialog.alert("客户姓名不能为空！");
      return;
    }
    if (!telephone) {
      Dialog.alert("客户电话不能为空！");
      return;
    }
    if (!address) {
      Dialog.alert("地址不能为空！");
      return;
    }
    if (orderList.length == 0) {
      Dialog.alert("订单信息不能为空，请选择商品");
      return;
    }

    Dialog.confirm({
      message: "确认要提交货单吗？",
      async onConfirm() {
        // 客户信息
        const clientInfo = {
          clientId,
          name,
          telephone,
          address,
          clientRemark,
        };
        // 新增货单
        const res = await addWaybillInfo({
          clientInfo,
          startTime: startTime.getTime(),
          orderList,
          waybillRemark,
          total,
          earnestMoney,
        });
        await toast(res.mess, "success", 2000);
      },
    });
  };

  /***************************货单******************************* */

  /***************************定金******************************* */
  /**
   * 判断订单信息来决定是否收取定金
   */
  const setIsEamoneyInfo = (e) => {
    if (e && orderList.length == 0) {
      Dialog.alert("订单信息不能为空，请选择商品");
      return;
    }
    if (!e) {
      Dialog.confirm({
        message: "确认不收取定金吗？",
        onConfirm() {
          setIsEamoney(false);
          setEarnestMoney(0.0);
        },
      });
      return;
    }
    setIsEamoney(e);
  };

  /**
   * 判断定金金额大小
   */
  const setEarnestMoneyInfo = (e) => {
    const val = e.detail.value;
    if (Number(val) > Number(total)) {
      Dialog.alert("定金不可大于货单总价！");
      return;
    }
  };

  /**
   * 校验金额
   */
  const handleBlurEarnestMoney = (e) => {
    const val = e.detail.value;
    if (Number(val) > Number(total)) return;
    setEarnestMoney(formatDecimal(val));
  };

  /***************************定金******************************* */

  return (
    <View className="waybill-page">
      {/* 送货时间 */}
      <HeaderTitle title="送货时间" icon="bars">
        <View
          onClick={() => setOpenCalendar(true)}
          style={{ color: "#828283" }}
        >
          {startTime ? (
            <Text>{formatDate(startTime, "yyyy/MM/dd")}</Text>
          ) : (
            <Text>点击选择时间 </Text>
          )}
          <Arrow />
        </View>
      </HeaderTitle>
      {/* 客户信息 */}
      <HeaderTitle title="客户信息" icon="bars">
        <View onClick={() => toList("clientList")}>
          <Text style={{ color: "#828283" }}>从列表中选择 </Text>
          <Icon name="arrow" color="#828283" />
        </View>
      </HeaderTitle>
      <Form onReset={resetClientInfo} className="client-info-form">
        <Cell.Group inset>
          <Field
            label="客户姓名"
            name="name"
            required
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input
              value={name}
              onChange={changeName}
              placeholder="用户名"
              readonly={clientDisabled}
            />
          </Field>
          <Field
            label="客户电话"
            name="telephone"
            required
            rules={[{ required: true, message: "请输入电话" }]}
          >
            <Input
              value={telephone}
              onChange={changeTelephone}
              placeholder="请输入电话"
              readonly={clientDisabled}
            />
          </Field>
          <Field
            align="start"
            label="地址"
            name="address"
            required
            rules={[{ required: true, message: "请输入地址" }]}
          >
            <Textarea
              value={address}
              onChange={changeAddress}
              style={{ height: "48px" }}
              limit={50}
              placeholder="请输入地址"
              readonly={clientDisabled}
            />
          </Field>
          <Field align="start" label="备注" name="clientRemark">
            <Textarea
              value={clientRemark}
              onChange={changeClientRemark}
              style={{ height: "48px" }}
              limit={100}
              placeholder="请输入备注"
              readonly={clientDisabled}
            />
          </Field>
        </Cell.Group>
        {clientDisabled ? (
          <View className="button-box">
            <Button shape="round" block formType="reset">
              重置
            </Button>
          </View>
        ) : null}
      </Form>

      {/* 订单信息 */}
      <HeaderTitle title="订单信息" icon="bars">
        <View onClick={() => toList("productList")}>
          <Text style={{ color: "#828283" }}>从列表中选择 </Text>
          <Arrow color="#828283" />
        </View>
      </HeaderTitle>
      {!orderList.length ? (
        <View className="empty-box">
          <Empty>
            <Empty.Image />
            <Empty.Description>当前无订单</Empty.Description>
          </Empty>
        </View>
      ) : (
        <View className="order-list-box">
          {orderList.map((item, index) => (
            <SwipeCell className="custom-swipe-cell" key={index}>
              <View className="custom-card">
                <View className="card-header">
                  <View>
                    <Text className="header-title">{item.model_num}</Text>
                    <Text className="header-price">{item.slice_num}片装</Text>
                  </View>
                  <Text
                    style={{
                      color: item.stepper_carton_max < 100 ? "#ff7575" : "#000",
                    }}
                  >
                    库存：{item.stepper_carton_max}
                  </Text>
                </View>
                <View className="card-content">
                  <Text>
                    单价：
                    <Text className="card-info-weight">
                      {item.unit_price}
                    </Text>{" "}
                    |{" "}
                  </Text>
                  <Text>
                    箱数：
                    <Text className="card-info-weight">
                      {item.carton_amount}
                    </Text>{" "}
                    |{" "}
                  </Text>
                  <Text>
                    片数：
                    <Text className="card-info-weight">
                      {item.slice_amount}
                    </Text>
                  </Text>
                </View>
                {item.remark ? (
                  <View className="card-footer">
                    <Text>备注：</Text>
                    <Text className="remark-text">{item.remark}</Text>
                  </View>
                ) : null}
              </View>
              <SwipeCell.Actions side="right">
                <Button
                  variant="contained"
                  shape="square"
                  color="primary"
                  onClick={() => editOrder(index)}
                >
                  编辑
                </Button>
                <Button
                  variant="contained"
                  shape="square"
                  color="danger"
                  onClick={() => deleteOrder(index)}
                >
                  删除
                </Button>
              </SwipeCell.Actions>
            </SwipeCell>
          ))}
        </View>
      )}

      {/* 定金信息 */}
      <HeaderTitle title="定金信息" icon="bars">
        <View className="eamoney-box">
          <Text className="eamoney-text">是否收取定金</Text>
          <Switch size="18" checked={isEamoney} onChange={setIsEamoneyInfo} />
        </View>
      </HeaderTitle>
      {isEamoney ? (
        <Cell.Group inset>
          <Field
            label="定金数额"
            name="earnestMoney"
            required
            rules={[{ required: true, message: "请输入定金数额" }]}
          >
            <Input
              type="digit"
              value={earnestMoney}
              onChange={setEarnestMoneyInfo}
              onBlur={handleBlurEarnestMoney}
              placeholder="定金数额"
            />
          </Field>
        </Cell.Group>
      ) : null}

      {/* 货单备注 */}
      <HeaderTitle title="货单备注" icon="bars" />
      <Cell.Group inset>
        <Field align="start" label="备注" name="waybillRemark">
          <Textarea
            value={waybillRemark}
            onChange={changeWaybillRemark}
            style={{ height: "48px" }}
            limit={100}
            placeholder="请输入备注"
          />
        </Field>
      </Cell.Group>

      {/* 底部价格显示 */}
      <View className="footer-box">
        <View>
          <Text>合计：</Text>
          <Text className="total-num-1">{integer}</Text>
          <Text className="total-num-2">.{farPart}</Text>
        </View>
        {Number(earnestMoney) ? (
          <>
            <Text> = </Text>
            <Text> {total} </Text>
            <Text> - </Text>
            <Text> {earnestMoney} </Text>
          </>
        ) : null}
        <View>
          <Button
            variant="contained"
            shape="round"
            color="danger"
            onClick={openSubmitDialog}
          >
            提交货单
          </Button>
        </View>
      </View>

      {/* 商品信息编辑 */}
      <Popup
        className="edit-order-box"
        rounded
        open={popupOpen}
        defaultOpen
        placement="bottom"
      >
        <HeaderTitle title="编辑订单信息" icon="bars" />
        <View className="order-content">
          <View>
            <Text className="product-name">商品型号：</Text>
            <Text className="product-modelnum">{curProduct.model_num}</Text>
          </View>
          <Field
            label="单价："
            name="unit_price"
            required
            rules={[{ required: true, message: "请输入单价" }]}
          >
            <Input
              type="digit"
              value={curProduct.unit_price}
              onChange={(val) => setOrderInfo("unit_price", val.detail.value)}
              onBlur={(e) =>
                setOrderInfo("unit_price", formatDecimal(e.detail.value))
              }
              placeholder="请输入单价"
            />
          </Field>
          <View>
            <Text className="product-name">箱数：</Text>
            <Stepper
              min={1}
              max={curProduct.stepper_carton_max}
              value={curProduct.carton_amount}
              onChange={(e) => setOrderInfo("carton_amount", e)}
            />
          </View>
          <View style={{ marginTop: "20px" }}>
            <Text className="product-name">片数：</Text>
            <Stepper
              min={0}
              max={curProduct.stepper_slice_max}
              value={curProduct.slice_amount}
              onChange={(e) => setOrderInfo("slice_amount", e)}
            />
          </View>
          <Field align="start" label="备注" name="remark">
            <Textarea
              value={curProduct.remark}
              onChange={(val) => setOrderInfo("remark", val.detail.value)}
              style={{ height: "48px" }}
              limit={100}
              placeholder="请输入备注"
            />
          </Field>
        </View>

        <View className="button-box">
          <Button shape="round" block onClick={popupCancel}>
            取消
          </Button>
          <Button
            className="save-btn"
            shape="round"
            block
            color="primary"
            onClick={popupSave}
          >
            保存
          </Button>
        </View>
      </Popup>

      {/* 日历选择 */}
      <Calendar
        type="single"
        value={startTime}
        poppable
        showPopup={openCalendar}
        onClose={setOpenCalendar}
        onChange={setStartTime}
        onConfirm={(newValue) => {
          setOpenCalendar(false);
          setStartTime(newValue);
        }}
      />
    </View>
  );
};

export default Index;
