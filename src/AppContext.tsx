import React from 'react';
import axios from 'axios';
import * as antd from 'antd';

axios.defaults.baseURL = '/';
// const url = "https://todo.skynocover.workers.dev"
axios.defaults.headers.common['Content-Type'] = 'application/json';
//axios.defaults.timeout = 5000;

interface AppContextProps {
  fetch: (method: 'get' | 'post' | 'delete' | 'put', url: string, param?: any) => Promise<any>;
  setModal: (modal: React.ReactNode | null) => void;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [modal, setModal] = React.useState<React.ReactNode | null>(null);

  const initialize = async () => {};

  React.useEffect(() => {
    initialize();
  }, []);

  /////////////////////////////////////////////////////

  const fetch = async (method: 'get' | 'post' | 'delete' | 'put', url: string, param?: any) => {
    // Send a POST request
    try {
      const response = await axios({
        method,
        url,
        data: param,
      });

      if (response) {
        // console.log('resp: ' + JSON.stringify(response.data));
        // if (response.data.errorCode === 999999) {
        //   // window.location.href = loginPage;
        //   throw new Error('登入超時');
        // } else if (response.data.errorCode !== 0) {
        //   throw new Error(response.errorMessage);
        // }
        // window.alert(JSON.stringify(response));

        return response.data;
      } else {
        throw new Error('Response fail');
      }
    } catch (e) {
      window.alert(e);
      return null;
    }
  };

  /////////////////////////////////////////////////////

  React.useEffect(() => {}, []);

  return (
    <AppContext.Provider
      value={{
        fetch,

        setModal: (modal: React.ReactNode | null) => setModal(modal),
      }}
    >
      <antd.Modal
        visible={modal !== null}
        onOk={() => setModal(null)}
        onCancel={() => {
          setModal(null);
        }}
        footer={null}
        closable={false}
      >
        {modal}
      </antd.Modal>

      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };