import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Header} from "./share/components/header/Header";
import {ViewProduct} from "./page/view-product/view-product";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function App() {
  return (
    <div className="App">
      <Header></Header>
        <ViewProduct></ViewProduct>
    </div>
  );
}

export default App;
