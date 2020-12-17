import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as antd from 'antd';
import { AppContext } from './AppContext';
import { useFormik } from 'formik';
import { v1 as uuidv1 } from 'uuid';

const url = 'http://localhost:9000';
// const url = "https://todo.skynocover.workers.dev"

function App() {
  const appCtx = React.useContext(AppContext);

  const [dataSource, setDataSource] = React.useState([]); //coulmns data
  const [select, setSelect] = React.useState([]); //coulmns data
  const [message, setMessage] = React.useState(''); //coulmns data

  const data = [
    { id: 0, name: '30', completed: true },
    { id: 1, name: 'R2 Key Server2', completed: true },
    { id: 2, name: '旗標上正式', completed: true },
    { id: 3, name: '資源串接goodpay', completed: true },
    { id: 4, name: '簡訊api串接', completed: true },
  ];

  const initialize = async () => {
    // let data = await appCtx.fetch('get', '');
    let data = await appCtx.fetch('get', url);

    let newData = data.map((item, index) => {
      return { key: item.key, ...item };
    });
    // setIndex(newData.length);
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

  const deleteList = async () => {
    let keys = [];
    let newList = dataSource.filter((item) => {
      if (!select.includes(item.key)) {
        return true;
      }
      keys.push(item.key);
      return false;
    });
    await appCtx.fetch('delete', url, { keys });
    setDataSource(newList);
  };

  const newList = async (text) => {
    let newitem = { key: uuidv1(), name: text, complete: false };

    setDataSource((state, props) => {
      return [...state, newitem];
    });

    await appCtx.fetch('post', url, newitem);
  };

  const validate = (values) => {
    const errors = {};

    if (!values.text) {
      setMessage('請至少輸入一個字');
      errors.message = '請至少輸入一個字';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    validate,
    onSubmit: (values, action) => {
      // console.log(values);
      action.resetForm();
      newList(values.text);
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
      render: (item) => <antd.Radio checked={item.completed} />,
    },
  ];

  React.useEffect(() => {
    if (message) {
      antd.message.error(message);
    }
  }, [message]);

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
            <antd.Input placeholder="please input todo" id="text" onChange={formik.handleChange('text')} allowClear />
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
