import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { appConfig } from "../shared/config";
import { useSession } from "../shared/context";
import { Session } from "../shared/session";

const axiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 1000,
});

const useAxios = () => {
  const { session, signIn, signOut, isLoading } = useSession();
  const [isRefreshing, setRefreshing] = useState(false);

  /* const [axiosInstance] = useState<AxiosInstance>( */
  /*   axios.create({ */
  /*     baseURL: appConfig.apiBaseUrl, */
  /*     timeout: 1000, */
  /*   }), */
  /* ); */

  useEffect(() => {
    axiosInstance.interceptors.request.use(
      async (config) => {
        // Modify the request config if needed (e.g., add headers)
        // For example, you might want to add an authorization header with the access token.
        const accessToken = session.accessToken;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    axiosInstance.interceptors.response.use(
      (response) => {
        // If the response is successful, return it
        return response;
      },
      async (error) => {
        // If the response status is 401, try to refresh the access token
        if (error.response && error.response.status === 401) {
          if (!isRefreshing && !isLoading) {
            try {
              setRefreshing(true);
              const newTokens = await axios.post(
                appConfig.apiBaseUrl + "/api/v1/auth/refresh",
                {
                  refreshToken: session.refreshToken,
                },
              );
              const newSession = Session.create({
                accessToken: newTokens.data.accessToken,
                refreshToken: session.refreshToken,
                identityToken: newTokens.data.identityToken,
              });
              await signIn(newSession);
              // If the token refresh is successful, retry the original request with the new token
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${newTokens}`;
              return axiosInstance(originalRequest);
            } catch (refreshError) {
              // If token refresh fails, you might want to redirect to the login page or handle it appropriately
              console.error("Token refresh failed:", refreshError);
              // For now, let's just log the error and return the original error
              signOut();
              router.replace("/login");
              return Promise.reject(error);
            } finally {
              setRefreshing(false);
            }
          }
        }
        // If it's not a 401 error, just return the error
        return Promise.reject(error);
      },
    );
    return;
  }, [axiosInstance, router]);

  return axiosInstance;
};

export default useAxios;
