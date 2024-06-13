import { StatusBar } from "expo-status-bar";
import { Button, Text, View } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import axios from "axios";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log(locations[0]);
    // sendPostRequest(locations[0]);
  }
});

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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Start" onPress={startLocation} />
      <Button title="Stop" onPress={stopLocation} />
      <Text>Status: {status}</Text>
      <StatusBar style="auto" />
    </View>
  );
}
