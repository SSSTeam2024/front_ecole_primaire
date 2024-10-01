import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from "@reduxjs/toolkit/query";

import LayoutReducer from "../slices/layouts/reducer";
import DashboardReducer from "../slices/dashboard/reducer";

import { accountSlice } from "features/account/accountSlice";
import authSlice from "features/account/authSlice";
import { classeSlice } from "features/classes/classeSlice";
import { etudiantSlice } from "features/etudiants/etudiantSlice";
import { parentSlice } from "features/parents/parentSlice";
import { enseignantSlice } from "features/enseignants/enseignantSlice";
import { observationSlice } from "features/observations/observationSlice";
import { exerciceSlice } from "features/exercices/exerciceSlice";
import { disciplineSlice } from "features/disciplines/disciplineSlice";
import { emploiSlice } from "features/emplois/emploiSlice";
import { matiereSlice } from "features/matieres/matiereSlice";
import { noteSlice } from "features/notes/noteSlice";
import { carnetSlice } from "features/carnets/carnetSlice";
import { absenceSlice } from "features/absences/absenceSlice";
import { avisSlice } from "features/avis/avisSlice";
import { documentSlice } from "features/documents/documentSlice";
import { evenementSlice } from "features/evenements/evenementSlice";
import { compteRenduSlice } from "features/compteRendus/compteRenduSlice";
import { gallerieSlice } from "features/galleries/gallerieSlice";
import { messagerieSlice } from "features/messageries/messagerieSlice";
import { cantineSlice } from "features/cantines/cantineSlice";
import { paiementSlice } from "features/paiements/paiementSlice";
import { salleSlice } from "features/salles/salleSlice";
import { calendrierSlice } from "features/calendriers/calendrierSlice";
import { evaluationsSlice } from "features/evaluations/evaluationSlice";
import { rendezvousSlice } from "features/rendezvous/rendezvousSlice";
import { inscriptionsSlice } from "features/inscriptions/inscriptionSlice";
import { niveauSlice } from "features/niveaux/niveauxSlice";
import { smSSlice } from "features/sms/smsSlice";
import { smsEnseignantSlice } from "features/smsEnseignants/smsEnseignantSlice";
import { smsSettingSlice } from "features/smsSettings/smsSettings";
import { abonnementSlice } from "features/abonnements/abonnementSlice";

export const store = configureStore({
  reducer: {
    [accountSlice.reducerPath]: accountSlice.reducer,
    [classeSlice.reducerPath]: classeSlice.reducer,
    [etudiantSlice.reducerPath]: etudiantSlice.reducer,
    [parentSlice.reducerPath]: parentSlice.reducer,
    [enseignantSlice.reducerPath]: enseignantSlice.reducer,
    [observationSlice.reducerPath]: observationSlice.reducer,
    [exerciceSlice.reducerPath]: exerciceSlice.reducer,
    [disciplineSlice.reducerPath]: disciplineSlice.reducer,
    [emploiSlice.reducerPath]: emploiSlice.reducer,
    [matiereSlice.reducerPath]: matiereSlice.reducer,
    [noteSlice.reducerPath]: noteSlice.reducer,
    [carnetSlice.reducerPath]: carnetSlice.reducer,
    [absenceSlice.reducerPath]: absenceSlice.reducer,
    [avisSlice.reducerPath]: avisSlice.reducer,
    [documentSlice.reducerPath]: documentSlice.reducer,
    [evenementSlice.reducerPath]: evenementSlice.reducer,
    [compteRenduSlice.reducerPath]: compteRenduSlice.reducer,
    [gallerieSlice.reducerPath]: gallerieSlice.reducer,
    [messagerieSlice.reducerPath]: messagerieSlice.reducer,
    [cantineSlice.reducerPath]: cantineSlice.reducer,
    [paiementSlice.reducerPath]: paiementSlice.reducer,
    [salleSlice.reducerPath]: salleSlice.reducer,
    [calendrierSlice.reducerPath]: calendrierSlice.reducer,
    [evaluationsSlice.reducerPath]: evaluationsSlice.reducer,
    [rendezvousSlice.reducerPath]: rendezvousSlice.reducer,
    [inscriptionsSlice.reducerPath]: inscriptionsSlice.reducer,
    [niveauSlice.reducerPath]: niveauSlice.reducer,
    [smSSlice.reducerPath]: smSSlice.reducer,
    [smsEnseignantSlice.reducerPath]: smsEnseignantSlice.reducer,
    [smsSettingSlice.reducerPath]: smsSettingSlice.reducer,
    [abonnementSlice.reducerPath]: abonnementSlice.reducer,
    auth: authSlice,
    Layout: LayoutReducer,
    Dashboard: DashboardReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([
      accountSlice.middleware,
      classeSlice.middleware,
      etudiantSlice.middleware,
      parentSlice.middleware,
      enseignantSlice.middleware,
      observationSlice.middleware,
      exerciceSlice.middleware,
      disciplineSlice.middleware,
      emploiSlice.middleware,
      matiereSlice.middleware,
      noteSlice.middleware,
      carnetSlice.middleware,
      absenceSlice.middleware,
      avisSlice.middleware,
      documentSlice.middleware,
      evenementSlice.middleware,
      compteRenduSlice.middleware,
      gallerieSlice.middleware,
      messagerieSlice.middleware,
      cantineSlice.middleware,
      paiementSlice.middleware,
      salleSlice.middleware,
      calendrierSlice.middleware,
      evaluationsSlice.middleware,
      rendezvousSlice.middleware,
      inscriptionsSlice.middleware,
      niveauSlice.middleware,
      smSSlice.middleware,
      smsEnseignantSlice.middleware,
      smsSettingSlice.middleware,
      abonnementSlice.middleware
    ]);
  },
});

setupListeners(store.dispatch);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
