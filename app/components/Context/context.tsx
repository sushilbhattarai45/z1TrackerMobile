import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState, useEffect, useContext, createContext } from "react";
import { StyleSheet, View } from "react-native";
const AppContext = createContext({});
export const ContextProvider = ({ children }: { children: any }) => {
  const [logged, setLogged] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [hasCompany, setHasCompany] = useState<boolean>(false);

  const [companyInfo, setCompanyInfo] = useState<any>(null);
  let url = "http://103.90.86.173:3000/api/";
  useEffect(() => {
    async function CheckLoggedIn() {
      let phone = await AsyncStorage.getItem("number");
      console.log(phone);
      if (phone) {
        setLogged(true);
        setPhone(phone);

        getDeviceId({ phone });
      } else {
        console.log("Not Logged In");
      }
    }

    async function getDeviceId({ phone }: { phone: string | null }) {
      let fetchAllDevices = await axios.get(
        process.env.EXPO_PUBLIC_SECONDARY_URL + "devices"
      );
      console.log(phone + "hello");
      const device = fetchAllDevices.data.find(
        (device: any) => device.uniqueid == phone
      );
      if (device) {
        setDeviceId(device.id);
        console.log(device);
        setHasCompany(true);
        getCompany({ id: device.id });
      }
    }

    async function getCompany({ id }: { id: string | null }) {
      let fetchCompany = await axios.get(
        process.env.EXPO_PUBLIC_SECONDARY_URL + "usersdevice"
      );

      let company = fetchCompany.data.find(
        (company: any) => company.deviceid == id
      );
      console.log(company);
      if (company) {
        setHasCompany(true);
        getCompanyInfo({ id: company.userid });
      }
    }

    async function getCompanyInfo({ id }: { id: string | null }) {
      let fetchCompanyInfo = await axios.get(
        process.env.EXPO_PUBLIC_SECONDARY_URL + "users"
      );
      let companyInfo = fetchCompanyInfo.data.find(
        (companyInfo: any) => companyInfo.id == id
      );
      console.log(companyInfo);
      if (companyInfo) {
        setCompanyInfo(companyInfo);
      }
    }

    CheckLoggedIn();
  }, []);

  const name = "John Doe";
  return (
    <AppContext.Provider
      value={{
        name,

        logged,
        setLogged,
        phone,
        setPhone,
        hasCompany,
        companyInfo,
        setCompanyInfo,
        deviceId,
        setDeviceId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
