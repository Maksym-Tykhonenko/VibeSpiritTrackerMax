import {
    TouchableOpacity as PulseTapNode,
    useWindowDimensions as auraSpanDims,
    Image as SpiritVeilFrame,
    View as AuraShellStage,
} from 'react-native';
import { Text as AuraGlyphText } from 'react-native-gesture-handler';
import { useNavigation as useSpiritNavFlow } from '@react-navigation/native';
import React, { useState as useRuneCycle } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { viritravefonts } from '../viritravefonts';

const VIBESPIRIT_ONBOARD_MARK = 'vspirit-onboard-seal-2kq81';

const VibeSpiritTrackerOnboarding: React.FC = () => {
    const [runeIndex, setRuneIndex] = useRuneCycle(0);
    const spiritNav = useSpiritNavFlow();

    const visionScroll = [
        require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/trackerstart/WelcomToVibeSpiritTracker.png'),
        require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/trackerstart/TrackYourDailyVibes.png'),
        require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/trackerstart/UnderstandYourselfBetter.png'),
        require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/trackerstart/StayConsistentEarnRewards.png'),
        require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/trackerstart/InspireYourMind.png'),
    ];

    const { width: auraW, height: auraH } = auraSpanDims();

    const advanceRune = async () => {
        if (runeIndex < visionScroll.length - 1) {
            setRuneIndex(prev => prev + 1);
        } else {
            try {
                await AsyncStorage.setItem(VIBESPIRIT_ONBOARD_MARK, 'complete');
            } catch (errSeal) {
                if (__DEV__) console.warn('VibeSpirit::onboardSaveFail', errSeal);
            }
            spiritNav.replace?.('RtiripsObruchScn');
        }
    };

    const activeVision = visionScroll[runeIndex];

    return (
        <AuraShellStage
            style={{
                flex: 1,
                width: auraW,
                height: auraH,
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}
        >
            <SpiritVeilFrame
                source={activeVision}
                resizeMode="cover"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: auraW,
                    height: auraH,
                }}
            />

            <PulseTapNode
                activeOpacity={0.9}
                onPress={advanceRune}
                style={{
                    position: 'absolute',
                    bottom: auraH * 0.05,
                    width: auraW * 0.8,
                    height: auraH * 0.08,
                    borderRadius: auraW * 0.1,
                    backgroundColor: '#00D595',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                <AuraGlyphText
                    style={{
                        fontSize: auraW * 0.05,
                        color: '#100E1A',
                        fontFamily: viritravefonts.sanvibeBold,
                    }}
                >
                    {runeIndex === visionScroll.length - 1
                        ? 'Start Tracking Now'
                        : runeIndex === 0
                        ? 'Let’s Begin'
                        : 'Next'}
                </AuraGlyphText>
            </PulseTapNode>
        </AuraShellStage>
    );
};

export default VibeSpiritTrackerOnboarding;