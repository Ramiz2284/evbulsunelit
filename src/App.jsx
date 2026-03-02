import React, { useState, useEffect } from 'react'

// Токен и канал берутся из переменных окружения Vercel/Vite
// Задайте их в настройках проекта на Vercel:
//   VITE_TELEGRAM_BOT_TOKEN = ваш токен от @BotFather
//   VITE_TELEGRAM_CHANNEL_ID = @ваш_канал  (или числовой ID -100xxxxxxxxxx)
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHANNEL_ID = import.meta.env.VITE_TELEGRAM_CHANNEL_ID || ''

const CITIES = [
  'istanbul', 'ankara', 'izmir', 'antalya', 'bursa',
  'alanya', 'mersin', 'trabzon', 'gaziantep', 'other',
]

const TRANSLATIONS = {
  ru: {
    nav_objects: 'Объекты',
    nav_how_it_works: 'Как это работает',
    nav_concierge: 'Консьерж',
    nav_cta: 'Оставить заявку',
    nav_login: 'Войти',
    nav_slogan: 'Жизнь на ваших условиях',
    hero_badge: 'Реверсивный маркетплейс',
    hero_title: 'Найдите свою идеальную',
    hero_title_italic: 'обитель',
    hero_desc: 'Хватит листать бесконечные списки. Опишите дом своей мечты, и владельцы сами найдут вас. Прямо, эксклюзивно и изысканно.',
    hero_cta: 'Оставить заявку',
    hero_trust: 'Бесплатно · Без регистрации · 2 минуты',
    how_title: 'Как это работает',
    how_desc: 'Безупречный опыт, созданный для самых взыскательных клиентов.',
    step01_title: 'Опишите пожелания',
    step01_desc: 'Укажите город, бюджет и ваши особые требования к образу жизни через нашу форму.',
    step02_title: 'Прямая рассылка',
    step02_desc: 'Ваш запрос публикуется в закрытой сети владельцев недвижимости и проверенных агентов.',
    step03_title: 'Прямой контакт',
    step03_desc: 'Заинтересованные стороны свяжутся с вами напрямую. Без посредников и лишнего шума.',
    step04_title: 'Финальный выбор',
    step04_desc: 'Изучайте персональные предложения и выбирайте то, что по-настоящему станет вашим домом.',
    privacy_title: 'Конфиденциальность на ваших условиях',
    privacy_desc: 'Ваш Telegram остается скрытым. Предпочитаете почту или WhatsApp? Вы сами решаете, какие контакты видны владельцам. Безопасность — наш безусловный приоритет.',
    seller_title: 'Хотите сдать',
    seller_title_italic: 'или продать?',
    seller_desc: 'Присоединяйтесь к нашей закрытой сети, где качественные покупатели публикуют свои эксклюзивные запросы.',
    seller_cta: 'Вступить в сеть',
    footer_desc: 'EvBulsun — Поиск премиального жилья для экспатов за рубежом.',
    footer_privacy: 'Конфиденциальность',
    footer_terms: 'Условия',
    footer_contacts: 'Контакты',
    footer_copy: 'Все права защищены.',
    form_back: 'Назад на главную',
    form_step1_title: 'Опишите ваш запрос',
    form_step2_title: 'Контактные данные',
    form_step_of: 'Шаг {step} из 2',
    form_label_type: 'Что ищете?',
    form_type_rent: '🏠 Аренда',
    form_type_buy: '💰 Покупка',
    form_label_city: 'Город',
    form_city_placeholder: 'Выберите…',
    form_label_district: 'Район',
    form_district_hint: 'необязательно',
    form_district_placeholder: 'Кадыкёй, Лара…',
    form_label_rooms: 'Комнат',
    form_rooms_studio: 'Студия',
    form_rooms_count: '{n}-комн.',
    form_rooms_plus: '4+ комн.',
    form_label_budget: 'Бюджет (до)',
    form_budget_placeholder: '50 000',
    form_label_currency: 'Валюта',
    form_label_desc: 'Опишите пожелания',
    form_desc_placeholder: 'Этаж, балкон, рядом с метро, питомцы, срок заселения…',
    form_label_urgent: '🔥 Срочный запрос',
    form_urgent_desc: 'Мне нужно жильё в самое ближайшее время',
    form_contact_title: 'Как с вами связаться?',
    form_contact_preview: 'Предпросмотр в Telegram',
    form_btn_next: 'Далее',
    form_btn_back: 'Назад',
    form_btn_submit: 'Разместить запрос',
    form_sending: 'Отправка...',
    success_title: 'Запрос опубликован!',
    success_desc: 'Ваше объявление уже появилось в закрытом Telegram-канале. Владельцы недвижимости скоро свяжутся с вами напрямую.',
    success_tip_title: 'Совет:',
    success_tip_desc: 'Пока вы ждете предложений, вы можете подписаться на наш канал, чтобы следить за другими запросами и обновлениями рынка.',
    success_btn_tg: 'Открыть Telegram',
    success_btn_home: 'На главную',
    error_title: 'Не удалось отправить',
    error_desc: 'При публикации запроса в Telegram произошла техническая ошибка.',
    error_label_details: 'Детали ошибки',
    error_label_failed: 'Действие не выполнено',
    error_quote: '"Качество — это когда возвращается покупатель, а не товар. Мы стремимся к совершенству в каждом запросе."',
    error_footer: 'Пожалуйста, проверьте настройки API и попробуйте позже.',
    error_btn_retry: 'Попробовать снова',
    val_city: 'Выберите город',
    val_budget: 'Укажите бюджет цифрами',
    val_desc: 'Напишите хотя бы пару предложений',
    val_contact: 'Укажите контакт для связи',
    val_tg_format: 'Telegram username должен начинаться с @',
    city_istanbul: 'Стамбул',
    city_ankara: 'Анкара',
    city_izmir: 'Измир',
    city_antalya: 'Анталья',
    city_bursa: 'Бурса',
    city_alanya: 'Аланья',
    city_mersin: 'Мерсин',
    city_trabzon: 'Трабзон',
    city_gaziantep: 'Газиантеп',
    city_other: 'Другой',
    tg_title_rent: '🏠 АРЕНДА',
    tg_title_buy: '💰 ПОКУПКА',
    tg_urgent: '🔥 *СРОЧНО*',
    tg_footer: 'Заявка с сайта EvBulsun',
    contact_tg_hint: '@username — не раскрывает номер телефона',
    contact_wa_hint: 'Номер с кодом страны',
    contact_mail_hint: 'Владельцы напишут письмо',
    seo_title: 'EvBulsun | Найти жильё в Турции — Реверсивный маркетплейс',
    seo_desc: 'Ищете аренду или покупку жилья в Стамбуле, Анталье, Аланье? Опишите запрос — владельцы и агенты найдут вас напрямую. Бесплатно, без регистрации.',
    seo_block_p1: 'Ищете идеальное жилье в Анталье? EvBulsun предлагает уникальный подход к поиску недвижимости. Вместо того чтобы листать бесконечные списки, вы просто описываете свои пожелания, и владельцы сами находят вас.',
    seo_block_p2: 'Наш сервис охватывает все популярные запросы:',
    seo_block_li1: 'Анталья сатлык дайре (Antalya satılık daire) — покупка апартаментов в лучших районах.',
    seo_block_li2: 'Аренда квартир в Коньяалты и Ларе на длительный срок.',
    seo_block_li3: 'Инвестиции в недвижимость Турции с высокой доходностью.',
    seo_block_li4: 'Эксклюзивные виллы и пентхаусы, недоступные на открытых площадках.',
    seller_img_alt: 'Современная роскошная архитектура в Анталье',
    faq_title: "Часто задаваемые вопросы",
    faq_subtitle: "Всё, что нужно знать об аренде и покупке жилья в Турции",
    faq_q1: "Как найти квартиру в Турции без посредников?",
    faq_a1: "EvBulsun работает как реверсивный маркетплейс: вы описываете свои требования, и владельцы сами выходят на вас напрямую. Это исключает агентские комиссии и длительные переговоры через третьих лиц.",
    faq_q2: "Сколько стоит аренда квартиры в Стамбуле для иностранцев в 2025 году?",
    faq_a2: "Стоимость аренды в Стамбуле варьируется от $400–600 в месяц за студию в спальных районах до $1500–3000 за апартаменты в центре (Бешикташ, Нишанташы, Кадыкёй). Через EvBulsun вы получаете предложения в рамках вашего бюджета напрямую от владельцев.",
    faq_q3: "Можно ли иностранцу купить квартиру в Турции?",
    faq_a3: "Да, граждане большинства стран, включая Россию, Украину, Беларусь и страны ЕС, могут приобретать недвижимость в Турции. При покупке от $400 000 возможно получение турецкого гражданства. EvBulsun поможет найти объект под ваши цели.",
    faq_q4: "Как быстро владельцы отвечают на запрос?",
    faq_a4: "Запрос публикуется в закрытой сети немедленно после отправки. Как правило, первые предложения поступают в течение нескольких часов. Срочные запросы (отмечаются флагом 🔥) обрабатываются в приоритетном порядке.",
    faq_q5: "В каких городах Турции работает EvBulsun?",
    faq_a5: "Сервис охватывает все крупные города: Стамбул, Анталья, Аланья, Измир, Анкара, Бурса, Мерсин, Трабзон, Газиантеп. Если вашего города нет в списке — выберите 'Другой' и укажите название в описании.",
    faq_q6: "Безопасно ли передавать свои контакты через EvBulsun?",
    faq_a6: "Вы сами выбираете, какой контакт показывать: Telegram (без раскрытия номера телефона), WhatsApp или email. Ваши данные не передаются третьим лицам и не используются в рекламных целях.",
  },
  en: {
    nav_objects: 'Properties',
    nav_how_it_works: 'How it works',
    nav_concierge: 'Concierge',
    nav_cta: 'Post Request',
    nav_login: 'Login',
    nav_slogan: 'Life on your terms',
    hero_badge: 'Reverse Marketplace',
    hero_title: 'Find your perfect',
    hero_title_italic: 'dwelling',
    hero_desc: 'Stop scrolling through endless listings. Describe your dream home, and owners will find you. Direct, exclusive, and refined.',
    hero_cta: 'Post Request',
    hero_trust: 'Free · No registration · 2 minutes',
    how_title: 'How it works',
    how_desc: 'A flawless experience designed for the most discerning clients.',
    step01_title: 'Describe your wishes',
    step01_desc: 'Specify city, budget, and your special lifestyle requirements through our form.',
    step02_title: 'Direct broadcasting',
    step02_desc: 'Your request is published in a closed network of property owners and verified agents.',
    step03_title: 'Direct contact',
    step03_desc: 'Interested parties will contact you directly. No intermediaries or unnecessary noise.',
    step04_title: 'Final choice',
    step04_desc: 'Review personal offers and choose what will truly become your home.',
    privacy_title: 'Privacy on your terms',
    privacy_desc: 'Your Telegram remains hidden. Prefer email or WhatsApp? You decide which contacts are visible to owners. Security is our absolute priority.',
    seller_title: 'Want to rent out',
    seller_title_italic: 'or sell?',
    seller_desc: 'Join our closed network where high-quality buyers publish their exclusive requests.',
    seller_cta: 'Join network',
    footer_desc: 'EvBulsun — Premium housing search for expats abroad.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Use',
    footer_contacts: 'Contacts',
    footer_copy: 'All rights reserved.',
    form_back: 'Back to main',
    form_step1_title: 'Describe your request',
    form_step2_title: 'Contact details',
    form_step_of: 'Step {step} of 2',
    form_label_type: 'What are you looking for?',
    form_type_rent: '🏠 Rent',
    form_type_buy: '💰 Buy',
    form_label_city: 'City',
    form_city_placeholder: 'Choose…',
    form_label_district: 'District',
    form_district_hint: 'optional',
    form_district_placeholder: 'Kadikoy, Lara…',
    form_label_rooms: 'Rooms',
    form_rooms_studio: 'Studio',
    form_rooms_count: '{n}-room',
    form_rooms_plus: '4+ rooms',
    form_label_budget: 'Budget (up to)',
    form_budget_placeholder: '50,000',
    form_label_currency: 'Currency',
    form_label_desc: 'Describe wishes',
    form_desc_placeholder: 'Floor, balcony, near metro, pets, move-in date…',
    form_label_urgent: '🔥 Urgent request',
    form_urgent_desc: 'I need housing as soon as possible',
    form_contact_title: 'How to contact you?',
    form_contact_preview: 'Telegram Preview',
    form_btn_next: 'Next',
    form_btn_back: 'Back',
    form_btn_submit: 'Post request',
    form_sending: 'Sending...',
    success_title: 'Request published!',
    success_desc: 'Your ad has already appeared in the closed Telegram channel. Property owners will contact you directly soon.',
    success_tip_title: 'Tip:',
    success_tip_desc: 'While you wait for offers, you can subscribe to our channel to follow other requests and market updates.',
    success_btn_tg: 'Open Telegram',
    success_btn_home: 'To main page',
    error_title: 'Failed to send',
    error_desc: 'A technical error occurred while publishing the request to Telegram.',
    error_label_details: 'Error Details',
    error_label_failed: 'Action not completed',
    error_quote: '"Quality is when the customer returns, not the product. We strive for excellence in every request."',
    error_footer: 'Please check your API settings and try again later.',
    error_btn_retry: 'Try again',
    val_city: 'Please choose a city',
    val_budget: 'Specify budget with numbers',
    val_desc: 'Write at least a couple of sentences',
    val_contact: 'Specify contact for communication',
    val_tg_format: 'Telegram username must start with @',
    city_istanbul: 'Istanbul',
    city_ankara: 'Ankara',
    city_izmir: 'Izmir',
    city_antalya: 'Antalya',
    city_bursa: 'Bursa',
    city_alanya: 'Alanya',
    city_mersin: 'Mersin',
    city_trabzon: 'Trabzon',
    city_gaziantep: 'Gaziantep',
    city_other: 'Other',
    tg_title_rent: '🏠 RENT',
    tg_title_buy: '💰 BUY',
    tg_urgent: '🔥 *URGENT*',
    tg_footer: 'Request from EvBulsun website',
    contact_tg_hint: '@username — does not reveal phone number',
    contact_wa_hint: 'Number with country code',
    contact_mail_hint: 'Owners will write an email',
    seo_title: 'EvBulsun | Find Housing in Turkey — Reverse Marketplace',
    seo_desc: 'Looking for rental or property in Istanbul, Antalya, Alanya? Describe your needs — owners contact you directly. Free, no registration.',
    seo_block_p1: 'Looking for the perfect home in Antalya? EvBulsun offers a unique approach to real estate search. Instead of scrolling through endless listings, you simply describe your wishes, and owners find you.',
    seo_block_p2: 'Our service covers all popular requests:',
    seo_block_li1: 'Antalya apartments for sale — buying apartments in the best areas.',
    seo_block_li2: 'Rent apartments in Konyaalti and Lara for the long term.',
    seo_block_li3: 'Real estate investment in Turkey with high returns.',
    seo_block_li4: 'Exclusive villas and penthouses not available on public platforms.',
    seller_img_alt: 'Modern luxury architecture in Antalya',
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Everything you need to know about renting and buying property in Turkey",
    faq_q1: "How to find an apartment in Turkey without agents?",
    faq_a1: "EvBulsun operates as a reverse marketplace: you describe your requirements and property owners contact you directly. This eliminates agency fees and lengthy negotiations through intermediaries.",
    faq_q2: "How much does it cost to rent an apartment in Istanbul for foreigners in 2025?",
    faq_a2: "Rental prices in Istanbul range from $400–600/month for a studio in residential districts to $1,500–3,000 for apartments in central areas (Besiktas, Nisantasi, Kadikoy). Through EvBulsun you receive offers within your budget directly from owners.",
    faq_q3: "Can a foreigner buy property in Turkey?",
    faq_a3: "Yes, citizens of most countries including Russia, Ukraine, Belarus and EU nations can purchase real estate in Turkey. Buying property worth $400,000+ may qualify for Turkish citizenship. EvBulsun helps find the right property for your goals.",
    faq_q4: "How quickly do owners respond to a request?",
    faq_a4: "Your request is published in the closed network immediately after submission. Typically, first offers arrive within a few hours. Urgent requests (marked with 🔥) are prioritized.",
    faq_q5: "Which cities in Turkey does EvBulsun cover?",
    faq_a5: "The service covers all major cities: Istanbul, Antalya, Alanya, Izmir, Ankara, Bursa, Mersin, Trabzon, Gaziantep. If your city is not listed, select 'Other' and specify the name in the description.",
    faq_q6: "Is it safe to share my contacts through EvBulsun?",
    faq_a6: "You choose which contact to display: Telegram (without revealing your phone number), WhatsApp, or email. Your data is not shared with third parties or used for advertising purposes.",
  },
  tr: {
    nav_objects: 'Mülkler',
    nav_how_it_works: 'Nasıl çalışır',
    nav_concierge: 'Concierge',
    nav_cta: 'Talep Bırak',
    nav_login: 'Giriş Yap',
    nav_slogan: 'Kendi şartlarınızda yaşam',
    hero_badge: 'Tersine Pazaryeri',
    hero_title: 'Mükemmel evinizi',
    hero_title_italic: 'bulun',
    hero_desc: 'Sonsuz ilanlar arasında kaybolmayı bırakın. Hayalinizdeki evi tarif edin, ev sahipleri sizi bulsun. Doğrudan, özel ve seçkin.',
    hero_cta: 'Talep Bırak',
    hero_trust: 'Ücretsiz · Kayıt yok · 2 dakika',
    how_title: 'Nasıl çalışır',
    how_desc: 'En seçici müşteriler için tasarlanmış kusursuz bir deneyim.',
    step01_title: 'Dileklerinizi belirtin',
    step01_desc: 'Şehir, bütçe ve yaşam tarzınıza özel gereksinimlerinizi formumuz aracılığıyla belirtin.',
    step02_title: 'Doğrudan yayım',
    step02_desc: 'Talebiniz, mülk sahipleri ve doğrulanmış acentelerden oluşan kapalı bir ağda yayımlanır.',
    step03_title: 'Doğrudan iletişim',
    step03_desc: 'İlgili taraflar sizinle doğrudan iletişime geçecektir. Aracı veya gereksiz gürültü yok.',
    step04_title: 'Final seçimi',
    step04_desc: 'Kişisel teklifleri inceleyin ve gerçekten eviniz olacak olanı seçin.',
    privacy_title: 'Şartlarınıza göre gizlilik',
    privacy_desc: 'Telegram hesabınız gizli kalır. E-posta mı yoksa WhatsApp mı tercih edersiniz? Hangi iletişim bilgilerinin görüntüleneceğine siz karar verirsiniz. Güvenlik mutlak önceliğimizdir.',
    seller_title: 'Kiraya vermek',
    seller_title_italic: 'veya satmak mı istiyorsunuz?',
    seller_desc: 'Kaliteli alıcıların özel taleplerini yayımladığı kapalı ağımıza katılın.',
    seller_cta: 'Ağa katılın',
    footer_desc: 'EvBulsun — Yurt dışındaki gurbetçiler için premium konut arama.',
    footer_privacy: 'Gizlilik Politikası',
    footer_terms: 'Kullanım Koşulları',
    footer_contacts: 'İletişim',
    footer_copy: 'Tüm hakları saklıdır.',
    form_back: 'Ana sayfaya dön',
    form_step1_title: 'Talebinizi tarif edin',
    form_step2_title: 'İletişim bilgileri',
    form_step_of: 'Adım {step} / 2',
    form_label_type: 'Ne arıyorsunuz?',
    form_type_rent: '🏠 Kiralık',
    form_type_buy: '💰 Satılık',
    form_label_city: 'Şehir',
    form_city_placeholder: 'Seçiniz…',
    form_label_district: 'İlçe',
    form_district_hint: 'isteğe bağlı',
    form_district_placeholder: 'Kadıköy, Lara…',
    form_label_rooms: 'Oda Sayısı',
    form_rooms_studio: 'Stüdyo',
    form_rooms_count: '{n} odalı',
    form_rooms_plus: '4+ odalı',
    form_label_budget: 'Bütçe (maks)',
    form_budget_placeholder: '50.000',
    form_label_currency: 'Para Birimi',
    form_label_desc: 'Dileklerinizi tarif edin',
    form_desc_placeholder: 'Kat, balkon, metroya yakınlık, evcil hayvan, taşınma tarihi…',
    form_label_urgent: '🔥 Acil talep',
    form_urgent_desc: 'En kısa sürede bir konuta ihtiyacım var',
    form_contact_title: 'Sizinle nasıl iletişime geçelim?',
    form_contact_preview: 'Telegram Önizleme',
    form_btn_next: 'İleri',
    form_btn_back: 'Geri',
    form_btn_submit: 'Talebi yayımla',
    form_sending: 'Gönderiliyor...',
    success_title: 'Talep yayımlandı!',
    success_desc: 'İlanınız kapalı Telegram kanalında yayımlandı. Mülk sahipleri yakında sizinle doğrudan iletişime geçecektir.',
    success_tip_title: 'İpucu:',
    success_tip_desc: 'Teklifleri beklerken, diğer talepleri ve piyasa güncellemelerini takip etmek için kanalımıza abone olabilirsiniz.',
    success_btn_tg: 'Telegram\'ı Aç',
    success_btn_home: 'Ana sayfaya',
    error_title: 'Gönderilemedi',
    error_desc: 'Talebi Telegram\'да yayımlarken teknik bir hata oluştu.',
    error_label_details: 'Hata Detayları',
    error_label_failed: 'İşlem tamamlanamadı',
    error_quote: '"Kalite, müşterinin geri gelmesidir, ürünün değil. Her talepte mükemmellik için çabalıyoruz."',
    error_footer: 'Lütfen API ayarlarınızı kontrol edin ve daha sonra tekrar deneyin.',
    error_btn_retry: 'Tekrar dene',
    val_city: 'Lütfen bir şehir seçin',
    val_budget: 'Bütçeyi rakamlarla belirtin',
    val_desc: 'En az birkaç cümle yazın',
    val_contact: 'İletişim için bir bilgi belirtin',
    val_tg_format: 'Telegram kullanıcı adı @ ile başlamalıdır',
    city_istanbul: 'İstanbul',
    city_ankara: 'Ankara',
    city_izmir: 'İzmir',
    city_antalya: 'Antalya',
    city_bursa: 'Bursa',
    city_alanya: 'Alanya',
    city_mersin: 'Mersin',
    city_trabzon: 'Trabzon',
    city_gaziantep: 'Gaziantep',
    city_other: 'Diğer',
    tg_title_rent: '🏠 KİRALIK',
    tg_title_buy: '💰 SATILIK',
    tg_urgent: '🔥 *ACİL*',
    tg_footer: 'EvBulsun sitesinden talep',
    contact_tg_hint: '@username — telefon numarasını göstermez',
    contact_wa_hint: 'Ülke kodu ile numara',
    contact_mail_hint: 'Sahipleri e-posta gönderecektir',
    seo_title: 'EvBulsun | Antalya\'da Premium Gayrimenkul',
    seo_desc: 'Antalya\'da tersine emlak pazaryeri. Lara, Konyaaltı ve diğer bölgelerde hayalinizdeki daireyi veya villayı doğrudan sahiplerinden bulun.',
    seo_block_p1: 'Antalya\'da mükemmel evi mi arıyorsunuz? EvBulsun emlak arama konusunda benzersiz bir yaklaşım sunuyor. Sonsuz ilanlar arasında kaybolmak yerine, dileklerinizi tarif edersiniz ve ev sahipleri sizi bulur.',
    seo_block_p2: 'Hizmetimiz tüm popüler talepleri kapsar:',
    seo_block_li1: 'Antalya satılık daire — en iyi bölgelerde daire sahibi olun.',
    seo_block_li2: 'Konyaaltı ve Lara\'da uzun dönem kiralık daireler.',
    seo_block_li3: 'Türkiye\'de yüksek getirili gayrimenkul yatırımı.',
    seo_block_li4: 'Kamuya açık platformlarda bulunmayan özel villalar ve penthouse daireler.',
    seller_img_alt: 'Antalya\'da modern lüks mimari',
  }
}

