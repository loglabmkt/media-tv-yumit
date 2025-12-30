import Dashboard from './pages/Dashboard';
import Locais from './pages/Locais';
import Slides from './pages/Slides';
import Player from './pages/Player';
import Agenda from './pages/Agenda';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Locais": Locais,
    "Slides": Slides,
    "Player": Player,
    "Agenda": Agenda,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};