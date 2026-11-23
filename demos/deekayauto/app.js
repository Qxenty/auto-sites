/**
 * DeeKayAvto — логика демо-страницы.
 * Рендерит всю страницу из STUDIO_CONFIG, считает калькулятор,
 * формирует текст заявки и интегрируется с Telegram WebApp API.
 */
(function () {
  'use strict';

  const cfg = window.STUDIO_CONFIG;
  if (!cfg) {
    console.error('STUDIO_CONFIG не найден — проверьте studio-config.js');
    return;
  }

  /* ---------- Установка CSS-переменных из конфига ---------- */
  const root = document.documentElement;
  if (cfg.colors) {
    root.style.setProperty('--bg', cfg.colors.bg);
    root.style.setProperty('--surface', cfg.colors.surface);
    root.style.setProperty('--accent', cfg.colors.accent);
    root.style.setProperty('--accent-hover', cfg.colors.accentHover || cfg.colors.accent);
    root.style.setProperty('--accent-soft', cfg.colors.accentSoft || 'rgba(255,90,31,0.12)');
    root.style.setProperty('--text', cfg.colors.text || '#F5F7FA');
    root.style.setProperty('--text-muted', cfg.colors.textMuted || '#8A8F98');
    root.style.setProperty('--border', cfg.colors.border || 'rgba(255,255,255,0.08)');
    root.style.setProperty('--success', cfg.colors.success || '#2ECC71');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', cfg.colors.bg);
  }

  /* ---------- Утилиты ---------- */
  const $ = (sel, ctx = document) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
  // Сайт действительно запущен внутри Telegram Mini App только тогда,
  // когда WebApp инициализирован с корректной initData (в обычном
  // мобильном браузере Telegram-скрипт не подключается и window.Telegram
  // отсутствует — тогда переходы идут стандартно через href).
  const isTelegram = !!(window.Telegram && window.Telegram.WebApp &&
    window.Telegram.WebApp.initData && window.Telegram.WebApp.initData.length > 0);

  /* ---------- Рендер: бейджи и первый экран ---------- */
  (function renderHero() {
    const badgesEl = $('[data-badges]');
    if (badgesEl && cfg.badges) {
      badgesEl.innerHTML = cfg.badges.map((b, i) =>
        `<span class="badge${i === cfg.badges.length - 1 ? ' tma' : ''}">${esc(b)}</span>`
      ).join('');
    }
    const titleEl = $('[data-hero-title]');
    if (titleEl) titleEl.textContent = cfg.hero.title;
    const subEl = $('[data-hero-sub]');
    if (subEl) subEl.textContent = cfg.hero.sub;
  })();

  /* ---------- Плавный скролл к секциям ---------- */
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  $$('[data-go]').forEach((btn) => {
    btn.addEventListener('click', () => scrollToSection(btn.dataset.go));
  });

  /* =========================================================
     КАЛЬКУЛЯТОР
     ========================================================= */
  const state = {
    carClassId: null,
    selectedServices: new Set(),
    discountApplied: false,
    currentPackage: null
  };

  const classEl = $('[data-car-classes]');
  const packagesEl = $('[data-packages]');
  const servicesEl = $('[data-services]');
  const stepClass = $('#step-class');
  const stepPackages = $('#step-packages');
  const stepResult = $('#step-result');

  /* Рендер классов авто */
  if (classEl) {
    classEl.innerHTML = cfg.carClasses.map((cc) => `
      <button class="car-class-btn" data-class-id="${esc(cc.id)}">
        <span>${esc(cc.name)}</span>
        <span class="car-class-coef">×${cc.coef}</span>
      </button>
    `).join('');

    $$('.car-class-btn', classEl).forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.car-class-btn', classEl).forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.carClassId = btn.dataset.classId;
        stepClass.classList.add('hidden');
        stepPackages.classList.remove('hidden');
        stepPackages.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* Рендер готовых комплексов */
  if (packagesEl) {
    packagesEl.innerHTML = cfg.packages.map((p) => `
      <button class="package-btn" data-package-id="${esc(p.id)}">
        <div class="package-name">${esc(p.name)}</div>
        <div class="package-desc">${esc(p.desc)}</div>
      </button>
    `).join('');

    $$('.package-btn', packagesEl).forEach((btn) => {
      btn.addEventListener('click', () => {
        const pkg = cfg.packages.find((p) => p.id === btn.dataset.packageId);
        if (!pkg) return;
        const wasActive = btn.classList.contains('active');
        $$('.package-btn', packagesEl).forEach((b) => b.classList.remove('active'));
        if (wasActive) {
          state.currentPackage = null;
          // снимаем отметки с услуг этого пакета
          pkg.services.forEach((sid) => state.selectedServices.delete(sid));
        } else {
          btn.classList.add('active');
          state.currentPackage = pkg.id;
          pkg.services.forEach((sid) => state.selectedServices.add(sid));
        }
        syncServicesUI();
      });
    });
  }

  /* Рендер услуг */
  if (servicesEl) {
    servicesEl.innerHTML = cfg.services.map((s) => `
      <div class="service-item" data-service-id="${esc(s.id)}">
        <span class="service-checkbox" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </span>
        <span class="service-info">
          <div class="service-name">${esc(s.name)}</div>
          <div class="service-price">от ${fmt(s.price)}</div>
        </span>
      </div>
    `).join('');

    $$('.service-item', servicesEl).forEach((item) => {
      item.addEventListener('click', () => {
        const sid = item.dataset.serviceId;
        if (state.selectedServices.has(sid)) {
          state.selectedServices.delete(sid);
        } else {
          state.selectedServices.add(sid);
        }
        // ручной выбор сбрасывает активный пакет
        state.currentPackage = null;
        $$('.package-btn', packagesEl).forEach((b) => b.classList.remove('active'));
        syncServicesUI();
      });
    });
  }

  function syncServicesUI() {
    $$('.service-item', servicesEl).forEach((item) => {
      item.classList.toggle('selected', state.selectedServices.has(item.dataset.serviceId));
    });
  }

  /* Расчёт */
  function calcTotals() {
    const cc = cfg.carClasses.find((c) => c.id === state.carClassId) || cfg.carClasses[0];
    let base = 0;
    const selected = [];
    state.selectedServices.forEach((sid) => {
      const s = cfg.services.find((x) => x.id === sid);
      if (s) { base += s.price; selected.push(s); }
    });
    const withCoef = base * (cc ? cc.coef : 1);
    const count = selected.length;
    const discountApplied = count >= 2;
    const total = discountApplied ? withCoef * 0.9 : withCoef;
    const low = Math.round(total * 0.9);
    const high = Math.round(total * 1.1);
    return { cc, selected, base, withCoef, discountApplied, total, low, high };
  }

  /* Переход к результату */
  $('#btn-calc-result')?.addEventListener('click', () => {
    if (state.selectedServices.size === 0) {
      // мягкая подсказка: мигнуть списком услуг
      servicesEl?.animate(
        [{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }],
        { duration: 400 }
      );
      return;
    }
    stepPackages.classList.add('hidden');
    stepResult.classList.remove('hidden');
    renderResult();
    stepResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function renderResult() {
    const t = calcTotals();
    const rangeEl = $('[data-price-range]');
    if (rangeEl) rangeEl.innerHTML = `${fmt(t.low)} – ${fmt(t.high)}`;

    const discEl = $('[data-discount]');
    if (discEl) {
      if (t.discountApplied) {
        discEl.classList.remove('hidden');
        discEl.textContent = `Скидка 10% за комбо — экономия ${fmt(t.withCoef * 0.1)}`;
      } else {
        discEl.classList.add('hidden');
      }
    }

    const listEl = $('[data-selected-list]');
    if (listEl) {
      listEl.innerHTML = t.selected.map((s) =>
        `<li><span>${esc(s.name)}</span><span>${fmt(s.price * t.cc.coef)}</span></li>`
      ).join('');
    }
  }

  $('#btn-back-to-services')?.addEventListener('click', () => {
    stepResult.classList.add('hidden');
    stepPackages.classList.remove('hidden');
    stepPackages.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* Формирование текста заявки */
  function buildCalcMessage() {
    const t = calcTotals();
    if (!t.selected.length) return '';
    const lines = [];
    lines.push(`Расчёт стоимости детейлинга из ${cfg.name}`);
    lines.push(`${cfg.fullName}, ${cfg.city}, ${cfg.address}`);
    lines.push('');
    lines.push(`Класс авто: ${t.cc.name} (×${t.cc.coef})`);
    lines.push('Услуги:');
    t.selected.forEach((s) => {
      lines.push(`  • ${s.name} — ${fmt(s.price * t.cc.coef)}`);
    });
    if (t.discountApplied) {
      lines.push('');
      lines.push(`Скидка за комбо 10%: −${fmt(t.withCoef * 0.1)}`);
    }
    lines.push('');
    lines.push(`Итог: от ${fmt(t.low)} до ${fmt(t.high)}`);
    lines.push('');
    lines.push('Ориентировочный расчёт — точный прайс подтвердим после осмотра автомобиля.');
    lines.push(`Телефон для связи: ${cfg.mainPhone}`);
    return lines.join('\n');
  }

  /* Отправка в Telegram / копирование */
  function openTelegramLink(url) {
    // Вызываем WebApp.openTelegramLink ТОЛЬКО внутри Telegram Mini App.
    // В обычном браузере (включая мобильный Chrome/Safari) переход должен
    // открываться стандартно — иначе браузер блокирует всплывающие окна.
    if (isTelegram) {
      try {
        window.Telegram.WebApp.openTelegramLink(url);
        return;
      } catch (e) { /* фолбэк ниже */ }
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function sendToTelegram(text) {
    const url = `${cfg.links.telegramApp}?text=${encodeURIComponent(text)}`;
    openTelegramLink(url);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        // Если внутри Telegram — делимся через нативный диалог
        if (isTelegram) {
          try { openTelegramLink(`${cfg.links.telegramApp}?text=${encodeURIComponent(text)}`); } catch (e) {}
        }
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    // После копирования пробуем открыть VK
    window.open(cfg.links.vk, '_blank', 'noopener,noreferrer');
  }

  $('#btn-send-tg')?.addEventListener('click', () => {
    const msg = buildCalcMessage();
    if (msg) sendToTelegram(msg);
  });

  $('#btn-copy-vk')?.addEventListener('click', () => {
    const msg = buildCalcMessage();
    if (msg) copyText(msg);
  });

  /* =========================================================
     ПОДАРОЧНЫЙ СЕРТИФИКАТ
     ========================================================= */
  if (cfg.flags && cfg.flags.giftCertificate) {
    $('#gift')?.classList.remove('hidden');
    const giftWrap = $('[data-gift-options]');
    let giftSelected = null; // число или id услуги

    if (giftWrap) {
      const amounts = cfg.giftCertificates || [];
      giftWrap.innerHTML = amounts.map((a) =>
        `<button class="gift-btn" data-gift-amount="${a}">${fmt(a)}</button>`
      ).join('');

      $$('.gift-btn', giftWrap).forEach((btn) => {
        btn.addEventListener('click', () => {
          $$('.gift-btn', giftWrap).forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          giftSelected = { type: 'amount', value: parseInt(btn.dataset.giftAmount, 10) };
          // снимаем выбор с кастомного селекта
          const customSel = $('[data-gift-custom-select]');
          if (customSel) customSel.selectedIndex = 0;
        });
      });
    }

    if (cfg.giftCertificateCustom) {
      const customWrap = $('[data-gift-custom-wrap]');
      const customSel = $('[data-gift-custom-select]');
      if (customWrap && customSel) {
        customWrap.classList.remove('hidden');
        customSel.innerHTML = '<option value="">Выберите услугу</option>' +
          cfg.services.map((s) =>
            `<option value="${esc(s.id)}">${esc(s.name)} — от ${fmt(s.price)}</option>`
          ).join('');
        customSel.addEventListener('change', () => {
          if (customSel.value) {
            $$('.gift-btn', giftWrap).forEach((b) => b.classList.remove('active'));
            giftSelected = { type: 'service', id: customSel.value };
          }
        });
      }
    }

    $('#btn-gift-tg')?.addEventListener('click', () => {
      let text;
      if (!giftSelected) {
        // мягкая подсказка
        giftWrap?.animate(
          [{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }],
          { duration: 400 }
        );
        return;
      }
      if (giftSelected.type === 'amount') {
        text = `Хочу заказать подарочный сертификат ${cfg.name} номиналом ${fmt(giftSelected.value)}.`;
      } else {
        const s = cfg.services.find((x) => x.id === giftSelected.id);
        text = `Хочу заказать подарочный сертификат ${cfg.name} на услугу «${s ? s.name : giftSelected.id}».`;
      }
      text += `\n${cfg.fullName}, ${cfg.city}, ${cfg.address}`;
      sendToTelegram(text);
    });
  } else {
    $('#gift')?.classList.add('hidden');
  }

  /* =========================================================
     КЕЙСЫ
     ========================================================= */
  (function renderCases() {
    const wrap = $('[data-cases]');
    if (!wrap || !cfg.cases) return;
    wrap.innerHTML = cfg.cases.map((c) => {
      const media = c.photo
        ? `<div class="case-media"><img src="${esc(c.photo)}" alt="${esc(c.model)}" style="object-position:${esc(c.photoPosition || 'center center')}" loading="lazy"></div>`
        : `<div class="case-media">
             <div class="case-placeholder">
               <div class="case-placeholder-text">Фото скоро</div>
             </div>
           </div>`;
      return `
        <article class="case-card">
          ${media}
          <div class="case-body">
            <div class="case-model">${esc(c.model)}${c.year ? ` <span class="case-year">${esc(c.year)}</span>` : ''}</div>
            <div class="case-desc">${esc(c.desc)}</div>
          </div>
        </article>
      `;
    }).join('');
  })();

  /* =========================================================
     TELEGRAM-КАНАЛ
     ========================================================= */
  (function renderTelegramChannel() {
    if (!cfg.telegramChannel) return;
    const titleEl = $('[data-tg-title]');
    if (titleEl) titleEl.textContent = cfg.telegramChannel.title;
    const descEl = $('[data-tg-desc]');
    if (descEl) descEl.textContent = cfg.telegramChannel.desc;
    $$('[data-tg-link]').forEach((a) => {
      a.href = cfg.telegramChannel.url || cfg.links.telegramChannel;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
    // Нижняя панель ведёт в личный чат (а не на канал)
    $$('[data-tg-personal]').forEach((a) => {
      a.href = cfg.links.telegramApp;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  })();

  /* =========================================================
     КОНТАКТЫ
     ========================================================= */
  (function renderContacts() {
    const wrap = $('[data-contacts]');
    if (!wrap) return;
    const phonesHtml = cfg.phones.map((p) =>
      `<a class="contact-phone" href="tel:${p.replace(/[^+\d]/g, '')}">${esc(p)}</a>`
    ).join('');
    wrap.innerHTML = `
      <div class="contact-card">
        <h3>Адрес</h3>
        <p>${esc(cfg.city)}, ${esc(cfg.address)}</p>
        <p class="contact-note">${esc(cfg.addressNote)}</p>
        <a class="btn btn-primary btn-full" href="${esc(cfg.links.route)}" target="_blank" rel="noopener noreferrer">Построить маршрут</a>
      </div>
      <div class="contact-card">
        <h3>График работы</h3>
        <p>${esc(cfg.schedule)}</p>
      </div>
      <div class="contact-card">
        <h3>Телефоны</h3>
        ${phonesHtml}
      </div>
      <div class="contact-card">
        <h3>Мессенджеры и соцсети</h3>
        <a class="contact-link" href="${esc(cfg.links.telegramApp)}" target="_blank" rel="noopener noreferrer">Telegram</a>
        <a class="contact-link" href="${esc(cfg.links.twoGis)}" target="_blank" rel="noopener noreferrer">2ГИС</a>
        <a class="contact-link" href="${esc(cfg.links.vk)}" target="_blank" rel="noopener noreferrer">VK</a>
        <a class="contact-link" href="${esc(cfg.links.telegramChannel)}" target="_blank" rel="noopener noreferrer">Канал @DeeKayAuto</a>
      </div>
    `;
  })();

  /* =========================================================
     TELEGRAM WEBAPP API
     ========================================================= */
  (function initTelegram() {
    if (!isTelegram) return;
    try {
      const wa = window.Telegram.WebApp;
      wa.ready();
      wa.expand();
    } catch (e) {
      console.warn('Telegram WebApp API недоступен, работаем как обычная страница', e);
    }
  })();

  /* Отладка */
  console.log('DeeKayAvto demo loaded. Mini App inside Telegram:', isTelegram);

  /* Отладка */

})();