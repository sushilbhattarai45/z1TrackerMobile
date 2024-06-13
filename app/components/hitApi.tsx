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
