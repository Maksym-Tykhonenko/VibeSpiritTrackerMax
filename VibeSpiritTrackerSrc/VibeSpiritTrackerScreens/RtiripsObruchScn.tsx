import ShowUserWalpapersWhichHave from './ShowUserWalpapersWhichHave';
import { viritravefonts } from '../viritravefonts';
import TrackerArticles from './TrackerArticles';
import Spiriparamsapge from './Spiriparamsapge';
import randofacts from '../Vibedata/randofacts';
import React, {
    useState as vexSpinLatch,
    useMemo as shardMemoPulse,
} from 'react';
import SpprtNexxScene from './SpprtNexxScene';


import {
    Text as RuneTextLine,
    View as FramelockBox,
    Image as PixLayerShard,
    TouchableOpacity as PressRuneTap,
    SafeAreaView as SafePlateHalo,
    Dimensions as DimenPulseGrid,
} from 'react-native';

type DriftPages =
    | 'wrapday-core'
    | 'vibe-reads'
    | 'owned-wallpix'
    | 'spirit-config';
const { width: GSK_W, height: GSK_H } = DimenPulseGrid.get('window');

const navRunes = [
    {
        jump: 'wrapday-core' as DriftPages,
        ico: require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/btnsofbr/dom.png'),
    },
    {
        jump: 'vibe-reads' as DriftPages,
        ico: require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/btnsofbr/articles.png'),
    },
    {
        jump: 'owned-wallpix' as DriftPages,
        ico: require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/btnsofbr/wallpapers.png'),
    },
    {
        jump: 'spirit-config' as DriftPages,
        ico: require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/btnsofbr/nalashtyvannya.png'),
    },
];

