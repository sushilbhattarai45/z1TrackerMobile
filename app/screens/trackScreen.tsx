import { StatusBar } from "expo-status-bar";
import { Button, Image, Switch, Text, View } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LOCATION_TASK_NAME = "background-location-task";
import { router } from "expo-router";
import colors from "../components/colors";
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  ({ data, error }: { data: any; error: any }) => {
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      const { locations } = data;
      console.log(locations[0]);
      sendMyLocation({
        locations: locations[0],
      });
      // sendPostRequest(locations[0]);
    }
  }
);

const sendMyLocation = async (data: { locations: any }) => {
  try {
    let num = await AsyncStorage.getItem("number");
    const resp = await axios.get(
      process.env.EXPO_PUBLIC_URL +
        "?lat=" +
        data.locations.coords.latitude +
        "&lon=" +
        data.locations.coords.longitude +
        "&timestamp=" +
        Date.now() +
        "&id=" +
        num
    );
    console.log(resp.status);
  } catch (err) {
    console.error(err);
  }
};

// const sendPostRequest = async (data: unknown) => {
//   try {
//     console.log(data);
//     const resp = await axios.post("http://domain:3001/api/gps/", {
//       latitude: data.coords.latitude,
//       longitude: data.coords.longitude,
//       speed: "im samsung",
//     });
//     console.log(resp.data);
//   } catch (err) {
//     console.error(err);
//   }
// };

export default function App() {
  const [status, setStatus] = useState("stopped");

  useEffect(() => {
    checkRegistry();
    requestPermissionsAsync();

    // return () => {
    //   Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    // };
  }, []);

  async function checkRegistry() {
    console.log(await AsyncStorage.getItem("number"));
    console.log(await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME));

    setStatus(
      (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME))
        ? "started"
        : "stopped"
    );
  }
  const requestPermissionsAsync = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === "granted") {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === "granted") {
        console.log("permission granted");
      }
    }
  };

  const startLocation = async () => {
    console.log("start location");
    setStatus("started");
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      timeInterval: 500,
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 1,
      deferredUpdatesInterval: 0,
      foregroundService: {
        notificationTitle: "GPS",
        notificationBody: " enabled",
        notificationColor: "#0000FF",
      },
    });
  };

  const stopLocation = async () => {
    setStatus("stopped");
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: 50,
            marginTop: 30,
            borderBottomWidth: 0.4,
            borderBottomColor: colors.grey,

            alignItems: "center",
            display: "flex",
            padding: 15,
            flexDirection: "row",
            backgroundColor: colors.white,
          }}
        >
          <View
            style={{
              flex: 0.3,
              // backgroundColor: colors.red,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Image
              source={require("../../assets/images/z1-01.png")}
              style={{
                width: "100%",
                objectFit: "contain",
                height: 30,
              }}
            />
          </View>
          <View
            style={{
              height: "100%",
              flex: 0.7,
              justifyContent: "flex-end",
              display: "flex",
              flexDirection: "row",
              // backgroundColor: colors.red,
              alignContent: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: colors.darkGrey,
              }}
            >
              Track
            </Text>

            <Switch
              style={{
                alignSelf: "center",
              }}
              value={status === "started"}
              onValueChange={(value) =>
                value ? startLocation() : stopLocation()
              }
            />
          </View>
        </View>
      </View>

      <Button title="Start" onPress={startLocation} />
      <Button title="Stop" onPress={stopLocation} />
      <Text>Status: {status}</Text>
      <StatusBar style="auto" />

      <Button
        title="Logout"
        onPress={async () => {
          stopLocation();
          await AsyncStorage.removeItem("number");
          router.push("/screens/auth/login");
        }}
      />
    </View>
  );
}
