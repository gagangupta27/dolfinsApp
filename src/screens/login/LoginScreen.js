import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Animated from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import Carousel from "react-native-reanimated-carousel";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { appleLogin } from "../../redux/reducer/webslice";
import { setAuthData } from "../../redux/reducer/app";

const width = Dimensions.get("window").width;

const DATA = [
    {
        src: require("../../assets/Onboarding2.webp"),
        title: "Converse",
        style: { width: 298, height: 292 },
    },
    {
        src: require("../../assets/Onboarding1.webp"),
        title: "Contextualize",
        style: { width: 331, height: 274 },
    },
    {
        src: require("../../assets/Onboarding3.webp"),
        title: "Connect ",
        style: { width: 293, height: 293.6 },
    },
];

const LoginScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(3);
    const [appleLoading, setAppleLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const authData = useSelector((state) => state.app.authData);
    const dispatch = useDispatch();
    const _carouselRef = useRef(null);

    useEffect(() => {
        GoogleSignin.configure({
            iosClientId: "489610353043-opmp8tiat2lah3nbash5v45v5v4f7teh.apps.googleusercontent.com",
            scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
            hostedDomain: "", // specifies a hosted domain restriction
            googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. "GoogleService-Info-Staging"
            profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
        });
    }, []);

    const onAppleButtonPress = async () => {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        if (credentialState === appleAuth.State.AUTHORIZED) {
            setAppleLoading(true);
            try {
                dispatch(appleLogin(appleAuthRequestResponse?.identityToken))
                    .then((res) => {
                        console.log("res", res);
                        setAppleLoading(false);
                        if ([200].includes(res?.payload?.status) && res?.payload?.data?.id) {
                            dispatch(
                                setAuthData({
                                    ...res?.payload?.data,
                                    userId: res?.payload?.data?.id,
                                })
                            );
                        } else {
                            alert("Error");
                        }
                    })
                    .catch((err) => {
                        setAppleLoading(false);
                        alert("Error");
                        console.log("err", err);
                    });
            } catch (err) {
                setAppleLoading(false);
                Alert.alert("err", JSON.stringify(err));
            }
        } else {
            Alert.alert("Error");
        }
    };

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            setGoogleLoading(true);
            dispatch(appleLogin(response?.data?.idToken))
                .then((res) => {
                    setGoogleLoading(false);
                    if ([200].includes(res?.payload?.status) && res?.payload?.data?.id) {
                        dispatch(
                            setAuthData({
                                ...res?.payload?.data,
                                userId: res?.payload?.data?.id,
                            })
                        );
                    } else {
                        alert("Error");
                    }
                })
                .catch((err) => {
                    setGoogleLoading(false);
                    alert("Error");
                    console.log("err", err);
                });
        } catch (error) {
            setGoogleLoading(false);
            console.log("err", error);
            Alert.alert("Error");
        }
    };

    const nextStep = () => {
        const currentIdx = _carouselRef.current?.getCurrentIndex() || currentIndex;
        setCurrentIndex(currentIdx + 1);
        _carouselRef.current.next({ count: 1, animated: true });
    };

    const LoginPage = () => (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
            }}
        >
            <Text style={{ fontWeight: "bold", fontSize: 60, marginBottom: 100 }}>dolfins.ai</Text>
            <View
                style={{
                    width: "80%",
                    marginTop: 20,
                    paddingVertical: 5,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        fontFamily: "Urbanist-Regular",
                        color: "#59606E",
                    }}
                >
                    Let's sign you in
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => {
                    onAppleButtonPress();
                }}
                style={{
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000",
                    padding: 16,
                    flexDirection: "row",
                    marginTop: 50,
                    width: 250,
                }}
            >
                {appleLoading && <ActivityIndicator />}
                {!appleLoading && (
                    <>
                        <AntDesign name="apple1" size={24} color="white" />
                        <Text
                            style={{
                                fontFamily: "Urbanist-Bold",
                                color: "white",
                                fontSize: 16,
                                paddingLeft: 16,
                            }}
                        >
                            Sign In with Apple
                        </Text>
                    </>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    signIn();
                }}
                style={{
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000",
                    padding: 16,
                    flexDirection: "row",
                    marginTop: 20,
                    width: 250,
                }}
            >
                {googleLoading && <ActivityIndicator />}
                {!googleLoading && (
                    <>
                        <AntDesign name="google" size={24} color="white" />
                        <Text
                            style={{
                                fontFamily: "Urbanist-Bold",
                                color: "white",
                                fontSize: 16,
                                paddingLeft: 16,
                            }}
                        >
                            Sign In with Google
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderContent = () => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    marginTop: 100,
                }}
            >
                {currentIndex == 3 && <LoginPage />}
                {currentIndex != 3 && (
                    <>
                        <Carousel
                            width={width}
                            enabled={false}
                            ref={_carouselRef}
                            height={500}
                            autoPlay={false}
                            data={DATA}
                            scrollAnimationDuration={1000}
                            onSnapToItem={(index) => setCurrentIndex(index)}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: "center",
                                    }}
                                >
                                    <Image source={item?.src} style={item.style} />
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 36,
                                            color: "#040404",
                                            marginTop: 52,
                                        }}
                                    >
                                        {item?.title}
                                    </Text>
                                </View>
                            )}
                        />
                        <View
                            style={{
                                position: "absolute",
                                padding: 38,
                                bottom: 0,
                                width: "100%",
                            }}
                        >
                            <View
                                style={[
                                    {
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        paddingBottom: 40,
                                    },
                                ]}
                            >
                                {DATA &&
                                    Array.isArray(DATA) &&
                                    DATA?.map((item, index) => (
                                        <Animated.View
                                            key={index}
                                            style={{
                                                backgroundColor: currentIndex == index ? "#040404" : "#D9D9D9",
                                                borderRadius: 100,
                                                marginHorizontal: 5,
                                                height: 8,
                                                width: currentIndex == index ? 25 : 8,
                                            }}
                                        ></Animated.View>
                                    ))}
                            </View>
                            <TouchableOpacity
                                style={{
                                    width: "100%",
                                    backgroundColor: "#040404",
                                    padding: 10,
                                    borderRadius: 15,
                                }}
                                activeOpacity={0.8}
                                onPress={nextStep}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: "#FCFCFC",
                                        textAlign: "center",
                                    }}
                                >
                                    NEXT
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        );
    };

    return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
});

export default LoginScreen;
