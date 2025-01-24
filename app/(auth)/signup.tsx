import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ButtonComponents } from "@/components/Buntton";
import { RadioComponents } from "@/components/Radio";
import { Link, useRouter } from "expo-router";
import { ISignUp } from "@/interface/user";
import { axiosInstance } from "@/lib/axios_instance";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";

export default function SignUP() {
  const [data, setData] = useState<ISignUp>({
    full_name: "",
    birthday: null,
    email: "",
    password: "",
    sensitive_skin: false,
  });

  const handleChange = (name: string, value: string) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  const router = useRouter();

  const handleSubmit = async () => {
    await axiosInstance
      .post("/user/register", data)
      .then(async (res) => {
        if (res.status === 201) {
          router.push("/login");
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setData({
        ...data,
        birthday: selectedDate,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-y-4">
      <Text className="text-6xl font-bold">Create Your Account</Text>
      <View className="container mx-auto px-16">
        <View className="flex flex-col gap-y-8">
          <TextInput
            placeholder="Full name"
            className=" border-2  w-full rounded-full p-6 border-BrightGray"
            onChangeText={(full_name) => handleChange("full_name", full_name)}
          />

          <TouchableOpacity
            className="border-2  w-full rounded-full p-6 border-BrightGray"
            onPress={showDatePickerModal}
          >
            <Text>
              {data.birthday != null
                ? data.birthday.toDateString()
                : "Birthday"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={data.birthday || new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <TextInput
            placeholder="Email"
            className=" border-2  w-full rounded-full p-6 border-BrightGray"
            onChangeText={(email) => handleChange("email", email)}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            className=" border-2  w-full rounded-full p-6 border-BrightGray"
            onChangeText={(password) => handleChange("password", password)}
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={true}
            className=" border-2  w-full rounded-full p-6 border-BrightGray"
          />
          <View className="flex flex-col gap-y-4">
            <Text>Do you have sensitive facial skin?</Text>
            <RadioComponents
              setValue={(value: boolean) =>
                setData({
                  ...data,
                  sensitive_skin: value,
                })
              }
            />
          </View>
          <ButtonComponents
            onPress={handleSubmit}
            title="Register"
            className="flex flex-row items-center justify-center rounded-full border-4 border-BrightGray p-6 bg-Bittersweet"
            textSize="text-white text-xl font-bold"
          />
        </View>
      </View>
      <Link href="/login" className=" text-center text-Quartz font-bold ">
        Already Have an account ?<Text className="text-black"> Login</Text>
      </Link>
    </SafeAreaView>
  );
}
