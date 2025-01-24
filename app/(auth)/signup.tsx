import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState} from "react";
import { ButtonComponents } from "@/components/Buntton";
import { RadioComponents } from "@/components/Radio";
import { Link} from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/context/AuthContext";

export default function SignUP() {
  const { signupData, setSignupData, handleSignup } = useAuth();

  const handleChange = (name: string, value: string) => {
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSignupData({
        ...signupData,
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
              {signupData.birthday != null
                ? signupData.birthday.toDateString()
                : "Birthday"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={signupData.birthday || new Date()}
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
                setSignupData({
                  ...signupData,
                  sensitive_skin: value,
                })
              }
            />
          </View>
          <ButtonComponents
            onPress={handleSignup}
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
