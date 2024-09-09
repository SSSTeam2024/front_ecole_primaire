import { Navigate } from "react-router-dom";
import Dashboard from "pages/Dashboard";

import UserProfile from "pages/Authentication/user-profile";

import Login from "pages/Authentication/Login";
import Classes from "pages/Classes";
import Etudiants from "pages/Etudiants";
import Parents from "pages/Parents";
import Enseignants from "pages/Enseignants";
import Observations from "pages/Observations";
import Exercices from "pages/Exercices";
import Emploi from "pages/Emploi";
import Discipline from "pages/Discpline";
import Avis from "pages/Avis";
import Documents from "pages/Documents";
import Notes from "pages/Notes";
import Carnets from "pages/Carnets";
import Evenements from "pages/Evenements";
import Gallerie from "pages/Gallerie";
import Absence from "pages/Absence";
import Paiement from "pages/Paiement";
import CompteRendu from "pages/CompteRendu";
import Matieres from "pages/Matiere";
import Cantines from "pages/Cantines";
import Salles from "pages/Salles";
import Calendrier from "pages/Calendrier";
import Evaluations from "pages/Evaluations";
import Rendezvous from "pages/Rendezvous";
import Inscriptions from "pages/Inscriptions";
import InscriptionDetails from "pages/Inscriptions/InscriptionDetails";
import UpdateInscription from "pages/Inscriptions/UpdateInscription";
// import Messages from "pages/Messages";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/classes", component: <Classes /> },
  { path: "/etudiants", component: <Etudiants /> },
  { path: "/parents", component: <Parents /> },
  { path: "/enseignants", component: <Enseignants /> },
  { path: "/observations", component: <Observations /> },
  { path: "/exercices", component: <Exercices /> },
  { path: "/emploi", component: <Emploi /> },
  { path: "/discipline", component: <Discipline /> },
  { path: "/avis", component: <Avis /> },
  { path: "/documents", component: <Documents /> },
  { path: "/notes", component: <Notes /> },
  { path: "/bulletins", component: <Carnets /> },
  { path: "/evènements", component: <Evenements /> },
  { path: "/gallerie", component: <Gallerie /> },
  { path: "/absence", component: <Absence /> },
  { path: "/paiement", component: <Paiement /> },
  { path: "/compte_rendu", component: <CompteRendu /> },
  { path: "/matieres", component: <Matieres /> },
  // { path: "/messages", component: <Messages /> },
  { path: "/cantines", component: <Cantines /> },
  { path: "/salles", component: <Salles /> },
  { path: "/calendrier-examen", component: <Calendrier /> },
  { path: "/evaluations", component: <Evaluations /> },
  { path: "/rendez-vous", component: <Rendezvous /> },
  { path: "/inscriptions", component: <Inscriptions /> },
  { path: "/details-inscription", component: <InscriptionDetails /> },
  { path: "/modifier-inscription", component: <UpdateInscription /> },

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },
  { path: "/user-profile", component: <UserProfile /> },
];

const publicRoutes = [
  // AuthenticationInner
  { path: "/login", component: <Login /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
];

export { authProtectedRoutes, publicRoutes };
