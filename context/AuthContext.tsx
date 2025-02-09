import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ILogin,
  ISignUp,
  IPubicUser,
} from "@/interface/user";
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
  User : IPubicUser;
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

  const [User, setUser] = useState<IPubicUser>({
    fullname: "",
    birthday: null,
    email: "",
    sensitive_skin: null,
    image: "",
  });

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
    await AsyncStorage.getItem("token").then(async (token) => {
      await axiosInstance
        .get("/user/me", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          setUser(res.data.data);
        });
    });
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
        .then((res) => {
          const status = res.status;
          if (status !== 200) {
            return;
          }

          const token: string = res.data.data.token;
          AsyncStorage.setItem("token", token);

          if (User.sensitive_skin !== null) {
            router.push("/home");
          }
          console.log("Skinsensitive is null");
          
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

  useEffect(() => {
    handleGetUser();
  }, []);

  const AuthContextValue = {
    loginData,
    setLoginData,
    handleLogin,
    signupData,
    setSignupData,
    handleSignup,
    googleSignIn,
    User,
  };

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
