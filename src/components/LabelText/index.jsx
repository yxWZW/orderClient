import { View, Text } from "@tarojs/components";

import "./index.less";

const HeaderTitle = ({ label, title, children }) => {
  return (
    <View className="label-text-box">
      <View className="text-left">
        <Text className="label-text">{label}: </Text>
      </View>
      <View className="text-right">
        {title ? <Text className="title-text">{title}</Text> : children}
      </View>
    </View>
  );
};

export default HeaderTitle;
