import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Inscription {
  classe: string;
  nom_eleve: string;
  prenom_eleve: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: string;
  adresse_eleve: string;
  situation_familiale: string;
  avec: string;
  responsable_legal: string;
  nom_parent: string;
  prenom_parent: string;
  adresse_parent: string;
  profession: string;
  nom_societe: string;
  phone: string;
  status: string;
  nationalite: string;
  annee_scolaire: string;
  etablissement_frequente: string;
  moyenne_trimestre_1: string;
  moyenne_trimestre_2: string;
  moyenne_trimestre_3: string;
  moyenne_annuelle: string;
  moyenne_concours_6: string;
  numero_convocation_concours: string;
  bulletin_base64: string;
  bulletin_extension: string;
  photo_base64: string;
  photo_extension: string;
  copie_bulletin: string;
  photoProfil: string;
  groupe: string;
  notes: string
}

export interface InscriptionStatus {
   _id?:string;
    status: string;
  }

  export interface InscriptionGroupe {
    _id?:string;
    groupe: string;
   }

   export interface InscriptionNotes {
    _id?:string;
    notes: string;
   }

export const inscriptionsSlice = createApi({
  reducerPath: "Inscription",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/inscriptions`,
  }),
  tagTypes: ["Inscription", "InscriptionStatus", "InscriptionGroupe", "InscriptionNotes"],
  endpoints(builder) {
    return {
      getAllInscriptions: builder.query<Inscription[], number | void>({
        query() {
          return "/getInscriptions";
        },
        providesTags: ["Inscription"],
      }),
      addNewInscription: builder.mutation<void, Inscription>({
        query(payload) {
          return {
            url: "/createInscription",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Inscription"],
      }),
      updateInscriptionStataus: builder.mutation<void, InscriptionStatus>({
        query(payload) {
          return {
            url: "/updateInscriptionStatus",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Inscription", "InscriptionStatus"],
      }),
      updateInscriptionGroupe: builder.mutation<void, InscriptionGroupe>({
        query(payload) {
          return {
            url: "/updateInscriptionGroupe",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Inscription", "InscriptionGroupe"],
      }),
      updateInscriptionNotes: builder.mutation<void, InscriptionNotes>({
        query(payload) {
          return {
            url: "/updateInscriptionNotes",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Inscription", "InscriptionNotes"],
      }),
      removeInscription: builder.mutation<void, number>({
        query: (idNote) => ({
          url: `deleteInscription/${idNote}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Inscription"],
      }),
    };
  },
});

export const {
  useAddNewInscriptionMutation,
  useGetAllInscriptionsQuery,
  useRemoveInscriptionMutation,
  useUpdateInscriptionStatausMutation,
  useUpdateInscriptionGroupeMutation,
  useUpdateInscriptionNotesMutation
} = inscriptionsSlice;