const RtiripsObruchScn: React.FC = () => {
    const [activeDrift, setActiveDrift] =
        vexSpinLatch<DriftPages>('wrapday-core');

    const shardFact = shardMemoPulse(() => {
        return randofacts[Math.floor(Math.random() * randofacts.length)];
    }, []);

    const [quizFlux, setQuizFlux] = vexSpinLatch<{ quizStarted: boolean; quizDone: boolean }>({
        quizStarted: false,
        quizDone: false,
    });

    const CoreWrapView = (
        <SpprtNexxScene
            randomFact={shardFact}
            onQuizStateChange={(s: { quizStarted: boolean; quizDone: boolean }) =>
                setQuizFlux(s)
            }
        />
    );

    const resolveScreen = (key: DriftPages) => {
        switch (key) {
            case 'wrapday-core':
                return CoreWrapView;
            case 'vibe-reads':
                return <TrackerArticles randomFact={shardFact} />;
            case 'owned-wallpix':
                return <ShowUserWalpapersWhichHave />;
            case 'spirit-config':
                return <Spiriparamsapge />;
            default:
                return null;
        }
    };

    const headerTitle =
        activeDrift === 'wrapday-core'
            ? 'Main menu'
            : activeDrift === 'vibe-reads'
            ? 'Articles'
            : activeDrift === 'owned-wallpix'
            ? 'Wallpapers'
            : 'Settings';

    return (
        <FramelockBox style={{ width: GSK_W, flex: 1, height: GSK_H }}>
            <FramelockBox
                style={{
                    paddingBottom: GSK_H * 0.023,
                    shadowOpacity: 0.7,
                    shadowOffset: { width: 0, height: 3 },
                    backgroundColor: '#281C43',
                    width: GSK_W,
                    borderBottomRightRadius: GSK_W * 0.07,
                    zIndex: 10,
                    shadowColor: '#000',
                    shadowRadius: 10,
                    elevation: 8,
                    alignSelf: 'center',
                    alignItems: 'center',
                    borderBottomLeftRadius: GSK_W * 0.07,
                }}
            >
                <SafePlateHalo
                    style={{
                        justifyContent:
                            activeDrift === 'wrapday-core'
                                ? 'center'
                                : 'space-between',
                        paddingHorizontal: GSK_W * 0.012,
                        alignItems: 'center',
                        flexDirection:
                            activeDrift === 'wrapday-core'
                                ? quizFlux.quizStarted || quizFlux.quizDone
                                    ? 'row'
                                    : 'column'
                                : 'row',
                        alignSelf: 'center',
                        width: GSK_W * 0.91,
                    }}
                >
                    {activeDrift !== 'wrapday-core' && (
                        <PixLayerShard
                            source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vibeLogo.png')}
                            style={{
                                width: GSK_W * 0.16,
                                height: GSK_W * 0.16,
                                resizeMode: 'contain',
                            }}
                        />
                    )}

                    {activeDrift === 'wrapday-core' &&
                        (quizFlux.quizStarted || quizFlux.quizDone) && (
                            <PixLayerShard
                                source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vibeLogo.png')}
                                style={{
                                    resizeMode: 'contain',
                                    height: GSK_W * 0.16,
                                    width: GSK_W * 0.16,
                                }}
                            />
                        )}

                    <RuneTextLine
                        style={{
                            maxWidth: GSK_W * 0.59,
                            fontSize: GSK_W * 0.05,
                            textAlign: 'center',
                            fontFamily: viritravefonts.sanvibeBold,
                            width: GSK_W * 0.59,
                            color: 'white',
                        }}
                        adjustsFontSizeToFit
                        numberOfLines={2}
                    >
                        {headerTitle}
                    </RuneTextLine>

                    {activeDrift !== 'wrapday-core' && (
                        <FramelockBox style={{ width: GSK_W * 0.16 }} />
                    )}

                    {activeDrift === 'wrapday-core' &&
                        (quizFlux.quizStarted || quizFlux.quizDone) && (
                            <FramelockBox style={{ width: GSK_W * 0.16 }} />
                        )}
                </SafePlateHalo>

                {activeDrift === 'wrapday-core' &&
                    !(quizFlux.quizStarted || quizFlux.quizDone) && (
                        <PixLayerShard
                            source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vibeLogo.png')}
                            style={{
                                marginTop: GSK_W * 0.035,
                                resizeMode: 'contain',
                                height: GSK_W * 0.4,
                                width: GSK_W * 0.4,
                            }}
                        />
                    )}
            </FramelockBox>

            <SafePlateHalo />

            {resolveScreen(activeDrift)}

            <FramelockBox
                style={{
                    paddingHorizontal: GSK_W * 0.08,
                    borderTopRightRadius: GSK_W * 0.1,
                    width: GSK_W * 1.012543,
                    elevation: 8,
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    backgroundColor: '#281C43',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowColor: '#000',
                    bottom: 0,
                    borderTopLeftRadius: GSK_W * 0.1,
                    position: 'absolute',
                }}
            >
                {navRunes.map((btn, idx) => (
                    <PressRuneTap
                        key={`nav-rune-${idx}`}
                        style={{
                            paddingVertical: GSK_H * 0.037,
                            alignItems: 'center',
                            width: GSK_H * 0.064,
                            borderRadius: GSK_W * 0.019,
                            justifyContent: 'center',
                            overflow: 'hidden',
                            borderTopColor:
                                activeDrift === btn.jump ? '#00D595' : '#4D4569',
                            borderTopWidth: 3,
                        }}
                        onPress={() => setActiveDrift(btn.jump)}
                    >
                        <PixLayerShard
                            source={btn.ico}
                            style={{
                                width: GSK_W * 0.071,
                                height: GSK_W * 0.071,
                                resizeMode: 'contain',
                                tintColor:
                                    activeDrift === btn.jump
                                        ? '#00D595'
                                        : '#4D4569',
                            }}
                        />
                    </PressRuneTap>
                ))}
            </FramelockBox>
        </FramelockBox>
    );
};

export default RtiripsObruchScn;
