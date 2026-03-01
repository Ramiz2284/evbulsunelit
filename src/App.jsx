import React, { useState, useEffect } from 'react'

// Токен и канал берутся из переменных окружения Vercel/Vite
// Задайте их в настройках проекта на Vercel:
//   VITE_TELEGRAM_BOT_TOKEN = ваш токен от @BotFather
//   VITE_TELEGRAM_CHANNEL_ID = @ваш_канал  (или числовой ID -100xxxxxxxxxx)
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHANNEL_ID = import.meta.env.VITE_TELEGRAM_CHANNEL_ID || ''

const CITIES = [
  'Стамбул', 'Анкара', 'Измир', 'Анталья', 'Бурса',
  'Аланья', 'Мерсин', 'Трабзон', 'Газиантеп', 'Другой',
]

async function sendToTelegram(ad) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    throw new Error(
      'Не заданы переменные окружения VITE_TELEGRAM_BOT_TOKEN и VITE_TELEGRAM_CHANNEL_ID. ' +
      'Добавьте их в настройках проекта на Vercel (Settings → Environment Variables).'
    )
  }

  const roomsLabel = ad.rooms === 'studio' ? 'Студия' : `${ad.rooms}-комн.`
  const districtLine = ad.district ? ` · ${ad.district}` : ''
  const urgentLine = ad.urgent ? '\n🔥 *СРОЧНО*' : ''

  let contactLine = ''
  if (ad.contactType === 'telegram') contactLine = `✈️ Telegram: ${ad.contactValue}`
  else if (ad.contactType === 'whatsapp') contactLine = `📱 WhatsApp: ${ad.contactValue}`
  else if (ad.contactType === 'email') contactLine = `📧 Email: ${ad.contactValue}`

  const text =
    `${ad.type === 'rent' ? '🏠 АРЕНДА' : '💰 ПОКУПКА'}${urgentLine}\n\n` +
    `📍 *${ad.city}${districtLine}*\n` +
    `🛏 ${roomsLabel} · 💵 до ${Number(ad.budget).toLocaleString()} ${ad.currency}\n\n` +
    `📝 ${ad.description}\n\n` +
    `${contactLine}\n\n` +
    `_Заявка с сайта EvBulsun_`

  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        text,
        parse_mode: 'Markdown',
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.description || 'Ошибка Telegram API')
  }
}

// ─── Компоненты ───────────────────────────────────────────────────────────────

function Inp(props) {
  return (
    <input
      {...props}
      className="w-full px-5 py-3.5 bg-white dark:bg-navy-900 border border-gray-200 dark:border-white/10 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-200 text-navy-950 dark:text-gray-100 placeholder:text-gray-400"
    />
  )
}

function Sel({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full px-5 py-3.5 bg-white dark:bg-navy-900 border border-gray-200 dark:border-white/10 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-200 text-navy-950 dark:text-gray-100 cursor-pointer appearance-none"
    >
      {children}
    </select>
  )
}

function Field({ label, hint, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] uppercase tracking-[0.15em] font-bold text-gray-500 dark:text-gray-400 ml-1">
        {label}
      </label>
      {children}
      {hint && <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">{hint}</span>}
      {error && <span className="text-red-500 text-xs ml-1 font-medium">{error}</span>}
    </div>
  )
}

