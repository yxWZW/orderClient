import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import {
  Button,
  Cell,
  Field,
  Input,
  Form,
  Textarea,
  Flex,
} from "@taroify/core";
import HeaderTitle from "@/components/HeaderTitle";
import LabelText from "@/components/LabelText";
import PhoneCard from "@/components/PhoneCard";
import TypeTag from "@/components/TypeTag/index";
import { getWaybillDetail } from "@/axios/index";
import { toast, useSyncCallback, formatDate } from "@/tool/index";

import "./index.less";

const Index = () => {
  const [waybillId, setWaybillId] = useState("");
  const [waybillInfo, setWaybillInfo] = useState(null);

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
    if (!res.data) return;
    setWaybillInfo(res.data);
  });

  return (
    <View className="waybill-detail-page">
      <HeaderTitle title="客户信息" icon="bars">
        <PhoneCard telephone={waybillInfo?.clientInfo.telephone} />
      </HeaderTitle>
      <View className="info-box">
        <Flex>
          <Flex.Item span={10}>
            <LabelText label="客户名称" title={waybillInfo?.clientInfo.name} />
          </Flex.Item>
          <Flex.Item span={14}>
            <LabelText
              label="联系电话"
              title={waybillInfo?.clientInfo.telephone}
            />
          </Flex.Item>
        </Flex>
        <Flex>
          <Flex.Item span={24}>
            <LabelText
              label="送货地址"
              title={waybillInfo?.clientInfo.address}
            />
          </Flex.Item>
        </Flex>
        {waybillInfo?.clientInfo.remark ? (
          <Flex>
            <Flex.Item span={24}>
              <LabelText
                label="客户备注"
                title={waybillInfo?.clientInfo.remark}
              />
            </Flex.Item>
          </Flex>
        ) : null}
      </View>
      <HeaderTitle title="货单信息" icon="bars" />
      <View className="info-box">
        <Flex>
          <Flex.Item span={24}>
            <LabelText
              label="送货时间"
              title={formatDate(waybillInfo?.time, "yyyy/MM/dd")}
            />
          </Flex.Item>
        </Flex>
        <Flex>
          <Flex.Item span={10}>
            <LabelText label="货单类型" title={null}>
              <TypeTag title={waybillInfo?.type} type={waybillInfo?.type} />
            </LabelText>
          </Flex.Item>
          <Flex.Item span={18}>
            <LabelText label="货单状态" title={null}>
              <TypeTag
                title={waybillInfo?.status_new}
                type={waybillInfo?.status_new}
              />
            </LabelText>
          </Flex.Item>
        </Flex>
        {waybillInfo?.remark ? (
          <Flex>
            <Flex.Item span={24}>
              <LabelText label="货单备注" title={waybillInfo?.remark} />
            </Flex.Item>
          </Flex>
        ) : null}
      </View>
      <HeaderTitle title="订单信息" icon="bars" />
      <View className="info-box">
        <Flex>
          <Flex.Item span={12}>
            <LabelText label="订单总价" title={waybillInfo?.total_price} />
          </Flex.Item>
          {waybillInfo?.earnest_money ? (
            <Flex.Item span={12}>
              <LabelText label="定金" title={waybillInfo?.earnest_money} />
            </Flex.Item>
          ) : null}
        </Flex>
        <Flex>
          <Flex.Item span={24}>
            <LabelText
              label="待付金额"
              title={waybillInfo?.total_price - waybillInfo?.earnest_money}
            />
          </Flex.Item>
        </Flex>
      </View>
    </View>
  );
};

export default Index;
