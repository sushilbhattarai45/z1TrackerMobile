import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
} from "react-native";

const Login = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "red",
          flex: 1,

          display: "flex",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            backgroundColor: "red",
            flex: 0.6,
          }}
        >
          <Text>Hello</Text>
        </View>

        <View
          style={{
            flex: 0.4,
            padding: 20,
            backgroundColor: "white",
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
                color: "gray",
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
              }}
            >
              We will send you a One Time Password to the number!
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
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
                  marginLeft: 10,
                  height: 50,
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
                color: "gray",
              }}
            >
              By continuing, you are indicating that you agree to the Terms and
              Conditions and Privacy Policy
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
            }}
          >
            <Pressable
              style={{
                backgroundColor: "#243142",
                padding: 10,
                height: 52,
                marginTop: 10,
                marginHorizontal: 10,
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
    </View>
  );
};

const styles = StyleSheet.create({});

export default Login;
