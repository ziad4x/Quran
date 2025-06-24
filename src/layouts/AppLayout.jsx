import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence, time } from 'framer-motion';

function AppLayout() {
    const [surahs, setSurahs] = useState([]);
    const [timings, setTimings] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDua, setSelectedDua] = useState('');
    const [surahsLoading, setSurahsLoading] = useState(true);
    const [prayerTimesLoading, setPrayerTimesLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

   const dailyDuas = [
  ".اللهم لك أسلمت، وبك آمنت، وعليك توكلت، وإليك خاصمت، وبك حاكمت، فاغفر لي ما قدمت وما أخرت، وأسررت وأعلنت، وما أنت أعلم به مني، لا إله إلا أنت",
  ".اللهم ربنا لك الحمد، ملء السماوات وملء الأرض، وملء ما شئت من شيء بعد أهل الثناء والمجد، لا مانع لما أعطيت، ولا معطي لما منعت ولا ينفع ذا الجد منك الجد",
  ".سبحانك اللهم ربنا وبحمدك، اللهم اغفر لي",
  ".اللهم صل على محمد وعلى آل محمد، كما صليت على إبراهيم، وعلى آل إبراهيم، إنك حميد مجيد، اللهم بارك على محمد وعلى آل محمد، كما باركت على إبراهيم وعلى آل إبراهيم، إنك حميد مجيد",
  ".اللهم إني ظلمت نفسي ظلما كثيرا ولا يغفر الذنوب إلا أنت، فاغفر لي مغفرة من عندك وارحمني، إنك أنت الغفور الرحيم",
  ".اللهم إني أعوذ بك من العجز والكسل، والجبن والهرم والبخل، وأعوذ بك من عذاب القبر ومن فتنة المحيا والممات",
  ".اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والجبن والبخل، وضلع الدين، وغلبة الرجال",
  ".اللهم إني أعوذ بك من علم لا ينفع، ومن قلب لا يخشع، ومن نفس لا تشبع، ومن دعوة لا يستجاب لها",
  ".اللهم اجعل في قلبي نورا، وفي بصري نورا، وفي سمعي نورا، وعن يميني نورا، وعن يساري نورا، وفوقي نورا، وتحتي نورا، وأمامي نورا، وخلفي نورا، وعظم لي نورا",
  ".اللهم اهدني فيمن هديت، وعافني فيمن عافيت، وتولني فيمن توليت، وبارك لي فيما أعطيت، وقني شر ما قضيت، إنك تقضي ولا يُقضى عليك",
  ".اللهم اغفر لي ذنبي كله، دقه وجله، وأوله وآخره، وعلانيته وسره",
  ".اللهم إنك عفو كريم تحب العفو فاعف عني",
  ".رب اغفر لي وتب علي إنك أنت التواب الغفور",
  ".اللهم اغفر لي وارحمني واهدني وارزقني",
  ".اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء لك بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت",
  ".لا إله إلا أنت سبحانك إني كنت من الظالمين",
  ".اللهم مصرف القلوب صرف قلوبنا على طاعتك",
  ".يا مقلب القلوب ثبت قلبي على دينك",
  ".اللهم إني أسألك الهدى والتقى والعفاف والغنى",
  ".اللهم أعوذ برضاك من سخطك، وبمعافاتك من عقوبتك، وأعوذ بك منك، لا أحصي ثناء عليك، أنت كما أثنيت على نفسك"
];

    useEffect(() => {
        if (!surahsLoading && !prayerTimesLoading) {
            const showTimeout = setTimeout(() => {
                setIsVisible(true);
            }, 2000);

            const hideTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 7000);

            return () => {
                clearTimeout(showTimeout);
                clearTimeout(hideTimeout);
            };
        }
    }, [surahsLoading, prayerTimesLoading]);


    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const res = await axios.get('https://api.alquran.cloud/v1/surah');
                setSurahs(res.data.data);
            } catch (err) {
                console.error('خطأ في جلب السور:', err);
            } finally {
                setSurahsLoading(false);
            }
        };

        const fetchPrayerTimes = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    axios
                        .get(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=5`)
                        .then((res) => setTimings(res.data.data.timings))
                        .catch((err) => console.error('فشل في تحميل مواقيت الصلاة:', err))
                        .finally(() => setPrayerTimesLoading(false));
                },
                () => setPrayerTimesLoading(false) // في حالة رفض تحديد الموقع
            );
        };

        setSelectedDua(dailyDuas[Math.floor(Math.random() * dailyDuas.length)]);
        fetchSurahs();
        fetchPrayerTimes();
    }, []);

    const removeTashkeel = (text) => {
        return text.normalize("NFD").replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, "");
    };

    const filteredSurahs = surahs.filter((surah) => {
        const name = removeTashkeel(surah.name);
        const english = surah.englishName.toLowerCase();
        const query = removeTashkeel(searchTerm.toLowerCase());

        return name.includes(query) || english.includes(query);
    });

    if (surahsLoading || prayerTimesLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#e9f3ef]">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#1b4d3e] mb-4"></div>
                <p className="text-[#1b4d3e] font-bold text-lg">اذكرك بالدعاء لباسل</p>
            </div>
        );
    }
    const changeDua = () => {
        const newIndex = Math.floor(Math.random() * dailyDuas.length);
        setSelectedDua(dailyDuas[newIndex]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#e9f3ef] to-[#dce9e0] p-4 font-[Cairo]">
            <AnimatePresence>
                {isVisible && (
                    <motion.h1
                        className="md:text-4xl text-2xl font-bold text-center text-[#155b41] my-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0}}
                        transition={{ duration: 0.8 , ease: "easeInOut" }}
                    >
                        صدقة جارية علي روح باسل وائل
                    </motion.h1>
                )}
            </AnimatePresence>
            {timings && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 shadow text-[#124734]">
                    <h3 className="text-2xl font-bold mb-2 text-center">مواقيت الصلاة</h3>
                    <ul className="grid grid-cols-2 gap-2 text-sm text-center mt-5">
                        {Object.entries(timings).map(([key, time]) => (
                            <li key={key} className="font-semibold text-lg">
                                {key}: {time}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 shadow text-[#124734]">
                <h3 className="text-2xl font-bold mb-2 text-center">دعاء اليوم</h3>
                <p className="text-sm text-center leading-relaxed">{selectedDua}</p>
                <div className="flex justify-center mt-4">
                    <button onClick={changeDua} className="p-2 rounded-full bg-[#1b4d3e] text-white hover:bg-[#155c47] transition duration-200">
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>


            <div className="bg-[#1b4d3e]/80 backdrop-blur-md text-white rounded-xl py-4 shadow-lg mb-6">
                <h1 className="text-3xl font-bold text-center tracking-wide">القرآن الكريم</h1>
            </div>

            <div className="mb-4 lg:w-[30%] w-[50%] flex ms-auto">
                <input
                    type="text"
                    placeholder="...ابحث باسم السورة"
                    className="w-full px-4 py-2 rounded-lg border border-[#1b4d3e]/30 shadow-sm focus:outline-none focus:ring focus:border-[#1b4d3e]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 " dir="rtl">
                {filteredSurahs.map((surah) => (
                    <button
                        key={surah.number}

                        onClick={() => navigate(`/surah/${surah.number}`)}
                        className="text-right bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                        <div className="z-10 relative">
                            <h2 className="text-xl font-bold text-[#1b4d3e]">{surah.name}</h2>
                            <p className="text-sm text-[#2e6650]">
                                {surah.englishName} - {surah.numberOfAyahs} آية
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AppLayout;
