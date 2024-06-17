import React, { useRef, useEffect } from "react";
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
// import LottieView from "lottie-react-native";
import colors from "./components/colors";
import { sendSms } from "./components/hitApi";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    let phone = await AsyncStorage.getItem("number");
    if (phone) {
      setTimeout(() => {
        router.push("/screens/trackScreen");
      }, 4000);
    } else {
      setTimeout(() => {
        router.push("/screens/auth/login");
      }, 4000);
    }
  }
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
              Control and Track Your Vehicle Seamlessly
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
