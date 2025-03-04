import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserRoles from "../pages/UserRoles";
import UserManagement from "../pages/UserManagement";
import Dashboard from "../pages/Dashboard";
import AutoResponse from "../pages/AutoResponse";
import Customers from "../pages/Customers";
import Subscriptions from "../pages/Subscriptions";
import Books from "../pages/Books";
import BookCreate from "../components/books/BookCreate";
import BookEdit from "../components/books/BookEdit";
import Players from "../pages/Players";
import PlayerCreate from "../components/players/PlayerCreate";
import PlayerEdit from "../components/players/PlayerEdit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <App />,
    children: [
      {
        path: "home",
        element: <Dashboard />,
      },
      {
        path: "user-roles",
        element: <UserRoles />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "auto-response",
        element: <AutoResponse />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "subscriptions",
        element: <Subscriptions />,
      },
      {
        path: "books",
        element: <Books />,
        children: [
          {
            path: "create",
            element: <BookCreate />,
          },
          { path: ":id/edit", element: <BookEdit /> },
        ],
      },
      {
        path: "players",
        element: <Players />,
        children: [
          {
            path: "create",
            element: <PlayerCreate />,
          },
          { path: ":id/edit", element: <PlayerEdit /> },
        ],
      },
    ],
  },
]);

export default router;