async function sendToTelegram(ad, lang) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    throw new Error(
      'Не заданы переменные окружения VITE_TELEGRAM_BOT_TOKEN и VITE_TELEGRAM_CHANNEL_ID. ' +
      'Добавьте их в настройках проекта на Vercel (Settings → Environment Variables).'
    )
  }

  const t = (key, params = {}) => {
    let text = TRANSLATIONS[lang][key] || key
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }

  const roomsLabel = ad.rooms === 'studio' ? t('form_rooms_studio') : t('form_rooms_count', { n: ad.rooms })
  const districtLine = ad.district ? ` · ${ad.district}` : ''
  const urgentLine = ad.urgent ? `\n${t('tg_urgent')}` : ''

  let contactLine = ''
  if (ad.contactType === 'telegram') contactLine = `✈️ Telegram: ${ad.contactValue}`
  else if (ad.contactType === 'whatsapp') contactLine = `📱 WhatsApp: ${ad.contactValue}`
  else if (ad.contactType === 'email') contactLine = `📧 Email: ${ad.contactValue}`

  const text =
    `${ad.type === 'rent' ? t('tg_title_rent') : t('tg_title_buy')}${urgentLine}\n\n` +
    `📍 *${t('city_' + ad.city)}${districtLine}*\n` +
    `🛏 ${roomsLabel} · 💵 до ${Number(ad.budget).toLocaleString()} ${ad.currency}\n\n` +
    `📝 ${ad.description}\n\n` +
    `${contactLine}\n\n` +
    `_${t('tg_footer')}_`

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

