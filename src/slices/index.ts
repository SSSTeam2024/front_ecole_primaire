import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

import DashboardReducer from "./dashboard/reducer";

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Dashboard: DashboardReducer,
});

export default rootReducer;