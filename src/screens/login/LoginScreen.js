import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Animated from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { appleLogin } from "../../redux/reducer/webSlice";
import { identify } from "../../utils/analytics";
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
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const dispatch = useDispatch();
    const _carouselRef = useRef(null);

    const onAppleButtonPress = async () => {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        if (credentialState === appleAuth.State.AUTHORIZED) {
            setLoading(true);
            dispatch(
                appleLogin(
                    __DEV__
                        ? "eyJraWQiOiJGZnRPTlR4b0VnIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmRvbGZpbnMuYWkuYXBwbGVTaWduaW4iLCJleHAiOjE3MjgxNDk3NTYsImlhdCI6MTcyODA2MzM1Niwic3ViIjoiMDAwMjE3LmE2YzgxYjEyNWMwMDRmMWJiMDI3MjUwOTQ0N2NiYzc4LjE1MzUiLCJjX2hhc2giOiJPWmdsWWFVaUhVWXpMR3A4VkNua1VnIiwiZW1haWwiOiJnYWdhbkBkb2xmaW5zLmFpIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF1dGhfdGltZSI6MTcyODA2MzM1Niwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.FvaJhnmq7zO6ZH2etNmJ1Gh8Zrwz8Q2IQHoyHhYqPPI4vBl8KLZs52YZhqnBAvYiKeyFrzV_sQ2sulHaD3j6p4otBTLU5pFCWZLr2QKYDH1-FQ4vG1O9bwQZbZhAMLRBXwnEpWTHTDlfMpLUfurtJ1FpM997r0bY3DvRhAkINocDxHqYwvU4kddeXqTfCpB9RsP1XL5MEKEkJYIHkSIH4aOsk6F2wtFunSxyhEkp5V6dWQb68aOq0PT4Jk7kvT1Qf4WqTLawU-smQjtVXnipQWG4-FREpiyxGaGYJQHR-M4MmTCHwXz8N6PZkE_vFTHysD56blQTUQU4W5BLqAtQ5A"
                        : appleAuthRequestResponse.identityToken
                )
            )
                .then((res) => {
                    setLoading(false);
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
                    setLoading(false);
                    alert("Error");
                    console.log("err", err);
                });
        } else {
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
                    // google?.accounts?.id?.prompt();
                    setGoogleLoading(true);
                    dispatch(appleLogin(response?.credential))
                        .then((res) => {
                            console.log("res gagan", res?.payload);
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
                }}
                style={{
                    borderRadius: 6,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000",
                    padding: 10,
                    flexDirection: "row",
                    marginRight: 16,
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
                            Sign In
                        </Text>
                    </>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onAppleButtonPress}
                style={{
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000",
                    padding: 16,
                    flexDirection: "row",
                    marginTop: 50,
                }}
            >
                <AntDesign name="apple1" size={24} color="white" />
                {loading && <ActivityIndicator />}
                {!loading && (
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
                            Sign In
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
