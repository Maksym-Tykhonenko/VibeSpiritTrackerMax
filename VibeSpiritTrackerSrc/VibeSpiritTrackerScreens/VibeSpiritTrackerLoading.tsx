import React, {
    useEffect as vibraEchoLoop,
    useRef as useSpiritPulse,
} from 'react';
import { useNavigation as useAuraNavDrift } from '@react-navigation/native';
import {
    View as PulseShellCradle,
    Image as HaloScreenVeil,
    Dimensions as MoodSpanGauge,
    Animated as SpiritPulseAnim,
    Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwogasdLoader from '../VibeSpiritTrackerComponents/SwogasdLoader';
import { SafeAreaView as SpiritSafeHaven } from 'react-native-safe-area-context';

const VIBESPIRIT_ONB_TOKEN = 'vspirit-init-mark-7qz91';

const VibeSpiritTrackerLoading: React.FC = () => {
    const navRipple = useAuraNavDrift();
    const { width: auraWide, height: auraTall } = MoodSpanGauge.get('window');

    // --- Pulse Animation ---
    const pulseAnim = useSpiritPulse(new SpiritPulseAnim.Value(1)).current;
    vibraEchoLoop(() => {
        SpiritPulseAnim.loop(
            SpiritPulseAnim.sequence([
                SpiritPulseAnim.timing(pulseAnim, {
                    toValue: 1.18,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                SpiritPulseAnim.timing(pulseAnim, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    vibraEchoLoop(() => {
        let holdSeal = true;
        let driftClock: NodeJS.Timeout | null = null;

        const awakenSpiritPath = async () => {
            try {
                const storedSeal = await AsyncStorage.getItem(VIBESPIRIT_ONB_TOKEN);
                const chaosDelay = Math.floor(Math.random() * 900);

                if (!storedSeal) {
                    await AsyncStorage.setItem(VIBESPIRIT_ONB_TOKEN, 'active');
                    setTimeout(() => {
                        navRipple.replace('VibeSpiritTrackerOnboarding');
                    }, 5000 + chaosDelay);
                    return;
                }

                setTimeout(() => {
                    navRipple.replace('RtiripsObruchScn');
                }, 5000 + chaosDelay);

            } catch (errAura) {
                if (__DEV__) console.warn('VibeSpirit::syncFail', errAura);
            }
        };

        //awakenSpiritPath();

        return () => {
            holdSeal = false;
            if (driftClock) clearTimeout(driftClock);
        };
    }, [navRipple, auraWide]);

    return (
        <SpiritSafeHaven
            style={{
                alignItems: 'center',
                flex: 1,
                width: auraWide,
                height: auraTall,

                backgroundColor: '#281C43'
            }}
        >
            <SpiritPulseAnim.View
                style={{

                    alignItems: 'center',
                    transform: [{ scale: pulseAnim }],
                }}
            >
                <HaloScreenVeil
                    source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vibeLogo.png')}
                    style={{
                        width: auraWide * 0.59,
                        marginTop: auraTall * 0.1,
                        height: auraWide * 0.59,
                    }}
                    resizeMode="contain"
                />
            </SpiritPulseAnim.View>

            <PulseShellCradle
                style={{
                    position: 'absolute',
                    bottom: -auraTall * 0.1,
                    alignSelf: 'center',
                    zIndex: 20,
                }}
            >
                <SwogasdLoader />
            </PulseShellCradle>
        </SpiritSafeHaven>
    );
};

export default VibeSpiritTrackerLoading;