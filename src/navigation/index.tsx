import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/dashboard/home";
import Login from "../pages/auth/login";
import { SCREENS } from "./constant";
import Register from "../pages/auth/register";
import CreateInvestment from "../pages/dashboard/investment/create";
import Investments from "../pages/dashboard/investment";
import Transactions from "../pages/dashboard/transaction";
import Withdrawal from "../pages/dashboard/withdrawal";
import ProfilePage from "../pages/dashboard/profile";
import Plans from "../pages/dashboard/plans";
import CreatePlan from "../pages/dashboard/plans/create";
import Users from "../pages/dashboard/users";
import ForgotPassword from "../pages/auth/forgot-password";
import InvestmentDetail from "../pages/dashboard/investment/details";

const router = createBrowserRouter([
  {
    index: true,
    element: <Login />,
  },
  {
    path: SCREENS.LOGIN,
    element: <Login />,
  },
  {
    path: SCREENS.DASHBOARD,
    element: <Home />,
  },
  {
    path: SCREENS.REGISTER,
    element: <Register />,
  },
  {
    path: SCREENS.CREATE_INVESTMENT,
    element: <CreateInvestment />,
  },
  {
    path: SCREENS.INVESTMENTS,
    element: <Investments />,
  },
  {
    path: SCREENS.TRANSACTIONS,
    element: <Transactions />,
  },
  {
    path: SCREENS.WITHDRAWAL,
    element: <Withdrawal />,
  },
  {
    path: SCREENS.PROFILE,
    element: <ProfilePage />,
  },
  {
    path: SCREENS.PLANS,
    element: <Plans />,
  },
  {
    path: SCREENS.CREATE_PLAN,
    element: <CreatePlan />,
  },
  {
    path: SCREENS.USERS_TABLE,
    element: <Users />,
  },
  {
    path: SCREENS.FORGOT_PASSORD,
    element: <ForgotPassword />,
  },
  {
    path: SCREENS.INVESTMENT_DETAIL,
    element: <InvestmentDetail />
  }
]);

export default router;
