import { lazy } from "react";
import { Navigate, useRouteError, type RouteObject } from "react-router";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

function RootError() {
  const error = useRouteError() as Error;
  const isChunkError = error?.message?.includes("dynamically imported module");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-ink px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <p className="font-heading text-lg">
          {isChunkError ? "site updated — please reload" : "something went wrong"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="border border-ink px-4 py-1 text-sm hover:bg-ink hover:text-cream transition-colors font-body"
        >
          reload
        </button>
      </div>
    </div>
  );
}

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Shows = lazy(() => import("./pages/Shows"));
const MediaPage = lazy(() => import("./pages/Media"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLinks = lazy(() => import("./pages/AdminLinks"));
const AdminShows = lazy(() => import("./pages/AdminShows"));
const AdminMedia = lazy(() => import("./pages/AdminMedia"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "shows", element: <Shows /> },
      { path: "media", element: <MediaPage /> },
      { path: "admin/login", element: <AdminLogin /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="links" replace /> },
          { path: "links", element: <AdminLinks /> },
          { path: "shows", element: <AdminShows /> },
          { path: "media", element: <AdminMedia /> },
        ],
      },
    ],
  },
];
