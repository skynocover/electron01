import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as antd from 'antd';
import { AppContext } from './AppContext';

function App() {
  const appCtx = React.useContext(AppContext);

  const [dataSource, setDataSource] = React.useState([]); //coulmns data

  const initialize = async () => {
    // window.alert('asd');
    let data = await appCtx.fetch('get', 'https://todo.skynocover.workers.dev');
    setDataSource(data);
    // setDataSource([
    //   { id: 0, name: '30', completed: true },
    //   { id: 1, name: 'R2 Key Server2', completed: true },
    //   { id: 2, name: '旗標上正式', completed: true },
    //   { id: 3, name: '資源串接goodpay', completed: true },
    //   { id: 4, name: '簡訊api串接', completed: true },
    // ]);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      // key: 'name',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      // key: 'age',
    },
    {
      title: 'complete',
      dataIndex: 'completed',
      // key: 'address',
    },
  ];

  React.useEffect(() => {
    initialize();
  }, []);
  return (
    <>
      <antd.Table dataSource={dataSource} columns={columns} />
    </>
  );
}

export default App;
