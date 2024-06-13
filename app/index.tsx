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
} from "react-native";
// import LottieView from "lottie-react-native";
import colors from "./components/colors";
import OtpInputs from "react-native-otp-inputs";

const Login = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [otp, setOtp] = React.useState({
    first: "",
    second: "",
    third: "",
    fourth: "",
  });
  useEffect(() => {
    console.log("OTP", otp.first + otp.second + otp.third + otp.fourth);
  }, [otp]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: colors.red,
          flex: 100,

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
          {/* <LottieView
            source={require("../assets/lottie/bikemoving.json")}
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
            flex: 0.4,
            padding: 20,
            backgroundColor: colors.white,
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
                source={require("../assets/images/flag.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>
            <View
              style={{
                flex: 1,
              }}
            >
              <TextInput
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

                setModalVisible(true);
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
                  We have sent an OTP to this phone number +91 9876543210
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

                    setModalVisible(false);
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

    flex: 1,
    alignItems: "center",
  },
  modalView: {
    margin: 20,
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
