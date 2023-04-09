import { MainLayout } from "../layouts";
import {
  HomePage,
  EducationPage,
  ExperiencePage,
  ContactPage,
  SplashPage,
} from "../pages";

const ROUTES_DATA = [
  {
    Layout: null,
    data: [
      {
        path: "/",
        Component: SplashPage,
        isExact: true,
        sortOrder: 0,
      },
      {
        path: "/splash",
        Component: SplashPage,
        isExact: true,
        sortOrder: 5,
      },
    ],
  },
  {
    Layout: MainLayout,
    data: [
      {
        path: "/home",
        Component: HomePage,
        isExact: true,
        sortOrder: 1,
      },
      {
        path: "/vacancy",
        Component: ExperiencePage,
        isExact: true,
        sortOrder: 2,
      },
      {
        path: "/chat-ai",
        Component: EducationPage,
        isExact: true,
        sortOrder: 3,
      },
      {
        path: "/contact",
        Component: ContactPage,
        isExact: true,
        sortOrder: 4,
      }
    ],
  },
];

export default ROUTES_DATA;
