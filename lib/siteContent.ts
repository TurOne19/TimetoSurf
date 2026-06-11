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
  dates: string[]
  detailsTitle: L10n
  detailsIntro: L10n
  details: { title: L10n; items: L10nList }[]
  result: L10nList
  leader?: {
    initials: string
    name: L10n
    role: L10n
    bio: L10n
  }
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
  why: {
    eyebrow: L10n
    title: L10n
    text: L10n
    points: { value: L10n; label: L10n; text: L10n }[]
  }
  safety: {
    eyebrow: L10n
    title: L10n
    points: L10nList
  }
  included: {
    eyebrow: L10n
    title: L10n
    text: L10n
    items: { title: L10n; text: L10n }[]
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
    why: { ru: 'Почему мы', en: 'Why us', et: 'Miks meie' },
    safety: { ru: 'Безопасность', en: 'Safety', et: 'Turvalisus' },
    included: { ru: 'Что входит', en: 'Included', et: 'Hinna sees' },
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
    secondary: { ru: 'Задать вопрос', en: 'Ask a question', et: 'Küsi küsimus' },
    facts: {
      ru: ['7-12 лет', 'от 265€', 'места ограничены'],
      en: ['Ages 7-12', 'from 265€', 'limited spots'],
      et: ['7-12 aastat', 'alates 265€', 'kohtade arv piiratud'],
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
  why: {
    eyebrow: { ru: 'Почему родители выбирают Time to Surf', en: 'Why parents choose Time to Surf', et: 'Miks vanemad valivad Time to Surfi' },
    title: {
      ru: 'Ребёнок занят делом, а родитель понимает, кто рядом с ним',
      en: 'Kids stay busy with real activities, parents know who is nearby',
      et: 'Lapsel on päris tegevus ja vanem teab, kes tema kõrval on',
    },
    text: {
      ru: 'Мы не обещаем “магическое лето”. Мы делаем понятную смену у моря: инструкторы, оборудование, питание, вода, игры и спокойный контроль детей каждый день.',
      en: 'We do not sell a magic summer. We run a clear seaside week: instructors, equipment, meals, water, games and calm supervision every day.',
      et: 'Me ei luba maagilist suve. Teeme selge mereäärse vahetuse: juhendajad, varustus, toit, vesi, mängud ja rahulik järelevalve iga päev.',
    },
    points: [
      {
        value: { ru: '15+', en: '15+', et: '15+' },
        label: { ru: 'лет опыта', en: 'years of experience', et: 'aastat kogemust' },
        text: {
          ru: 'Команда Time to Surf много лет работает с водой, ветром и детьми на Балтийском море.',
          en: 'The Time to Surf team has worked for years with water, wind and kids on the Baltic Sea.',
          et: 'Time to Surfi tiim on aastaid töötanud vee, tuule ja lastega Läänemere ääres.',
        },
      },
      {
        value: { ru: '12-16', en: '12-16', et: '12-16' },
        label: { ru: 'детей в группе', en: 'kids per group', et: 'last grupis' },
        text: {
          ru: 'Группа небольшая, поэтому инструкторы видят детей и успевают помогать.',
          en: 'Groups are small, so instructors can see the kids and help in time.',
          et: 'Grupid on väikesed, seega juhendajad näevad lapsi ja jõuavad aidata.',
        },
      },
      {
        value: { ru: '100%', en: '100%', et: '100%' },
        label: { ru: 'жилеты на воде', en: 'life jackets on water', et: 'päästevestid vees' },
        text: {
          ru: 'На воду дети выходят только после правил безопасности, в жилетах и под контролем.',
          en: 'Kids enter the water only after safety rules, with life jackets and supervision.',
          et: 'Lapsed lähevad vette ainult pärast ohutusreegleid, päästevestiga ja järelevalve all.',
        },
      },
    ],
  },
  safety: {
    eyebrow: { ru: 'Безопасность · Родителям спокойно', en: 'Safety · Parents can relax', et: 'Turvalisus · Vanematel on rahulik' },
    title: {
      ru: 'Мы не торопим детей и не выпускаем их на воду без подготовки',
      en: 'We do not rush kids onto the water before they are ready',
      et: 'Me ei kiirusta lapsi vette enne, kui nad on valmis',
    },
    points: {
      ru: ['Инструкторы рядом на воде и на берегу', 'Жилеты и гидрокостюмы включены', 'Перед водой повторяем правила', 'Если погода небезопасна, активность переносится на берег', 'Малые группы: 12-16 детей', 'Родителям понятно, где ребёнок и что он делает'],
      en: ['Instructors stay close on water and shore', 'Life jackets and wetsuits included', 'Rules are repeated before water sessions', 'If the weather is unsafe, activities move to shore', 'Small groups: 12-16 kids', 'Parents understand where the child is and what they do'],
      et: ['Juhendajad on lähedal vees ja kaldal', 'Päästevestid ja kalipsod hinna sees', 'Enne vett kordame reegleid', 'Kui ilm ei ole turvaline, liigume kaldale', 'Väikesed grupid: 12-16 last', 'Vanem teab, kus laps on ja mida ta teeb'],
    },
  },
  included: {
    eyebrow: { ru: 'Что входит в лагерь', en: 'What is included', et: 'Mis laagris sisaldub' },
    title: {
      ru: 'Вода, движение, питание и оборудование уже внутри программы',
      en: 'Water, movement, meals and equipment are already inside the program',
      et: 'Vesi, liikumine, toit ja varustus on programmis sees',
    },
    text: {
      ru: 'Ребёнку не нужен опыт серфинга. Нужны сменная одежда, полотенце, бутылка воды и готовность пробовать новое.',
      en: 'Your child does not need surfing experience. They need spare clothes, a towel, a water bottle and willingness to try.',
      et: 'Surfikogemust ei ole vaja. Kaasa vahetusriided, rätik, veepudel ja valmisolek proovida.',
    },
    items: [
      {
        title: { ru: 'SUP, виндсерфинг, wing и bodyboard', en: 'SUP, windsurfing, wing and bodyboard', et: 'SUP, purjelaud, wing ja bodyboard' },
        text: {
          ru: 'Дети видят разные водные виды спорта и пробуют то, что подходит погоде и уровню группы.',
          en: 'Kids see different water sports and try what fits the weather and group level.',
          et: 'Lapsed näevad eri veespordialasid ja proovivad seda, mis sobib ilma ja grupi tasemega.',
        },
      },
      {
        title: { ru: 'Гидрокостюм и спасательный жилет', en: 'Wetsuit and life jacket', et: 'Kalipso ja päästevest' },
        text: {
          ru: 'Оборудование выдаём на месте. На воде дети только в жилетах.',
          en: 'Equipment is provided on site. Kids are on the water only with life jackets.',
          et: 'Varustus antakse kohapeal. Vees on lapsed ainult päästevestiga.',
        },
      },
      {
        title: { ru: 'Обед и полдник', en: 'Lunch and snack', et: 'Lõuna ja vahepala' },
        text: {
          ru: 'Порционное питание от Tark Catering, особенности питания учитываются при регистрации.',
          en: 'Individual meals from Tark Catering, dietary needs are noted at registration.',
          et: 'Portsjonitoit Tark Cateringilt, erisoovid märgitakse registreerimisel.',
        },
      },
      {
        title: { ru: 'Игры, квесты и командные задания', en: 'Games, quests and team tasks', et: 'Mängud, ülesanded ja tiimitöö' },
        text: {
          ru: 'После воды дети не зависают в телефоне: общаются, двигаются и делают общий проект смены.',
          en: 'After water sessions kids do not disappear into phones: they talk, move and work on the week project.',
          et: 'Pärast vett ei kao lapsed telefoni: nad suhtlevad, liiguvad ja teevad vahetuse projekti.',
        },
      },
    ],
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
        dates: ['06.07 - 10.07.2026', '20.07 - 24.07.2026', '27.07 - 30.07.2026', '03.08 - 07.08.2026', '10.08 - 14.08.2026'],
        detailsTitle: { ru: 'Что внутри серфинг-лагеря', en: 'What is inside Surf Camp', et: 'Mis on surfilaagris sees' },
        detailsIntro: {
          ru: 'Это базовая программа Time to Surf: максимум моря, движения и понятной техники безопасности. Подходит детям, которые впервые пробуют водные виды спорта.',
          en: 'This is the core Time to Surf program: lots of sea, movement and clear water safety. Good for kids trying water sports for the first time.',
          et: 'See on Time to Surfi põhiprogramm: meri, liikumine ja selge veeohutus. Sobib lastele, kes proovivad veespordialasid esimest korda.',
        },
        details: [
          {
            title: { ru: 'Водный блок', en: 'Water block', et: 'Veeplokk' },
            items: {
              ru: ['SUP-прогулки и баланс', 'первые шаги в виндсерфинге', 'bodyboard и игры на воде', 'знакомство с ветром и условиями моря'],
              en: ['SUP walks and balance', 'first windsurfing steps', 'bodyboard and water games', 'learning wind and sea conditions'],
              et: ['SUP-sõidud ja tasakaal', 'esimesed sammud purjelaual', 'bodyboard ja veemängud', 'tuule ja mereolude tundmaõppimine'],
            },
          },
          {
            title: { ru: 'Берег и команда', en: 'Shore and team', et: 'Kallas ja tiim' },
            items: {
              ru: ['разминки и командные игры', 'простая теория безопасности', 'экология моря и бережное отношение к природе', 'спокойные задания после обеда'],
              en: ['warm-ups and team games', 'simple safety theory', 'sea ecology and care for nature', 'calm tasks after lunch'],
              et: ['soojendused ja tiimimängud', 'lihtne ohutusteooria', 'mereökoloogia ja looduse hoidmine', 'rahulikud ülesanded pärast lõunat'],
            },
          },
        ],
        result: {
          ru: ['ребёнок увереннее чувствует себя рядом с водой', 'понимает базовые правила безопасности', 'много двигается и меньше сидит в телефоне', 'знакомится с новыми друзьями'],
          en: ['the child feels more confident near water', 'understands basic safety rules', 'moves a lot and spends less time on a phone', 'meets new friends'],
          et: ['laps tunneb end vee ääres kindlamalt', 'mõistab põhilisi ohutusreegleid', 'liigub palju ja on vähem telefonis', 'leiab uusi sõpru'],
        },
        leader: {
          initials: 'TS',
          name: { ru: 'Команда Time to Surf', en: 'Time to Surf team', et: 'Time to Surfi tiim' },
          role: { ru: 'Инструкторы по водным видам спорта', en: 'Water sports instructors', et: 'Veespordi juhendajad' },
          bio: {
            ru: 'Инструкторы работают рядом с детьми на воде и на берегу: объясняют, помогают, страхуют и следят за темпом группы.',
            en: 'Instructors stay with kids on water and shore: explain, help, support and watch the group pace.',
            et: 'Juhendajad on lastega vees ja kaldal: selgitavad, aitavad, toetavad ja jälgivad grupi tempot.',
          },
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
        dates: ['15.06 - 19.06.2026', '29.06 - 03.07.2026'],
        detailsTitle: { ru: 'Серфинг + кино: что делает ребёнок', en: 'Surf + Cinema: what the child does', et: 'Surf + kino: mida laps teeb' },
        detailsIntro: {
          ru: 'Ребята пробуют SUP и серфинг, а во второй части дня снимают свой короткий фильм про лагерь: репортажи, интервью, кадры с воды и премьера.',
          en: 'Kids try SUP and surfing, then create their own short camp film: reports, interviews, water shots and a screening.',
          et: 'Lapsed proovivad SUP-i ja surfamist, seejärel teevad oma lühifilmi laagrist: reportaažid, intervjuud, veekaadrid ja esitlus.',
        },
        details: [
          {
            title: { ru: 'Серфинг и активность', en: 'Surfing and activity', et: 'Surfamine ja aktiivsus' },
            items: {
              ru: ['SUP, баланс и координация', 'игры на пляже', 'безопасность на воде', 'движение каждый день'],
              en: ['SUP, balance and coordination', 'beach games', 'water safety', 'movement every day'],
              et: ['SUP, tasakaal ja koordinatsioon', 'rannamängud', 'veeohutus', 'liikumine iga päev'],
            },
          },
          {
            title: { ru: 'Создание фильма', en: 'Making the film', et: 'Filmi tegemine' },
            items: {
              ru: ['ведущие снимают репортажи', 'операторы учатся видеть кадр', 'дети берут интервью', 'команда собирает историю смены'],
              en: ['hosts make reports', 'camera operators learn framing', 'kids take interviews', 'the team builds the week story'],
              et: ['saatejuhid teevad reportaaže', 'operaatorid õpivad kaadrit nägema', 'lapsed teevad intervjuusid', 'tiim paneb vahetuse loo kokku'],
            },
          },
          {
            title: { ru: 'Что остаётся после смены', en: 'What stays after the week', et: 'Mis jääb pärast vahetust' },
            items: {
              ru: ['короткий фильм на память', 'опыт перед камерой', 'новая уверенность', 'живые кадры с друзьями и морем'],
              en: ['a short film as a memory', 'camera confidence', 'new confidence', 'real shots with friends and the sea'],
              et: ['lühifilm mälestuseks', 'julgus kaamera ees', 'uus enesekindlus', 'päris hetked sõprade ja merega'],
            },
          },
        ],
        result: {
          ru: ['ребёнок пробует водные виды спорта', 'учится говорить и работать в команде', 'получает опыт съёмки', 'у семьи остаётся фильм со смены'],
          en: ['the child tries water sports', 'learns to speak and work in a team', 'gets filming experience', 'the family keeps a film from the week'],
          et: ['laps proovib veespordialasid', 'õpib rääkima ja tiimis töötama', 'saab filmimise kogemuse', 'perele jääb film vahetusest'],
        },
        leader: {
          initials: 'НК',
          name: { ru: 'Наталья Карасёва', en: 'Natalia Karaseva', et: 'Natalia Karaseva' },
          role: { ru: 'Ведущая программы “Серфинг + кино”', en: 'Surf + Cinema lead', et: 'Surf + kino programmi juht' },
          bio: {
            ru: 'Тележурналист с 20-летним опытом в двух странах, автор подкаста “Cozy with Tasha”, создатель видео и документального короткого формата.',
            en: 'TV journalist with 20 years of experience in two countries, author of the Cozy with Tasha podcast and creator of video/documentary short formats.',
            et: 'Teleajakirjanik 20-aastase kogemusega kahes riigis, Cozy with Tasha taskuhäälingu autor ja videolugude looja.',
          },
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
        dates: ['13.07 - 17.07.2026', '17.08 - 21.08.2026'],
        detailsTitle: { ru: 'Серфинг + поход: море и приключение', en: 'Surf + Hike: sea and adventure', et: 'Surf + matk: meri ja seiklus' },
        detailsIntro: {
          ru: 'Это смена для детей, которым мало просто воды. Здесь есть серфинг, ориентирование, лес, палатка, командные задания и финальный мини-поход.',
          en: 'This week is for kids who want more than water. It has surfing, navigation, forest, tent, team tasks and a final mini-hike.',
          et: 'See vahetus on lastele, kellele ainult veest ei piisa. Siin on surf, orienteerumine, mets, telk, tiimitöö ja lõpu-minimatk.',
        },
        details: [
          {
            title: { ru: 'На воде', en: 'On the water', et: 'Vees' },
            items: {
              ru: ['SUP и баланс', 'виндсерфинг по погоде', 'правила воды и ветра', 'работа с уверенностью ребёнка'],
              en: ['SUP and balance', 'windsurfing when weather fits', 'water and wind rules', 'building child confidence'],
              et: ['SUP ja tasakaal', 'purjelaud sobiva ilmaga', 'vee ja tuule reeglid', 'lapse enesekindluse toetamine'],
            },
          },
          {
            title: { ru: 'В природе', en: 'In nature', et: 'Looduses' },
            items: {
              ru: ['карта и компас', 'как вести себя в лесу', 'палатка и организация лагеря', 'простые основы костра и выживания'],
              en: ['map and compass', 'how to behave in the forest', 'tent and camp setup', 'simple fire and survival basics'],
              et: ['kaart ja kompass', 'kuidas metsas käituda', 'telk ja laagri ülespanek', 'lihtsad lõkke ja ellujäämise alused'],
            },
          },
          {
            title: { ru: 'Команда', en: 'Team', et: 'Tiim' },
            items: {
              ru: ['каждый участник важен', 'решения принимаются вместе', 'финальный мини-поход', 'нашивка Time to Surf hiker'],
              en: ['every participant matters', 'decisions are made together', 'final mini-hike', 'Time to Surf hiker patch'],
              et: ['iga osaleja on oluline', 'otsuseid tehakse koos', 'lõpu-minimatk', 'Time to Surf hiker märk'],
            },
          },
        ],
        result: {
          ru: ['ребёнок увереннее на воде и в природе', 'понимает карту, компас и базовые условия', 'учится принимать решения', 'получает опыт настоящей команды'],
          en: ['the child is more confident on water and in nature', 'understands map, compass and basic conditions', 'learns to make decisions', 'gets real team experience'],
          et: ['laps on vees ja looduses kindlam', 'mõistab kaarti, kompassi ja olusid', 'õpib otsuseid tegema', 'saab päris tiimikogemuse'],
        },
        leader: {
          initials: 'ВХ',
          name: { ru: 'Виталий Холстинин', en: 'Vitaliy Kholstinin', et: 'Vitaliy Kholstinin' },
          role: { ru: 'Ведущий программы “Серфинг + поход”', en: 'Surf + Hike lead', et: 'Surf + matk programmi juht' },
          bio: {
            ru: 'Хайкер, предприниматель и основатель Join The Hike. Больше 10 лет ходит в походы в Эстонии и Скандинавии и учит детей уважать природу.',
            en: 'Hiker, entrepreneur and founder of Join The Hike. Over 10 years of hiking in Estonia and Scandinavia, teaching kids to respect nature.',
            et: 'Matkaja, ettevõtja ja Join The Hike asutaja. Üle 10 aasta matku Eestis ja Skandinaavias, õpetab lapsi loodust austama.',
          },
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
        time: '09:00-09:30',
        title: { ru: 'Сбор у станции', en: 'Arrival at the station', et: 'Kogunemine jaamas' },
        text: {
          ru: 'Встречаем детей, проверяем одежду, воду и самочувствие. День начинается без спешки.',
          en: 'We meet the kids, check clothes, water bottles and mood. The day starts calmly.',
          et: 'Võtame lapsed vastu, kontrollime riided, veepudelid ja enesetunde. Päev algab rahulikult.',
        },
      },
      {
        time: '09:30-10:00',
        title: { ru: 'Разминка и безопасность', en: 'Warm-up and safety', et: 'Soojendus ja ohutus' },
        text: {
          ru: 'Повторяем правила, делаем разминку, распределяем группы.',
          en: 'We repeat the rules, warm up and split into groups.',
          et: 'Kordame reegleid, teeme soojenduse ja jagame lapsed gruppidesse.',
        },
      },
      {
        time: '10:00-12:00',
        title: { ru: 'Вода', en: 'Water session', et: 'Veesessioon' },
        text: {
          ru: 'Теория безопасности, гидрокостюмы, жилеты, SUP, баланс и первые водные задания.',
          en: 'Safety theory, wetsuits, life jackets, SUP, balance and first water tasks.',
          et: 'Ohutusteooria, kalipsod, päästevestid, SUP, tasakaal ja esimesed veeülesanded.',
        },
      },
      {
        time: '12:00-13:00',
        title: { ru: 'Обед', en: 'Lunch', et: 'Lõuna' },
        text: {
          ru: 'Порционный обед от Tark Catering. Учитываем особенности питания, которые указаны при регистрации.',
          en: 'Individual lunch from Tark Catering. Dietary needs noted at registration are taken into account.',
          et: 'Portsjonilõuna Tark Cateringilt. Arvestame registreerimisel märgitud toitumissoove.',
        },
      },
      {
        time: '13:00-13:30',
        title: { ru: 'Отдых после обеда', en: 'Rest after lunch', et: 'Puhkus pärast lõunat' },
        text: {
          ru: 'Настольные игры, спокойное общение, пауза перед второй активной частью.',
          en: 'Board games, calm social time and a break before the second active part.',
          et: 'Lauamängud, rahulik suhtlus ja paus enne teist aktiivset osa.',
        },
      },
      {
        time: '13:30-15:30',
        title: { ru: 'Активная программа', en: 'Active program', et: 'Aktiivne programm' },
        text: {
          ru: 'Виндсерфинг, SUP, кайт-знакомство, походные задания, кино, мастерские или пляжные игры по погоде.',
          en: 'Windsurfing, SUP, kite intro, hiking tasks, cinema, workshops or beach games depending on weather.',
          et: 'Purjelaud, SUP, lohetutvustus, matkaülesanded, kino, töötoad või rannamängud vastavalt ilmale.',
        },
      },
      {
        time: '15:30-15:45',
        title: { ru: 'Полдник', en: 'Snack', et: 'Vahepala' },
        text: {
          ru: 'Чай, перекус, вода и короткий отдых.',
          en: 'Tea, snack, water and a short rest.',
          et: 'Tee, vahepala, vesi ja lühike puhkus.',
        },
      },
      {
        time: '15:45-16:30',
        title: { ru: 'Спокойный финал дня', en: 'Calm end of the day', et: 'Rahulik päeva lõpp' },
        text: {
          ru: 'Игры, творчество, обсуждение дня и лёгкие задания, чтобы дети не уходили перегруженными.',
          en: 'Games, creativity, day recap and light tasks so kids do not leave overloaded.',
          et: 'Mängud, loovus, päeva kokkuvõte ja kerged ülesanded, et lapsed ei läheks ülekoormatuna koju.',
        },
      },
      {
        time: '16:30',
        title: { ru: 'Родители забирают детей', en: 'Pick-up', et: 'Vanemad tulevad järgi' },
        text: {
          ru: 'Программа заканчивается. До 17:00 дети могут спокойно дождаться родителей у станции.',
          en: 'The program ends. Until 17:00 kids can calmly wait for parents at the station.',
          et: 'Programm lõpeb. Kuni 17:00 saavad lapsed jaamas rahulikult vanemaid oodata.',
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
      ru: 'Включено: инструкторы, оборудование, гидрокостюм, спасательный жилет, обед, полдник, программа дня, игры, мастерские и сертификат.',
      en: 'Included: instructors, equipment, wetsuit, life jacket, lunch, snack, day program, games, workshops and certificate.',
      et: 'Hinna sees: juhendajad, varustus, kalipso, päästevest, lõuna, vahepala, päevaprogramm, mängud, töötoad ja sertifikaat.',
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
          ru: 'Основной возраст 7-12 лет. До 14 лет можно по согласованию, если ребёнку подходит темп программы.',
          en: 'The main age range is 7-12. Up to 14 is possible by agreement if the program pace fits the child.',
          et: 'Põhivanus on 7-12 aastat. Kuni 14 on kokkuleppel võimalik, kui programmi tempo lapsele sobib.',
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
    primary: { ru: 'Записать ребёнка', en: 'Register my child', et: 'Registreeri laps' },
    secondary: { ru: 'Задать вопрос', en: 'Ask a question', et: 'Küsi küsimus' },
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
