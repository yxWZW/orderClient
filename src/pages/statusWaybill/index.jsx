import { View, Text } from "@tarojs/components";
import { useEffect, useState, useRef } from "react";
import Taro, { usePageScroll, getCurrentInstance } from "@tarojs/taro";
import WaybillCard from "@/components/waybillCard/index";
import { PullRefresh, List, Loading } from "@taroify/core";
import { Arrow, Icon } from "@taroify/icons";
import { useSyncCallback, formatDate } from "@/tool/index";
import { toast, formatDecimal } from "@/tool/index";
import { addWaybillInfo, toLoadWaybillInfo } from "@/axios/index";
import "./index.less";

const tabsMap = [
  {
    name: "待派送",
    sign: "driver_off",
  },
  {
    name: "待送达",
    sign: "on_deliver",
  },
  {
    name: "待结算",
    sign: "pay_off",
  },
];

const listStatusMap = {
  driver_off: {
    list: [],
    current: 1,
    hasMore: true,
  },
  on_deliver: {
    list: [],
    current: 1,
    hasMore: true,
  },
  pay_off: {
    list: [],
    current: 1,
    hasMore: true,
  },
};

const Index = () => {
  const [tabValue, setTabValue] = useState("driver_off");
  const [loading, setLoading] = useState(false); // 数据加载
  const [refreshing, setRefreshing] = useState(false); // 下拉加载数据
  const [listStatus, setListStatus] = useState(listStatusMap);

  const [reachTop, setReachTop] = useState(true);

  // 根据外部点击切换货单状态
  useEffect(() => {
    const { router } = getCurrentInstance();
    setTabValue(router.params.status);
  }, []);

  useEffect(() => {
    if (
      listStatus[tabValue].list.length === 0 &&
      listStatus[tabValue].hasMore
    ) {
      toLoadWaybillInfoSync();
    }
  }, [tabValue]);

  usePageScroll(({ scrollTop: aScrollTop }) => {
    setReachTop(aScrollTop === 0);
  });

  /**
   * 加载货单列表数据
   */
  const toLoadWaybillInfoSync = useSyncCallback(async () => {
    setLoading(true);
    const res = await toLoadWaybillInfo({
      current: listStatus[tabValue].current,
      status_new: tabValue,
    });
    setListStatusMap({ list: [...listStatus[tabValue].list, ...res.data] });
    if (!res.data.length) setListStatusMap({ hasMore: false });
    setLoading(false);
    setRefreshing(false);
  });

  /**
   * 修改 listStatus 对象中的属性
   * @param {*} obj 属性名与属性值对象
   */
  const setListStatusMap = (obj) => {
    const tabItem = listStatus[tabValue];
    setListStatus({
      ...listStatus,
      [tabValue]: {
        ...tabItem,
        ...obj,
      },
    });
  };

  /**
   * 更改货单状态
   */
  const setTabStatus = (value) => {
    setTabValue(value);
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  };

  /**
   * 下拉加载数据
   */
  const onRefresh = () => {
    setRefreshing(true);
    setListStatusMap({ list: [], current: 1, hasMore: true });
    toLoadWaybillInfoSync();
  };

  /**
   * 上滑加载数据
   */
  const pullupLoad = () => {
    const current = listStatus[tabValue].current;
    setListStatusMap({ current: current + 1 });
    toLoadWaybillInfoSync();
  };

  /**
   * 跳转货单详情
   * @param {*} id 货单ID
   */
  const toWaybillDetails = (id) => {
    Taro.navigateTo({ url: `/pages/waybillDetails/index?id=${id}` });
  };

  return (
    <View className="waybill-status-page">
      <View className="tabs-box">
        {tabsMap.map((i) => (
          <View className="tabs-item" onClick={() => setTabStatus(i.sign)}>
            <Text className={i.sign === tabValue ? "currenr-text" : ""}>
              {i.name}
            </Text>
            {i.sign === tabValue ? <View className="tabs-sign" /> : null}
          </View>
        ))}
      </View>
      <View className="list-box">
        <PullRefresh
          loading={refreshing}
          reachTop={reachTop}
          onRefresh={onRefresh}
        >
          <List
            loading={loading}
            hasMore={listStatus[tabValue].hasMore}
            onLoad={pullupLoad}
          >
            {listStatus[tabValue].list.map((item) => (
              <View
                className="waybill-item"
                onClick={() => toWaybillDetails(item.id)}
              >
                <WaybillCard waybillInfo={item} />
              </View>
            ))}
            <List.Placeholder>
              {loading && <Loading>加载中...</Loading>}
              {!listStatus[tabValue].hasMore && "没有更多了"}
            </List.Placeholder>
          </List>
        </PullRefresh>
      </View>
    </View>
  );
};

export default Index;