function Step1({ form, set, errors, lang }) {
  const t = (key, params = {}) => {
    let text = TRANSLATIONS[lang][key] || key
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }

  return (
    <div className="flex flex-col gap-8">
      <Field label={t('form_label_type')}>
        <div className="flex gap-4">
          <ToggleTag active={form.type === 'rent'} onClick={() => set('type', 'rent')}>{t('form_type_rent')}</ToggleTag>
          <ToggleTag active={form.type === 'buy'} onClick={() => set('type', 'buy')}>{t('form_type_buy')}</ToggleTag>
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={t('form_label_city')} error={errors.city}>
          <div className="relative">
            <Sel value={form.city} onChange={e => set('city', e.target.value)}>
              <option value="">{t('form_city_placeholder')}</option>
              {CITIES.map(c => <option key={c} value={c}>{t('city_' + c)}</option>)}
            </Sel>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
          </div>
        </Field>
        <Field label={t('form_label_district')} hint={t('form_district_hint')}>
          <Inp
            value={form.district}
            onChange={e => set('district', e.target.value)}
            placeholder={t('form_district_placeholder')}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_120px] gap-6">
        <div className="col-span-1">
          <Field label={t('form_label_rooms')}>
            <div className="relative">
              <Sel value={form.rooms} onChange={e => set('rooms', e.target.value)}>
                <option value="studio">{t('form_rooms_studio')}</option>
                <option value="1">{t('form_rooms_count', { n: 1 })}</option>
                <option value="2">{t('form_rooms_count', { n: 2 })}</option>
                <option value="3">{t('form_rooms_count', { n: 3 })}</option>
                <option value="4+">{t('form_rooms_plus')}</option>
              </Sel>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
            </div>
          </Field>
        </div>
        <div className="col-span-1">
          <Field label={t('form_label_budget')} error={errors.budget}>
            <Inp
              value={form.budget}
              onChange={e => set('budget', e.target.value)}
              placeholder={t('form_budget_placeholder')}
            />
          </Field>
        </div>
        <div className="col-span-2 md:col-span-1">
          <Field label={t('form_label_currency')}>
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

      <Field label={t('form_label_desc')} hint={`${form.description.length} / 500`} error={errors.description}>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value.slice(0, 500))}
          placeholder={t('form_desc_placeholder')}
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
          <span className="text-sm font-bold text-navy-950 dark:text-gray-100">{t('form_label_urgent')}</span>
          <span className="text-xs text-gray-400">{t('form_urgent_desc')}</span>
        </div>
      </label>
    </div>
  )
}

