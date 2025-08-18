import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const userDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboardData: builder.query({
      query: () => ({
        url: "/dashboard/user",
        method: "GET",
      }),
      providesTags: [tagTypes.UserDashboard],
    }),
  }),
});

export const {
  useGetUserDashboardDataQuery,
} = userDashboardApi;
