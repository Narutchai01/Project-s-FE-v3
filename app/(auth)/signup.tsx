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
import { Eye, EyeOff } from "lucide-react-native";
import { ConfirmAlert } from "@/components/Alert";

export default function SignUP() {
  const { signupData, setSignupData, handleSignup } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");

  const handleChange = (name: string, value: string) => {
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const onRegister = () => {
    if (!signupData.password || !confirmPassword) {
      setAlertTitle("Please fill in all password fields");
      setAlertVisible(true);
      return;
    }

    if (signupData.password !== confirmPassword) {
      setAlertTitle("Password not match");
      setAlertVisible(true);
      return;
    }

    handleSignup();
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
          
          <View className="relative">
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                className="border-2 w-full rounded-full p-4 pr-14 border-BrightGray"
                onChangeText={(password) => handleChange("password", password)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-5"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </TouchableOpacity>
            </View>

            <View className="relative">
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                className="border-2 w-full rounded-full p-4 pr-14 border-BrightGray"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-5"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </TouchableOpacity>
            </View>
            
          <View className="flex flex-col gap-y-4">
            <Text>Do you have sensitive facial skin?</Text>
            <RadioComponents
              setValue={(value: boolean) => setSignupData({
                ...signupData,
                sensitive_skin: value,
              })} value={null}            />
          </View>
          <ButtonComponents
             onPress={onRegister}
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

      <ConfirmAlert
        visible={alertVisible}
        title={alertTitle}
        confirm="OK"
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}
