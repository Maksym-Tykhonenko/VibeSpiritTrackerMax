import { viritravefonts } from '../viritravefonts';
import React, { useEffect as usePulseSync, useState as useVibeLatch, } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Text as RuneTextBit,
    Dimensions as SpanRuneDims,
    TouchableOpacity as PulseTapNode,
    Image as FluxImage,
    View as DriftPane,
    Share,
    Switch as ToggleGlyph,
} from 'react-native';

export default function Spiriparamsapge() {
    const { width: runeW, height: runeH } = SpanRuneDims.get('window');

    // storage glyph keys
    const KEY_VIBE = 'vibe_haptics_gate';
    const KEY_PINGS = 'vibe_notify_gate';

    // local states
    const [vibePulse, setVibePulse] = useVibeLatch(true);
    const [pingFlux, setPingFlux] = useVibeLatch(true);

    // hydrate state
    usePulseSync(() => {
        (async () => {
            const vibRaw = await AsyncStorage.getItem(KEY_VIBE);
            const pingRaw = await AsyncStorage.getItem(KEY_PINGS);

            setVibePulse(vibRaw === null ? true : vibRaw === 'true');
            setPingFlux(pingRaw === null ? true : pingRaw === 'true');
        })();
    }, []);

    // handlers
    const toggleVibeGate = async (flag: boolean) => {
        setVibePulse(flag);
        await AsyncStorage.setItem(KEY_VIBE, String(flag));
    };

    const togglePingGate = async (flag: boolean) => {
        setPingFlux(flag);
        await AsyncStorage.setItem(KEY_PINGS, String(flag));
    };

    const sparkShareIntent = async () => {
        try {
            await Share.share({
                message: 'Download WindSpirt: Tracker Discover and start tracking your vibes today!',
            });
        } catch { }
    };

    // ui metrics (⚠️ untouched ratios)
    const glyphScaleW = runeW * 0.13;
    const glyphScaleH = runeH * 0.04;
    const rowPadY = runeH * 0.025;
    const rowPadX = runeW * 0.04;
    const splitH = 0.8;
    const textSz = runeW * 0.048;

    const controlMatrix = [
        {
            title: 'Vibration',
            value: vibePulse,
            flip: toggleVibeGate,
            font: viritravefonts.sanvibeRegular,
        },
        {
            title: 'Notifications',
            value: pingFlux,
            flip: togglePingGate,
            font: viritravefonts.sanvibeRegular,
        },
    ];

    return (
        <DriftPane
            style={{
                backgroundColor: 'transparent',
                alignSelf: 'center',
                alignItems: 'flex-start',
                paddingTop: runeH * 0.019,
                width: runeW * 0.95,
                flex: 1,
            }}
        >
            {controlMatrix.map((node, idx) => (
                <React.Fragment key={node.title}>
                    <DriftPane
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            paddingVertical: rowPadY,
                            paddingHorizontal: rowPadX,
                        }}
                    >
                        <RuneTextBit style={{
                                fontFamily: node.font,
                                color: 'white',
                                fontSize: textSz,}}>
                            {node.title}
                        </RuneTextBit>

                        <ToggleGlyph
                            trackColor={{ false: '#767577', true: '#34C759' }}
                            onValueChange={node.flip}
                            value={node.value}
                            thumbColor="#fff"
                            style={{
                                transform: [
                                    { scaleX: glyphScaleW / 51 },
                                    { scaleY: glyphScaleH / 31 },
                                ],
                            }}
                        />
                    </DriftPane>

                    {idx < controlMatrix.length && (
                        <DriftPane
                            style={{
                                backgroundColor: 'white',
                                alignSelf: 'center',
                                width: '93%',
                                opacity: 0.5,
                                height: splitH,
                            }}
                        />
                    )}
                </React.Fragment>
            ))}

            {/* spacer */}
            <DriftPane style={{ flex: 1 }} />

            {/* share block */}
            <PulseTapNode
                onPress={sparkShareIntent}
                style={{
                    backgroundColor: '#4B436B',
                    height: runeH * 0.088,
                    borderRadius: runeW * 0.09,
                    justifyContent: 'space-between',
                    bottom: runeH * 0.14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingHorizontal: runeW * 0.1,
                    position: 'absolute',
                    width: runeW * 0.8,
                }}
            >
                <RuneTextBit
                    style={{
                        marginRight: runeW * 0.03,
                        fontFamily: viritravefonts.sanvibeMedium,
                        color: 'white',
                        fontSize: runeW * 0.05,
                    }}
                >
                    Share the program
                </RuneTextBit>

                <FluxImage
                    style={{
                        resizeMode: 'contain',
                        width: runeW * 0.08,
                        height: runeW * 0.08,
                    }}
                    source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/shareTheResult.png')}
                />
            </PulseTapNode>
        </DriftPane>
    );
}
