import React from 'react';
import '../App.css';
import * as antd from 'antd';
import { AppContext } from '../AppContext';
import { FormikErrors, FormikValues, useFormik } from 'formik';
import { v1 as uuidv1 } from 'uuid';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';

declare global {
  interface Window {
    ipc: any;
  }
}

const ipc = window.ipc;

const url = '/aaa';

const List = () => {
  const appCtx = React.useContext(AppContext);

  interface todolist {
    key: string;
    name: string;
    completed: boolean;
  }

  const [dataSource, setDataSource] = React.useState<todolist[]>([]); //coulmns data
  const [select, setSelect] = React.useState<React.Key[]>([]); //coulmns data

  const initialize = async () => {
    let data = await appCtx.fetch('get', url);

    let newData = data.map((item: any, index: number) => {
      return { key: item.key, ...item };
    });
    setDataSource(newData);
  };

  React.useEffect(() => {
    initialize();
  }, []);

  // rowSelection object indicates the need for row selection
  const rowSelection: TableRowSelection<object> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: object[]) => {
      setSelect(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      name: record.name,
    }),
  };

  const deleteList = async () => {
    let result = await ipc.invoke('ask_delete');
    if (result === 0) {
      let keys: string[] = [];
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

  const newList = async (text: string) => {
    let newitem: todolist = { key: uuidv1(), name: text, completed: false };

    setDataSource((state: todolist[]) => {
      return [...state, newitem];
    });

    await appCtx.fetch('post', url, newitem);
  };

  const completeList = async (key: string, value: boolean) => {
    setDataSource((state: todolist[]) => {
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

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    validate: (values: FormikValues) => {
      const errors: FormikErrors<FormikValues> = {};

      if (!values.text) {
        errors.text = '請至少輸入一個字';
      }

      return errors;
    },
    validateOnMount: true,
    onSubmit: (values) => {
      newList(values.text);
      formik.resetForm();
    },
  });

  /////////////////////////

  const columns: ColumnsType<object> = [
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
              // content={
              //   formik.errors.text ? (
              //     <div>
              //       <p> {formik.errors.text}</p>
              //     </div>
              //   ) : null
              // }

              content={
                formik.errors.text ? (
                  <div>
                    <p> {formik.errors.text}</p>
                  </div>
                ) : null
              }

              // disable={formik.errors.text ==='' ? true : false}
            >
              <antd.Button
                type="primary"
                disabled={!!formik.errors.text}
                onClick={() => {
                  formik.handleSubmit();
                }}
              >
                {'Send'}
              </antd.Button>
            </antd.Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
