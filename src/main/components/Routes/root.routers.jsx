// Admin


// Player
import Home from '@components/routes/Home';
import UserProfile from '@components/login/UserProfile';
import NavBar from '@components/bars/NavBar';
import StatusBar from '@components/bars/StatusBar';
import AddEntry from '@components/entries/EditEntry';
import ImportExport from '@components/admin/ImportExport';
import StaticSingle from '@components/entries/StaticSingle';
import AddSubEntry from '@components/entries/AddSubEntry';
// import StyleTest from '../Style';
import Search from '@components/search/Search';
import FileFullscreen from '@components/templates/FileFullScreen';
import Bookmarks from '@components/search/Bookmarks';
import Media from '@components/search/Media';
import HashImport from '@components/admin/HashImport';
import { StaticList } from '@components/lists/StaticList';
import { EntryList } from '@components/lists/ListEditEntry';


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

