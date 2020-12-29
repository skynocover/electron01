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
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [modal, setModal] = React.useState<React.ReactNode | null>(null);
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

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
        collapsed,
        onCollapse,
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
