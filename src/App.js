import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as antd from 'antd';
import { AppContext } from './AppContext';
import { useFormik } from 'formik';

function App() {
  const appCtx = React.useContext(AppContext);

  const [dataSource, setDataSource] = React.useState([]); //coulmns data
  const [select, setSelect] = React.useState([]); //coulmns data
  const [index, setIndex] = React.useState(0); //coulmns data

  const data = [
    { id: 0, name: '30', completed: true },
    { id: 1, name: 'R2 Key Server2', completed: true },
    { id: 2, name: '旗標上正式', completed: true },
    { id: 3, name: '資源串接goodpay', completed: true },
    { id: 4, name: '簡訊api串接', completed: true },
  ];

  const initialize = async () => {
    // let data = await appCtx.fetch('get', 'https://todo.skynocover.workers.dev');
    let _index = 0;
    let newData = data.map((item) => {
      _index++;
      setIndex(_index);
      // setIndex((state) => state + 1);
      return { key: _index, ...item };
    });
    setDataSource(newData);
  };

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelect(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  const newList = async (text) => {
    setDataSource((state, props) => {
      let _index = index + 1;
      setIndex(_index);
      // setIndex((state) => state + 1);
      return [...state, { key: _index, name: text, complete: false }];
    });
  };

  const deleteList = async () => {
    let newList = dataSource.filter((item) => {
      let check = false;
      for (let i = 0; i < select.length; i++) {
        if (select[i] == item.key) {
          check = true;
        }
      }
      return !check;
    });
    setDataSource(newList);
  };

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    onSubmit: (values) => {
      // console.log(values);
      newList(values.text);
      formik.resetForm();
    },
  });

  /////////////////////////

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'complete',
      align: 'center',
      // dataIndex: 'completed',
      render: (item) => <antd.Radio checked={item.completed} />,
      // key: 'address',
    },
  ];

  React.useEffect(() => {
    initialize();
  }, []);
  return (
    <>
      <div className="constainer m-3">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <antd.Button type="primary" onClick={deleteList}>
              刪除所選
            </antd.Button>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <antd.Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} pagination={false} />
          </div>
        </div>
        <antd.Divider />
        <div className="row ">
          <div className="col-md-3 col-lg-3 "></div>
          <div className="col-md-6 col-lg-6 col-sm-12">
            <antd.Input placeholder="please input todo" onChange={formik.handleChange('text')} allowClear />
          </div>
          <div className="col-md-3 col-lg-3 col-sm-6 justify-content-end">
            <antd.Button type="primary" onClick={formik.handleSubmit}>
              送出
            </antd.Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