// ─── Шаг 2: контакт ──────────────────────────────────────────────────────────

function Step2({ form, set, errors, lang }) {
  const t = (key, params = {}) => {
    let text = TRANSLATIONS[lang][key] || key
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }

  const contactOpts = [
    { value: 'telegram', label: 'Telegram', icon: '✈️', hint: t('contact_tg_hint'), placeholder: '@username' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '📱', hint: t('contact_wa_hint'), placeholder: '+7 900 000 0000' },
    { value: 'email', label: 'Email', icon: '📧', hint: t('contact_mail_hint'), placeholder: 'you@example.com' },
  ]

  const cur = contactOpts.find(o => o.value === form.contactType)

  const preview =
    `${form.type === 'rent' ? t('form_type_rent') : t('form_type_buy')}${form.urgent ? `\n${t('form_label_urgent')}` : ''}\n\n` +
    `📍 ${form.city ? t('city_' + form.city) : '…'}${form.district ? ` · ${form.district}` : ''}\n` +
    `🛏 ${form.rooms === 'studio' ? t('form_rooms_studio') : t('form_rooms_count', { n: form.rooms })} · 💵 до ${form.budget ? Number(form.budget).toLocaleString() : '…'} ${form.currency}\n\n` +
    `📝 ${form.description || '…'}\n\n` +
    (form.contactType === 'telegram' ? `✈️ Telegram: ${form.contactValue || '@username'}`
      : form.contactType === 'whatsapp' ? `📱 WhatsApp: ${form.contactValue || '+7…'}`
        : `📧 Email: ${form.contactValue || '…'}`)

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4 items-start">
        <span className="material-symbols-outlined text-primary text-2xl pt-1">lock</span>
        <div className="text-sm dark:text-gray-300 leading-relaxed">
          <strong className="text-primary block mb-1">{t('privacy_title')}</strong>
          {t('privacy_desc')}
        </div>
      </div>

      <Field label={t('form_contact_title')}>
        <div className="flex flex-wrap gap-3">
          {contactOpts.map(o => (
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
          {t('form_contact_preview')}
        </div>
        <pre className="font-mono text-sm dark:text-gray-400 whitespace-pre-wrap word-break-all leading-6">
          {preview}
        </pre>
      </div>
    </div>
  )
}

// ─── Обёртка страницы ─────────────────────────────────────────────────────────

function Shell({ children, setPage, lang, setLang }) {
  const [isOpen, setIsOpen] = useState(false)
  const t = (key, params = {}) => {
    let text = TRANSLATIONS[lang][key] || key
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setPage('home'); setIsOpen(false); }}>
            <span className="font-display text-2xl font-bold tracking-tight text-navy-950 dark:text-white">
              Ev<span className="text-primary">Bulsun</span>
            </span>
            <span className="hidden lg:block text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mt-1 pl-4 border-l border-gray-200 dark:border-gray-800">
              {t('nav_slogan')}
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-[11px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">
            <a className="hover:text-primary transition-colors" href="#">{t('nav_objects')}</a>
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
              {t('nav_how_it_works')}
            </button>
            <a className="hover:text-primary transition-colors" href="#">{t('nav_concierge')}</a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-full">
              {['ru', 'en', 'tr'].map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${lang === l ? 'bg-white dark:bg-navy-900 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={() => { window.scrollTo(0, 0); setPage('form'); setIsOpen(false); }}
              className="hidden sm:block bg-primary text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest gold-shimmer shadow-lg shadow-primary/20 transition-all hover:scale-[1.05]"
            >
              {t('nav_cta')}
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
            <a className="hover:text-primary transition-colors" href="#" onClick={() => setIsOpen(false)}>{t('nav_objects')}</a>
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
              {t('nav_how_it_works')}
            </button>
            <a className="hover:text-primary transition-colors" href="#" onClick={() => setIsOpen(false)}>{t('nav_concierge')}</a>
            <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex flex-col gap-4">
              <button
                onClick={() => { window.scrollTo(0, 0); setPage('form'); setIsOpen(false); }}
                className="text-primary tracking-widest py-2 text-left"
              >
                {t('nav_cta')}
              </button>
              <button className="text-gray-400 tracking-widest py-2 text-left">{t('nav_login')}</button>
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
              {t('footer_desc')}
            </div>
            <div className="flex space-x-8 text-gray-400 dark:text-gray-600 text-[11px] font-bold uppercase tracking-widest">
              <a className="hover:text-primary transition-colors" href="#">{t('footer_privacy')}</a>
              <a className="hover:text-primary transition-colors" href="#">{t('footer_terms')}</a>
              <a className="hover:text-primary transition-colors" href="#">{t('footer_contacts')}</a>
            </div>
          </div>
          <div className="mt-16 text-center text-gray-300 dark:text-gray-800 text-[10px] uppercase tracking-[0.3em] font-medium">
            &copy; {new Date().getFullYear()} EvBulsun. {t('footer_copy')}
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Главная страница ───────────────────────────────────────────────────────

// ─── FAQ Секция ──────────────────────────────────────────────────────────────

function FAQSection({ lang }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const t = (key) => TRANSLATIONS[lang][key] || key

  const faqs = [1, 2, 3, 4, 5, 6].map(i => ({
    q: t(`faq_q${i}`),
    a: t(`faq_a${i}`)
  }))

  return (
    <section className="py-32 px-6 bg-white dark:bg-navy-950 overflow-hidden relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl mb-6 dark:text-white leading-tight">
            {t('faq_title')}
          </h2>
          <div className="h-px w-24 bg-primary/50 mx-auto mb-8"></div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-light max-w-2xl mx-auto">
            {t('faq_subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`border rounded-2xl transition-all duration-300 ${activeIndex === idx
                  ? 'border-primary/40 bg-primary/[0.02] dark:bg-primary/[0.01]'
                  : 'border-gray-100 dark:border-white/5 hover:border-primary/20 bg-white dark:bg-navy-900/50'
                }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className={`font-display text-lg md:text-xl transition-colors duration-300 ${activeIndex === idx ? 'text-primary' : 'dark:text-white group-hover:text-primary'
                  }`}>
                  {faq.q}
                </span>
                <span className={`material-symbols-outlined text-primary transition-transform duration-500 ${activeIndex === idx ? 'rotate-180' : ''
                  }`}>
                  expand_more
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="px-8 pb-8 pt-0">
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Home({ setPage, lang }) {
  const t = (key, params = {}) => {
    let text = TRANSLATIONS[lang][key] || key
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center -mt-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-navy-950/20"></div>
        <div className="relative z-10 text-center max-w-5xl px-6">
          <span className="inline-block px-5 py-2 rounded-full border border-primary/30 text-primary bg-primary/5 text-[10px] font-black uppercase tracking-[0.4em] mb-10 animate-fade" style={{ animationDelay: '0.1s' }}>
            {t('hero_badge')}
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-10 leading-[1.05] tracking-tight animate-fade" style={{ animationDelay: '0.2s' }}>
            {t('hero_title')}<br /> <span className="italic font-light text-primary/90">{t('hero_title_italic')}</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed opacity-90 animate-fade" style={{ animationDelay: '0.3s' }}>
            {t('hero_desc')}
          </p>
          <div className="flex flex-col items-center gap-8 animate-fade" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => { window.scrollTo(0, 0); setPage('form'); }}
              className="bg-primary text-white px-12 py-6 rounded-full text-lg font-bold uppercase tracking-widest gold-shimmer shadow-2xl shadow-primary/30 flex items-center gap-4 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              {t('hero_cta')}
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </button>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
              {t('hero_trust')}
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
            <h2 className="font-display text-4xl md:text-6xl mb-8 dark:text-white">{t('how_title')}</h2>
            <div className="h-px w-24 bg-primary/50 mx-auto mb-10"></div>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg font-light">
              {t('how_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              ['01', 'edit_note', t('step01_title'), t('step01_desc')],
              ['02', 'campaign', t('step02_title'), t('step02_desc')],
              ['03', 'chat_bubble', t('step03_title'), t('step03_desc')],
              ['04', 'verified_user', t('step04_title'), t('step04_desc')],
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

      <FAQSection lang={lang} />

      {/* Privacy Section */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-primary/5 dark:bg-primary/[0.03] border border-primary/20 p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-navy-900 flex items-center justify-center shrink-0 shadow-lg border border-primary/10">
              <span className="material-symbols-outlined text-primary text-4xl">lock</span>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-display text-3xl mb-5 dark:text-white">{t('privacy_title')}</h4>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-lg">
                {t('privacy_desc')}
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
              alt={t('seller_img_alt')}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-[10s] hover:scale-110"
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-navy-950 via-navy-950/90 to-transparent"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-16">
              <div className="max-w-xl">
                <h2 className="font-display text-4xl md:text-6xl text-white mb-8 leading-tight">
                  {t('seller_title')} <br /> <span className="italic font-light">{t('seller_title_italic')}</span>
                </h2>
                <p className="text-gray-400 text-xl font-light mb-0 leading-relaxed max-w-md">
                  {t('seller_desc')}
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href={`https://t.me/${TELEGRAM_CHANNEL_ID.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass px-12 py-6 rounded-full text-white font-bold uppercase tracking-widest flex items-center gap-4 hover:bg-white/10 transition-all duration-300 group shadow-2xl"
                >
                  {t('seller_cta')}
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform duration-300">send</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Block Section */}
      <section id="seo-content" className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-navy-950/20 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-10 md:p-16">
            <h2 className="font-display text-2xl md:text-3xl mb-8 dark:text-white">
              {t('seo_title')}
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              <p className="mb-6">{t('seo_block_p1')}</p>
              <p className="mb-6 font-medium">{t('seo_block_p2')}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                {[
                  t('seo_block_li1'),
                  t('seo_block_li2'),
                  t('seo_block_li3'),
                  t('seo_block_li4')
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">stat_check</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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
  const [lang, setLang] = useState('ru')
  const [page, setPage] = useState('home')   // home | form | success | error
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setFormState] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const title = TRANSLATIONS[lang].seo_title
    const desc = TRANSLATIONS[lang].seo_desc

    document.title = title
    document.documentElement.lang = lang

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', desc)

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title)

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', desc)
  }, [lang])

  useEffect(() => {
    // FAQ Schema.org JSON-LD (Strictly RU version as requested)
    const existing = document.getElementById('faq-schema')
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.id = 'faq-schema'
    script.type = 'application/ld+json'

    const questions = [1, 2, 3, 4, 5, 6].map(i => ({
      "@type": "Question",
      "name": TRANSLATIONS.ru[`faq_q${i}`],
      "acceptedAnswer": {
        "@type": "Answer",
        "text": TRANSLATIONS.ru[`faq_a${i}`]
      }
    }))

    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": questions
    })

    document.head.appendChild(script)
  }, [])

  const t = (key, params = {}) => {
    let text = TRANSLATIONS[lang][key] || key
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }

  const set = (k, v) => setFormState(f => ({ ...f, [k]: v }))

  const reset = () => {
    setFormState(emptyForm)
    setErrors({})
    setStep(1)
    setPage('home')
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.city) e.city = t('val_city')
    if (!form.budget || isNaN(form.budget.replace(/\s/g, ''))) e.budget = t('val_budget')
    if (form.description.trim().length < 20) e.description = t('val_desc')
    return e
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.contactValue.trim()) e.contactValue = t('val_contact')
    if (form.contactType === 'telegram' && form.contactValue && !form.contactValue.startsWith('@'))
      e.contactValue = t('val_tg_format')
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
      await sendToTelegram(form, lang)
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
      <Shell setPage={setPage} lang={lang} setLang={setLang}>
        <Home setPage={setPage} lang={lang} />
      </Shell>
    )
  }

  if (page === 'form') {
    return (
      <Shell setPage={setPage} lang={lang} setLang={setLang}>
        <div className="max-w-2xl mx-auto px-6 py-24">
          <button onClick={reset} className="text-primary font-bold flex items-center gap-2 mb-12 hover:translate-x-[-4px] transition-transform">
            <span className="material-symbols-outlined">arrow_back</span> {t('form_back')}
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
                {step === 1 ? t('form_step1_title') : t('form_step2_title')}
              </h2>
              <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">{t('form_step_of', { step })}</span>
            </div>

            {step === 1 ? <Step1 form={form} set={set} errors={errors} lang={lang} /> : <Step2 form={form} set={set} errors={errors} lang={lang} />}

            <div className="flex gap-4 mt-12">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-8 py-4 rounded-full border border-gray-200 dark:border-white/10 text-gray-500 font-bold uppercase tracking-widest text-[11px] hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  {t('form_btn_back')}
                </button>
              )}
              <button
                onClick={step === 1 ? handleNext : handleSubmit}
                disabled={sending}
                className="flex-[2] bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] gold-shimmer shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {sending ? t('form_sending') : step === 1 ? t('form_btn_next') : t('form_btn_submit')}
              </button>
            </div>
          </div>
        </div>
      </Shell>
    )
  }

  if (page === 'success') {
    return (
      <Shell setPage={setPage} lang={lang} setLang={setLang}>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-fade">
            <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-6 dark:text-white animate-fade" style={{ animationDelay: '0.1s' }}>{t('success_title')}</h2>
          <div className="h-px w-24 bg-primary/50 mx-auto mb-10 animate-fade" style={{ animationDelay: '0.2s' }}></div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed animate-fade" style={{ animationDelay: '0.3s' }}>
            {t('success_desc')}
          </p>

          <div className="bg-primary/5 dark:bg-primary/[0.03] border border-primary/20 p-8 rounded-3xl mb-12 max-w-2xl mx-auto text-left flex gap-6 items-center animate-fade" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 bg-white dark:bg-navy-900 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-primary/10">
              <span className="material-symbols-outlined text-primary text-2xl">lightbulb</span>
            </div>
            <div className="text-sm dark:text-gray-300 leading-relaxed">
              <strong className="text-primary">{t('success_tip_title')}</strong> {t('success_tip_desc')}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade" style={{ animationDelay: '0.5s' }}>
            <a href={`https://t.me/${TELEGRAM_CHANNEL_ID.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
              className="bg-primary text-white px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest gold-shimmer shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
              {t('success_btn_tg')}
              <span className="material-symbols-outlined text-xl">send</span>
            </a>
            <button onClick={reset} className="px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest border border-gray-200 dark:border-white/10 hover:border-primary/50 transition-all dark:text-gray-400">
              {t('success_btn_home')}
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  if (page === 'error') {
    return (
      <Shell setPage={setPage} lang={lang} setLang={setLang}>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-10">
            <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
          </div>
          <h2 className="font-display text-3xl mb-6 dark:text-white">{t('error_title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10">{t('error_desc')}</p>

          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/40 p-6 rounded-2xl mb-10 text-left">
              <div className="text-[10px] uppercase tracking-widest font-bold text-red-400 mb-2">{t('error_label_details')}</div>
              <code className="text-xs text-red-600 dark:text-red-400 break-all family-mono leading-relaxed">{errorMsg}</code>
            </div>
          )}

          <div className="bg-background-light dark:bg-navy-950/50 border border-gray-100 dark:border-white/5 p-8 rounded-3xl text-left mb-12">
            <h4 className="text-sm font-bold uppercase tracking-widest text-navy-950 dark:text-gray-100 mb-6">{t('error_label_failed')}</h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 italic">
              {t('error_quote')}
            </p>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 border-t border-gray-100 dark:border-white/5 pt-6">
              {t('error_footer')}
            </div>
          </div>

          <button
            onClick={() => { setPage('form'); setStep(2) }}
            className="bg-primary text-white px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest gold-shimmer shadow-lg shadow-primary/20 flex items-center justify-center gap-3 mx-auto"
          >
            <span className="material-symbols-outlined text-xl">undo</span>
            {t('error_btn_retry')}
          </button>
        </div>
      </Shell>
    )
  }

  return null
}
