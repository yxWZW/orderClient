import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, { useReachBottom, getCurrentInstance } from "@tarojs/taro";
import HeaderTitle from "@/components/HeaderTitle";
import { toLoadProductInfo } from "@/axios/index";
import {
  Button,
  Divider,
  DropdownMenu,
  Search,
  Slider,
  SwipeCell,
  Popup,
} from "@taroify/core";
import { useEventTrigger, useSyncCallback } from "@/tool/index";

import "./index.less";

const Index = () => {
  // 商品信息相关
  const _brand = Taro.getStorageSync('brandInfo');
  const _size = Taro.getStorageSync('sizeInfo');
  const _brand_map = Taro.getStorageSync('brandInfo_map');
  const _size_map = Taro.getStorageSync('sizeInfo_map');


  const [searchValue, setSearchValue] = useState("");
  const [brandValue, setBrandValue] = useState(""); // 品牌
  const [sizeValue, setSizeValue] = useState(""); // 规格
  const [price_head, setPriceHead] = useState(0); // 价格下线
  const [price_foot, setPriceFoot] = useState(0); // 价格上线

  const [list, setList] = useState([]); // 商品列表

  // 数据加载相关
  const [current, setCurrent] = useState(1); // 当前页数
  const [isFinish, setIsFinish] = useState(false); // 是否加载完毕
  const [isLoading, setIsLoading] = useState(false); // 是否加载中
  const [sourceType, setSourceType] = useState(""); // 上一个页面的类型
  const [priceTitle, setPriceTitle] = useState("价格区间");

  const [popupOpen, setPopupOpen] = useState(false); // 是否显示商品编辑

  // 判断是从哪个页面跳转到客户列表的
  useEffect(() => {
    const { router } = getCurrentInstance();
    setSourceType(router.params.type | "");
  }, []);

  // 页面初始加载数据
  useEffect(() => {
    toLoadProductInfoSync();
  }, []);

  // 上拉加载
  useReachBottom(() => {
    if (!isFinish) {
      setCurrent(current + 1);
      toLoadProductInfoSync();
    }
  });

  /**
   * 加载商品列表数据
   */
  const toLoadProductInfoSync = useSyncCallback(async () => {
    setIsLoading(true);
    const res = await toLoadProductInfo({
      current,
      model_num: searchValue,
      brand: brandValue,
      size: sizeValue,
      price_head,
      price_foot,
    });
    setList([...list, ...res.data]);
    if (!res.data.length) setIsFinish(true);
    setIsLoading(false);
  });

  /**
   * 改变筛选条件
   * @param {*} e
   * @param {*} type
   */
  const changeScreen = (e, type) => {
    if (type === "price") {
      if (price_head == 0 && price_head == 0) {
        setPriceTitle("价格区间");
      } else {
        setPriceTitle(`${price_head}~${price_foot}`);
      }
    }
    if (type === "brand") {
      setBrandValue(e);
    }
    if (type === "size") {
      setSizeValue(e);
    }

    setIsFinish(false);
    setCurrent(1);
    setList([]);
    toLoadProductInfoSync();
  };

  /**
   * 改变价格区间标题
   */
  const changePrice = (e) => {
    const [head, foot] = e;
    setPriceHead(head);
    setPriceFoot(foot);
  };

  /**
   * 重置价格区间
   */
  const resetPrice = () => {
    setPriceHead(0);
    setPriceFoot(0);
  };

  /**
   * 点击商品item进行跳转
   */
  const toProductDetails = (info) => {
    if (sourceType) {
      // 选择商品信息，并返回上一页面
      Taro.navigateBack({
        delta: 1,
        success: () => {
          Taro.eventCenter.trigger("create-waybill-page-product-info", info); // 触发事件
        },
      });
    } else {
      // 进入商品详情页面
      // Taro.navigateTo({ url: "/pages/clientDetails/index" });
    }
  };

  /**
   * 编辑商品
   * @param {*} id 商品ID
   */
  const editProduct = (id) => {
    setPopupOpen(true);
  };

  /**
   * 删除商品
   * @param {*} id 商品ID
   */
  const deleteProduct = (id) => {};

  return (
    <View className="product-page">
      <View className="product-header">
        <Search
          value={searchValue}
          placeholder="请输入商品型号"
          action={<View onClick={() => changeScreen()}>搜索</View>}
          onChange={(e) => setSearchValue(e.detail.value)}
        />
        <DropdownMenu>
          <DropdownMenu.Item
            value={brandValue}
            onChange={(e) => changeScreen(e, "brand")}
            options={_brand}
          />
          <DropdownMenu.Item
            value={sizeValue}
            onChange={(e) => changeScreen(e, "size")}
            options={_size}
          />
          <DropdownMenu.Item
            title={priceTitle}
            onClose={() => changeScreen(null, "price")}
          >
            <View className="price-num">
              <Text>{price_head}~</Text>
              <Text>{price_foot}</Text>
            </View>
            <View className="price-box">
              <Slider
                range
                min={0}
                max={200}
                step={10}
                defaultValue={[price_head, price_foot]}
                onChange={(e) => changePrice(e)}
              />
            </View>
            <Button
              className="reset-button"
              shape="round"
              block
              onClick={resetPrice}
            >
              重置
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu>
      </View>
      <View className="list-box">
        {list.map((item) => (
          <SwipeCell className="custom-swipe-cell" key={item.id}>
            <View className="card-item" onClick={() => toProductDetails(item)}>
              <View className="card-header">
                <View>
                  <Text className="header-title">{item.model_num}</Text>
                  <Text className="header-price">
                    {_size_map[item.size]} |{" "}
                  </Text>
                  <Text className="header-price">{item.slice_num}片装</Text>
                </View>
                <Text
                  style={{
                    color: item.repertory_carton_amount < 100 ? "#ff7575" : "#000",
                  }}
                >
                  库存：{item.repertory_carton_amount}
                </Text>
              </View>
              <View className="card-footer">
                <Text>单价：{item.retail_price} | </Text>
                {item.colour_num ? (
                  <Text>色号：{item.colour_num} | </Text>
                ) : null}
                <Text>品牌：{_brand_map[item.brand]}</Text>
              </View>
            </View>
            <SwipeCell.Actions side="right">
              <Button
                variant="contained"
                shape="square"
                color="primary"
                onClick={() => editProduct(item.id)}
              >
                编辑
              </Button>
              <Button
                variant="contained"
                shape="square"
                color="danger"
                onClick={() => deleteProduct(item.id)}
              >
                删除
              </Button>
            </SwipeCell.Actions>
          </SwipeCell>
        ))}
      </View>
      {isFinish ? <Divider>加载完毕</Divider> : null}
      <Popup open={popupOpen} rounded defaultOpen placement="bottom">
        <View className="edit-product-box">
          <HeaderTitle title="编辑商品信息" icon="bars" />
        </View>
      </Popup>
    </View>
  );
};

export default Index;
