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
      invalidatesTags: [tagTypes.AdminDashboard, tagTypes.ContentPoolTests],
    }),
    getSkillTests: builder.query({
      query: ({ skill, page, limit, difficulty }) => ({
        url: `/content-pool/${skill}/tests`,
        method: "GET",
        params: { page, limit, difficulty },
      }),
      providesTags: [tagTypes.ContentPoolTests],
    }),
    deleteSkillTest: builder.mutation({
      query: ({ skill, id }) => ({
        url: `/content-pool/${skill}/tests/${id}`,
        method: "DELETE",
      }),
      // Counts card needs a refetch, but the tests list is patched
      // optimistically below so deleting a row doesn't flash the whole
      // table back to a loading state.
      invalidatesTags: [tagTypes.AdminDashboard],
      async onQueryStarted({ skill, id, page, limit }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          contentPoolApi.util.updateQueryData("getSkillTests", { skill, page, limit }, (draft: any) => {
            if (!draft?.data) return;
            draft.data = draft.data.filter((t: { id: string }) => t.id !== id);
            if (draft.meta) draft.meta.total = Math.max(0, draft.meta.total - 1);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPoolStatusQuery,
  useGeneratePoolContentMutation,
  useGetSkillTestsQuery,
  useDeleteSkillTestMutation,
} = contentPoolApi;
