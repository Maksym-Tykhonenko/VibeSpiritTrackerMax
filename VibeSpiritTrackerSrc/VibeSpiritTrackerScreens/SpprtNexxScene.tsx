import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
    Dimensions as Dimkespi,
    View as SPiritobox,
    TouchableOpacity as TravitraTap,
    Text as Ckertext,
    Share,
    Image as Beimgage,
    FlatList,
    Animated,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { viritravefonts } from '../viritravefonts';
import questionsForShowMood from '../Vibedata/questinsForShowMood';

const pirateImg = require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/moodsAfterAnswers/red.png'); // 🔴
const sunImg = require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/moodsAfterAnswers/yellow.png'); // 🟡
const leafImg = require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/moodsAfterAnswers/green.png'); // 🟢
const cloudImg = require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/moodsAfterAnswers/blue.png'); // 🔵

const moodImages: Record<string, any> = {
    '🟡': sunImg,
    '🟢': leafImg,
    '🔵': cloudImg,
    '🔴': pirateImg,
};

const moodTitles: Record<string, string> = {
    '🟡': 'Your result today:',
    '🟢': 'Your result today:',
    '🔵': 'Your result today:',
    '🔴': 'Your result today:',
};

function getTodayKey() {
    const d = new Date();
    return `quiz_result_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
}

function pickRandomQuestions(arr: any[], n: number) {
    const copy = [...arr];
    const res = [];
    while (res.length < n && copy.length) {
        const idx = Math.floor(Math.random() * copy.length);
        res.push(copy.splice(idx, 1)[0]);
    }
    return res;
}

// --- загальні шпалери (НЕ по муду, а просто 4 по черзі) ---
const globalWallpapers = [
    require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vipapers/tiger.png'),
    require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vipapers/bee.png'),
    require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vipapers/bull.png'),
    require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/vipapers/chinawoman.png'),
];

export default function SpprtNexxScene({
    randomFact,
    onQuizStateChange,
}: {
    randomFact: string,
    onQuizStateChange?: (state: { quizStarted: boolean, quizDone: boolean }) => void
}) {
    const { width: tracibewith, height: tracibeheit } = Dimkespi.get('window');
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizDone, setQuizDone] = useState(false);
    const [quizResult, setQuizResult] = useState<string | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showWallpaper, setShowWallpaper] = useState<{ uri: any } | null>(null);
    const [showWallpaperModal, setShowWallpaperModal] = useState(false);
    const [wallpaperToShow, setWallpaperToShow] = useState<any>(null);
    const modalOpacity = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.85)).current;

    // Check if quiz is done for today
    useEffect(() => {
        (async () => {
            const key = getTodayKey();
            const res = await AsyncStorage.getItem(key);
            if (res) {
                setQuizDone(true);
                setQuizResult(res);
            }
        })();
    }, []);

    // Start quiz: pick 5 random questions
    const startQuiz = () => {
        setQuizQuestions(pickRandomQuestions(questionsForShowMood, 5));
        setAnswers([]);
        setCurrentQ(0);
        setQuizStarted(true);
        setSelectedOption(null);
    };

    // Handle answer (now called on Next)
    const handleAnswer = () => {
        if (selectedOption === null) return;
        const mood = quizQuestions[currentQ].options[selectedOption].mood;
        const newAnswers = [...answers, mood];
        if (newAnswers.length === 5) {
            // Calculate result
            const counts: Record<string, number> = {};
            for (const m of newAnswers) counts[m] = (counts[m] || 0) + 1;
            const max = Math.max(...Object.values(counts));
            const moodsWithMax = Object.keys(counts).filter(m => counts[m] === max);
            const finalMood = moodsWithMax[Math.floor(Math.random() * moodsWithMax.length)];
            // Save to AsyncStorage
            const key = getTodayKey();
            AsyncStorage.setItem(key, finalMood);
            setQuizResult(finalMood);
            setQuizDone(true);
            setQuizStarted(false);
        } else {
            setAnswers(newAnswers);
            setCurrentQ(currentQ + 1);
            setSelectedOption(null);
        }
    };

    // Share result
    const handleShareResult = () => {
        Share.share({
            message: `My mood today: ${quizResult ?? ''}`,
        });
    };

    // Share fact
    const handleShareFact = () => {
        Share.share({
            message: `Do you want interesting fact?\n${randomFact}`,
        });
    };

    useEffect(() => {
        if (onQuizStateChange) onQuizStateChange({ quizStarted, quizDone });
    }, [quizStarted, quizDone]);

    // --- допоміжна функція для отримання ключа попереднього дня ---
    function getPrevDayKey() {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return `quiz_result_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
    }

    // --- при монтуванні/оновленні quizDone/quizResult ---
    useEffect(() => {
        if (quizDone && quizResult) {
            (async () => {
                const prevKey = getPrevDayKey();
                const prevMood = await AsyncStorage.getItem(prevKey);

                if (prevMood === quizResult) {
                    const wallIdxKey = `wallpaper_idx_global`;
                    let idx = Number(await AsyncStorage.getItem(wallIdxKey)) || 0;
                    if (globalWallpapers.length > 0) {
                        // Перевіряємо чи вже показували цю шпалеру сьогодні
                        const todayKey = `wallpaper_shown_${new Date().toISOString().slice(0, 10)}`;
                        const alreadyShown = await AsyncStorage.getItem(todayKey);
                        if (!alreadyShown) {
                            setWallpaperToShow(globalWallpapers[idx % globalWallpapers.length]);
                            setShowWallpaperModal(true);
                            // Відмічаємо, що сьогодні вже показували
                            await AsyncStorage.setItem(todayKey, '1');
                            // Оновлюємо індекс для наступного разу
                            await AsyncStorage.setItem(wallIdxKey, String((idx + 1) % globalWallpapers.length));
                        } else {
                            setShowWallpaper(null);
                        }
                    }
                } else {
                    setShowWallpaper(null);
                }
            })();
        } else {
            setShowWallpaper(null);
        }
    }, [quizDone, quizResult]);

    // --- Анімація модалки з новою шпалерою ---
    useEffect(() => {
        if (showWallpaperModal) {
            modalOpacity.setValue(0);
            modalScale.setValue(0.85);
            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.spring(modalScale, {
                    toValue: 1,
                    friction: 7,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();

            // Автоматичне закриття через 2.5 секунди
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(modalOpacity, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                    Animated.timing(modalScale, {
                        toValue: 0.85,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    setShowWallpaperModal(false);
                    setShowWallpaper(null);
                });
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [showWallpaperModal]);

    // --- Wallpaper modal (анімована) ---
    if (showWallpaperModal && wallpaperToShow) {
        return (
            <Modal visible transparent animationType="none">
                <SPiritobox style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.65)',
                }}>
                    <Animated.View
                        style={{
                            opacity: modalOpacity,
                            transform: [{ scale: modalScale }],
                            backgroundColor: '#2D2640',
                            borderRadius: tracibewith * 0.07,
                            padding: tracibewith * 0.06,
                            alignItems: 'center',
                            shadowColor: '#00FFB0',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.3,
                            shadowRadius: 15,
                            elevation: 10,
                            width: tracibewith * 0.91,
                        }}
                    >
                        <Ckertext
                            style={{
                                color: '#00FFB0',
                                fontFamily: viritravefonts.sanvibeBold,
                                fontSize: tracibewith * 0.07,
                                textAlign: 'center',
                                marginBottom: tracibeheit * 0.019,
                                width: tracibewith * 0.91,
                            }}
                        >
                            Opened new wallpaper for your mood
                        </Ckertext>
                        <Beimgage
                            source={wallpaperToShow}
                            style={{
                                width: tracibewith * 0.8,
                                height: tracibeheit * 0.53,
                                resizeMode: 'cover',
                                alignSelf: 'center',
                                borderRadius: tracibewith * 0.05,
                                marginBottom: tracibeheit * 0.01,
                            }}
                        />
                    </Animated.View>
                </SPiritobox>
            </Modal>
        );
    }

    // --- UI ---
    // --- Wallpaper screen (після модалки, просто показувати mood) ---
    if (showWallpaper) {
        return (
            <SPiritobox style={{
                flex: 1,
                alignItems: 'center',

                // backgroundColor: 'black',
            }}>

                <Ckertext
                    style={{
                        color: 'white',
                        fontFamily: viritravefonts.sanvibeBold,
                        fontSize: tracibewith * 0.07,
                        textShadowColor: '#000',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 8,
                        marginTop: tracibeheit * 0.019,
                        textAlign: 'center',
                        width: tracibewith * 0.91,
                    }}
                >
                    Opened new wallpaper for your mood
                </Ckertext>

                <Beimgage
                    source={showWallpaper.uri}
                    style={{
                        width: tracibewith * 0.8,
                        height: tracibeheit * 0.53,
                        resizeMode: 'cover',
                        alignSelf: 'center',
                        borderRadius: tracibewith * 0.05,
                        marginTop: tracibeheit * 0.03,
                    }}
                />
            </SPiritobox>
        );
    }

    // Quiz screen
    if (quizStarted && quizQuestions.length === 5) {
        const q = quizQuestions[currentQ];
        return (
            <SPiritobox style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', paddingTop: tracibeheit * 0.045 }}>
                {/* Progress */}
                <Ckertext
                    style={{
                        color: '#E95CFB',
                        fontFamily: viritravefonts.sanvibeBold,
                        fontSize: tracibewith * 0.09,
                        alignSelf: 'center',
                        marginBottom: tracibeheit * 0.01,
                    }}
                >
                    {currentQ + 1}/5
                </Ckertext>
                {/* Question */}
                <Ckertext
                    style={{
                        color: 'white',
                        fontFamily: viritravefonts.sanvibeReg,
                        fontSize: tracibewith * 0.052,
                        textAlign: 'center',
                        marginBottom: tracibeheit * 0.03,
                        marginHorizontal: tracibewith * 0.07,
                    }}
                >
                    {q.question}
                </Ckertext>
                {/* Options */}
                <SPiritobox style={{ width: '100%', alignItems: 'center', marginBottom: tracibeheit * 0.03 }}>
                    {q.options.map((opt: any, idx: number) => (
                        <TravitraTap
                            key={idx}
                            onPress={() => setSelectedOption(idx)}
                            style={{
                                width: tracibewith * 0.87,
                                minHeight: tracibeheit * 0.07,
                                backgroundColor: '#4B436B',
                                borderRadius: tracibewith * 0.07,
                                borderWidth: selectedOption === idx ? 2 : 0,
                                borderColor: selectedOption === idx ? '#3FEA9A' : 'transparent',
                                marginBottom: tracibeheit * 0.018,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: tracibeheit * 0.012,
                                
                            }}
                        >
                            <Ckertext
                                style={{
                                    color: 'white',
                                    fontFamily: viritravefonts.sanvibeRegular,
                                    fontSize: tracibewith * 0.045,
                                    maxWidth: tracibewith * 0.84,
                                }}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {opt.text}
                            </Ckertext>
                        </TravitraTap>
                    ))}
                </SPiritobox>
                {/* Next button */}
                <TravitraTap
                    style={{
                        width: tracibewith * 0.6,
                        height: tracibeheit * 0.065,
                        backgroundColor: selectedOption !== null ? '#00E6A0' : '#39324B',
                        borderRadius: tracibewith * 0.09,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: tracibeheit * 0.01,
                        opacity: selectedOption !== null ? 1 : 0.5,
                    }}
                    activeOpacity={selectedOption !== null ? 0.7 : 1}
                    onPress={selectedOption !== null ? handleAnswer : undefined}
                >
                    <Ckertext
                        style={{
                            color: '#18142B',
                            fontFamily: viritravefonts.glimontSemi,
                            fontSize: tracibewith * 0.045,
                            fontWeight: '700',
                        }}
                    >
                        Next
                    </Ckertext>
                </TravitraTap>
            </SPiritobox>
        );
    }

    // Result screen
    if (quizDone && quizResult) {
        return (
            <SPiritobox style={{ flex: 1, alignItems: 'center', backgroundColor: 'transparent', paddingTop: tracibeheit * 0.045 }}>
                {/* Random fact block */}
                <SPiritobox
                    style={{
                        width: tracibewith * 0.93,
                        borderRadius: tracibewith * 0.055,
                        backgroundColor: '#4B436B',
                        paddingHorizontal: tracibewith * 0.045,
                        paddingVertical: tracibeheit * 0.01,
                        marginBottom: tracibeheit * 0.025,
                        alignSelf: 'center',
                    }}
                >
                    <Ckertext
                        style={{
                            color: 'white',
                            fontFamily: viritravefonts.sanvibeBold,
                            fontSize: tracibewith * 0.043,
                            marginBottom: tracibeheit * 0.006,
                            fontWeight: '700',
                        }}
                    >
                        Random fact
                    </Ckertext>
                    <Ckertext
                        style={{
                            color: 'white',
                            fontFamily: viritravefonts.sanvibeReg,
                            fontSize: tracibewith * 0.042,
                            lineHeight: tracibeheit * 0.025,
                            marginBottom: tracibeheit * 0.004,
                        }}
                    >
                        {randomFact}
                    </Ckertext>
                    <TravitraTap onPress={handleShareFact} style={{
                        position: 'absolute',
                        right: tracibewith * 0.045,
                        bottom: tracibeheit * 0.01,
                    }}>
                        <Ckertext
                            style={{
                                color: '#3FEA9A',
                                fontFamily: viritravefonts.sanvibeMedium,
                                fontSize: tracibewith * 0.038,
                                alignSelf: 'flex-end',
                            }}
                        >
                            Share&gt;
                        </Ckertext>
                    </TravitraTap>
                </SPiritobox>
                {/* Divider */}
                <SPiritobox
                    style={{
                        width: tracibewith * 0.97,
                        height: 1,
                        backgroundColor: '#39324B',
                        marginBottom: tracibeheit * 0.03,
                    }}
                />
                {/* Title */}
                <Ckertext
                    style={{
                        color: 'white',
                        fontFamily: viritravefonts.sanvibeRegular,
                        fontSize: tracibewith * 0.052,
                        marginBottom: tracibeheit * 0.02,
                        alignSelf: 'center',
                    }}
                >
                    {moodTitles[quizResult]}
                </Ckertext>
                {/* Mood image */}
                <SPiritobox
                    style={{
                        width: tracibewith * 0.7,
                        height: tracibeheit * 0.33,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Beimgage
                        source={moodImages[quizResult]}
                        style={{
                            width: tracibewith * 0.6,
                            height: tracibeheit * 0.28,
                            resizeMode: 'contain',
                            borderRadius: tracibewith * 0.04,
                        }}
                    />
                </SPiritobox>
                {/* Share result button */}
                <TravitraTap
                    onPress={handleShareResult}
                    style={{
                        width: tracibewith * 0.8,
                        height: tracibeheit * 0.088,
                        backgroundColor: '#4B436B',
                        borderRadius: tracibewith * 0.09,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: tracibewith * 0.1,
                        position: 'absolute',
                        bottom: tracibeheit * 0.14,
                        alignSelf: 'center',
                    }}
                >
                    <Ckertext
                        style={{
                            color: 'white',
                            fontFamily: viritravefonts.sanvibeMedium,
                            fontSize: tracibewith * 0.05,
                            marginRight: tracibewith * 0.03,
                        }}
                    >
                        Share the result
                    </Ckertext>
                    {/* Arrow icon (можна замінити на свій SVG або PNG) */}
                    <Beimgage
                        source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/shareTheResult.png')}
                        style={{
                            width: tracibewith * 0.08,
                            height: tracibewith * 0.08,
                            resizeMode: 'contain',
                        }}
                    />
                </TravitraTap>
            </SPiritobox>
        );
    }

    // --- Default screen ---
    return (
        <SPiritobox
            style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: 'transparent',
                paddingTop: tracibeheit * 0.045,
            }}
        >
            {/* Random fact block */}
            <SPiritobox
                style={{
                    width: tracibewith * 0.93,
                    borderRadius: tracibewith * 0.055,
                    backgroundColor: '#4B436B',
                    paddingHorizontal: tracibewith * 0.045,
                    paddingVertical: tracibeheit * 0.01,
                    marginBottom: tracibeheit * 0.025,
                    alignSelf: 'center',
                }}
            >
                <Ckertext
                    style={{
                        color: 'white',
                        fontFamily: viritravefonts.sanvibeBold,
                        fontSize: tracibewith * 0.043,
                        marginBottom: tracibeheit * 0.006,
                        fontWeight: '700',
                    }}
                >
                    Random fact
                </Ckertext>
                <Ckertext
                    style={{
                        color: 'white',
                        fontFamily: viritravefonts.sanvibeReg,
                        fontSize: tracibewith * 0.042,
                        lineHeight: tracibeheit * 0.025,
                        marginBottom: tracibeheit * 0.004,
                    }}
                >
                    {randomFact}
                </Ckertext>
                <TravitraTap onPress={handleShareFact} style={{
                    position: 'absolute',
                    right: tracibewith * 0.045,
                    bottom: tracibeheit * 0.01,
                }}>
                    <Ckertext
                        style={{
                            color: '#3FEA9A',
                            fontFamily: viritravefonts.sanvibeMedium,
                            fontSize: tracibewith * 0.038,
                            alignSelf: 'flex-end',
                        }}
                    >
                        Share&gt;
                    </Ckertext>
                </TravitraTap>
            </SPiritobox>
            {/* Divider */}
            <SPiritobox
                style={{
                    width: tracibewith * 0.97,
                    height: 1,
                    backgroundColor: '#39324B',
                    marginBottom: tracibeheit * 0.03,
                }}
            />
            {/* Question */}
            <Ckertext
                style={{
                    color: 'white',
                    fontFamily: viritravefonts.glimontReg,
                    fontSize: tracibewith * 0.045,
                    marginBottom: tracibeheit * 0.04,
                    alignSelf: 'flex-start',
                    marginLeft: tracibewith * 0.045,
                }}
            >
                Do you have time to answer{'\n'}questions today?
            </Ckertext>
            {/* Calculate mood button */}
            <TravitraTap
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: tracibewith * 0.18,
                    width: tracibewith * 0.82,
                    height: tracibeheit * 0.09,
                    backgroundColor: '#00E6A0',
                    alignSelf: 'center',
                }}
                activeOpacity={0.91}
                onPress={startQuiz}
            >
                <Ckertext
                    style={{
                        color: '#18142B',
                        fontFamily: viritravefonts.glimontSemi,
                        fontSize: tracibewith * 0.062,
                        fontWeight: '700',
                    }}
                >
                    Calculate mood
                </Ckertext>
            </TravitraTap>
        </SPiritobox>
    );
}