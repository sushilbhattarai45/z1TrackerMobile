import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Button,
  Image,
  Pressable,
  Switch,
  Text,
  ScrollView,
  View,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "expo-router";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { useEffect, useState, useContext } from "react";
import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AppContext from "../components/Context/context";
import * as Updates from "expo-updates";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { WebView } from "react-native-webview";
import moment from "moment";
import MapView, { Marker } from "react-native-maps";
import NetInfo from "@react-native-community/netinfo";

import LottieView from "lottie-react-native";
import colors from "../components/colors";
import { ReverseGeoCode } from "../components/hitApi";
import Toast from "react-native-toast-message";
const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data, error }: { data: any; error: any }) => {
    console.log("Task Defined");
    if (error) {
      console.log(error);
      return;
    }
    const { locations } = data;
    console.log("Location Task");
    console.log(locations[0]);
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected && state.isInternetReachable) {
        let inStack = await AsyncStorage.getItem("inSTACK");
        if (inStack === "true") {
          let stack = await AsyncStorage.getItem("stackedLocations");
          if (stack) {
            // stackLocation(locations[0]);
            let data = JSON.parse(stack);
            await Promise.all(
              data.map(async (address: any) => {
                try {
                  await sendMyLocation({
                    locations: JSON.parse(address),
                  });
                } catch (err) {
                  console.log(err);
                }
              })
            );
          }

          await AsyncStorage.removeItem("stackedLocations");
        } else {
          console.log("I am here");
          try {
            sendMyLocation({
              locations: locations[0],
            });
          } catch (err) {
            console.log(err);
          }
        }

        try {
          sendMyLocation({
            locations: locations[0],
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        stackLocation(locations[0]);
      }
    });
  }
);
const stackLocation = async (data: any) => {
  await AsyncStorage.setItem("inSTACK", "true");
  console.log("Stacking location");
  let num = await AsyncStorage.getItem("number");
  let stack = await AsyncStorage.getItem("stackedLocations");
  // alert(JSON.parse(stack));
  if (stack) {
    let newData = JSON.parse(stack);
    // alert(JSON.stringify(data));
    newData.push(JSON.stringify(data));
    await AsyncStorage.setItem("stackedLocations", JSON.stringify(newData));
  } else {
    let stack = [];
    stack.push({
      data,
    });
    await AsyncStorage.setItem("stackedLocations", JSON.stringify(stack));
  }
};

