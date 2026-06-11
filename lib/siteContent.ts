export type Lang = 'ru' | 'en' | 'et'

export type L10n = Record<Lang, string>
export type L10nList = Record<Lang, string[]>

export type ProgramContent = {
  key: string
  photo: string
  kicker: L10n
  title: L10n
  text: L10n
  bullets: L10nList
}

export type DayItem = {
  time: string
  title: L10n
  text: L10n
}

export type FaqItem = {
  q: L10n
  a: L10n
}

export type SiteContent = {
  nav: Record<string, L10n>
  hero: {
    eyebrow: L10n
    title: L10n
    text: L10n
    primary: L10n
    secondary: L10n
    facts: L10nList
  }
  about: {
    eyebrow: L10n
    title: L10n
    text: L10n
    points: L10nList
  }
  safety: {
    eyebrow: L10n
    title: L10n
    points: L10nList
  }
  programs: {
    eyebrow: L10n
    title: L10n
    items: ProgramContent[]
  }
  day: {
    eyebrow: L10n
    title: L10n
    text: L10n
    items: DayItem[]
  }
  sessions: {
    eyebrow: L10n
    title: L10n
    spotsAvailable: L10n
    lowSpots: L10n
    spotsWord: L10n
  }
  prices: {
    eyebrow: L10n
    title: L10n
    cards: { label: L10n; text: L10n; priceKey: 'price_3day' | 'price_4day' | 'price_5day' }[]
    included: L10n
  }
  gallery: {
    eyebrow: L10n
    title: L10n
    text: L10n
    button: L10n
  }
  reviews: {
    eyebrow: L10n
    title: L10n
    formTitle: L10n
    namePlaceholder: L10n
    programPlaceholder: L10n
    textPlaceholder: L10n
    submit: L10n
    sent: L10n
  }
  faq: {
    eyebrow: L10n
    title: L10n
    items: FaqItem[]
  }
  location: {
    eyebrow: L10n
    title: L10n
    text: L10n
    button: L10n
  }
  cta: {
    eyebrow: L10n
    title: L10n
    text: L10n
    primary: L10n
    secondary: L10n
  }
  footer: {
    text: L10n
    contacts: L10n
    links: L10n
    credit: L10n
  }
}

export const languages: { code: Lang; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'et', label: 'ET' },
]

export const publicPhotos = [
  '/DSC03180.jpg',
  '/DSC03177.jpg',
  '/DSC03142.jpg',
  '/DSC03136.jpg',
  '/DSC03057.jpg',
  '/DSC03039.jpg',
  '/DSC03014.jpg',
  '/DSC02979.jpg',
  '/DSC02967.jpg',
  '/DSC02952.jpg',
  '/DSC02945.jpg',
  '/DSC02922.jpg',
  '/DSC02878.jpg',
  '/DSC02873.jpg',
  '/DSC02866.jpg',
  '/DSC02861.jpg',
  '/DSC02860.jpg',
  '/DSC02835.jpg',
  '/DSC02827.jpg',
  '/DSC02825.jpg',
  '/DSC02550.jpg',
  '/DSC02502.jpg',
  '/DSC02445.jpg',
  '/DSC02384.jpg',
  '/DSC02376.jpg',
  '/DSC02333.jpg',
  '/DSC02326.jpg',
  '/DSC02314.jpg',
  '/DSC02287.jpg',
  '/DSC02286.jpg',
  '/DSC02107.jpg',
  '/DSC02068.jpg',
  '/IMG_8191.JPG',
  '/IMG_6865.JPG',
  '/IMG_6845.JPG',
  '/IMG_6814.JPG',
  '/IMG_6804.JPG',
  '/IMG_6794.JPG',
  '/IMG_6791.JPG',
  '/IMG_6773.JPG',
  '/IMG_6768.JPG',
  '/IMG_6751.JPG',
  '/IMG_6750.JPG',
  '/IMG_6746.JPG',
  '/IMG_6745.JPG',
  '/IMG_6737.JPG',
  '/IMG_6716.JPG',
  '/IMG_6704.JPG',
  '/IMG_6516.JPG',
  '/IMG_6492.JPG',
  '/IMG_6490.JPG',
  '/IMG_6438.JPG',
  '/IMG_6388.JPG',
  '/IMG_6382.JPG',
  '/IMG_6371.JPG',
  '/IMG_6362.JPG',
]

