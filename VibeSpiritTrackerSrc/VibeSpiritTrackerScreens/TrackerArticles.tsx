import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
    Dimensions as Dimzmerker,
    View as Ckerivieew,
    TouchableOpacity as Tapperpiri,
    Text as Ratibetexter,
    Share,
    Image as Beimgage,
    FlatList,
    Animated,
    Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import intearticles from '../Vibedata/intearticles';
import { viritravefonts } from '../viritravefonts';
import { ScrollView } from 'react-native-gesture-handler';

const SAVE_KEY = 'SAVED_ARTICLES';

export default function TrackerArticles() {
    const { width: tracibewith, height: tracibeheit } = Dimzmerker.get('window');
    // Замість Unsaved/Saved тепер All/Saved
    const [selectedTab, setSelectedTab] = useState<'All' | 'Saved'>('All');
    const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        AsyncStorage.getItem(SAVE_KEY).then(data => {
            if (data) setSavedIds(JSON.parse(data));
        });
    }, []);

    const handleSave = async (id: string) => {
        let newSaved: string[];
        if (savedIds.includes(id)) {
            newSaved = savedIds.filter(i => i !== id);
        } else {
            newSaved = [...savedIds, id];
        }
        setSavedIds(newSaved);
        await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(newSaved));
    };

    const filteredArticles = useMemo(() => {
        return selectedTab === 'Saved'
            ? intearticles.filter(a => savedIds.includes(a.id))
            : intearticles;
    }, [selectedTab, savedIds]);

    const handleShare = async (article: any) => {
        try {
            await Share.share({
                message: `${article.title}\n\n${article.body}`,
            });
        } catch (e) { }
    };

    useEffect(() => {
        if (selectedTab === 'Saved' && filteredArticles.length === 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            animatedValue.stopAnimation();
            animatedValue.setValue(0);
        }
    }, [selectedTab, filteredArticles.length, animatedValue]);

    // --- Article List ---
    if (!selectedArticle) {
        const showNoSaved =
            selectedTab === 'Saved' &&
            (filteredArticles.length === 0);

        return (
            <Ckerivieew style={{
                    paddingTop: tracibeheit * 0.019,
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                {/* Tabs */}
                <Ckerivieew
                    style={{
                        width: tracibewith * 0.93,
                        flexDirection: 'row',
                        borderRadius: tracibewith * 0.055,
                        alignSelf: 'center',
                        marginBottom: tracibeheit * 0.019,
                        backgroundColor: '#332F47',
                    }}
                >
                    {['All', 'Saved'].map(tab => (
                        <Tapperpiri
                            key={tab}
                            style={{
                                borderRadius: tracibewith * 0.055,
                                flex: 1,
                                backgroundColor: selectedTab === tab ? '#3FEA9A' : 'transparent',
                                alignItems: 'center',
                                paddingVertical: tracibeheit * 0.012,
                            }}
                            onPress={() => setSelectedTab(tab as 'All' | 'Saved')}
                        >
                            <Ratibetexter
                                style={{
                                    color: selectedTab === tab ? '#18142B' : '#A9A6C1',
                                    fontFamily: viritravefonts.sanvibeBold,
                                    fontSize: tracibewith * 0.045,
                                }}
                            >
                                {tab}
                            </Ratibetexter>
                        </Tapperpiri>
                    ))}
                </Ckerivieew>

                {showNoSaved && (
                    <Animated.View
                        style={{
                            marginTop: tracibeheit * 0.25,
                            transform: [
                                {
                                    translateY: animatedValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -20],
                                    }),
                                },
                                {
                                    scale: animatedValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 1.08],
                                    }),
                                },
                            ],
                            opacity: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.7, 1],
                            }),
                        }}
                    >
                        <Ratibetexter
                            style={{
                                color: 'white',
                                fontFamily: viritravefonts.sanvibeBold,
                                fontSize: tracibewith * 0.045,
                                textAlign: 'center',
                            }}
                        >
                            You have no saved articles.
                        </Ratibetexter>
                    </Animated.View>
                )}
                {/* Article List */}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: tracibeheit * 0.16 }}
                    data={filteredArticles}
                    renderItem={({ item }) => (
                        <Tapperpiri
                            style={{
                                marginBottom: tracibeheit * 0.025,
                                borderRadius: tracibewith * 0.055,
                                backgroundColor: '#4B436B',
                                width: tracibewith * 0.93,
                                paddingVertical: tracibeheit * 0.022,
                                alignSelf: 'center',
                                paddingHorizontal: tracibewith * 0.045,
                                alignItems: 'center',
                            }}
                            onPress={() => setSelectedArticle(item)}
                            activeOpacity={0.88}
                        >
                            <Ratibetexter
                                style={{
                                    color: 'white',
                                    fontFamily: viritravefonts.sanvibeBold,
                                    fontSize: tracibewith * 0.045,
                                    fontWeight: '700',
                                }}
                            >
                                {item.title}
                            </Ratibetexter>
                            <Ratibetexter
                                style={{
                                    fontSize: tracibewith * 0.039,
                                    fontFamily: viritravefonts.sanvibeMedium,
                                    alignSelf: 'flex-end',
                                    marginTop: tracibeheit * 0.012,
                                    color: '#3FEA9A',
                                }}
                            >
                                More&gt;
                            </Ratibetexter>
                        </Tapperpiri>
                    )}
                    ListEmptyComponent={showNoSaved ? null : undefined}
                />
            </Ckerivieew>
        );
    }

    // --- Article Detail ---
    return (
        <Ckerivieew
            style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: tracibeheit * 0.045,
                width: tracibewith * 0.95,
                alignSelf: 'center',
            }}
        >
            {/* Back Arrow */}
            <Tapperpiri
                style={{
                    alignSelf: 'flex-start',
                    zIndex: 10,
                    marginLeft: tracibewith * 0.035,
                }}
                onPress={() => setSelectedArticle(null)}
            >
                <Beimgage
                    source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/reverseShr.png')}
                    style={{
                        width: tracibewith * 0.08,
                        height: tracibewith * 0.08,
                        resizeMode: 'contain',
                    }}
                />
            </Tapperpiri>

            <ScrollView style={{ flex: 1, width: '100%' }} showsVerticalScrollIndicator={false} contentContainerStyle={{
                paddingBottom: tracibeheit * 0.21,
                alignItems: 'center',
            }}>
                {/* Title */}
                <Ratibetexter
                    style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: tracibewith * 0.059,
                        marginTop: tracibeheit * 0.014,
                        marginBottom: tracibeheit * 0.025,
                        fontFamily: viritravefonts.sanvibeBold,
                    }}
                >
                    {selectedArticle.title}
                </Ratibetexter>
                {/* Body */}
                <Ratibetexter
                    style={{
                        color: 'white',
                        fontFamily: viritravefonts.sanvibeMedium,
                        fontSize: tracibewith * 0.04,
                        lineHeight: tracibeheit * 0.032,
                        marginBottom: tracibeheit * 0.04,
                        textAlign: 'center',
                        width: tracibewith * 0.93,
                    }}
                >
                    {selectedArticle.content}
                </Ratibetexter>
                {/* Share & Save */}
                <Tapperpiri
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#4B436B',
                        width: tracibewith * 0.82,
                        justifyContent: 'space-between',
                        borderRadius: tracibewith * 0.1,
                        paddingHorizontal: tracibewith * 0.088,
                        height: tracibeheit * 0.07,
                        marginBottom: tracibeheit * 0.025,
                    }}
                    onPress={() => handleShare(selectedArticle)}
                    activeOpacity={0.85}
                >
                    <Ratibetexter
                        style={{
                            color: 'white',
                            fontFamily: viritravefonts.sanvibeMedium,
                            fontSize: tracibewith * 0.05,
                            marginRight: tracibewith * 0.03,
                        }}
                    >
                        Share
                    </Ratibetexter>
                    <Beimgage
                        source={require('../VibeSpiritTrackerAssets/VibeSpiritTrackerImages/shareTheResult.png')}
                        style={{
                            width: tracibewith * 0.08,
                            height: tracibewith * 0.08,
                            resizeMode: 'contain',
                        }}
                    />
                </Tapperpiri>
                <Tapperpiri
                    style={{
                        width: tracibewith * 0.82,
                        alignItems: 'center',
                        borderRadius: tracibewith * 0.1,
                        backgroundColor: savedIds.includes(selectedArticle.id) ? '#00D595' : '#4B436B',
                        justifyContent: 'center',
                        height: tracibeheit * 0.07,
                    }}
                    onPress={() => handleSave(selectedArticle.id)}
                    activeOpacity={0.85}
                >
                    <Ratibetexter
                        style={{
                            color: savedIds.includes(selectedArticle.id) ? '#100E1A' : 'white',
                            fontFamily: viritravefonts.sanvibeMedium,
                            fontSize: tracibewith * 0.05,
                        }}
                    >
                        Save{savedIds.includes(selectedArticle.id) ? 'd' : ''}
                    </Ratibetexter>
                </Tapperpiri>
            </ScrollView>
        </Ckerivieew>
    );
}