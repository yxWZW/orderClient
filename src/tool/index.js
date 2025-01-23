import { Toast } from "@taroify/core";
import Taro from "@tarojs/taro";
import { useEffect, useState, useCallback } from "react";

/**
 * 异步封装轻提示
 * @param {*} message 提示文本
 * @param {*} type 状态 loading success fail html
 * @param {*} time 滞留时间
 * @returns
 */
export const toast = (message, type, time) => {
  return new Promise((resolve) => {
    Toast.open({
      message,
      type,
      duration: time,
      backdrop: true,
    });
    setTimeout(() => resolve(), time);
  });
};

/**
 * 事件的传递
 * @param eventName 事件名称
 * @param onEvnetChange 事件回调
 */
export const useEventTrigger = (eventName, onEvnetChange) => {
  useEffect(() => {
    function bindChange(data) {
      if (!!onEvnetChange) {
        onEvnetChange(data);
      }
    }

    Taro.eventCenter.on(eventName, bindChange.bind(this));
    return () => {
      Taro.eventCenter.off(eventName, bindChange.bind(this));
    };
  }, []);
};

/*
 * @lastTime: 2021-03-05 15:29:11
 * @Description: 同步hooks
 */

export const useSyncCallback = (callback) => {
  const [proxyState, setProxyState] = useState({ current: false });

  const Func = useCallback(() => {
    setProxyState({ current: true });
  }, [proxyState]);

  useEffect(() => {
    if (proxyState.current === true) setProxyState({ current: false });
  }, [proxyState]);

  useEffect(() => {
    proxyState.current && callback();
  });

  return Func;
};

/**
 * 将数组转化为对象
 * @param {*} list 目标数组
 */
export const setListToObj = (list) => {
  let obj = {};
  list.forEach((i) => {
    obj = { ...obj, [i.value]: i.title };
  });
  return obj;
};

/**
 * 时间格式化
 */
const padLeftZero = (str) => {
  return ("00" + str).substr(str.length);
};
export const formatDate = (time, fmt) => {
  let date = time;
  if (!(time instanceof Date && !isNaN(time))) {
    date = new Date(Number(time));
  }

  // 1、获取年份
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  // 2、获取天数
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }

  return fmt;
};

/**
 * 格式化金额数字
 */
export const formatDecimal = (input) => {
  // 判断输入值中是否包含小数点
  if (input.includes(".")) {
    // 去除数字前面的0
    const trimmedInput = input.replace(/^0+/, "");

    // 补齐小数点前面漏加的0
    const parts = trimmedInput.split(".");
    if (parts[0] === "") {
      parts[0] = "0";
    }

    // 补齐小数点后不足两位的0
    if (parts.length === 1) {
      return "0." + parts[0].padStart(2, "0");
    } else {
      return parts[0] + "." + parts[1].padEnd(2, "0");
    }
  } else {
    return input;
  }
};
