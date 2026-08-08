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
    getSkillTests: builder.query({
      query: ({ skill, page, limit, difficulty }) => ({
        url: `/content-pool/${skill}/tests`,
        method: "GET",
        params: { page, limit, difficulty },
      }),
      providesTags: [tagTypes.AdminDashboard],
    }),
    deleteSkillTest: builder.mutation({
      query: ({ skill, id }) => ({
        url: `/content-pool/${skill}/tests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.AdminDashboard],
    }),
  }),
});

export const {
  useGetPoolStatusQuery,
  useGeneratePoolContentMutation,
  useGetSkillTestsQuery,
  useDeleteSkillTestMutation,
} = contentPoolApi;