function ToggleTag({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${active
        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
        : 'bg-white dark:bg-navy-900 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-primary/30'
        }`}
    >
      {children}
    </button>
  )
}

// ─── Шаг 1: параметры жилья ──────────────────────────────────────────────────

function Step1({ form, set, errors }) {
  return (
    <div className="flex flex-col gap-8">
      <Field label="Что ищете?">
        <div className="flex gap-4">
          <ToggleTag active={form.type === 'rent'} onClick={() => set('type', 'rent')}>🏠 Аренда</ToggleTag>
          <ToggleTag active={form.type === 'buy'} onClick={() => set('type', 'buy')}>💰 Покупка</ToggleTag>
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Город" error={errors.city}>
          <div className="relative">
            <Sel value={form.city} onChange={e => set('city', e.target.value)}>
              <option value="">Выберите…</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </Sel>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
          </div>
        </Field>
        <Field label="Район" hint="необязательно">
          <Inp
            value={form.district}
            onChange={e => set('district', e.target.value)}
            placeholder="Кадыкёй, Лара…"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_120px] gap-6">
        <div className="col-span-1">
          <Field label="Комнат">
            <div className="relative">
              <Sel value={form.rooms} onChange={e => set('rooms', e.target.value)}>
                <option value="studio">Студия</option>
                <option value="1">1-комн.</option>
                <option value="2">2-комн.</option>
                <option value="3">3-комн.</option>
                <option value="4+">4+ комн.</option>
              </Sel>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
            </div>
          </Field>
        </div>
        <div className="col-span-1">
          <Field label="Бюджет (до)" error={errors.budget}>
            <Inp
              value={form.budget}
              onChange={e => set('budget', e.target.value)}
              placeholder="50 000"
            />
          </Field>
        </div>
        <div className="col-span-2 md:col-span-1">
          <Field label="Валюта">
            <div className="relative">
              <Sel value={form.currency} onChange={e => set('currency', e.target.value)}>
                <option>USD</option>
                <option>EUR</option>
                <option>TRY</option>
              </Sel>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
            </div>
          </Field>
        </div>
      </div>

      <Field label="Опишите пожелания" hint={`${form.description.length} / 500`} error={errors.description}>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value.slice(0, 500))}
          placeholder="Этаж, балкон, рядом с метро, питомцы, срок заселения…"
          rows={5}
          className="w-full px-5 py-4 bg-white dark:bg-navy-900 border border-gray-200 dark:border-white/10 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-200 text-navy-950 dark:text-gray-100 placeholder:text-gray-400 resize-none leading-relaxed"
        />
      </Field>

      <label className="flex items-center gap-4 cursor-pointer group bg-gray-50 dark:bg-navy-900/50 p-4 rounded-xl border border-transparent hover:border-primary/20 transition-all duration-200">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={form.urgent}
            onChange={e => set('urgent', e.target.checked)}
            className="w-6 h-6 rounded-lg text-primary bg-white dark:bg-navy-900 border-gray-200 dark:border-white/10 focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-navy-950 dark:text-gray-100">🔥 Срочный запрос</span>
          <span className="text-xs text-gray-400">Мне нужно жильё в самое ближайшее время</span>
        </div>
      </label>
    </div>
  )
}

// ─── Шаг 2: контакт ──────────────────────────────────────────────────────────

const CONTACT_OPTS = [
  { value: 'telegram', label: 'Telegram', icon: '✈️', hint: '@username — не раскрывает номер телефона', placeholder: '@username' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '📱', hint: 'Номер с кодом страны', placeholder: '+7 900 000 0000' },
  { value: 'email', label: 'Email', icon: '📧', hint: 'Владельцы напишут письмо', placeholder: 'you@example.com' },
]

function Step2({ form, set, errors }) {
  const cur = CONTACT_OPTS.find(o => o.value === form.contactType)

  const preview =
    `${form.type === 'rent' ? '🏠 АРЕНДА' : '💰 ПОКУПКА'}${form.urgent ? '\n🔥 СРОЧНО' : ''}\n\n` +
    `📍 ${form.city || '…'}${form.district ? ` · ${form.district}` : ''}\n` +
    `🛏 ${form.rooms === 'studio' ? 'Студия' : `${form.rooms}-комн.`} · 💵 до ${form.budget ? Number(form.budget).toLocaleString() : '…'} ${form.currency}\n\n` +
    `📝 ${form.description || '…'}\n\n` +
    (form.contactType === 'telegram' ? `✈️ Telegram: ${form.contactValue || '@username'}`
      : form.contactType === 'whatsapp' ? `📱 WhatsApp: ${form.contactValue || '+7…'}`
        : `📧 Email: ${form.contactValue || '…'}`)

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4 items-start">
        <span className="material-symbols-outlined text-primary text-2xl pt-1">lock</span>
        <p className="text-sm dark:text-gray-300 leading-relaxed">
          <strong className="text-primary block mb-1">Только вы решаете, что раскрывать.</strong>
          Telegram username не раскрывает ваш номер. Хозяева смогут написать вам — и не узнают ничего лишнего.
        </p>
      </div>

      <Field label="Как с вами связаться?">
        <div className="flex flex-wrap gap-3">
          {CONTACT_OPTS.map(o => (
            <ToggleTag key={o.value} active={form.contactType === o.value} onClick={() => set('contactType', o.value)}>
              <span className="mr-2">{o.icon}</span> {o.label}
            </ToggleTag>
          ))}
        </div>
      </Field>

      <Field label={cur.label} hint={cur.hint} error={errors.contactValue}>
        <Inp
          value={form.contactValue}
          onChange={e => set('contactValue', e.target.value)}
          placeholder={cur.placeholder}
          type={form.contactType === 'email' ? 'email' : 'text'}
        />
      </Field>

      <div className="bg-background-light dark:bg-navy-950/50 rounded-2xl p-6 border border-gray-100 dark:border-white/5">
        <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">
          Предпросмотр в Telegram
        </div>
        <pre className="font-mono text-sm dark:text-gray-400 whitespace-pre-wrap word-break-all leading-6">
          {preview}
        </pre>
      </div>
    </div>
  )
}

// ─── Обёртка страницы ─────────────────────────────────────────────────────────

function Shell({ children, setPage }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setPage('home'); setIsOpen(false); }}>
            <span className="font-display text-2xl font-bold tracking-tight text-navy-950 dark:text-white">
              Ev<span className="text-primary">Bulsun</span>
            </span>
            <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mt-1 pl-4 border-l border-gray-200 dark:border-gray-800">
              Жизнь на ваших условиях
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-[11px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">
            <a className="hover:text-primary transition-colors" href="#">Объекты</a>
            <button
              className="hover:text-primary transition-colors uppercase"
              onClick={() => {
                setPage('home');
                setIsOpen(false);
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Как это работает
            </button>
            <a className="hover:text-primary transition-colors" href="#">Консьерж</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => { window.scrollTo(0, 0); setPage('form'); setIsOpen(false); }}
              className="bg-primary text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest gold-shimmer shadow-lg shadow-primary/20 transition-all hover:scale-[1.05]"
            >
              Оставить заявку
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-navy-950 dark:text-white"
            >
              <span className="material-symbols-outlined text-2xl">
                {isOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Планшетное/Мобильное меню */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-navy-950 border-b border-gray-100 dark:border-white/5 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col p-6 space-y-6 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400">
            <a className="hover:text-primary transition-colors" href="#" onClick={() => setIsOpen(false)}>Объекты</a>
            <button
              className="text-left hover:text-primary transition-colors uppercase"
              onClick={() => {
                setPage('home');
                setIsOpen(false);
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Как это работает
            </button>
            <a className="hover:text-primary transition-colors" href="#" onClick={() => setIsOpen(false)}>Консьерж</a>
            <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex gap-4">
              <button className="text-primary tracking-widest py-2">Войти</button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-20">{children}</main>

      <footer className="py-16 border-t border-gray-100 dark:border-white/5 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center space-x-2">
              <span className="font-display text-2xl font-bold tracking-tight text-navy-950 dark:text-white">
                Ev<span className="text-primary">Bulsun</span>
              </span>
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm font-light tracking-wide max-w-xs text-center md:text-left">
              EvBulsun — Поиск премиального жилья для экспатов за рубежом.
            </div>
            <div className="flex space-x-8 text-gray-400 dark:text-gray-600 text-[11px] font-bold uppercase tracking-widest">
              <a className="hover:text-primary transition-colors" href="#">Конфиденциальность</a>
              <a className="hover:text-primary transition-colors" href="#">Условия</a>
              <a className="hover:text-primary transition-colors" href="#">Контакты</a>
            </div>
          </div>
          <div className="mt-16 text-center text-gray-300 dark:text-gray-800 text-[10px] uppercase tracking-[0.3em] font-medium">
            &copy; {new Date().getFullYear()} EvBulsun. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Главная страница ───────────────────────────────────────────────────────

function Home({ setPage }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center -mt-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-navy-950/20"></div>
        <div className="relative z-10 text-center max-w-5xl px-6">
          <span className="inline-block px-5 py-2 rounded-full border border-primary/30 text-primary bg-primary/5 text-[10px] font-black uppercase tracking-[0.4em] mb-10 animate-fade" style={{ animationDelay: '0.1s' }}>
            Реверсивный маркетплейс
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-10 leading-[1.05] tracking-tight animate-fade" style={{ animationDelay: '0.2s' }}>
            Найдите свою идеальную<br /> <span className="italic font-light text-primary/90">обитель</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed opacity-90 animate-fade" style={{ animationDelay: '0.3s' }}>
            Хватит листать бесконечные списки. Опишите дом своей мечты, и владельцы сами найдут вас. Прямо, эксклюзивно и изысканно.
          </p>
          <div className="flex flex-col items-center gap-8 animate-fade" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => { window.scrollTo(0, 0); setPage('form'); }}
              className="bg-primary text-white px-12 py-6 rounded-full text-lg font-bold uppercase tracking-widest gold-shimmer shadow-2xl shadow-primary/30 flex items-center gap-4 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              Оставить заявку
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </button>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
              Бесплатно · Без регистрации · 2 минуты
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <span className="material-symbols-outlined text-white text-3xl font-light">expand_more</span>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-6 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-display text-4xl md:text-6xl mb-8 dark:text-white">Как это работает</h2>
            <div className="h-px w-24 bg-primary/50 mx-auto mb-10"></div>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg font-light">
              Безупречный опыт, созданный для самых взыскательных клиентов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              ['01', 'edit_note', 'Опишите пожелания', 'Укажите город, бюджет и ваши особые требования к образу жизни через нашу форму.'],
              ['02', 'campaign', 'Прямая рассылка', 'Ваш запрос публикуется в закрытой сети владельцев недвижимости и проверенных агентов.'],
              ['03', 'chat_bubble', 'Прямой контакт', 'Заинтересованные стороны свяжутся с вами напрямую. Без посредников и лишнего шума.'],
              ['04', 'verified_user', 'Финальный выбор', 'Изучайте персональные предложения и выбирайте то, что по-настоящему станет вашим домом.'],
            ].map(([n, icon, title, text]) => (
              <div key={n} className="group relative pt-12">
                <span className="text-9xl font-display font-black text-gray-100 dark:text-white/5 absolute -top-4 -left-4 z-0 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  {n}
                </span>
                <div className="relative z-10">
                  <div className="mb-8 w-16 h-16 bg-white dark:bg-navy-900 shadow-xl rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/10 group-hover:border-primary/50 transition-all duration-300">
                    <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
                  </div>
                  <h3 className="font-display text-2xl mb-6 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-light leading-relaxed text-sm">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-primary/5 dark:bg-primary/[0.03] border border-primary/20 p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-navy-900 flex items-center justify-center shrink-0 shadow-lg border border-primary/10">
              <span className="material-symbols-outlined text-primary text-4xl">lock</span>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-display text-3xl mb-5 dark:text-white">Конфиденциальность на ваших условиях</h4>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-lg">
                Ваш Telegram остается скрытым. Предпочитаете почту или WhatsApp? Вы сами решаете, какие контакты видны владельцам. Безопасность — наш безусловный приоритет.
              </p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] opacity-30"></div>
          </div>
        </div>
      </section>

      {/* Seller CTA Section */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-navy-950 rounded-[3rem] overflow-hidden p-12 md:p-24 lg:p-32 text-center md:text-left flex flex-col items-center justify-center min-h-[500px]">
            <img
              alt="Modern luxury architecture"
              className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-[10s] hover:scale-110"
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-navy-950 via-navy-950/90 to-transparent"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-16">
              <div className="max-w-xl">
                <h2 className="font-display text-4xl md:text-6xl text-white mb-8 leading-tight">
                  Хотите сдать <br /> <span className="italic font-light">или продать?</span>
                </h2>
                <p className="text-gray-400 text-xl font-light mb-0 leading-relaxed max-w-md">
                  Присоединяйтесь к нашей закрытой сети, где качественные покупатели публикуют свои эксклюзивные запросы.
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href={`https://t.me/${TELEGRAM_CHANNEL_ID.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass px-12 py-6 rounded-full text-white font-bold uppercase tracking-widest flex items-center gap-4 hover:bg-white/10 transition-all duration-300 group shadow-2xl"
                >
                  Вступить в сеть
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform duration-300">send</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

const emptyForm = {
  type: 'rent', city: '', district: '', rooms: '1',
  budget: '', currency: 'USD', description: '', urgent: false,
  contactType: 'telegram', contactValue: '',
}

export default function App() {
  const [page, setPage] = useState('home')   // home | form | success | error
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setFormState] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const set = (k, v) => setFormState(f => ({ ...f, [k]: v }))

  const reset = () => {
    setFormState(emptyForm)
    setErrors({})
    setStep(1)
    setPage('home')
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.city) e.city = 'Выберите город'
    if (!form.budget || isNaN(form.budget.replace(/\s/g, ''))) e.budget = 'Укажите бюджет цифрами'
    if (form.description.trim().length < 20) e.description = 'Напишите хотя бы пару предложений'
    return e
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.contactValue.trim()) e.contactValue = 'Укажите контакт для связи'
    if (form.contactType === 'telegram' && form.contactValue && !form.contactValue.startsWith('@'))
      e.contactValue = 'Telegram username должен начинаться с @'
    return e
  }

  const handleNext = () => {
    const e = validateStep1()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(2)
  }

  const handleSubmit = async () => {
    const e = validateStep2()
    if (Object.keys(e).length) { setErrors(e); return }
    setSending(true)
    try {
      await sendToTelegram(form)
      setPage('success')
    } catch (err) {
      setErrorMsg(err.message)
      setPage('error')
    } finally {
      setSending(false)
    }
  }

  if (page === 'home') {
    return (
      <Shell setPage={setPage}>
        <Home setPage={setPage} />
      </Shell>
    )
  }

  if (page === 'form') {
    return (
      <Shell setPage={setPage}>
        <div className="max-w-2xl mx-auto px-6 py-24">
          <button onClick={reset} className="text-primary font-bold flex items-center gap-2 mb-12 hover:translate-x-[-4px] transition-transform">
            <span className="material-symbols-outlined">arrow_back</span> Назад на главную
          </button>

          <div className="bg-white dark:bg-navy-950 rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-50 dark:bg-white/5">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(step / 2) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mb-12">
              <h2 className="font-display text-3xl dark:text-white">
                {step === 1 ? 'Опишите ваш запрос' : 'Контактные данные'}
              </h2>
              <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Шаг {step} из 2</span>
            </div>

            {step === 1 ? <Step1 form={form} set={set} errors={errors} /> : <Step2 form={form} set={set} errors={errors} />}

            <div className="flex gap-4 mt-12">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-8 py-4 rounded-full border border-gray-200 dark:border-white/10 text-gray-500 font-bold uppercase tracking-widest text-[11px] hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  Назад
                </button>
              )}
              <button
                onClick={step === 1 ? handleNext : handleSubmit}
                disabled={sending}
                className="flex-[2] bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] gold-shimmer shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {sending ? 'Отправка...' : step === 1 ? 'Далее' : 'Разместить запрос'}
              </button>
            </div>
          </div>
        </div>
      </Shell>
    )
  }

  if (page === 'success') {
    return (
      <Shell setPage={setPage}>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-fade">
            <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-6 dark:text-white animate-fade" style={{ animationDelay: '0.1s' }}>Запрос опубликован!</h2>
          <div className="h-px w-24 bg-primary/50 mx-auto mb-10 animate-fade" style={{ animationDelay: '0.2s' }}></div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed animate-fade" style={{ animationDelay: '0.3s' }}>
            Ваше объявление уже появилось в закрытом Telegram-канале. Владельцы недвижимости скоро свяжутся с вами напрямую.
          </p>

          <div className="bg-primary/5 dark:bg-primary/[0.03] border border-primary/20 p-8 rounded-3xl mb-12 max-w-2xl mx-auto text-left flex gap-6 items-center animate-fade" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 bg-white dark:bg-navy-900 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-primary/10">
              <span className="material-symbols-outlined text-primary text-2xl">lightbulb</span>
            </div>
            <p className="text-sm dark:text-gray-300 leading-relaxed">
              <strong className="text-primary">Совет:</strong> Пока вы ждете предложений, вы можете подписаться на наш канал, чтобы следить за другими запросами и обновлениями рынка.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade" style={{ animationDelay: '0.5s' }}>
            <a href={`https://t.me/${TELEGRAM_CHANNEL_ID.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
              className="bg-primary text-white px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest gold-shimmer shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
              Открыть Telegram
              <span className="material-symbols-outlined text-xl">send</span>
            </a>
            <button onClick={reset} className="px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest border border-gray-200 dark:border-white/10 hover:border-primary/50 transition-all dark:text-gray-400">
              На главную
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  if (page === 'error') {
    return (
      <Shell setPage={setPage}>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-10">
            <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
          </div>
          <h2 className="font-display text-3xl mb-6 dark:text-white">Не удалось отправить</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10">При публикации запроса в Telegram произошла техническая ошибка.</p>

          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/40 p-6 rounded-2xl mb-10 text-left">
              <div className="text-[10px] uppercase tracking-widest font-bold text-red-400 mb-2">Детали ошибки</div>
              <code className="text-xs text-red-600 dark:text-red-400 break-all family-mono leading-relaxed">{errorMsg}</code>
            </div>
          )}

          <div className="bg-background-light dark:bg-navy-950/50 border border-gray-100 dark:border-white/5 p-8 rounded-3xl text-left mb-12">
            <h4 className="text-sm font-bold uppercase tracking-widest text-navy-950 dark:text-gray-100 mb-6">Действие не выполнено</h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 italic">
              "Качество — это когда возвращается покупатель, а не товар. Мы стремимся к совершенству в каждом запросе."
            </p>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 border-t border-gray-100 dark:border-white/5 pt-6">
              Пожалуйста, проверьте настройки API и попробуйте позже.
            </div>
          </div>

          <button
            onClick={() => { setPage('form'); setStep(2) }}
            className="bg-primary text-white px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest gold-shimmer shadow-lg shadow-primary/20 flex items-center justify-center gap-3 mx-auto"
          >
            <span className="material-symbols-outlined text-xl">undo</span>
            Попробовать снова
          </button>
        </div>
      </Shell>
    )
  }

  return null
}
