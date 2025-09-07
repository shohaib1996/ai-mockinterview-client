import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const listeningAudioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createListeningAudio: builder.mutation({
      query: (data) => ({
        url: "/listening-audios",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.ListeningAudio],
    }),
    getAllListeningAudios: builder.query({
      query: (params) => ({
        url: "/listening-audios",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.ListeningAudio],
    }),
    getSingleListeningAudio: builder.query({
      query: (id) => ({
        url: `/listening-audios/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ListeningAudio],
    }),
    updateListeningAudio: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/listening-audios/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.ListeningAudio],
    }),
    deleteListeningAudio: builder.mutation({
      query: (id) => ({
        url: `/listening-audios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ListeningAudio],
    }),
  }),
});

export const {
  useCreateListeningAudioMutation,
  useGetAllListeningAudiosQuery,
  useGetSingleListeningAudioQuery,
  useUpdateListeningAudioMutation,
  useDeleteListeningAudioMutation,
} = listeningAudioApi;
