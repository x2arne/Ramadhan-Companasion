import React, { useState, useRef } from 'react';
import {
  Palette,
  Download,
  Share2,
  Copy,
  Sparkles,
  Check,
  Send,
  Heart,
  Moon,
  Gift,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';

interface CardTemplate {
  id: string;
  name: string;
  category: 'ramadan' | 'idulfitri' | 'lailatulqadar';
  theme: string;
  arabicCalligraphy: string;
  defaultTitle: string;
  bgGradient: string[];
  textColor: string;
  accentColor: string;
  badgeLabel: string;
}

const TEMPLATES: CardTemplate[] = [
  {
    id: 'accent-400',
    name: 'Marhaban Ya Ramadan',
    category: 'ramadan',
    theme: 'Emas & Indigo Royal',
    arabicCalligraphy: 'رَمَضَانُ كَرِيمٌ',
    defaultTitle: 'Selamat Menunaikan Ibadah Puasa',
    bgGradient: ['#1e1b4b', '#0a0f21', '#020617'],
    textColor: '#f8fafc',
    accentColor: '#e3b23a',
    badgeLabel: 'Ramadan 1448 H',
  },
  {
    id: 'idul-fitri-emerald',
    name: 'Idul Fitri & Lebaran',
    category: 'idulfitri',
    theme: 'Emerald & Ketupat Cahaya',
    arabicCalligraphy: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
    defaultTitle: 'Selamat Hari Raya Idul Fitri 1448 H',
    bgGradient: ['#064e3b', '#022c22', '#020617'],
    textColor: '#f0fdf4',
    accentColor: '#34d399',
    badgeLabel: 'Syawal 1448 H',
  },
  {
    id: 'lailatul-qadar-violet',
    name: 'Malam Lailatul Qadar',
    category: 'lailatulqadar',
    theme: 'Violet Malam Seribu Bulan',
    arabicCalligraphy: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ',
    defaultTitle: 'Meraih Kemuliaan Lailatul Qadar',
    bgGradient: ['#3b0764', '#1e1b4b', '#09090b'],
    textColor: '#faf5ff',
    accentColor: '#c084fc',
    badgeLabel: '10 Malam Terakhir',
  },
  {
    id: 'minimalist-monochrome',
    name: 'Hitam Putih Luxury',
    category: 'ramadan',
    theme: 'Monochrome Minimalist Elegan',
    arabicCalligraphy: 'كُلُّ عَامٍ وَأَنْتُمْ بِخَيْرٍ',
    defaultTitle: 'Ramadan Penuh Berkah & Ampunan',
    bgGradient: ['#18181b', '#09090b', '#000000'],
    textColor: '#ffffff',
    accentColor: '#e4e4e7',
    badgeLabel: 'Edisi Elegan',
  },
];

const PRESET_MESSAGES = [
  'Marhaban ya Ramadan. Semoga di bulan yang suci ini, setiap detik ibadah kita diterima, hati disucikan, dan hidup kita dipenuhi limpahan rahmat serta ampunan Allah SWT.',
  'Taqabbalallahu minna wa minkum, shiyamana wa shiyamakum. Selamat Hari Raya Idul Fitri 1448 H. Minal Aidin Wal Faizin, mohon maaf lahir dan batin atas segala khilaf dan salah.',
  'Di antara heningnya malam Ramadan, teriring doa tulus semoga Allah melimpahkan kesehatan, keberkahan rezeki, dan mempertemukan kita dengan malam mulia Lailatul Qadar.',
  'Selamat menyambut bulan suci Ramadan! Mari jadikan bulan ini madrasah ruhani untuk memperbaiki diri, melipatgandakan sedekah, dan mempererat tali silaturahmi.',
];

export const KartuUcapanPage: React.FC = () => {
  const { showToast } = useToast();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [recipientName, setRecipientName] = useState<string>('Sahabat & Keluarga Tercinta');
  const [senderName, setSenderName] = useState<string>('Keluarga Kami');
  const [customMessage, setCustomMessage] = useState<string>(PRESET_MESSAGES[0]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const cardPreviewRef = useRef<HTMLDivElement | null>(null);

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  // Copy greeting text to clipboard
  const handleCopyText = async () => {
    const fullText = `*${currentTemplate.defaultTitle}*\n\nKepada: *${recipientName}*\n\n"${customMessage}"\n\nDari: *${senderName}*\n\n_Dibuat dengan Ramadan Companion — ramadhan-site.vercel.app_`;
    try {
      await navigator.clipboard.writeText(fullText);
      showToast({
        title: 'Teks Ucapan Disalin!',
        message: 'Teks ucapan siap ditempel ke WhatsApp, Telegram, atau media sosial.',
        type: 'success',
      });
    } catch (_) {
      showToast({
        title: 'Gagal Menyalin',
        message: 'Silakan salin teks ucapan secara manual.',
        type: 'error',
      });
    }
  };

  // Share to WhatsApp directly
  const handleShareWhatsApp = () => {
    const fullText = `*${currentTemplate.defaultTitle}*\n\nKepada: *${recipientName}*\n\n"${customMessage}"\n\nDari: *${senderName}*\n\n_Dibuat dengan Ramadan Companion — ramadhan-site.vercel.app_`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(waUrl, '_blank');
  };

  // Download Image as PNG via HTML5 Canvas
  const handleDownloadImage = () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350; // 4:5 Instagram Portrait / WhatsApp status ratio
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, currentTemplate.bgGradient[0]);
      grad.addColorStop(0.5, currentTemplate.bgGradient[1]);
      grad.addColorStop(1, currentTemplate.bgGradient[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Decorative Islamic Stars & Border
      ctx.strokeStyle = currentTemplate.accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

      // 3. Top Badge
      ctx.fillStyle = currentTemplate.accentColor;
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentTemplate.badgeLabel.toUpperCase(), canvas.width / 2, 130);

      // 4. Arabic Calligraphy
      ctx.fillStyle = currentTemplate.accentColor;
      ctx.font = 'bold 64px "Amiri", serif';
      ctx.fillText(currentTemplate.arabicCalligraphy, canvas.width / 2, 260);

      // 5. Main Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(currentTemplate.defaultTitle, canvas.width / 2, 380);

      // 6. Recipient
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '28px sans-serif';
      ctx.fillText(`Kepada Yth: ${recipientName}`, canvas.width / 2, 470);

      // 7. Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 150, 520);
      ctx.lineTo(canvas.width / 2 + 150, 520);
      ctx.stroke();

      // 8. Custom Message (Multi-line wrap)
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '32px sans-serif';
      const words = customMessage.split(' ');
      let line = '';
      let y = 620;
      const maxWidth = 860;
      const lineHeight = 50;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line.trim(), canvas.width / 2, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), canvas.width / 2, y);

      // 9. Sender Box
      const senderY = 1080;
      ctx.fillStyle = currentTemplate.accentColor;
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(`Dari: ${senderName}`, canvas.width / 2, senderY);

      // 10. Footer Attribution
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '22px sans-serif';
      ctx.fillText('Ramadan Companion • ramadhan-site.vercel.app', canvas.width / 2, 1260);

      // Convert Canvas to Image URL & Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Kartu-Ucapan-${currentTemplate.id}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast({
        title: 'Gambar Kartu Diunduh!',
        message: 'Kartu ucapan beresolusi tinggi berhasil disimpan ke perangkat Anda.',
        type: 'success',
        duration: 3500,
      });
    } catch (e) {
      console.error(e);
      showToast({
        title: 'Gagal Mengunduh',
        message: 'Terjadi kesalahan saat memproses gambar.',
        type: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-28 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 bg-surface border border-accent-500/30">

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="gold" dot>
              Generator Kartu Ucapan Ramadan & Idul Fitri
            </Badge>
            <Badge variant="blue">Unduh PNG & Kirim WhatsApp</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-ink-100 tracking-tight">
            Pembuat Kartu Ucapan Estetik Islami
          </h1>

          <p className="text-xs sm:text-sm text-ink-300 leading-relaxed max-w-2xl">
            Buat kartu ucapan Ramadan, Lailatul Qadar, dan Selamat Hari Raya Idul Fitri dengan nama pribadi Anda. Simpan langsung sebagai gambar atau bagikan ke keluarga dan kerabat!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CUSTOMIZATION CONTROLS */}
        <div className="lg:col-span-6 space-y-5">
          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-accent-700" />
              Pilih Tema Desain
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-surface-elevated border-accent-500 ring-2 ring-accent-500/20'
                      : 'bg-surface border-ink-800 hover:border-ink-700'
                  }`}
                >
                  <div
                    className="w-full h-8 rounded-lg mb-2 border border-white/10"
                    style={{
                      background: `linear-gradient(to right, ${tmpl.bgGradient[0]}, ${tmpl.bgGradient[1]})`,
                    }}
                  />
                  <p className="text-xs font-bold text-ink-100">{tmpl.name}</p>
                  <p className="text-xs text-ink-400">{tmpl.theme}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields: Sender & Recipient */}
          <Card className="p-5 bg-surface border-ink-800 space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-300 block mb-1.5">
                Kepada (Nama Penerima):
              </label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Contoh: Sahabatku Ahmad / Keluarga Besar"
                className="bg-ink-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-300 block mb-1.5">
                Dari (Nama Pengirim):
              </label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Contoh: Fulan & Keluarga"
                className="bg-ink-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="text-xs font-semibold text-ink-300">
                  Isi Pesan & Doa Ucapan:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (PRESET_MESSAGES.indexOf(customMessage) + 1) % PRESET_MESSAGES.length;
                    setCustomMessage(PRESET_MESSAGES[nextIdx]);
                  }}
                  className="text-xs text-accent-700 hover:text-accent-800 flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3 h-3" /> Ganti Kalimat Ucapan
                </button>
              </div>
              <textarea
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                className="w-full bg-ink-900 border border-ink-700/80 rounded-lg p-3 text-xs text-ink-200 focus:outline-none focus:border-accent-500/80 resize-none leading-relaxed"
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <Button
              variant="primary"
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-accent-400 hover:bg-accent-500 text-on-accent font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Menyimpan...' : 'Unduh Gambar'}</span>
            </Button>

            <Button
              variant="secondary"
              onClick={handleShareWhatsApp}
              className="w-full flex items-center justify-center gap-2 border-accent-600/50 text-accent-700 hover:bg-ink-800/30"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim WhatsApp</span>
            </Button>

            <Button
              variant="ghost"
              onClick={handleCopyText}
              className="w-full flex items-center justify-center gap-2 border border-ink-700 text-ink-300 hover:bg-ink-800"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Teks</span>
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE CARD PREVIEW (WYSIWYG) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <p className="text-xs font-semibold text-ink-400 mb-3">
            Pratinjau Kartu (Live Preview)
          </p>

          {/* Interactive Card Canvas Preview Container */}
          <div
            ref={cardPreviewRef}
            className="w-full max-w-sm rounded-xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 border border-white/15 select-none"
            style={{
              background: `linear-gradient(135deg, ${currentTemplate.bgGradient[0]}, ${currentTemplate.bgGradient[1]} 60%, ${currentTemplate.bgGradient[2]})`,
              color: currentTemplate.textColor,
            }}
          >
            {/* Inner Border Frame */}
            <div className="absolute inset-3 rounded-xl border border-white/20 pointer-events-none" />

            {/* Top Badge */}
            <div className="text-center mb-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold "
                style={{
                  backgroundColor: `${currentTemplate.accentColor}25`,
                  color: currentTemplate.accentColor,
                  border: `1px solid ${currentTemplate.accentColor}50`,
                }}
              >
                {currentTemplate.badgeLabel}
              </span>
            </div>

            {/* Arabic Calligraphy Header */}
            <div className="text-center mb-4">
              <p
                className="text-2xl sm:text-3xl font-amiri font-bold drop-shadow-md leading-relaxed"
                style={{ color: currentTemplate.accentColor }}
                dir="rtl"
              >
                {currentTemplate.arabicCalligraphy}
              </p>
            </div>

            {/* Greeting Title */}
            <div className="text-center mb-4">
              <h2 className="text-base sm:text-lg font-bold tracking-tight leading-snug">
                {currentTemplate.defaultTitle}
              </h2>
            </div>

            {/* Recipient */}
            <div className="text-center mb-4">
              <p className="text-xs text-ink-300">
                Kepada Yth: <strong className="text-ink-50 font-semibold">{recipientName}</strong>
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-0.5 mx-auto bg-ink-800/60 my-4" />

            {/* Custom Message Content */}
            <div className="text-center my-6">
              <p className="text-xs sm:text-sm text-ink-200 leading-relaxed font-normal italic">
                "{customMessage}"
              </p>
            </div>

            {/* Sender */}
            <div className="text-center mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-ink-300">Dari:</p>
              <p
                className="text-sm font-bold tracking-tight mt-0.5"
                style={{ color: currentTemplate.accentColor }}
              >
                {senderName}
              </p>
            </div>

            {/* Footer Branding */}
            <div className="text-center mt-6">
              <p className="text-xs text-ink-50/40">
                Ramadan Companion • ramadhan-site.vercel.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

