import { viritravefonts } from '../viritravefonts';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState, useEffect } from 'react';
import {
    Share,
    View as SPiritobox,
    TouchableOpacity as TravitraTap,
    Text as Ckertext,
    Image as Beimgage,
    Dimensions as Dimkespi,
    FlatList,
    Modal,
    Platform,
    PermissionsAndroid,
    Alert,
    Animated,
} from 'react-native';

// Масив шпалер
const wallpapers = [
    {
        id: '1',
        image: require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vipapers/tiger.png'),
    },
    {
        id: '2',
        image: require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vipapers/bee.png'),
    },
    {
        id: '3',
        image: require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vipapers/bull.png'),
    },
    {
        id: '4',
        image: require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vipapers/chinawoman.png'),
    },
];

const STORAGE_KEY = 'wallpaper_idx_global';

export default function ShowUserWalpapersWhichHave() {
    const { width: tracibewith, height: tracibeheit } = Dimkespi.get('window');
    const [selectedWallpaper, setSelectedWallpaper] = useState<any | null>(null);
    const viewShotRef = useRef<any>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const modalOpacity = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.8)).current;
    const [unlockedCount, setUnlockedCount] = useState(0);

    // Дозвіл для Android на запис у сховище
    const requestAndroidPermission = async () => {
        if (Platform.OS !== 'android') return true;
        
        try {
            if (Number(Platform.Version) >= 33) {
                // Android 13+ не потребує WRITE_EXTERNAL_STORAGE
                return true;
            }
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'App needs access to your storage to save wallpapers',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.error('Permission error:', err);
            return false;
        }
    };

    // При монтуванні читаємо кількість відкритих шпалер
    useEffect(() => {
        (async () => {
            try {
                const idxStr = await AsyncStorage.getItem(STORAGE_KEY);
                const idx = idxStr ? parseInt(idxStr, 10) : 0;
                // idx - це індекс наступної шпалери, яку треба видати, тому відкрито idx штук
                setUnlockedCount(idx);
            } catch {
                setUnlockedCount(0);
            }
        })();
    }, []);

    useEffect(() => {
        if (showSuccessModal) {
            // Анімація появи
            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(modalScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();

            // Автоматичне закриття через 3 секунди
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(modalOpacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(modalScale, {
                        toValue: 0.8,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    setShowSuccessModal(false);
                    modalOpacity.setValue(0);
                    modalScale.setValue(0.8);
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showSuccessModal]);

    // --- Головний екран вибору шпалер ---
    if (!selectedWallpaper) {
        return (
            <SPiritobox style={{
                justifyContent: 'flex-start',
                paddingTop: tracibeheit * 0.03,
                alignItems: 'center',
                flex: 1,
            }}>
                <FlatList
                    keyExtractor={item => item.id}
                    numColumns={3}
                    data={wallpapers}
                    contentContainerStyle={{
                        paddingBottom: tracibeheit * 0.04,
                        paddingHorizontal: tracibewith * 0.03,
                        paddingTop: tracibeheit * 0.01,
                    }}
                    columnWrapperStyle={{
                        justifyContent: 'flex-start',
                        marginBottom: tracibeheit * 0.025,
                    }}
                    renderItem={({ item, index }) => {
                        const isUnlocked = index < unlockedCount;
                        return (
                            <TravitraTap
                                style={{
                                    backgroundColor: isUnlocked ? 'transparent' : '#23202F',
                                    width: tracibewith * 0.28,
                                    marginRight: tracibewith * 0.03,
                                    borderRadius: tracibewith * 0.055,
                                    marginBottom: tracibeheit * 0.01,
                                    overflow: 'hidden',
                                    height: tracibeheit * 0.23,
                                }}
                                activeOpacity={isUnlocked ? 0.8 : 1}
                                onPress={() => isUnlocked && setSelectedWallpaper(item)}
                                disabled={!isUnlocked}
                            >
                                <Beimgage
                                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: tracibewith * 0.055,
                                        opacity: isUnlocked ? 1 : 0.35,
                                    }}
                                    resizeMode="cover"
                                />
                                {!isUnlocked && (
                                    <SPiritobox style={{
                                        alignItems: 'center',
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        justifyContent: 'center',
                                    }}>
                                        <Beimgage
                                            source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/lock.png')}
                                            style={{
                                                width: tracibewith * 0.13,
                                                height: tracibewith * 0.13,
                                                tintColor: '#00FFB0',
                                            }}
                                            resizeMode="contain"
                                        />
                                    </SPiritobox>
                                )}
                            </TravitraTap>
                        );
                    }}
                />
            </SPiritobox>
        );
    }

    return (
        <SPiritobox   style={{
                paddingTop: tracibeheit * 0.0,
                flex: 1,
                backgroundColor: 'transparent',
                alignItems: 'center',
            }}
        >
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="none"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <SPiritobox style={{
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    flex: 1,
                }}>
                    <Animated.View
                        style={{
                            backgroundColor: '#2D2640',
                            borderRadius: tracibewith * 0.055,
                            shadowRadius: 15,
                            alignItems: 'center',
                            width: tracibewith * 0.75,
                            padding: tracibewith * 0.06,
                            elevation: 10,
                            transform: [{ scale: modalScale }],
                            shadowColor: '#00FFB0',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.3,
                            opacity: modalOpacity,
                        }}
                    >
                        <Beimgage
                            source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/save.png')}
                            style={{
                                width: tracibewith * 0.15,
                                height: tracibewith * 0.15,
                                tintColor: '#00FFB0',
                                marginBottom: tracibeheit * 0.02,
                            }}
                            resizeMode="contain"
                        />
                        <Ckertext style={{
                            marginBottom: tracibeheit * 0.01,
                            fontFamily: viritravefonts.sanvibeMedium,
                            textAlign: 'center',
                            fontSize: tracibewith * 0.055,
                            color: '#00FFB0',
                        }}>
                            Success!
                        </Ckertext>
                        <Ckertext style={{
                            color: 'white',
                            fontFamily: viritravefonts.sanvibeMedium,
                            fontSize: tracibewith * 0.04,
                            textAlign: 'center',
                        }}>
                            Wallpaper saved to gallery
                        </Ckertext>
                    </Animated.View>
                </SPiritobox>
            </Modal>

            {/* Back Arrow */}
            <TravitraTap
                style={{
                    zIndex: 10,
                    top: tracibeheit * 0.025,
                    left: tracibewith * 0.035,
                    width: tracibewith * 0.11,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: tracibewith * 0.11,
                    position: 'absolute',
                }}
                onPress={() => setSelectedWallpaper(null)}
                activeOpacity={0.7}
            >
                <Beimgage
                    source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/reverseShr.png')}
                    style={{
                        width: tracibewith * 0.09,
                        height: tracibewith * 0.09,
                        resizeMode: 'contain',
                    }}
                />
            </TravitraTap>

            <ViewShot
                ref={viewShotRef}
                options={{
                    format: 'png',
                    quality: 1,
                }}
                style={{
                    justifyContent: 'center',
                    height: tracibeheit * 0.44,
                    borderRadius: tracibewith * 0.07,
                    backgroundColor: 'transparent',
                    width: tracibewith * 0.59,
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                <Beimgage
                    source={
                        typeof selectedWallpaper.image === 'string'
                            ? { uri: selectedWallpaper.image }
                            : selectedWallpaper.image
                    }
                    style={{
                        borderRadius: tracibewith * 0.07,
                        height: tracibeheit * 0.44,
                        width: tracibewith * 0.59,
                    }}
                    resizeMode="cover"
                />
            </ViewShot>

            {/* Кнопки Share та Download */}
            <SPiritobox
                style={{
                    width: '100%',
                    alignItems: 'center',
                    marginTop: tracibeheit * 0.023,
                }}
            >
                <TravitraTap
                    style={{
                        width: tracibewith * 0.8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: tracibeheit * 0.025,
                        height: tracibeheit * 0.07,
                        borderRadius: tracibewith * 0.055,
                        backgroundColor: '#4D4569',
                        flexDirection: 'row',
                    }}
                    onPress={async () => {
                        try {
                            const uri = await viewShotRef.current.capture();
                            if (!uri) {
                                Alert.alert('Error', 'Failed to capture image');
                                return;
                            }

                            if (Platform.OS === 'ios') {
                                await Share.share({
                                    url: uri,
                                    title: 'Wallpaper',
                                });
                            } else {
                                await Share.share({
                                    message: 'Check out this wallpaper!',
                                    url: `file://${uri}`,
                                    title: 'Wallpaper',
                                });
                            }
                        } catch (e: any) {
                            Alert.alert('Error', e?.message || 'Failed to share wallpaper');
                        }
                    }}
                    activeOpacity={0.85}
                >
                    <Ckertext style={{
                        marginRight: tracibewith * 0.03,
                        fontFamily: viritravefonts.sanvibeMedium,
                        color: 'white',
                        fontSize: tracibewith * 0.05,
                    }}>
                        Share
                    </Ckertext>
                    <Beimgage
                        source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/shareTheResult.png')}
                        style={{
                            width: tracibewith * 0.08,
                            height: tracibewith * 0.08,
                            resizeMode: 'contain',
                        }}
                    />
                </TravitraTap>
                <TravitraTap
                    style={{
                        backgroundColor: '#4D4569',
                        flexDirection: 'row',
                        borderRadius: tracibewith * 0.055,
                        alignItems: 'center',
                        width: tracibewith * 0.8,
                        height: tracibeheit * 0.07,
                        justifyContent: 'center',
                    }}
                    onPress={async () => {
                        try {
                            // Перевірка дозволів тільки для Android
                            if (Platform.OS === 'android') {
                                const hasPermission = await requestAndroidPermission();
                                if (!hasPermission) {
                                    Alert.alert('Permission Denied', 'Storage permission is required to save wallpapers');
                                    return;
                                }
                            }

                            const uri = await viewShotRef.current.capture();
                            if (!uri) {
                                Alert.alert('Error', 'Failed to capture image');
                                return;
                            }

                            // CameraRoll.saveAsset автоматично запитує дозволи на iOS
                            await CameraRoll.saveAsset(uri, { type: 'photo' });
                            
                            // Показуємо кастомну модалку замість Alert
                            setShowSuccessModal(true);
                        } catch (e: any) {
                            console.error('Download error:', e);
                            // Перевірка на помилку дозволів iOS
                            if (e?.message?.includes('permission') || e?.message?.includes('denied')) {
                                Alert.alert('Permission Denied', 'Please enable photo library access in Settings');
                            } else {
                                Alert.alert('Error', e?.message || 'Failed to save wallpaper');
                            }
                        }
                    }}
                    activeOpacity={0.85}
                >
                    <Ckertext style={{
                        fontSize: tracibewith * 0.05,
                        fontFamily: viritravefonts.sanvibeMedium,
                        color: 'white',
                        marginRight: tracibewith * 0.03,
                    }}>
                        Download
                    </Ckertext>
                    <Beimgage
                        source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/save.png')}

                        style={{
                            width: tracibewith * 0.08,
                            resizeMode: 'contain',
                            height: tracibewith * 0.08,
                        }}
                    />
                </TravitraTap>
            </SPiritobox>
        </SPiritobox>
    );
}