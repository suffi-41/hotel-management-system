import { Outlet } from "react-router-dom";
import "./App.css";
import TopLodingBar from "./components/TopLoddingBar";
import { useEffect } from "react";

import { actionCreator } from "./redux/index";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { logged_token, admin_token, staff_token } from "./utils/extra";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const token = logged_token();
  const adminToken = admin_token();
  const staffToken = staff_token();
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);

  useEffect(() => {
    if (token) {
      action.login();
    }
    if (adminToken) {
      action.Adminlogin();
    }
    if (staffToken) {
      action.Stafflogin();
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <main className="w-screen h-screen overflow-auto">
        <TopLodingBar />
        <Outlet />
      </main>
    </QueryClientProvider>
  );
}

export default App;
