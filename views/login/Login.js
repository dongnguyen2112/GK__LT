import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const checkCredentials = async () => {
        if (!isValidEmail(email)) {
            Alert.alert('Email không hợp lệ', 'Vui lòng nhập địa chỉ email hợp lệ.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Mật khẩu không hợp lệ', 'Mật khẩu phải có ít nhất 6 kí tự.');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;
            const userDoc = await firestore().collection('user').doc(uid).get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                if (userData.role === 'admin') {
                    console.log('Successful admin login');
                    navigation.navigate('Tab', { userName: email });
                } else if (userData.role === 'user') {
                    console.log('Successful user login');
                    navigation.navigate('TabC', { userName: email });
                }
            } else {
                Alert.alert('Không tìm thấy thông tin người dùng');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập', error);
            Alert.alert('Tên đăng nhập hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image
                            resizeMode="contain"
                            style={styles.headerImg}
                            source={require('../../image/logo.png')} />
                        <Text style={styles.title}>
                            <Text style={{ color: '#FF9966', fontSize: 50 }}>Đăng Nhập</Text>
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                keyboardType="email-address"
                                onChangeText={setEmail}
                                placeholder="dongnguyen1589@example.com"
                                placeholderTextColor="#6b7280"
                                style={styles.inputControl}
                                value={email} />
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Mật khẩu</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={setPassword}
                                    placeholder="********"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                />
                                <TouchableOpacity onPress={toggleShowPassword} style={styles.passwordToggle}>
                                    <MaterialCommunityIcons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={25}
                                        color="black"
                                        style={styles.eyeIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity onPress={checkCredentials} disabled={loading}>
                            <View style={styles.btn}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.btnText}>Đăng nhập</Text>
                                )}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text style={styles.formLink}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <TouchableOpacity
                onPress={handleRegister}
                style={{ marginTop: 'auto' }}>
                <Text style={styles.formFooter}>
                    Không có tài khoản?{' '}
                    <Text style={{ textDecorationLine: 'underline' }}>Đăng kí</Text>
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFC0CB',
        marginBottom: 16,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 36,
    },
    headerImg: {
        width: 500,
        height: 200,
        alignSelf: 'center',
    },
    form: {
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    formLink: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF9966',
        textAlign: 'center',
        marginTop: 12,
    },
    formFooter: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FF9966',
        textAlign: 'center',
        letterSpacing: 0.15,
        margin:25
    },
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputControl: {
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderWidth: 1,
        borderColor: '#C9D3DB',
        borderStyle: 'solid',
        flex: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordToggle: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 1,
        backgroundColor: '#00CCCC',
        borderColor: '#00CCCC',
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#FFFF99',
    },
});
