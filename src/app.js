import { View } from "@tarojs/components";
import { AtMessage } from "taro-ui";
import { Component } from "react";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/index.scss"; // 引入组件样式
import { getBrandInfo, getSizeInfo, getTagInfo } from "@/axios/index";
import { setListToObj } from "@/tool/index";
import "./app.less";

class App extends Component {
  async componentDidMount() {
    if (!Taro.getStorageSync("tagInfo")) {
      const res = await getTagInfo({});
      const tagInfo = {};
      res.data.map(i => {
        tagInfo[i.id] = {
          title: i.name,
          type: i.color,
          remark: i.remark,
        }
      });
      Taro.setStorageSync("tagInfo", tagInfo);
    }

    if (!Taro.getStorageSync("brandInfo")) {
      const res = await getBrandInfo({});
      const brandInfo = res.data.map(i => {
        return {
          title: i.name,
          value: i.id,
        };
      });
      brandInfo.unshift({ title: "请选择品牌", value: '' });
      Taro.setStorageSync("brandInfo", brandInfo);
      Taro.setStorageSync("brandInfo_map", setListToObj(brandInfo));
    }

    if (!Taro.getStorageSync("sizeInfo")) {
      const res = await getSizeInfo({});
      const sizeInfo = res.data.map(i => {
        return {
          title: i.name,
          value: i.id,
        };
      });
      sizeInfo.unshift({ title: "请选择规格", value: '' });
      Taro.setStorageSync("sizeInfo", sizeInfo);
      Taro.setStorageSync("sizeInfo_map", setListToObj(sizeInfo));
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      <View>
        <AtMessage />
        {this.props.children}
      </View>
    );
  }
}

export default App;
