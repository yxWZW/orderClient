import { View, Text } from "@tarojs/components";
import { Icon } from "@taroify/icons";

import './index.less';

const HeaderTitle = ({ children, title, icon }) => {
  return (
    <View className="title-box">
      <View className="title-left">
        <Icon name={icon} size='24' color='#4695FE'/>
        <Text className="title-text">{title}</Text>
      </View>
      <View className="title-right">
        {children}
      </View>
    </View>
  )
}

export default HeaderTitle;
