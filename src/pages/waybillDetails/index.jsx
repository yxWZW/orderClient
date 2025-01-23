import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Button, Cell, Field, Input, Form, Textarea } from "@taroify/core";
import HeaderTitle from "@/components/HeaderTitle";
import { getWaybillDetail } from "@/axios/index";
import { toast, useSyncCallback } from "@/tool/index";

import "./index.less";
fadf
const Index = () => {
  const [waybillId, setWaybillId] = useState("");

  // 获取货单ID
  useEffect(async () => {
    const { router } = getCurrentInstance();
    const id = router.params.id;
    setWaybillId(id);
    getWaybillDetailSync();
  }, []);

  /**
   * 加载货单列表数据
   */
  const getWaybillDetailSync = useSyncCallback(async () => {
    const res = await getWaybillDetail({
      waybillId,
    });
    console.log("wzw--------res", res);

    // if (!res.data.length) setListStatusMap({ hasMore: false });
  });

  return <View>这里是货单详情页面</View>;
};

export default Index;
