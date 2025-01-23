import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { formatDate } from "@/tool/index";
import TypeTag from "@/components/TypeTag/index";
import "./index.less";

const WaybillCard = ({ waybillInfo }) => {
  const { client_name, status_new, type, user_name, driver_name, create_time, time } = waybillInfo;

  return (
    <View className="card-item-page">
      <View className="card-header">
        <View className="header-left">
          <Text>客户名称：</Text>
          <Text className="title-bold">{client_name}</Text>
        </View>
        <View className="header-right">
          <TypeTag title={status_new} type={status_new} />
          <TypeTag title={type} type={type} />
        </View>
      </View>
      <View className="card-content">
        <Text>业务员：</Text>
        <Text>{user_name}</Text>
        {driver_name ? (
          <>
            <Text>{" | "}</Text>
            <Text>司机：</Text>
            <Text>{driver_name}</Text>
          </>
        ) : null}
      </View>
      <View className="card-footer">
        <View>
          <Text>创建时间：</Text>
          <Text>{formatDate(create_time, "yyyy/MM/dd")}</Text>
        </View>
        <View>
          <Text>送货时间：</Text>
          <Text>{formatDate(time, "yyyy/MM/dd")}</Text>
        </View>
      </View>
    </View>
  );
};

export default WaybillCard;
