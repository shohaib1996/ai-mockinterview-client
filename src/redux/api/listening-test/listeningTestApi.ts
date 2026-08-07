import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const listeningTestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startListeningTest: builder.mutation({
      query: () => ({
        url: "/listening-tests/start",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.ListeningTest, tagTypes.Session],
    }),
    getListeningTest: builder.query({
      query: (sessionId: string) => ({
        url: `/listening-tests/${sessionId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ListeningTest],
    }),
    submitListeningTest: builder.mutation({
      query: ({ sessionId, answers }) => ({
        url: `/listening-tests/${sessionId}/submit`,
        method: "POST",
        data: { answers },
      }),
      invalidatesTags: [tagTypes.ListeningTest, tagTypes.Session],
    }),
  }),
});

export const {
  useStartListeningTestMutation,
  useGetListeningTestQuery,
  useSubmitListeningTestMutation,
} = listeningTestApi;
