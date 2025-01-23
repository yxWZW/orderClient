import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, { usePageScroll } from "@tarojs/taro";
import HeaderTitle from "@/components/HeaderTitle";
import { searchWaybillInfo } from "@/axios/index";
import {
  Cell,
  Search,
  DropdownMenu,
  Calendar,
  Switch,
  PullRefresh,
  List,
  Loading,
} from "@taroify/core";
import { formatDate, useSyncCallback, toast } from "@/tool/index";
import WaybillCard from "@/components/waybillCard/index";
import "./index.less";

// 搜索关键词
const searchKey = [
  { title: "检索客户", value: "clent" },
  { title: "检索司机", value: "driver" },
  { title: "检索业务员", value: "users" },
];

// 1. 下滑加载！！！

const Index = () => {
  const curDate = new Date();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectTime, setSelectTime] = useState();
  const [dateInterval, setDateInterval] = useState("选择日期区间");
  const [timeHead, setTimeHead] = useState(""); // 送货日期期间开始
  const [timeFoot, setTimeFoot] = useState(""); // 送货日期期间结束
  const [keyValue, setKeyValue] = useState("clent"); // 检索属性词
  const [searchValue, setSearchValue] = useState(""); // 检索关键词
  const [isNoPay, setIsNoPay] = useState(false); // 是否只显示赊账货单
  const [current, setCurrent] = useState(1); // 当前页数
  const [loading, setLoading] = useState(false); // 数据加载
  const [refreshing, setRefreshing] = useState(false); // 下拉加载数据

  const [hasMore, setHasMore] = useState(true); // 是否还有更多的数据
  const [reachTop, setReachTop] = useState(true);

  const [list, setList] = useState([]); // 货单列表

  // 页面初始加载数据
  useEffect(() => {
    toLoadWaybillInfoSync();
  }, []);

  usePageScroll(({ scrollTop: aScrollTop }) => {
    setReachTop(aScrollTop === 0);
  });

  /**
   * 加载货单列表数据
   */
  const toLoadWaybillInfoSync = useSyncCallback(async () => {
    setLoading(true);
    const res = await searchWaybillInfo({
      current,
      time_head: timeHead,
      time_foot: timeFoot,
      isNoPay,
      keyValue,
      searchValue,
    });
    setList([...list, ...res.data]);
    if (!res.data.length) setHasMore(false);
    setLoading(false);
    setRefreshing(false);
  });

  /**
   * 格式化时间显示
   */
  const formatRange = (dateRange) => {
    if (dateRange.length) {
      const [start, end] = dateRange;
      return `${formatDate(start, "yyyy/MM/dd")} - ${formatDate(
        end,
        "yyyy/MM/dd"
      )}`;
    }
  };

  /**
   * 下拉加载数据
   */
  const onRefresh = () => {
    setRefreshing(true);
    setCurrent(1);
    setList([]);
    setHasMore(true);
    toLoadWaybillInfoSync();
  };

  /**
   * 上滑加载数据
   */
  const pullupLoad = () => {
    setCurrent(current + 1);
    toLoadWaybillInfoSync();
  };

  /**
   * 根据日期区间检索
   * @param {*} newValue
   */
  const timeWaybillList = (newValue) => {
    setTimeHead(newValue[0].getTime()); // 当天的零点开始算
    setTimeFoot(newValue[1].getTime() + 24 * 60 * 60 * 1000 - 1000); // 明天的零点减一秒
    setDateInterval(formatRange(newValue));
    setCurrent(1);
    setList([]);
    setCalendarOpen(false);
    toLoadWaybillInfoSync();
  };

  /**
   * 根据赊账状态检索
   */
  const isNoPayWaybillList = (e) => {
    setIsNoPay(e);
    setCurrent(1);
    setList([]);
    toLoadWaybillInfoSync();
  };

  /**
   * 根据关键词检索
   */
  const searchWaybill = async (e) => {
    console.log("wzw-----------------------------keyValue", keyValue);
    console.log("wzw-----------------------------searchValue", searchValue);
    if (!searchValue) {
      await toast("请输入检索关键词", "fail", 2000);
      return;
    }

    setCurrent(1);
    setList([]);
    toLoadWaybillInfoSync();
  };

  return (
    <View className="history-waybill-page">
      <View className="product-header">
        <View className="search-box">
          <DropdownMenu>
            <DropdownMenu.Item
              value={keyValue}
              onChange={(e) => setKeyValue(e)}
              options={searchKey}
            />
          </DropdownMenu>
          <Search
            value={searchValue}
            placeholder="请输入检索关键词"
            action={<View onClick={searchWaybill}>搜索</View>}
            onChange={(e) => setSearchValue(e.detail.value)}
          />
        </View>
        <Cell
          title="选择送货日期区间"
          isLink
          children={dateInterval}
          onClick={() => setCalendarOpen(true)}
        />
        <Cell
          align="center"
          title="只显示赊账货单"
          rightIcon={
            <Switch
              size="24"
              checked={isNoPay}
              onChange={(e) => isNoPayWaybillList(e)}
            />
          }
        />
      </View>
      <Calendar
        min={new Date(2024, 10, 1)}
        max={new Date(curDate.getTime() - 24 * 60 * 60 * 1000)}
        type="range"
        value={selectTime}
        onChange={setSelectTime}
        poppable
        showPopup={calendarOpen}
        onClose={setCalendarOpen}
        onConfirm={timeWaybillList}
      />

      <View className="list-box">
        <PullRefresh
          loading={refreshing}
          reachTop={reachTop}
          onRefresh={onRefresh}
        >
          <List loading={loading} hasMore={hasMore} onLoad={pullupLoad}>
            {list.map((item) => (
              <View className="waybill-item">
                <WaybillCard waybillInfo={item} />
              </View>
            ))}
            <List.Placeholder>
              {loading && <Loading>加载中...</Loading>}
              {!hasMore && "没有更多了"}
            </List.Placeholder>
          </List>
        </PullRefresh>
      </View>
    </View>
  );
};

export default Index;
