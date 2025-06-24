import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import bg from './../assets/bg4.png';

function SurahDetails() {
  const { id } = useParams();
  const audioRef = useRef(null);
  const ayahRefs = useRef([]);

  const [surah, setSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [basmalah, setBasmalah] = useState('');
  const [loading, setLoading] = useState(true);

  const reciter = 'Alafasy_128kbps'; // يمكنك تغييره لأي قارئ متاح على Everyayah

  const formatNumber = (num) => String(num).padStart(3, '0');

  const generateAyahAudioUrl = (surahNumber, ayahNumber) => {
    return `https://everyayah.com/data/${reciter}/${formatNumber(surahNumber)}${formatNumber(ayahNumber)}.mp3`;
  };

  const fetchSurahData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`);
      const data = res.data.data;
      setSurah(data);

      const basmalahText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
      const processedAyahs = [...data.ayahs];

      if (processedAyahs[0]?.text.includes(basmalahText) && id !== '1') {
        setBasmalah(basmalahText);
        processedAyahs[0].text = processedAyahs[0].text.replace(basmalahText, '').trim();
      } else {
        setBasmalah('');
      }

      setAyahs(processedAyahs);
    } catch (err) {
      console.error('خطأ في تحميل بيانات السورة:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurahData();
    setCurrentAyahIndex(0);
  }, [id]);

  useEffect(() => {
    if (currentAyahIndex !== null && ayahRefs.current[currentAyahIndex]) {
      setTimeout(() => {
        ayahRefs.current[currentAyahIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
  }, [currentAyahIndex]);

  const handleEnded = () => {
    if (currentAyahIndex < ayahs.length - 1) {
      setCurrentAyahIndex((prev) => prev + 1);
    }
  };

  if (loading || !surah) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e9f3ef]">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#1b4d3e]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fixed bg-cover p-6 font-[Cairo]" style={{ backgroundImage: `url(${bg})` }}>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-emerald-800 drop-shadow-xl mb-2">{surah.name}</h1>
        <p className="text-emerald-600 text-lg font-medium">
          {surah.englishName} - {surah.englishNameTranslation}
        </p>
      </div>

      <div className="scrollbar-custom bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-50 backdrop-blur-md rounded-3xl p-6 shadow-lg max-w-6xl mx-auto h-[420px] overflow-y-auto border border-amber-300/40 scroll-smooth scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-yellow-100">
        <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center border-b-2 pb-3 border-emerald-600/30">الآيات</h2>
        <div className="space-y-5 text-right text-emerald-900 leading-relaxed">
          {basmalah && (
            <p className="text-sm font-bold text-center text-amber-800/60 mb-4">{basmalah}</p>
          )}
          {ayahs.map((ayah, index) => (
            <p
              key={ayah.number}
              ref={(el) => (ayahRefs.current[index] = el)}
              onClick={() => setCurrentAyahIndex(index)}
              className={`cursor-pointer rounded-lg px-3 py-2 transition-all duration-300 border-b border-dashed border-amber-200/60 ${
                index === currentAyahIndex
                  ? 'bg-yellow-200/60 backdrop-blur-3xl text-emerald-900 font-bold ring-2 ring-emerald-500/50 shadow-lg scale-[1.04]'
                  : 'hover:bg-amber-100 hover:text-emerald-800'
              }`}
            >
              {ayah.text} <span className="font-bold text-amber-700">({ayah.numberInSurah})</span>
            </p>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200 mx-auto mt-8">
        <div className="bg-emerald-800 p-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <audio
            ref={audioRef}
            key={currentAyahIndex} 
            src={generateAyahAudioUrl(surah.number, ayahs[currentAyahIndex]?.numberInSurah)}
            controls
            autoPlay
            onEnded={handleEnded}
            className="w-full rounded-md"
            style={{ accentColor: '#1b4d3e' }}
          >
            المتصفح لا يدعم تشغيل الصوت.
          </audio>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-6">
        <Link to={`/surah/${Math.max(1, parseInt(id) - 1)}`}>
          <button className="bg-emerald-700 text-white px-6 py-2 rounded-full shadow-lg hover:bg-emerald-600 transition duration-300">
            السورة السابقة
          </button>
        </Link>

        <Link to={`/surah/${Math.min(114, parseInt(id) + 1)}`}>
          <button className="bg-emerald-700 text-white px-6 py-2 rounded-full shadow-lg hover:bg-emerald-600 transition duration-300">
            السورة التالية
          </button>
        </Link>
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          to="/"
          className="bg-emerald-700 text-white px-8 py-3 rounded-full shadow-lg hover:bg-emerald-600 transition duration-300"
        >
          رجوع إلى السور
        </Link>
      </div>
    </div>
  );
}

export default SurahDetails;
