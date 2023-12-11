import { Button, Input, Text } from "@rneui/themed";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { appConfig } from "../shared/config";
import { useSession } from "../shared/context";
import { Session } from "../shared/session";

const LoginScreen = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    isLoading: false,
  });
  const { signIn } = useSession();

  const handleLogin = async () => {
    try {
      setFormState((d) => ({ ...d, isLoading: true }));
      const response = await axios.post<{
        accessToken: string;
        refreshToken: string;
        identityToken: string;
      }>(appConfig.apiBaseUrl + "/api/v1/auth/signin", {
        email: formState.email,
        password: formState.password,
      });

      console.log("User logged in:", response.data.accessToken);
      const session = Session.create({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        identityToken: response.data.identityToken,
      });
      await signIn(session);
      setFormState((d) => ({ ...d, isLoading: false }));
      router.replace("/");
      // Navigate to the home screen or perform any other necessary action
    } catch (error) {
      console.error(error.response.data?.error?.name);
      setFormState((d) => ({ ...d, isLoading: false }));
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ width: "80%" }}>
        <Text>Email:</Text>
        <Input
          value={formState.email}
          keyboardType="email-address"
          onChangeText={(text) => setFormState((d) => ({ ...d, email: text }))}
          placeholder="Enter your email"
        />
        <Text>Password:</Text>
        <Input
          value={formState.password}
          onChangeText={(text) =>
            setFormState((d) => ({ ...d, password: text }))
          }
          secureTextEntry
          placeholder="Enter your password"
        />
        <Button
          title="Login"
          onPress={handleLogin}
          loading={formState.isLoading}
        />
      </View>
    </View>
  );
};

export default LoginScreen;
