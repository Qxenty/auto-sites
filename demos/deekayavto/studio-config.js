/**
 * DeeKayAvto — конфигурация демо-студии.
 * Все данные студии вынесены строго сюда: app.js рендерит страницу из этого объекта.
 * Чтобы перебрендить демку под другую студию — меняйте только этот файл.
 */
const STUDIO_CONFIG = {
  id: 'deekayavto',
  name: 'DeeKayAvto',
  fullName: 'Детейлинг-центр DeeKayAuto',
  city: 'Архангельск',
  address: 'Окружное шоссе, 3к8',
  addressNote: '«Оранжевые боксы справа»',
  schedule: 'Пн–Сб 11:00–19:00, Вс — по предварительной записи',
  experience: 'на рынке с 2019 года',
  subscribers: '2 900+ подписчиков VK',
  trust: 'обслуживание премиальных и новых авто',
  phones: [
    '+7 (911) 554-52-25',
    '+7 (981) 559-14-25'
  ],
  mainPhone: '+7 (911) 554-52-25',
  links: {
    telegramChannel: 'https://t.me/DeeKayAuto',
    vk: 'https://vk.ru/deekayavto',
    telegramApp: 'https://t.me/+79115545225',
    whatsapp: 'https://wa.me/79115545225',
    yandexMaps: 'https://yandex.ru/maps/?text=Архангельск,%20Окружное%20шоссе,%203к8'
  },
  colors: {
    bg: '#0B0C0E',
    surface: '#14161A',
    accent: '#FF5A1F',
    accentHover: '#E04E18',
    accentSoft: 'rgba(255, 90, 31, 0.12)',
    text: '#F5F7FA',
    textMuted: '#8A8F98',
    border: 'rgba(255,255,255,0.08)',
    success: '#2ECC71'
  },
  badges: [
    'С 2019 года',
    'Оранжевые боксы · Окружное ш., 3к8',
    'Telegram Mini App Ready'
  ],
  hero: {
    title: 'Премиальный детейлинг и защита авто в Архангельске',
    subtitle: 'Бронеплёнка, керамика, полировка и химчистка салона в «Оранжевых боксах» на Окружном шоссе.'
  },
  // Классы авто с коэффициентами
  carClasses: [
    { id: 'sedan', name: 'Седан / Хэтчбек', shortName: 'Седан', coef: 1.0 },
    { id: 'crossover', name: 'Кроссовер', shortName: 'Кроссовер', coef: 1.2 },
    { id: 'suv', name: 'Внедорожник / Премиум', shortName: 'Внедорожник', coef: 1.4 }
  ],
  // Базовые ориентировочные цены для седана (x1.0)
  services: [
    { id: 'polish', name: 'Полировка кузова и оптики', price: 16000 },
    { id: 'ppf-zones', name: 'Защита зон риска полиуретаном (бронеплёнка)', price: 45000 },
    { id: 'ppf-full', name: 'Полная оклейка кузова бронеплёнкой', price: 165000 },
    { id: 'ceramic', name: 'Керамическое покрытие кузова', price: 22000 },
    { id: 'detail', name: 'Детальная химчистка салона', price: 12000 },
    { id: 'sound', name: 'Шумо- и виброизоляция', price: 42000 },
    { id: 'pdr', name: 'Удаление вмятин без покраски (PDR)', price: 3500 },
    { id: 'tint', name: 'Тонировка стёкол / оптики', price: 6000 },
    { id: 'antirain', name: 'Покрытие «Антидождь» на стёкла', price: 3000 }
  ],
  // Готовые комплексы — клик подставляет нужные услуги
  packages: [
    {
      id: 'new-car',
      name: 'Защита нового авто',
      desc: 'Бронеплёнка зон риска + Керамика + Антидождь',
      services: ['ppf-zones', 'ceramic', 'antirain']
    },
    {
      id: 'refresh',
      name: 'Глубокое обновление',
      desc: 'Полировка кузова + Керамика + Химчистка салона',
      services: ['polish', 'ceramic', 'detail']
    },
    {
      id: 'comfort',
      name: 'Максимум комфорта',
      desc: 'Шумоизоляция + Химчистка + Антидождь',
      services: ['sound', 'detail', 'antirain']
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
  // Недавние проекты (photo — опциональное поле; если пусто, показывается градиентный плейсхолдер)
  cases: [
    {
      model: 'Audi A5 L Sportback',
      year: '2026',
      desc: 'Комплексная бронеплёнка экстерьера и интерьера, керамика, антидождь',
      photo: './img/audi.jpg',
      photoPosition: 'center 78%'
    },
    {
      model: 'Volkswagen Tiguan L Pro',
      year: '',
      desc: 'Бронеплёнка передней части, мягкая полировка, керамика, антидождь',
      photo: './img/tiguan.jpg',
      photoPosition: 'center 68%'
    },
    {
      model: 'RAM Rebel TRX',
      year: '',
      desc: 'Двухфазная мойка, удаление реагентов, химчистка салона, антидождь',
      photo: './img/ram.jpg',
      photoPosition: 'center center'
    }
  ],
  // Отзывы (статичные, без платных сторонних виджетов)
  reviews: [
    {
      author: 'Александр К.',
      car: 'BMW X5',
      text: 'Делал бронеплёнку и керамику на новую машину. Экипировка на высоте, боксы реально оранжевые и заметные, ребята работают аккуратно. Забрал через два дня — машина как новая.',
      rating: 5
    },
    {
      author: 'Марина С.',
      car: 'Audi A5',
      text: 'Химчистка салона после зимы — спасение. Записалась через Telegram Mini App, приехала к назначенному времени, всё сделали при мне. Салон пахнет новым автомобилем.',
      rating: 5
    },
    {
      author: 'Дмитрий П.',
      car: 'Volkswagen Tiguan',
      text: 'Брал комплекс «Защита нового авто». Помогли подобрать услуги под бюджет, не навязывали лишнего. Расчёт в калькуляторе совпал с итоговой суммой после осмотра.',
      rating: 5
    }
  ],
  // Блок Telegram-канала
  telegramChannel: {
    title: 'Наш канал @DeeKayAuto',
    desc: 'Розыгрыши, закрытые скидки и внутренняя кухня студии.',
    url: 'https://t.me/DeeKayAuto'
  }
};

// Экспорт для удобной отладки в консоли
if (typeof window !== 'undefined') {
  window.STUDIO_CONFIG = STUDIO_CONFIG;
}