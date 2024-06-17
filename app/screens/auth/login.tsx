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
  StatusBar as StatusBarComponent,
  KeyboardAvoidingView,
} from "react-native";
// import LottieView from "lottie-react-native";
import colors from "../../components/colors";
import { sendSms } from "../../components/hitApi";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import SvgComponent from "@/app/components/svg/loginSvg";
import { StatusBar } from "expo-status-bar";
const Login = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [number, setNumber] = React.useState<string>("");
  const [otp, setOtp] = React.useState({
    first: "",
    second: "",
    third: "",
    fourth: "",
  });
  const [sentOtp, setSentOtp] = React.useState<string | null>(null);
  useEffect(() => {
    console.log("OTP", otp.first + otp.second + otp.third + otp.fourth);
  }, [otp]);

  async function validateNumber() {
    console.log("Number", number);
    if (number.length === 10) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "OTP Sent Successfully",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });

      let { success, sendOtp } = await sendSms({ phone: number });
      console.log("OTP", sendOtp);
      if (success) {
        sendOtp.toString();
        setSentOtp(sendOtp);
        setModalVisible(true);
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "OTP Not Sent! Incorrect Phone Number",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
      }
      console.log("OTP", otp);
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please Enter a valid Number",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }
  }
  async function validateOtp() {
    console.log("OTP", otp.first + otp.second + otp.third + otp.fourth);
    let otpValue = otp.first + otp.second + otp.third + otp.fourth;
    if (otpValue == sentOtp) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "OTP Verified Successfully",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
      setModalVisible(false);
      await AsyncStorage.setItem("number", number);
      router.push("/screens/trackScreen");
      // await AsyncStorage.setItem("number", number);
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "OTP Verification Failed",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }
  }
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar backgroundColor={colors.black} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: colors.white,
            flex: 1,

            display: "flex",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              flex: 0.6,
            }}
          >
            <Image
              source={require("../../../assets/images/z1-01.png")}
              style={{
                alignSelf: "center",
                resizeMode: "contain",
                width: 200,
                height: 60,
                marginTop: 50,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: colors.grey,
                fontWeight: "900",
                textAlign: "center",
              }}
            >
              Control and Track Your Vehicle Seamlessly
            </Text>
            <SvgComponent />
            <Text
              style={{
                fontSize: 14,
                color: colors.grey,
                fontWeight: "900",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Please Login to Z1 Tracker Client App
            </Text>
            {/* <LottieView
              source={require("../../../assets/lottie/loginLottie.json")}
              autoPlay
              loop
              style={{
                width: 300,
                height: 300,
                alignSelf: "center",
              }}
            /> */}
          </View>

          <View
            style={{
              opacity: modalVisible ? 0.8 : 1,
              flex: 0.4,
              elevation: 3,

              shadowColor: colors.driveGreen,
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 1,
              shadowRadius: 4,

              padding: 20,
              // backgroundColor: colors.white,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            <View
              style={{
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: colors.darkGrey,
                  fontWeight: "900",
                }}
              >
                Let the Tracking Journey {"\n"}Begin!!
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.grey,
                  fontWeight: "600",
                }}
              >
                Enter your Phone Number{" "}
              </Text>
            </View>
            <View
              style={
                {
                  //   marginTop: 10,
                }
              }
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "gray",
                  fontWeight: "500",
                }}
              >
                We will send you a One Time Password to the number!
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 5,
                  borderColor: "gray",
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",

                  padding: 10,
                }}
              >
                <Image
                  source={require("../../../assets/images/flag.png")}
                  style={{ width: 30, height: 30 }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <TextInput
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={(value) => {
                    setNumber(value);
                  }}
                  style={{
                    marginLeft: 5,
                    height: 55,
                    borderColor: "gray",
                    borderWidth: 1,
                    padding: 10,
                    paddingLeft: 20,
                    borderRadius: 10,
                  }}
                  placeholder="Enter your Phone Number"
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.grey,
                }}
              >
                By continuing, you are indicating that you agree to the
                <Text
                  style={{
                    color: colors.driveGreen,
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  Terms and Conditions and Privacy Policy
                </Text>
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
              }}
            >
              <Pressable
                onPress={() => {
                  console.log("Hello");
                  validateNumber();
                }}
                style={{
                  backgroundColor: "#243142",
                  padding: 10,
                  height: 52,
                  marginTop: 10,
                  marginHorizontal: 5,
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  Continue
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flex: 0.3,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.black,
                    fontWeight: "800",
                  }}
                >
                  Enter the OTP
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 10,
                    color: colors.grey,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  We have sent an OTP to this phone number +977 {number}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flex: 0.4,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 0.2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    value={otp.first}
                    maxLength={1}
                    onChangeText={(value) => {
                      setOtp({
                        ...otp,
                        first: value,
                      });
                      if (value.length > 0) {
                        this.secondInput.focus();
                      }
                    }}
                    keyboardType="numeric"
                    style={{
                      height: 55,
                      borderColor: "gray",
                      borderWidth: 1,
                      padding: 10,
                      paddingLeft: 20,
                      borderRadius: 10,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 0.2,
                    marginLeft: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    value={otp.second}
                    ref={(input) => {
                      this.secondInput = input;
                    }}
                    onChangeText={(value) => {
                      setOtp({
                        ...otp,
                        second: value,
                      });
                      if (value.length > 0) {
                        this.thirdInput.focus();
                      }
                    }}
                    maxLength={1}
                    keyboardType="numeric"
                    style={{
                      height: 55,
                      borderColor: "gray",
                      borderWidth: 1,
                      padding: 10,
                      paddingLeft: 20,
                      borderRadius: 10,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 0.2,
                    marginLeft: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    value={otp.third}
                    ref={(input) => {
                      this.thirdInput = input;
                    }}
                    onChangeText={(value) => {
                      setOtp({
                        ...otp,
                        third: value,
                      });

                      if (value.length > 0) {
                        this.lastInput.focus();
                      }
                    }}
                    maxLength={1}
                    keyboardType="numeric"
                    style={{
                      height: 55,
                      borderColor: "gray",
                      borderWidth: 1,
                      padding: 10,
                      paddingLeft: 20,
                      borderRadius: 10,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 0.2,
                    marginLeft: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    value={otp.fourth}
                    ref={(input) => {
                      this.lastInput = input;
                    }}
                    onChangeText={(value) => {
                      setOtp({
                        ...otp,
                        fourth: value,
                      });
                      if (value.length > 0) {
                        // this.nextInput.focus();
                      }
                    }}
                    maxLength={1}
                    keyboardType="numeric"
                    style={{
                      height: 55,
                      borderColor: "gray",
                      borderWidth: 1,
                      padding: 10,
                      paddingLeft: 20,
                      borderRadius: 10,
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flex: 0.3,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pressable
                  onPress={() => {
                    console.log("Hello");
                    validateOtp();
                  }}
                  style={{
                    backgroundColor: "#243142",
                    padding: 10,
                    width: "90%",
                    height: 52,
                    marginTop: 10,
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                    }}
                  >
                    Verify
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
