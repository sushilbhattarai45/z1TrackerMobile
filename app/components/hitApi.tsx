import React from "react";
import { StyleSheet, View } from "react-native";
import axios from "axios";
type SendSmsProps = {
  phone: string;
};
export const sendSms = async ({ phone }: SendSmsProps) => {
  console.log("Phone", phone);
  try {
    let otp = Math.floor(1000 + Math.random() * 9000);
    let url = "https://api.sparrowsms.com/v2/sms";
    let params = {
      token: process.env.EXPO_PUBLIC_SPARROW_KEY,
      from: "TheAlert",
      to: phone,
      text: "This is your One Time password.\n" + otp,
    };
    let sendData = await axios.get(url, {
      params: params,
    });
    console.log(sendData.data);

    return {
      success: true,
      sendOtp: otp,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      sendOtp: null,
    };
  }
};

export const ReverseGeoCode = async ({
  lat,
  long,
}: {
  lat: string;
  long: string;
}) => {
  let adress = [];
  // console.log("Lat, Long", lat, long);
  // console.log(data._j.map((vehicleData) => vehicleData?.latitude));      let url =
  let url =
    "https://route-init.gallimap.com/api/v1/reverse/generalReverse?accessToken=" +
    process.env.EXPO_PUBLIC_GALLIMAPKEY +
    "&lat=" +
    lat +
    "&lng=" +
    long;
  try {
    let reversedata = await axios.get(url);
    let address = await reversedata.data.data.generalName;

    return address;
    // console.log(reversedata.data);
    // setAddress(reversedata.data);
  } catch (e) {
    console.log(e);
  }
};
