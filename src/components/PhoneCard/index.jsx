import { View, Text } from "@tarojs/components";
import { Phone, Chat } from "@taroify/icons";
import Taro from "@tarojs/taro";

const HeaderTitle = ({ telephone }) => {
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
    <View className="label-text-box">
      <Chat
        style={{ color: "#00b26a" }}
        size="30"
        onClick={(e) => phoneClient(e, telephone, false)}
      />
      <Phone
        style={{ color: "#1989fa", marginLeft: "20px" }}
        size="30"
        onClick={(e) => phoneClient(e, telephone, true)}
      />
    </View>
  );
};

export default HeaderTitle;
