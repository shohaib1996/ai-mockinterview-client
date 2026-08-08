import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

const speakingTestBankApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSpeakingTestBank: builder.mutation({
      query: (data) => ({
        url: "/speaking-test-bank",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.SpeakingTest],
    }),
    getAllSpeakingTestBank: builder.query({
      query: (args) => ({
        url: "/speaking-test-bank",
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.SpeakingTest],
    }),
    updateSpeakingTestBank: builder.mutation({
      query: ({ id, data }) => ({
        url: `/speaking-test-bank/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.SpeakingTest],
    }),
    deleteSpeakingTestBank: builder.mutation({
      query: (id) => ({
        url: `/speaking-test-bank/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.SpeakingTest],
    }),
  }),
});

export const {
  useCreateSpeakingTestBankMutation,
  useGetAllSpeakingTestBankQuery,
  useUpdateSpeakingTestBankMutation,
  useDeleteSpeakingTestBankMutation,
} = speakingTestBankApi;
