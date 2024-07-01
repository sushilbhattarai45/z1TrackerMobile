import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { View, Text } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, marginTop: 30 }}>
      <StatusBar style="auto" />
      <Drawer>
        <Drawer.Screen
          name="trackScreen"
          options={{
            headerShown: false,
            drawerLabel: "Track",
            title: "Track Screen",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
