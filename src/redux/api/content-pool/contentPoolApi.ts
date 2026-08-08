import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const contentPoolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPoolStatus: builder.query({
      query: () => ({
        url: "/content-pool",
        method: "GET",
      }),
      providesTags: [tagTypes.AdminDashboard],
    }),
    generatePoolContent: builder.mutation({
      query: ({ skill, difficulty }) => ({
        url: "/content-pool/generate",
        method: "POST",
        data: { skill, difficulty },
      }),
      invalidatesTags: [tagTypes.AdminDashboard],
    }),
  }),
});

export const { useGetPoolStatusQuery, useGeneratePoolContentMutation } = contentPoolApi;
