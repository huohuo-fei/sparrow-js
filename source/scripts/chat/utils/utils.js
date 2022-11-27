define(function (require, exports, module) {
  // 根据传来的class  滚动到底部
  const getScrollBottom = function (className) {
    const scrollDom = document.querySelector(className);
    scrollDom.scrollTop = scrollDom.scrollHeight;
  };

  // 当前发送消息的时间
  function currentSendTime() {
    return dayjs().format("HH:mm");
  }

  // 历史记录的时间格式
  function historyMsgTime(temp) {
    const currentTemp = +new Date();
    // 显示的时间格式:
    // 如果是当前的历史记录  15:02
    // 如果是昨天的历史记录  昨天 15:02
    // 早于昨天的历史        22/11/20 15:02

    const currentY = dayjs(currentTemp).format("YYYY");
    const currentM = dayjs(currentTemp).format("MM");
    const currentD = dayjs(currentTemp).format("DD");
    const currentDayTemp = dayjs(
      currentY + "-" + currentM + "-" + currentD
    ).valueOf();
    // 今天过了的时间
    const duringTime = currentTemp - currentDayTemp;
    // 一天的毫秒数
    const oneDayTime = 86400000;
    if (currentTemp - temp < duringTime) {
      // 今天的信息
      return dayjs(temp).format("HH:mm");
    }
    if (currentTemp - temp < duringTime + oneDayTime) {
      return "昨天" + dayjs(temp).format("HH:mm");
    }
    return dayjs(temp).format("YY/MM/DD HH:mm");
  }
  module.exports = {
    getScrollBottom,
    currentSendTime,
    historyMsgTime,
  };
});
