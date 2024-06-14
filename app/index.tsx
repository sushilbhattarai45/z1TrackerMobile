import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    let phone = await AsyncStorage.getItem("number");
    if (phone) {
      router.navigate("/screens/trackScreen");
    } else {
      router.navigate("/screens/auth/login");
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
      <Text>Splash Screen</Text>
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