export const defaultContent: SiteContent = {
  nav: {
    about: { ru: 'О лагере', en: 'About', et: 'Laagrist' },
    safety: { ru: 'Безопасность', en: 'Safety', et: 'Turvalisus' },
    programs: { ru: 'Программы', en: 'Programs', et: 'Programmid' },
    day: { ru: 'День', en: 'Day', et: 'Päev' },
    sessions: { ru: 'Смены', en: 'Dates', et: 'Vahetused' },
    prices: { ru: 'Цены', en: 'Prices', et: 'Hinnad' },
    gallery: { ru: 'Галерея', en: 'Gallery', et: 'Galerii' },
    faq: { ru: 'FAQ', en: 'FAQ', et: 'KKK' },
    cta: { ru: 'Записаться', en: 'Register', et: 'Registreeri' },
  },
  hero: {
    eyebrow: { ru: 'Stroomi rand, Tallinn · лето 2026', en: 'Stroomi Beach, Tallinn · summer 2026', et: 'Stroomi rand, Tallinn · suvi 2026' },
    title: {
      ru: 'Детский серфинг-лагерь у моря в Таллине',
      en: 'Kids surf camp by the sea in Tallinn',
      et: 'Laste surfilaager mere ääres Tallinnas',
    },
    text: {
      ru: 'Дети пробуют водные виды спорта, двигаются, находят друзей и проводят день под присмотром инструкторов.',
      en: 'Kids try water sports, stay active, make new friends and spend the day under instructor supervision.',
      et: 'Lapsed proovivad veespordialasid, liiguvad, leiavad uusi sõpru ja on terve päeva juhendajate hoole all.',
    },
    primary: { ru: 'Записать ребёнка', en: 'Register my child', et: 'Registreeri laps' },
    secondary: { ru: 'Смотреть программы', en: 'See programs', et: 'Vaata programme' },
    facts: {
      ru: ['7-14 лет', '09:30-16:30', 'детей в группе'],
      en: ['Ages 7-14', '09:30-16:30', 'children per group'],
      et: ['7-14 aastat', '09:30-16:30', 'last grupis'],
    },
  },
  about: {
    eyebrow: { ru: 'Time to Surf — не просто лагерь', en: 'Time to Surf is more than a camp', et: 'Time to Surf ei ole lihtsalt laager' },
    title: {
      ru: 'Лето, после которого ребёнок чувствует себя смелее',
      en: 'A summer that helps kids feel braver',
      et: 'Suvi, mille järel laps tunneb end julgemalt',
    },
    text: {
      ru: 'Это не “посидели на пляже и разошлись”. У ребёнка есть понятный день, вода, команда, движение и взрослые рядом. Он пробует новое, учится слушать инструктора, меньше сидит в телефоне и уходит домой приятно уставшим.',
      en: 'This is not just sitting on the beach. The day is clear: water, team, movement and adults nearby. Kids try new things, listen to instructors, spend less time on phones and go home happily tired.',
      et: 'See ei ole lihtsalt rannas istumine. Päeval on selge rütm: vesi, tiim, liikumine ja täiskasvanud kõrval. Laps proovib uut, kuulab juhendajat, on vähem telefonis ja läheb koju mõnusalt väsinuna.',
    },
    points: {
      ru: ['водные виды спорта', 'новые друзья', 'уверенность', 'активное лето'],
      en: ['water sports', 'new friends', 'confidence', 'active summer'],
      et: ['veespordialad', 'uued sõbrad', 'enesekindlus', 'aktiivne suvi'],
    },
  },
  safety: {
    eyebrow: { ru: 'Безопасность · Родителям спокойно', en: 'Safety · Parents can relax', et: 'Turvalisus · Vanematel on rahulik' },
    title: {
      ru: 'Мы не торопим детей и не выпускаем их на воду без подготовки',
      en: 'We do not rush kids onto the water before they are ready',
      et: 'Me ei kiirusta lapsi vette enne, kui nad on valmis',
    },
    points: {
      ru: ['Инструкторы рядом на воде и на берегу', 'Жилеты и гидрокостюмы включены', 'Понятный день с 09:30 до 16:30', 'Малые группы: 12-16 детей'],
      en: ['Instructors stay close on water and shore', 'Life jackets and wetsuits included', 'Clear day from 09:30 to 16:30', 'Small groups: 12-16 kids'],
      et: ['Juhendajad on lähedal vees ja kaldal', 'Päästevestid ja kalipsod hinna sees', 'Selge päev 09:30-16:30', 'Väikesed grupid: 12-16 last'],
    },
  },
  programs: {
    eyebrow: { ru: 'Наши программы · Три уникальные программы', en: 'Our programs · Three unique options', et: 'Meie programmid · Kolm eri valikut' },
    title: { ru: 'Выберите смену под характер ребёнка', en: 'Choose the week that fits your child', et: 'Vali vahetus lapse iseloomu järgi' },
    items: [
      {
        key: 'surf',
        photo: '/DSC03180.jpg',
        kicker: { ru: 'База Time to Surf', en: 'Time to Surf classic', et: 'Time to Surf baas' },
        title: { ru: 'Серфинг лагерь', en: 'Surf camp', et: 'Surfilaager' },
        text: {
          ru: 'Каждый день вода, SUP, баланс, игры на пляже и понятная техника безопасности. Подходит новичкам.',
          en: 'Water, SUP, balance, beach games and clear safety practice every day. Good for beginners.',
          et: 'Iga päev vesi, SUP, tasakaal, rannamängud ja selged ohutusreeglid. Sobib algajatele.',
        },
        bullets: {
          ru: ['водные тренировки', 'игры и командные задания', 'присмотр инструкторов весь день'],
          en: ['water sessions', 'games and team tasks', 'instructor supervision all day'],
          et: ['veetreeningud', 'mängud ja tiimitööd', 'juhendajad jälgivad kogu päeva'],
        },
      },
      {
        key: 'kino',
        photo: '/DSC03039.jpg',
        kicker: { ru: 'Активность и творчество', en: 'Activity and creativity', et: 'Liikumine ja loovus' },
        title: { ru: 'Серфинг + кино', en: 'Surf + cinema', et: 'Surf + kino' },
        text: {
          ru: 'Ребята пробуют серфинг и снимают короткий фильм: придумывают роли, берут интервью, работают в команде.',
          en: 'Kids try surfing and make a short film: roles, interviews and teamwork.',
          et: 'Lapsed proovivad surfamist ja teevad lühifilmi: rollid, intervjuud ja tiimitöö.',
        },
        bullets: {
          ru: ['серфинг и SUP', 'съёмка мини-фильма', 'премьера для родителей'],
          en: ['surf and SUP', 'short film project', 'screening for parents'],
          et: ['surf ja SUP', 'lühifilmi tegemine', 'esitlus vanematele'],
        },
      },
      {
        key: 'hike',
        photo: '/IMG_6814.JPG',
        kicker: { ru: 'Море и природа', en: 'Sea and nature', et: 'Meri ja loodus' },
        title: { ru: 'Серфинг + поход', en: 'Surf + hike', et: 'Surf + matk' },
        text: {
          ru: 'Водная часть плюс походные задания, ориентирование и больше движения на свежем воздухе.',
          en: 'Water sessions plus hiking tasks, orientation and more fresh-air movement.',
          et: 'Veesessioonid pluss matkaülesanded, orienteerumine ja rohkem liikumist õues.',
        },
        bullets: {
          ru: ['день у моря', 'походные навыки', 'уверенность и самостоятельность'],
          en: ['day by the sea', 'hiking skills', 'confidence and independence'],
          et: ['päev mere ääres', 'matkaoskused', 'julgus ja iseseisvus'],
        },
      },
    ],
  },
  day: {
    eyebrow: { ru: 'Программа дня · Как проходит день', en: 'Daily plan · How the day works', et: 'Päevakava · Kuidas päev käib' },
    title: {
      ru: 'День собран так, чтобы дети двигались, отдыхали и не перегорели',
      en: 'The day balances movement, rest and focus',
      et: 'Päev hoiab tasakaalus liikumise, puhkuse ja tähelepanu',
    },
    text: {
      ru: 'Водная часть чередуется с береговыми заданиями. Если ребёнок устал или погода меняется, команда спокойно перестраивает активности.',
      en: 'Water sessions alternate with shore activities. If a child is tired or weather changes, the team adjusts the plan calmly.',
      et: 'Veesessioonid vahelduvad kaldal tehtavate ülesannetega. Kui laps väsib või ilm muutub, kohandab tiim tegevusi rahulikult.',
    },
    items: [
      {
        time: '09:30',
        title: { ru: 'Сбор у станции', en: 'Arrival at the station', et: 'Kogunemine jaamas' },
        text: {
          ru: 'Встречаем детей, проверяем одежду и воду, спокойно запускаем день.',
          en: 'We meet the kids, check clothes and water bottles, and start the day calmly.',
          et: 'Võtame lapsed vastu, kontrollime riided ja veepudelid ning alustame rahulikult.',
        },
      },
      {
        time: '10:00',
        title: { ru: 'Разминка и безопасность', en: 'Warm-up and safety', et: 'Soojendus ja ohutus' },
        text: {
          ru: 'Повторяем правила, делаем разминку, распределяем группы.',
          en: 'We repeat the rules, warm up and split into groups.',
          et: 'Kordame reegleid, teeme soojenduse ja jagame lapsed gruppidesse.',
        },
      },
      {
        time: '10:45',
        title: { ru: 'Вода', en: 'Water session', et: 'Veesessioon' },
        text: {
          ru: 'SUP, баланс, первые попытки, игры и упражнения по уровню ребёнка.',
          en: 'SUP, balance, first attempts, games and exercises matched to each child.',
          et: 'SUP, tasakaal, esimesed katsed, mängud ja harjutused lapse taseme järgi.',
        },
      },
      {
        time: '12:30',
        title: { ru: 'Обед', en: 'Lunch', et: 'Lõuna' },
        text: {
          ru: 'Горячий обед и пауза без спешки. Дети успевают отдохнуть.',
          en: 'Warm lunch and a calm break so kids can rest.',
          et: 'Soe lõuna ja rahulik paus, et lapsed jõuaksid puhata.',
        },
      },
      {
        time: '13:30',
        title: { ru: 'Проект дня', en: 'Day project', et: 'Päeva projekt' },
        text: {
          ru: 'Кино, походные задания, командные игры или творческая часть смены.',
          en: 'Film work, hiking tasks, team games or the creative part of the week.',
          et: 'Filmitöö, matkaülesanded, tiimimängud või vahetuse loov osa.',
        },
      },
      {
        time: '15:00',
        title: { ru: 'Вторая активность', en: 'Second activity', et: 'Teine tegevus' },
        text: {
          ru: 'Пляжные игры, техника, эстафеты и спокойная работа с прогрессом.',
          en: 'Beach games, technique, relays and steady progress.',
          et: 'Rannamängud, tehnika, teatevõistlused ja rahulik areng.',
        },
      },
      {
        time: '16:30',
        title: { ru: 'Родители забирают детей', en: 'Pick-up', et: 'Vanemad tulevad järgi' },
        text: {
          ru: 'Коротко рассказываем, как прошёл день и что было на воде.',
          en: 'We briefly share how the day went and what happened on the water.',
          et: 'Räägime lühidalt, kuidas päev läks ja mis vees toimus.',
        },
      },
    ],
  },
  sessions: {
    eyebrow: { ru: 'Все смены · Расписание лета 2026', en: 'All weeks · Summer 2026 schedule', et: 'Kõik vahetused · Suvi 2026' },
    title: { ru: 'Смены идут всё лето', en: 'Camp weeks run all summer', et: 'Vahetused toimuvad kogu suve' },
    spotsAvailable: { ru: 'места есть', en: 'spots available', et: 'kohti on' },
    lowSpots: { ru: 'мало мест', en: 'few spots left', et: 'vähe kohti' },
    spotsWord: { ru: 'мест', en: 'spots', et: 'kohta' },
  },
  prices: {
    eyebrow: { ru: 'Цены', en: 'Prices', et: 'Hinnad' },
    title: { ru: 'В стоимость уже включено главное', en: 'The essentials are already included', et: 'Oluline on juba hinna sees' },
    cards: [
      {
        priceKey: 'price_3day',
        label: { ru: '3 дня', en: '3 days', et: '3 päeva' },
        text: {
          ru: 'Если хочется попробовать формат без полной недели.',
          en: 'A good way to try the format without a full week.',
          et: 'Hea viis formaati proovida ilma terve nädalata.',
        },
      },
      {
        priceKey: 'price_4day',
        label: { ru: '4 дня', en: '4 days', et: '4 päeva' },
        text: {
          ru: 'Короткая смена, но уже с полноценным ритмом лагеря.',
          en: 'A shorter week with the full camp rhythm.',
          et: 'Lühem vahetus, aga laagri täisrütmiga.',
        },
      },
      {
        priceKey: 'price_5day',
        label: { ru: '5 дней', en: '5 days', et: '5 päeva' },
        text: {
          ru: 'Полная программа: вода, команда, проект и сертификат.',
          en: 'Full program: water, team, project and certificate.',
          et: 'Täisprogramm: vesi, tiim, projekt ja sertifikaat.',
        },
      },
    ],
    included: {
      ru: 'Включено: инструкторы, оборудование, гидрокостюм, спасательный жилет, обед, полдник и вся программа дня.',
      en: 'Included: instructors, equipment, wetsuit, life jacket, lunch, snack and the full day program.',
      et: 'Hinna sees: juhendajad, varustus, kalipso, päästevest, lõuna, vahepala ja kogu päevaprogramm.',
    },
  },
  gallery: {
    eyebrow: { ru: 'Галерея', en: 'Gallery', et: 'Galerii' },
    title: {
      ru: 'Живые моменты лагеря без бесконечной простыни фото',
      en: 'Real camp moments without an endless photo wall',
      et: 'Päris laagrihetked ilma lõputu fotoseinata',
    },
    text: {
      ru: 'На странице оставлены сильные кадры. Внутри можно открыть всю галерею, листать фото стрелками и выбирать кадры по нижней ленте.',
      en: 'The page shows the strongest shots. Open the full gallery to browse with arrows and the thumbnail rail.',
      et: 'Lehel on tugevamad kaadrid. Täisgaleriis saab fotosid nooltega sirvida ja allolevalt ribalt valida.',
    },
    button: { ru: 'Открыть все фото', en: 'Open all photos', et: 'Ava kõik fotod' },
  },
  reviews: {
    eyebrow: { ru: 'Отзывы', en: 'Reviews', et: 'Arvustused' },
    title: { ru: 'Что говорят родители', en: 'What parents say', et: 'Mida vanemad ütlevad' },
    formTitle: { ru: 'Оставить отзыв', en: 'Leave a review', et: 'Jäta arvustus' },
    namePlaceholder: { ru: 'Ваше имя', en: 'Your name', et: 'Teie nimi' },
    programPlaceholder: { ru: 'Программа', en: 'Program', et: 'Programm' },
    textPlaceholder: { ru: 'Коротко расскажите, как всё прошло', en: 'Briefly tell us how it went', et: 'Kirjeldage lühidalt kogemust' },
    submit: { ru: 'Отправить', en: 'Send', et: 'Saada' },
    sent: { ru: 'Спасибо. Отзыв отправлен на проверку.', en: 'Thank you. The review is waiting for approval.', et: 'Aitäh. Arvustus ootab kinnitamist.' },
  },
  faq: {
    eyebrow: { ru: 'Вопрос ответ', en: 'Questions and answers', et: 'Küsimused ja vastused' },
    title: {
      ru: 'Коротко о том, что обычно важно родителям',
      en: 'Short answers to what parents usually ask',
      et: 'Lühidalt sellest, mis vanematele tavaliselt tähtis on',
    },
    items: [
      {
        q: { ru: 'Нужен ли опыт серфинга?', en: 'Is surfing experience needed?', et: 'Kas surfikogemus on vajalik?' },
        a: {
          ru: 'Нет. Мы берём новичков и начинаем с простых упражнений: баланс, посадка на доску, правила на воде.',
          en: 'No. We welcome beginners and start with simple exercises: balance, board position and water rules.',
          et: 'Ei. Võtame algajaid ja alustame lihtsatest harjutustest: tasakaal, asend laual ja veereeglid.',
        },
      },
      {
        q: { ru: 'Какой возраст подходит?', en: 'What age is right?', et: 'Mis vanus sobib?' },
        a: {
          ru: 'Основной возраст 7-14 лет. Если ребёнок младше, лучше заранее написать нам.',
          en: 'The main age range is 7-14. If your child is younger, please write to us first.',
          et: 'Põhivanus on 7-14 aastat. Kui laps on noorem, kirjutage meile enne.',
        },
      },
      {
        q: { ru: 'Что входит в цену?', en: 'What is included?', et: 'Mis on hinna sees?' },
        a: {
          ru: 'Программа, инструкторы, оборудование, гидрокостюм, спасательный жилет, обед, полдник и сертификат.',
          en: 'Program, instructors, equipment, wetsuit, life jacket, lunch, snack and certificate.',
          et: 'Programm, juhendajad, varustus, kalipso, päästevest, lõuna, vahepala ja sertifikaat.',
        },
      },
      {
        q: { ru: 'Что если плохая погода?', en: 'What if the weather is bad?', et: 'Mis saab halva ilmaga?' },
        a: {
          ru: 'В лёгкий дождь занимаемся в гидрокостюмах. Если на воде небезопасно, переносим активность на берег.',
          en: 'In light rain we use wetsuits. If the water is unsafe, we move the program to shore.',
          et: 'Kerge vihmaga tegutseme kalipsodes. Kui vees ei ole turvaline, viime tegevused kaldale.',
        },
      },
      {
        q: { ru: 'Как обеспечивается безопасность?', en: 'How is safety handled?', et: 'Kuidas turvalisus tagatakse?' },
        a: {
          ru: 'Дети выходят на воду только в жилетах и под присмотром. Перед каждым заходом повторяем правила.',
          en: 'Kids go on the water only with life jackets and supervision. Rules are repeated before every session.',
          et: 'Lapsed lähevad vette ainult päästevestiga ja juhendaja jälgimisel. Reegleid kordame enne iga sessiooni.',
        },
      },
    ],
  },
  location: {
    eyebrow: { ru: 'Место проведения', en: 'Location', et: 'Asukoht' },
    title: { ru: 'Stroomi rand, Tallinn', en: 'Stroomi Beach, Tallinn', et: 'Stroomi rand, Tallinn' },
    text: {
      ru: 'Встречаемся у станции Time to Surf на пляже Штромка. Рядом парковка, остановки и удобный подъезд из центра города.',
      en: 'We meet at the Time to Surf station on Stroomi Beach. Parking, stops and easy access from the city are nearby.',
      et: 'Kohtume Time to Surf jaamas Stroomi rannas. Parkimine, peatused ja lihtne ligipääs linnast on lähedal.',
    },
    button: { ru: 'Открыть карту', en: 'Open map', et: 'Ava kaart' },
  },
  cta: {
    eyebrow: { ru: 'CTA', en: 'CTA', et: 'CTA' },
    title: { ru: 'Забронируйте место на лето 2026', en: 'Reserve a spot for summer 2026', et: 'Broneeri koht suveks 2026' },
    text: {
      ru: 'Напишите нам или заполните форму. Мы подскажем смену, программу и ответим на вопросы по безопасности.',
      en: 'Write to us or fill in the form. We will help choose the week, program and answer safety questions.',
      et: 'Kirjutage meile või täitke vorm. Aitame valida vahetuse, programmi ja vastame ohutuse küsimustele.',
    },
    primary: { ru: 'Записаться', en: 'Register', et: 'Registreeri' },
    secondary: { ru: 'Написать в Telegram', en: 'Write on Telegram', et: 'Kirjuta Telegramis' },
  },
  footer: {
    text: {
      ru: 'Детский серфинг-лагерь у моря в Таллине. Безопасно, активно и по-настоящему живо.',
      en: 'Kids surf camp by the sea in Tallinn. Safe, active and genuinely fun.',
      et: 'Laste surfilaager mere ääres Tallinnas. Turvaline, aktiivne ja päriselt elav.',
    },
    contacts: { ru: 'Контакты', en: 'Contacts', et: 'Kontaktid' },
    links: { ru: 'Ссылки', en: 'Links', et: 'Lingid' },
    credit: { ru: 'web page by NorthPixel', en: 'web page by NorthPixel', et: 'web page by NorthPixel' },
  },
}

export function getText(value: L10n, lang: Lang) {
  return value?.[lang] || value?.ru || ''
}

export function getList(value: L10nList, lang: Lang) {
  return value?.[lang] || value?.ru || []
}

export function parseContent(raw?: string): SiteContent {
  if (!raw) return defaultContent
  try {
    return deepMerge(defaultContent, JSON.parse(raw)) as SiteContent
  } catch {
    return defaultContent
  }
}

export function listToText(items: string[]) {
  return items.join('\n')
}

export function textToList(value: string) {
  return value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
}

function deepMerge(base: unknown, override: unknown): unknown {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base
  if (!isObject(base)) return override === undefined || override === null ? base : override
  if (!isObject(override)) return base

  const output: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  Object.keys(override as Record<string, unknown>).forEach(key => {
    output[key] = deepMerge(output[key], (override as Record<string, unknown>)[key])
  })
  return output
}

function isObject(value: unknown) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
