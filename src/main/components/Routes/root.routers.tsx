// Admin


// Player
import Home from '../Home';
import UserProfile from '../Login/UserProfile';
import NavBar from '../bars/NavBar';
import StatusBar from '../bars/StatusBar';
import AddEntry from '../Routes/EditEntry';
import ImportExport from '../Admin/ImportExport';
import StaticSingle from '../Routes/StaticSingle';
import AddSubEntry from '../Routes/AddSubEntry';
import StyleTest from '../Style';
import Search from '../Search/Search';
import FileFullscreen from '../Templates/FileFullScreen';
import Bookmarks from '../Search/Bookmarks';
import Media from '../Search/Media';
import HashImport from '../Admin/HashImport';
import { StaticList } from '../Lists/StaticList';
import { EntryList } from '../Lists/ListEditEntry';


export type RouterState = {
  path: string;
  element: JSX.Element;
};

export const AdminRoutes: RouterState[] = [
  {
    path: "/",
    element: <StaticList />,
  },
    {
    path: "/admin",
    element: <ImportExport />,
  },
  {
    path: "/media",
    element: <Media />
  },
  {
    path: "/user-profile",
    element: <UserProfile />,
  },
  {
    path: "edit-item/:id",
    element: <AddEntry />,
  },
  {
    path: "/add-subitem/:parentID",
    element: <AddSubEntry />,
  },
    {
    path: "/edit-subitem/:parentID/:itemID",
    element: <AddSubEntry />,
  },
    {
    path: "/search",
    element: <Search />,
  },
    {
    path: "/file-fullscreen/:fileID",
    element: <FileFullscreen />,
  },
    {
    path: "/bookmarks",
    element: <Bookmarks />,
  },
    {
    path: "/hashimport",
    element: <HashImport />,
  },
    {
    path: "/file-fullscreen/:id",
    element: <FileFullscreen />,
  }
]

export const PlayerRoutes: RouterState[] = [
  {
    path: "/",
    element: <EntryList />
  },
    {
    path: "/admin",
    element: <HashImport />,
  },
  {
    path: "/media",
    element: <EntryList />,
  },
  {
    path: "/user-profile",
    element: <UserProfile />,
  },
  {
    path: "edit-item/:id",
    element: <StaticSingle />,
  },
  {
    path: "/add-subitem/:parentID",
    element: <StaticSingle />,
  },
    {
    path: "/edit-subitem/:parentID/:itemID",
    element: <StaticSingle />,
  },
    {
    path: "/search",
    element: <Search />,
  },
    {
    path: "/file-fullscreen/:fileID",
    element: <FileFullscreen />,
  },
    {
    path: "/bookmarks",
    element: <Bookmarks />,
  },
    {
    path: "/hashimport",
    element: <HashImport />,
  },
    {
    path: "/file-fullscreen/:id",
    element: <FileFullscreen />,
  }
];

