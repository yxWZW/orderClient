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
  Timeline,
} from "@taroify/core";
import HeaderTitle from "@/components/HeaderTitle";
import LabelText from "@/components/LabelText";
import PhoneCard from "@/components/PhoneCard";
import TypeTag from "@/components/TypeTag/index";
import { getWaybillDetail } from "@/axios/index";
import { toast, useSyncCallback, formatDate } from "@/tool/index";
import Table, { Columns, LoadStatus, SorterEvent } from 'taro-react-table';

import 'taro-react-table/dist/index.css';
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

  // 修改表格样式
  const [dataSource, setDataSource] = useState([
    {
      name1: '无人之境1',
      name2: '打回原形1',
      name3: '防不胜防1',
      name4: '十面埋伏1',
      name5: 'k歌之王1',
      name6: '岁月如歌1',
    },
    {
      name1: '无人之境2',
      name2: '打回原形2',
      name3: '防不胜防2',
      name4: '十面埋伏2',
      name5: 'k歌之王2',
      name6: '岁月如歌2',
    },
    {
      name1: '无人之境3',
      name2: '打回原形3',
      name3: '防不胜防3',
      name4: '十面埋伏3',
      name5: 'k歌之王3',
      name6: '岁月如歌3',
    },
    {
      name1: '无人之境4',
      name2: '打回原形4',
      name3: '防不胜防4',
      name4: '十面埋伏4',
      name5: 'k歌之王4',
      name6: '岁月如歌4',
    },
    {
      name1: '无人之境5',
      name2: '打回原形5',
      name3: '防不胜防5',
      name4: '十面埋伏5',
      name5: 'k歌之王5',
      name6: '岁月如歌5',
    },
    {
      name1: '无人之境6',
      name2: '打回原形6',
      name3: '防不胜防6',
      name4: '十面埋伏6',
      name5: 'k歌之王6',
      name6: '岁月如歌6',
    },
  ])

  const columns = [
    {
      title: 'Song1',
      dataIndex: 'name1',
      sorter: true,
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Song2',
      width: 100,
      dataIndex: 'name2',
    },
    {
      title: 'Song3',
      dataIndex: 'name3',
    },
    {
      title: 'Song4',
      dataIndex: 'name4',
    },
    {
      title: 'Song5',
      dataIndex: 'name5',
    },
    {
      title: 'Song6',
      dataIndex: 'name6',
    },
  ]

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
            <LabelText label="货单ID" title={waybillInfo?.id} />
          </Flex.Item>
        </Flex>
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
        <Flex>
          <Flex.Item span={24}>
            <LabelText
              label="创建时间"
              title={formatDate(waybillInfo?.create_time, "yyyy/MM/dd")}
            />
          </Flex.Item>
        </Flex>

        <Flex>
          <Flex.Item span={24}>
            <LabelText
              label="修改时间"
              title={formatDate(waybillInfo?.alter_time, "yyyy/MM/dd")}
            />
          </Flex.Item>
        </Flex>
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
        <View className="table-content">
          <Table
            dataSource={dataSource}
            columns={columns}
          />
        </View>
      </View>
      <HeaderTitle title="货单状态" icon="bars" />
      <View className="info-box timeline">
        <Timeline>
          {waybillInfo?.statusInfo.map((i) => {
            return (
              <Timeline.Item>
                <Timeline.Content align="center" className="timeline-time">
                  {formatDate(i?.alter_time, "yyyy/MM/dd hh:mm:ss")}
                </Timeline.Content>
                <Timeline.Separator>
                  <Timeline.Connector />
                  <Timeline.Dot variant="outlined" color="primary" />
                  <Timeline.Connector />
                </Timeline.Separator>
                <Timeline.Content
                  align="center"
                >
                  <View>
                    <View className="timeline-title">
                      <TypeTag title={i?.type} type={i?.type} />
                    </View>
                    {i?.remark ? <View>{i?.remark}</View> : null}
                  </View>
                </Timeline.Content>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </View>
    </View>
  );
};

export default Index;
