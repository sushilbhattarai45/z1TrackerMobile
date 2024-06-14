import { StatusBar } from "expo-status-bar";
import { Button, Image, Switch, Text, View } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LOCATION_TASK_NAME = "background-location-task";
import { router } from "expo-router";
import { WebView } from "react-native-webview";
import MapView from "react-native-maps";

import LottieView from "lottie-react-native";
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
              value={status === "started" ? true : false}
              onValueChange={(value) =>
                value ? startLocation() : stopLocation()
              }
            />
          </View>
        </View>

        <View
          style={{
            width: "100%",
            marginTop: 50,
            paddingHorizontal: 6,
            flex: 0.9,
          }}
        >
          <View
            style={{
              flex: 0.2,
              width: "100%",
              height: 100,
              marginTop: 10,
              borderRadius: 10,
              alignContent: "center",
              overflow: "hidden",

              justifyContent: "center",
              backgroundColor: colors.white,
            }}
          >
            {/* <WebView
              style={{
                // borderRadius: 10,
                height: 200,
                position: "static",
                // height: "80%",
                backgroundColor: "white",
              }}
              source={{
                uri: "https://z1nepal.com/wp-content/uploads/2024/05/gif-for-app-banner.gif",
              }}
            /> */}
            {/* <Text
                  style={{
                    fontSize: 18,
                    marginLeft: 6,
                    lineHeight: 25,
                    fontWeight: "bold",
                    color: colors.white,
                    padding: 5,
                  }}
                >
                  Control and Track your Vehicle {"\n"}Seamlessly
                </Text> */}
          </View>
          <View style={{ flex: 1, width: "100%", display: "flex" }}>
            {/* <LottieView
              source={require("../../assets/lottie/bikemoving.json")}
              autoPlay
              loop
              style={{
                position: "absolute",
                zIndex: 1,
                width: "100%",
                height: 100,
              }}
            /> */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 0.5,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 25,
                    fontWeight: "bold",
                    color: colors.grey,
                    padding: 5,
                    marginTop: 10,
                  }}
                >
                  Your Current Location
                </Text>
              </View>
              {/* <View
                style={{
                  flex: 0.5,
                  alignItems: "flex-end",
                }}
              >
                <View
                  style={{
                    zIndex: 2,
                    backgroundColor: colors.driveGreen,
                    height: 18,
                    width: 18,
                    borderRadius: 10,
                    elevation: 5,
                    shadowColor: colors.black,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                  }}
                ></View>
              </View> */}
            </View>
            <View
              style={{
                flex: 0.5,
                marginHorizontal: 6,
                // backgroundColor: colors.red,
                marginTop: 0,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: colors.white,
                  elevation: 5,
                  borderRadius: 5,
                  padding: 10,
                  flexDirection: "column",
                  display: "flex",
                }}
              >
                <View
                  style={{
                    flex: 0.3,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 25,
                        fontWeight: "700",
                        color: colors.black,
                        padding: 5,
                      }}
                    >
                      Identifier: 9846761072{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      alignItems: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        zIndex: 2,
                        backgroundColor: colors.driveGreen,
                        height: 18,
                        width: 18,
                        borderRadius: 10,
                        elevation: 5,
                        shadowColor: colors.black,
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                      }}
                    ></View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 0.7,
                    display: "flex",
                    padding: 5,
                    flexDirection: "column",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="palette-swatch-variant"
                      size={16}
                      color={colors.purple}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        marginLeft: 6,
                        // lineHeight: 25,
                        color: colors.grey,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        Duration{" "}
                      </Text>{" "}
                      : 1 hour 50 minutes{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="time" size={14} color={colors.purple} />

                    <Text
                      style={{
                        fontSize: 13,
                        marginLeft: 6,
                        // lineHeight: 25,
                        color: colors.grey,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        Tracking Started{" "}
                      </Text>
                      : 12:00 PM{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Entypo
                      name="location-pin"
                      size={16}
                      color={colors.purple}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        marginLeft: 6,
                        // lineHeight: 25,
                        color: colors.grey,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        Current Location
                      </Text>{" "}
                      : Kathmandu 10, Nepal{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MaterialIcons
                      name={
                        status === "started"
                          ? "signal-wifi-statusbar-4-bar"
                          : "signal-wifi-statusbar-connected-no-internet-4"
                      }
                      size={16}
                      color={colors.purple}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        marginLeft: 6,
                        // lineHeight: 25,
                        color: colors.grey,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        Status
                      </Text>{" "}
                      :{" "}
                      {status === "started"
                        ? "You are being tracked"
                        : "You are not being tracked"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
                width: "100%",
                height: "40%",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {/* {status === "started" ? (
                <MapView
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                  initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                />
              ) : (
                <MapView
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                  initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                />
              )} */}
            </View>
          </View>

          {/* <Button title="Start" onPress={startLocation} />
          <Button title="Stop" onPress={stopLocation} />
          <Text>Status: {status}</Text> */}
          <StatusBar style="auto" />

          {/* <Button
            title="Logout"
            onPress={async () => {
              stopLocation();
              await AsyncStorage.removeItem("number");
              router.push("/screens/auth/login");
            }}
          /> */}
        </View>
      </View>
    </View>
  );
}
