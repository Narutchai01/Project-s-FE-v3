import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ILogin, ISignUp, IPubicUser } from "@/interface/user";
import { axiosInstance } from "@/lib/axios_instance";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

type AuthContextType = {
  loginData: ILogin;
  setLoginData: (data: ILogin) => void;
  handleLogin: () => void;
  signupData: ISignUp;
  setSignupData: (data: ISignUp) => void;
  handleSignup: () => void;
  googleSignIn: () => void;
  user: IPubicUser;
  getToken: () => string | null;
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void
  setSensitiveSkin : (sensitiveSkin:boolean) => void
  UpdateSenSitiveSkincare : () => void
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [sensitiveSkin , setSensitiveSkin] = useState<boolean>(false)
  const [isOpen,setIsOpen] = useState<boolean>(false)
  const [loginData, setLoginData] = useState<ILogin>({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState<ISignUp>({
    fullname: "",
    birthday: null,
    email: "",
    password: "",
    sensitive_skin: false,
  });

  const [user, setUser] = useState<IPubicUser>({
    fullname: "",
    birthday: null,
    email: "",
    sensitive_skin: null,
    image: "",
  });

  const getToken = (): string | null => {
    let token: string | null = null;
    AsyncStorage.getItem("token")
      .then((value) => {
        token = value;
      })
      .catch((err) => {
        console.log(err);
      });
    return token;
  };

  const handleLogin = async () => {
    await axiosInstance
      .post("/user/login", loginData)
      .then(async (res) => {
        const status = res.status;

        if (status !== 200) {
          return;
        }
        const token: string = res.data.data.token;
        await AsyncStorage.setItem("token", token);
        console.log("login suc");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSignup = async () => {
    await axiosInstance
      .post("/user/register", signupData)
      .then((res) => {
        const status = res.status;
        setSignupData({
          fullname: "",
          birthday: null,
          email: "",
          password: "",
          sensitive_skin: false,
        });
        if (status === 201) {
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGetUser = async () => {
   try {
    const token = await AsyncStorage.getItem("token")
      const response = await axiosInstance.get("/user/me", {
        headers: {
          token: token,
        },
      });
      setUser(response.data.data);
      return response.data.data;
   } catch (error) {
      console.log("GetUser",error);
   }
  };

 

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await axiosInstance
        .post("/user/goolge-signin", {
          email: userInfo.data?.user.email,
          full_name: userInfo.data?.user.name,
          image: userInfo.data?.user.photo,
        })
        .then(async(res) => {
          const status = res.status;
          if (status !== 200) {
            return;
          }

          const token: string = res.data.data.token;
          AsyncStorage.setItem("token", token);

          const newuser = await handleGetUser();

          if (newuser?.sensitive_skin !== null) {
            router.push("/home");
          } else {
            console.log("Skinsensitive is null");
            setIsOpen(true)
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log("cancelled");
      } else if ((error as any).code === statusCodes.IN_PROGRESS) {
        console.log("in progress");
      } else if (
        (error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        console.log("play services not available or outdated");
      } else {
        console.log("Something went wrong", error);
      }
    }
  };


  const UpdateSenSitiveSkincare = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axiosInstance.put("/user", {
        sensitive_skin: sensitiveSkin,
      }, {
        headers: {
          token: token,
        },
      });
      setIsOpen(false);
      router.push("/home");
      console.log(response.data.data);
    } catch (error) {
      console.log("UpdateSensitiveSkin",error);
    }
  }

 useEffect(() => {
    getToken();
  },[]);

  const AuthContextValue = {
    loginData,
    setLoginData,
    handleLogin,
    signupData,
    setSignupData,
    handleSignup,
    googleSignIn,
    user,
    getToken,
    isOpen,
    setIsOpen,
    setSensitiveSkin,
    UpdateSenSitiveSkincare
  };

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
