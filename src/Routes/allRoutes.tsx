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
// import Evaluations from "pages/Evaluations";
import Rendezvous from "pages/Rendezvous";
import Inscriptions from "pages/Inscriptions";
import InscriptionDetails from "pages/Inscriptions/InscriptionDetails";
import UpdateInscription from "pages/Inscriptions/UpdateInscription";
import Niveaux from "pages/Niveaux";
import ParentsSmses from "pages/ParentsSmses";
import EnseignantsSmses from "pages/EnseignantsSmses";
import CreateNote from "pages/Notes/CreateNote";
import CreateAbsence from "pages/Absence/CreateAbsence";
import CreateCarnet from "pages/Carnets/CreateCarnet";
import DevoirControle from "pages/Calendrier/DevoirControle";
import DevoirSynthese from "pages/Calendrier/DevoirSynthese";
import Parametres from "pages/Parametres";
import Messages from "pages/Messages";
import DetailsEtudiant from "pages/Etudiants/DetailsEtudiant";
import UpdateEtudiant from "pages/Etudiants/UpdateEtudiant";
import Abonnements from "pages/Abonnements";
import UpdateCarnet from "pages/Carnets/UpdateCarnet";
import UpdateNote from "pages/Notes/UpdateNote";
import UpdateAbsence from "pages/Absence/UpdateAbsence";
import MessageCollectif from "pages/Messages/MessageCollectif";
import Surveillants from "pages/Surveillants";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/classes", component: <Classes /> },

  { path: "/parents", component: <Parents /> },
  { path: "/enseignants", component: <Enseignants /> },
  { path: "/observations", component: <Observations /> },
  { path: "/exercices", component: <Exercices /> },
  { path: "/emploi", component: <Emploi /> },
  { path: "/discipline", component: <Discipline /> },
  { path: "/avis", component: <Avis /> },
  { path: "/documents", component: <Documents /> },

  { path: "/bulletins", component: <Carnets /> },
  { path: "/evènements", component: <Evenements /> },
  { path: "/gallerie", component: <Gallerie /> },

  { path: "/paiement", component: <Paiement /> },
  { path: "/compte_rendu", component: <CompteRendu /> },
  { path: "/matieres", component: <Matieres /> },
  { path: "/niveaux", component: <Niveaux /> },

  { path: "/cantines", component: <Cantines /> },
  { path: "/salles", component: <Salles /> },
  { path: "/abonnements", component: <Abonnements /> },

  // Messagerie Section
  { path: "/messages-individuels", component: <Messages /> },
  { path: "/messages-groupe", component: <MessageCollectif /> },

  // { path: "/evaluations", component: <Evaluations /> },
  { path: "/rendez-vous", component: <Rendezvous /> },

  { path: "/inscriptions", component: <Inscriptions /> },
  { path: "/details-inscription", component: <InscriptionDetails /> },
  { path: "/modifier-inscription", component: <UpdateInscription /> },

  // Etudiants Section
  { path: "/etudiants", component: <Etudiants /> },
  { path: "/détails-etudiant", component: <DetailsEtudiant /> },
  { path: "/modifier-etudiant", component: <UpdateEtudiant /> },

  // Calendrier Section
  { path: "/calendrier-examen-contrôle", component: <DevoirControle /> },
  { path: "/calendrier-examen-synthèse", component: <DevoirSynthese /> },

  // Note Section
  { path: "/notes", component: <Notes /> },
  { path: "/nouveau-note", component: <CreateNote /> },
  { path: "/modifier-note", component: <UpdateNote /> },

  // Absence Section
  { path: "/absence", component: <Absence /> },
  { path: "/nouveau-absence", component: <CreateAbsence /> },
  { path: "/modifier-absence", component: <UpdateAbsence /> },

  // Carnet Section
  { path: "/bulletins", component: <Carnets /> },
  { path: "/nouveau-bulletin", component: <CreateCarnet /> },
  { path: "/modifier-bulletin", component: <UpdateCarnet /> },

  // Sms Section
  { path: "/sms-parents", component: <ParentsSmses /> },
  { path: "/sms-enseignants", component: <EnseignantsSmses /> },
  { path: "/paremètres-sms", component: <Parametres /> },

  { path: "/surveillants", component: <Surveillants /> },

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
