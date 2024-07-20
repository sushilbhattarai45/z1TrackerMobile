import React, { useRef, useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  BackHandler,
  Alert,
  Image,
  Modal,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import * as Battery from "expo-battery";

// import LottieView from "lottie-react-native";
import colors from "./components/colors";
import { sendSms } from "./components/hitApi";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import * as Updates from "expo-updates";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  startActivityAsync,
  ActivityAction,

  //  ActivityType
} from "expo-intent-launcher";
import * as Location from "expo-location";

//The main purpose of the app is to enable users to share their location seamlessly.
// The app need to access background location so that the app can track the person even after the app is closed or terminated. All the functionalities are clear and transparent and we ask every possible permissions from the users.

const Login = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    Alert.alert(
      "Important Notice",
      "The app uses background location to track the location of the user even when the app is closed if you start the tracking from the app. Please enable the location permission and battery optimization to use the app seamlessly.",

      [
        {
          text: "Cancel",
          onPress: () => {
            Updates.reloadAsync();
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const { status } =
              await Location.requestForegroundPermissionsAsync();

            checkLogin();
          },
        },
      ]
    );
    async function checkLogin() {
      let powerState = await Battery.isBatteryOptimizationEnabledAsync();

      if (powerState) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Battery Restriction",
          text2:
            "Please turn off the battery restriction mode to continue using the app",
          visibilityTime: 5000,
          autoHide: true,
        });
        Alert.alert(
          "Battery Restriction",
          "Please turn off the battery restriction mode and reload the app to continue using the app",
          [
            {
              text: "OK",
              onPress: async () => {
                await startActivityAsync(
                  ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS
                );
                let powerState =
                  await Battery.isBatteryOptimizationEnabledAsync();
                console.log("mystate" + powerState);

                Updates.reloadAsync();
              },
            },
          ]
        );
      } else {
        let phone = await AsyncStorage.getItem("number");
        if (phone) {
          setTimeout(() => {
            router.push("/(drawer)/trackScreen");
          }, 4000);
        } else {
          setTimeout(() => {
            router.push("/screens/auth/login");
          }, 4000);
        }
      }
    }
  }, [count]);

  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        console.log(`Error fetching latest Expo update: ${error}`);
      }
    }
    onFetchUpdateAsync();
  }, []);
  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          display: "flex",
          width: "100%",
          backgroundColor: colors.white,
        }}
      >
        <View
          style={{
            flex: 0.7,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View>
            <Image
              source={require("../assets/images/z1-01.png")}
              style={{
                resizeMode: "contain",
                width: 250,
                height: 100,
                alignSelf: "center",
                marginTop: 50,
              }}
            />
          </View>
          <View>
            <Text
              style={{
                color: colors.grey,
                fontSize: 12,
                textAlign: "center",
                fontWeight: "bold",
                // marginTop: 20,
              }}
            >
              {/* Track Your Vehicles and Closed Ones Seamlessly */}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.3,
            display: "flex",
            alignContent: "center",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <LottieView
            source={require("../assets/lottie/loadLottie.json")}
            autoPlay
            loop
            style={{ width: 50, height: 50 }}
          />

          <View>
            <Text
              style={{
                color: colors.grey,
                fontSize: 12,
                textAlign: "center",
                fontWeight: "bold",
                // marginTop: 20,
              }}
            >
              A Product of Z1 Technologies & Trade Pvt. Ltd.{"\n"}
              <Text
                style={{
                  color: colors.driveGreen,

                  // marginTop: 20,
                }}
              >
                Client App
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignSelf: "center",

    alignItems: "center",
  },
  modalView: {
    margin: 20,
    marginTop: Dimensions.get("window").height / 5,
    width: Dimensions.get("window").width - 50,
    height: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Login;
