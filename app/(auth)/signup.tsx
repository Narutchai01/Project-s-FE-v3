import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { ButtonComponents } from "@/components/Buntton";
import { RadioComponents } from "@/components/Radio";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { DatePicker } from "@/components/DatePicker";
import dayjs from "dayjs";

export default function SignUP() {
  const { signupData, setSignupData, handleSignup } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name: string, value: string) => {
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-Snow p-4">
              <ScrollView>
                <View className="ml-6 mt-6">
      <Text className="text-5xl font-bold">Create Your Account</Text>
      </View>
      <View className="container mx-auto px-6">
        <View className="flex flex-col gap-y-8 mt-4 w-full flex gap-10">
          <TextInput
            placeholder="Full name"
            className="border-2 w-full rounded-full p-4 border-BrightGray"
            onChangeText={(full_name) => handleChange("full_name", full_name)}
          />

          <TouchableOpacity
            className="border-2 w-full rounded-full p-4 border-BrightGray"
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {signupData.birthday != null
                ? dayjs(signupData.birthday).format("DD/MM/YYYY")
                : "Birthday"}
            </Text>
          </TouchableOpacity>

          <DatePicker
            setSignupData={setSignupData}
            signupData={signupData}
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
          />

          <TextInput
            placeholder="Email"
            className="border-2 w-full rounded-full p-4 border-BrightGray"
            onChangeText={(email) => handleChange("email", email)}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            className="border-2 w-full rounded-full p-4 border-BrightGray"
            onChangeText={(password) => handleChange("password", password)}
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={true}
            className="border-2 w-full rounded-full p-4 border-BrightGray"
          />
          <View className="flex flex-col gap-y-4">
            <Text>Do you have sensitive facial skin?</Text>
            <RadioComponents
              setValue={(value: boolean) => setSignupData({
                ...signupData,
                sensitive_skin: value,
              })} value={null}            />
          </View>
          <ButtonComponents
            onPress={handleSignup}
            title="Register"
             className="flex flex-row items-center justify-center rounded-full border-2 border-BrightGray p-4 bg-Bittersweet"
                textSize="text-white text-xl font-bold"
          />
        </View>
      </View>
      <Link href="/login"  className="text-center text-OldSilver text-label4 font-bold mt-3" 
            >
        Already Have an account ? <Text className="text-label4 font-bold text-black"> Login</Text>
      </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
