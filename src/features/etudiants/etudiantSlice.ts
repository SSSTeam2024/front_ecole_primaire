import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Etudiant {
  _id?: string;
  nom: string;
  prenom: string;
  date_de_naissance: string;
  classe?: string;
  parent?: string;
  genre: string;
  avatar_base64_string?: string;
  avatar_extension?: string;
  avatar: string;
  statusPaiement?: string;
  lieu_naissance: string;
  adresse_eleve: string;
  ville: string;
  nationalite: string;
  annee_scolaire: string;
  etablissement_frequente: string;
  moyenne_trimestre_1: string;
  moyenne_trimestre_2: string;
  moyenne_trimestre_3: string;
  moyenne_annuelle: string;
  moyenne_concours_6: string;
  numero_convocation_concours: string;
}

export interface StatusPaiement {
  _id?: string;
  statusPaiement: string;
}

export interface EleveClasse {
  _id?: string;
  classe: string;
}

export const etudiantSlice = createApi({
  reducerPath: "Etudiant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/etudiants`,
  }),
  tagTypes: ["Etudiant", "StatusPaiement", "EleveClasse"],
  endpoints(builder) {
    return {
      fetchEtudiants: builder.query<Etudiant[], number | void>({
        query() {
          return `/getEtudiants`;
        },
        providesTags: ["Etudiant"],
      }),
      fetchEtudiantsByClasseId: builder.mutation<Etudiant[], string | void>({
        query: (id) => ({
          url: `/etudiants-classe-id/${id}`,
          method: "GET",
        }),
        invalidatesTags: ["Etudiant"],
      }),
      addEtudiant: builder.mutation<void, Etudiant>({
        query(payload) {
          return {
            url: "/newEtudiant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Etudiant"],
      }),
      updateEtudiant: builder.mutation<void, Etudiant>({
        query: ({ _id, ...rest }) => ({
          url: `/updateEtudiant/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Etudiant"],
      }),
      updatePaymentStataus: builder.mutation<void, StatusPaiement>({
        query(payload) {
          return {
            url: "/updateStatusPaiment",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Etudiant", "StatusPaiement"],
      }),
      updateEleveClasse: builder.mutation<void, EleveClasse>({
        query(payload) {
          return {
            url: "/updateEleveClasse",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Etudiant", "EleveClasse"],
      }),
      deleteEtudiant: builder.mutation<void, Etudiant>({
        query: (_id) => ({
          url: `/deleteEtudiant/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Etudiant"],
      }),
    };
  },
});

export const {
  useAddEtudiantMutation,
  useFetchEtudiantsQuery,
  useDeleteEtudiantMutation,
  useUpdateEtudiantMutation,
  useFetchEtudiantsByClasseIdMutation,
  useUpdatePaymentStatausMutation,
  useUpdateEleveClasseMutation
} = etudiantSlice;
