/**
 * RVR AUTO — конфигурация демо-студии.
 * Все данные студии вынесены строго сюда: app.js рендерит страницу из этого объекта.
 * Чтобы перебрендить демку под другую студию — меняйте только этот файл.
 */
const STUDIO_CONFIG = {
  id: 'rvrauto',
  name: 'RVR AUTO',
  fullName: 'RVR AUTO',
  city: 'Казань',
  address: 'ул. Габдуллы Тукая, 115к4',
  addressNote: 'Г. Казань, ул. Габдуллы Тукая, 115к4',
  schedule: '24/7 (по предварительной записи)',
  experience: 'на рынке с 2019 года',
  subscribers: '2 900+ подписчиков Telegram и Instagram',
  trust: 'детейлинг, автозвук и дооснащение',
  phones: [
    '+7 (906) 327-52-89'
  ],
  mainPhone: '+7 (906) 327-52-89',
  links: {
    telegramChannel: 'https://t.me/RVR_AUTO',
    telegramApp: 'https://t.me/RVR_AUTO_KZN',
    whatsapp: 'https://wa.me/79063275289',
    instagram: 'https://www.instagram.com/__rvr_auto__/',
    twoGis: 'https://2gis.ru/kazan/search/улица%20Габдуллы%20Тукая%2C%20115к4',
    route: 'https://2gis.ru/kazan/search/улица%20Габдуллы%20Тукая%2C%20115к4'
  },
  colors: {
    bg: '#0c0c0e',
    surface: '#151518',
    surface2: '#1d1d21',
    accent: '#e63946',
    accentHover: '#d62828',
    accentSoft: 'rgba(230, 57, 70, 0.12)',
    text: '#F5F5F7',
    textMuted: '#8A8D94',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.16)',
    success: '#2ECC71'
  },
  badges: [
    'Работаем 24/7',
    'Казань · ул. Габдуллы Тукая, 115к4',
    'Telegram Mini App Ready'
  ],
  hero: {
    title: 'Детейлинг, автозвук и дооснащение в Казани',
    subtitle: 'Профессиональная студия детейлинга, автозвука и дооснащения в Казани.'
  },
  // Классы авто с коэффициентами
  carClasses: [
    { id: 'sedan', name: 'Седан / Хэтчбек', shortName: 'Седан', coef: 1.0 },
    { id: 'crossover', name: 'Кроссовер', shortName: 'Кроссовер', coef: 1.2 },
    { id: 'suv', name: 'Внедорожник / Премиум', shortName: 'Внедорожник', coef: 1.4 }
  ],
  // Базовые ориентировочные цены для седана (x1.0)
  services: [
    { id: 'polish-body', name: 'Полировка кузова + защитный состав', price: 8000 },
    { id: 'polish-optics', name: 'Полировка и восстановление оптики', price: 4500 },
    { id: 'detail-salon', name: 'Полная химчистка салона', price: 14000 },
    { id: 'sound', name: 'Шумоизоляция автомобиля', price: 32000 },
    { id: 'audio', name: 'Установка и настройка автозвука', price: 15000 },
    { id: 'equip', name: 'Установка доп. оборудования и дооснащение', price: 10000 }
  ],
  // Готовые комплексы — клик подставляет нужные услуги
  packages: [
    {
      id: 'protect',
      name: 'Защита и полировка',
      desc: 'Полировка кузова + защитный состав + восстановление оптики',
      services: ['polish-body', 'polish-optics']
    },
    {
      id: 'comfort',
      name: 'Комфорт и звук',
      desc: 'Шумоизоляция + Полная химчистка салона',
      services: ['sound', 'detail-salon']
    },
    {
      id: 'audio-sound',
      name: 'Автозвук и защита',
      desc: 'Установка автозвука + Полировка кузова',
      services: ['audio', 'polish-body']
    },
    {
      id: 'full-care',
      name: 'Полный уход',
      desc: 'Полировка kузова + Химчистка + Шумоизоляция',
      services: ['polish-body', 'detail-salon', 'sound']
    }
  ],
  // Флаги опциональных блоков
  flags: {
    giftCertificate: true,
    corporate: false,
    booking: false
  },
  // Номиналы подарочных сертификатов (руб.)
  giftCertificates: [5000, 10000, 15000, 25000],
  giftCertificateCustom: true, // показать вариант «На конкретную услугу»
  // Недавние проекты (до / после)
  cases: [
    {
      before: './img/before1.jpg',
      after: './img/after1.jpg',
      model: 'Suzuki Grand Vitara',
      subtitle: 'Восстановление передних фар: полировка и нанесение защитного состава',
      beforePosition: 'center 70%',
      afterPosition: 'center 70%'
    },
    {
      before: './img/before2.jpg',
      after: './img/after2.jpg',
      model: 'Suzuki SX4',
      subtitle: 'Глубокое преображение и восстановление прозрачности фар',
      beforePosition: 'center 70%',
      afterPosition: 'center 70%'
    },
    {
      before: './img/before3.jpg',
      after: './img/after3.jpg',
      model: 'Toyota Hilux',
      subtitle: 'Полировка и восстановление оптики',
      beforePosition: 'center 60%',
      afterPosition: 'center 60%'
    }
  ],
  // Отзывы (статичные, без платных сторонних виджетов)
  reviews: [
    {
      author: 'Александр К.',
      car: 'Toyota Camry',
      text: 'Делал полировку кузова и шумоизоляцию. Экипировка на высоте, боксы аккуратные. Машина как новая.',
      rating: 5
    },
    {
      author: 'Марина С.',
      car: 'Kia Sportage',
      text: 'Химчистка салона после зимы — спасение. Записалась через Telegram Mini App, приехала к назначенному времени.',
      rating: 5
    },
    {
      author: 'Дмитрий П.',
      car: 'Hyundai Tucson',
      text: 'Брал комплекс «Защита и полировка». Помогли подобрать услуги под бюджет, не навязывали лишнего. Расчёт совпал с итоговой суммой.',
      rating: 5
    }
  ],
  // Блок Telegram-канала
  telegramChannel: {
    title: 'Наш канал @RVR_AUTO',
    desc: 'Розыгрыши, закрытые скидки и внутренняя кухня студии.',
    url: 'https://t.me/RVR_AUTO'
  }
};

// Экспорт для удобной отладки в консоли
if (typeof window !== 'undefined') {
  window.STUDIO_CONFIG = STUDIO_CONFIG;
}
