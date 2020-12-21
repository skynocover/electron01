import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as antd from 'antd';
import { AppContext } from './AppContext';
import { useFormik } from 'formik';
import { v1 as uuidv1 } from 'uuid';

const ipc = window.ipc;

const url = '/aaa';

function App() {
  const appCtx = React.useContext(AppContext);

  const [dataSource, setDataSource] = React.useState([]); //coulmns data
  const [select, setSelect] = React.useState([]); //coulmns data

  const initialize = async () => {
    let data = await appCtx.fetch('get', url);

    let newData = data.map((item, index) => {
      return { key: item.key, ...item };
    });
    setDataSource(newData);
  };

  React.useEffect(() => {
    initialize();
  }, []);

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
    let result = await ipc.invoke('ask_delete');
    if (result === 0) {
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
    }
  };

  const newList = async (text) => {
    let newitem = { key: uuidv1(), name: text, complete: false };

    setDataSource((state, props) => {
      return [...state, newitem];
    });

    await appCtx.fetch('post', url, newitem);
  };

  const completeList = async (key, value) => {
    setDataSource((state, props) => {
      let index = state.findIndex((element) => {
        return element.key == key;
      });

      if (index > -1) {
        state[index].completed = value;
      }

      return [...state];
    });

    await appCtx.fetch('put', url, { key, completed: value });
  };

  const validate = (values) => {
    const errors = {};

    if (!values.text) {
      errors.text = '請至少輸入一個字';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    validate,
    validateOnMount: true,
    onSubmit: (values) => {
      newList(values.text);
      formik.resetForm();
    },
  });

  /////////////////////////

  const columns = [
    {
      key: 'c1',
      title: '工作項目',
      dataIndex: 'name',
      align: 'center',
    },
    {
      key: 'c2',
      title: 'complete',
      align: 'center',
      render: (item) => (
        <antd.Checkbox
          checked={item.completed}
          onChange={(evt) => {
            completeList(item.key, evt.target.checked);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="constainer m-3">
        <div className="row justify-content-center m-2">
          <div className="col-md-2 col-lg-3 "></div>
          <div className="col ">
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
            <antd.Input
              placeholder="please input todo"
              value={formik.values.text}
              onChange={formik.handleChange('text')}
              allowClear
            />
          </div>
          <div className="col-md-3 col-lg-3 col-sm-6 justify-content-end">
            <antd.Popover
              content={
                formik.errors.text ? (
                  <div>
                    <p> {formik.errors.text}</p>
                  </div>
                ) : null
              }
              // visible={formik.errors.text ? true : false}
            >
              <antd.Button type="primary" disabled={!!formik.errors.text} onClick={formik.handleSubmit}>
                {'Send'}
              </antd.Button>
            </antd.Popover>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
