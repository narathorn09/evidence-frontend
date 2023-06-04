import React from "react";
import { Spin } from "antd";

const Loading = () => (
  <div className="justify-self-center items-center flex">
    <Spin tip="Loading" size="large">
      <div className="p-6" />
    </Spin>
  </div>
);

export default Loading;
