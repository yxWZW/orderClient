import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";

const TypeTag = ({ title, type }) => {
  const tagInfo = Taro.getStorageSync("tagInfo", tagInfo);

  return (
    <View className={`tag-box ${tagInfo[type]?.type}`}>
      <Text>{tagInfo[title]?.title}</Text>
    </View>
  );
};

export default TypeTag;