const sendMyLocation = async (data: { locations: any }) => {
  try {
    console.log("Sending location");
    let num = await AsyncStorage.getItem("number");
    console.log(num);
    console.log(
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
    Promise.resolve();

    console.log(resp.status);

    await AsyncStorage.setItem("lastLocation", JSON.stringify(data.locations));
  } catch (err) {
    console.error(err);
  }
};

export default function App() {
  interface contextData {
    hasCompany: boolean;
    logged: boolean;
    setLogged: any;
    companyInfo: any;
  }

  const { hasCompany, companyInfo, logged, setLogged } = useContext(
    AppContext
  ) as contextData;
  const [status, setStatus] = useState("stopped");
  const [bgPermission, requestBgPermission] =
    Location.useBackgroundPermissions();
  const [Identifier, setIdentifier] = useState<string | null>("");
  const [fgPermission, requestFgPermission] =
    Location.useForegroundPermissions();
  const [startTime, setStartTime] = useState<string | null>("");
  const [myNamedLocation, setMyNamedLocation] = useState<string | null>("");
  const [locationServicesEnabled, setLocationServicesEnabled] =
    useState<boolean>(false);
  false;
  const [currentCoords, setCurrentCoords] = useState({
    latitude: 0,
    longitude: 0,
  } as any);
  useEffect(() => {
    checkRegistry();
    requestPermissionsAsync();
    // return () => {
    //   Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    // };
  }, []);
  useFocusEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  });
  useEffect(() => {
    getStoredLocation();
    let lastLocation = AsyncStorage.getItem("lastLocation");
    AsyncStorage.getItem("lastLocation").then((data) => {
      if (data) {
        setCurrentCoords({
          latitude: JSON.parse(data).coords.latitude,
          longitude: JSON.parse(data).coords.longitude,
        });
        callGalliMapApi();
      }
    });
  }, [currentCoords?.latitude, currentCoords?.longitude]);

  async function getStoredLocation() {
    const lastLocation = await AsyncStorage.getItem("lastLocation");
    if (lastLocation) {
      setCurrentCoords({
        latitude: JSON.parse(lastLocation).coords.latitude,
        longitude: JSON.parse(lastLocation).coords.longitude,
      });
      callGalliMapApi();
    }
    // console.log(currentCoords);
  }

  async function callGalliMapApi() {
    ReverseGeoCode({
      lat: currentCoords.latitude,
      long: currentCoords.longitude,
    }).then((data) => {
      // console.log(data);
      setMyNamedLocation(data);
    });
  }
  async function checkRegistry() {
    let num = await AsyncStorage.getItem("number");
    console.log(await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME));
    if (num) {
      setIdentifier(num);
    }

    setStatus(
      (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME))
        ? "started"
        : "stopped"
    );
    checkIfLocationEnabled();
  }
  const requestPermissionsAsync = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === "granted") {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === "granted") {
        if (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)) {
          // startLocation();
          await Location.enableNetworkProviderAsync();
          // await Updates.reloadAsync();
        }
        console.log("permission granted");
      }
    }
  };

  const checkIfLocationEnabled = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    requestBgPermission();
    requestFgPermission();
    setLocationServicesEnabled(false); //store false into state
    requestPermissionsAsync();
    // console.log(await Location.isAndroidBackgroundLocationEnabled());
    let enabled = await Location.hasServicesEnabledAsync();
    await Location.enableNetworkProviderAsync();
    console.log(enabled + "here"); //returns true or false
    if (enabled === false) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Location Services Disabled",
        text2: "Please enable location!",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });

      // setLocationServicesEnabled(true); //store true into state
    } else {
      setLocationServicesEnabled(true);
      Toast.show({
        type: "success",
        position: "top",
        text1: "Location Services Enabled",
        text2: "You can now start",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
      // startLocation();
      //store true into state
    }
  };

  const startLocation = async () => {
    // findStartTime();

    setStatus("started");
    console.log("Starting Location");

    // await AsyncStorage.setItem("startTime", Date.now().toString());
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      timeInterval: 2000,
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 1,
      deferredUpdatesInterval: 0,
      foregroundService: {
        notificationTitle: "GPS",
        notificationBody: " enabled",
        notificationColor: "#0000FF",
      },
    });
    Toast.show({
      type: "success",
      position: "top",
      text1: "Started",
      text2: "The app will reload",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
    setTimeout(async () => {
      await Updates.reloadAsync();
    }, 3000);
  };

  const stopLocation = async () => {
    await AsyncStorage.removeItem("lastLocation");
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
        <ScrollView
          style={{
            flex: 1,

            width: "100%",
            height: "100%",
          }}
        >
          <View
            style={{
              top: 0,
              flex: 0.1,
              width: "100%",
              height: 50,
              marginTop: 0,
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
                  Alert.alert(
                    "Hold on!",
                    "Are you sure you want to " +
                      (value ? "start" : "stop") +
                      " tracking?",

                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () =>
                          value ? startLocation() : stopLocation(),
                      },
                    ]
                  )
                }
              />
            </View>
          </View>

          <View
            style={{
              paddingBottom: 30,

              width: "100%",
              paddingHorizontal: 6,
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 0.2,
                width: "100%",
                height: 120,
                marginTop: 10,
                borderRadius: 10,
                alignContent: "center",
                overflow: "hidden",

                justifyContent: "center",
                backgroundColor: colors.white,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignSelf: "center",
                  borderRadius: 10,
                  overflow: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 5,
                  shadowColor: colors.black,
                  backgroundColor: colors.white,
                }}
              >
                <View
                  style={{
                    width: "95%",
                    height: "90%",
                    alignSelf: "center",
                    borderRadius: 10,
                    overflow: "hidden",
                    justifyContent: "center",
                    // alignItems: "center",
                    elevation: 5,
                    shadowColor: colors.black,
                    backgroundColor: colors.white,
                  }}
                >
                  <View
                    style={{
                      padding: 10,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 25,
                          fontWeight: "bold",
                          color: colors.black,
                          padding: 5,
                        }}
                      >
                        You are being Tracked By
                      </Text>
                    </View>
                    <View
                      style={{
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
                        <Ionicons name="time" size={14} color={colors.purple} />

                        <Text
                          style={{
                            fontSize: 13,
                            marginLeft: 6,
                            // lineHeight: 25,
                            fontWeight: "bold",
                            color: colors.grey,
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "600",
                            }}
                          >
                            Name{" "}
                          </Text>
                          : {hasCompany ? companyInfo?.name : "Not Started"}{" "}
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
                          numberOfLines={1}
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
                            Contact
                          </Text>{" "}
                          : {hasCompany ? companyInfo?.phone : "Not Available"}
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
                          : {status === "started" ? "Started" : "Not Started"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
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
                  flex: 0.5,
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
                        Identifier: {Identifier || "Not Available"}
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
                          backgroundColor:
                            status === "started"
                              ? colors.driveGreen
                              : colors.red,
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
                    {/* <View
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
                  </View> */}
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
                        : {status == "started" ? "Started" : "Not Started"}{" "}
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
                        numberOfLines={1}
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
                        :{" "}
                        {status === "started"
                          ? myNamedLocation || "Loading Address..."
                          : "Not Tracking"}
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
                        : {status === "started" ? "Started" : "Not Started"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginTop: 20,
                  flex: 1,
                  height: 300,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                {currentCoords?.latitude ? (
                  <MapView
                    scrollEnabled={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                    initialRegion={{
                      latitude: currentCoords.latitude,
                      longitude: currentCoords.longitude,
                      latitudeDelta: 0.00922,
                      longitudeDelta: 0.00421,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: currentCoords.latitude,
                        longitude: currentCoords.longitude,
                      }}
                      title="You are here"
                      description="Your current location"
                    />
                  </MapView>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 10,
                      overflow: "hidden",
                      backgroundColor: colors.white,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <LottieView
                      source={require("../../assets/lottie/bikemoving.json")}
                      autoPlay
                      loop
                      style={{
                        width: "50%",
                        height: "50%",
                      }}
                    />
                    <Text
                      style={{
                        color: colors.grey,
                        fontSize: 14,
                        marginTop: 10,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      You will see the map here when we are ready.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* <Button title="Start" onPress={startLocation} />
          <Button title="Stop" onPress={stopLocation} />
          <Text>Status: {status}</Text> */}
            <StatusBar style="auto" />
            <Pressable
              style={{
                backgroundColor: colors.purple,
                justifyContent: "center",
                alignItems: "center",
                height: 55,
                padding: 10,
                borderRadius: 6,
                marginTop: 20,
              }}
              onPress={async () => {
                Alert.alert("Hold on!", "Are you sure you want to logout?", [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: async () => {
                      await AsyncStorage.removeItem("number");
                      await AsyncStorage.removeItem("startTime");
                      await AsyncStorage.removeItem("lastLocation");
                      setLogged(false);
                      stopLocation();
                      Toast.show({
                        type: "success",
                        position: "top",
                        text1: "Logout",
                        text2: "You have been logged out",
                        visibilityTime: 2000,
                        autoHide: true,
                        topOffset: 30,
                        bottomOffset: 40,
                      });
                      setTimeout(() => {
                        router.push("/screens/auth/login");
                      }, 2000);
                      router.push("/screens/auth/login");
                    },
                  },
                ]);
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Logout
              </Text>
            </Pressable>
            {/* <Button
            title="Logout"
            onPress={async () => {
              stopLocation();
              await AsyncStorage.removeItem("number");
              router.push("/screens/auth/login");
            }}
          /> */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
