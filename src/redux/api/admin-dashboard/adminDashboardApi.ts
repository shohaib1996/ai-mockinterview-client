import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardData: builder.query({
      query: () => ({
        url: "/admin-dashboard",
        method: "GET",
      }),
      providesTags: [tagTypes.AdminDashboard],
    }),
  }),
});

export const {
  useGetAdminDashboardDataQuery,
} = adminDashboardApi;
