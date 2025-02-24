module.exports = [
  {
    id: 'esa',
    mailingList: {
      development: 2,
      staging: 2,
      production: 4,
    },
    match: ['race.esa.int', 'eodash.eox.at', 'eodash-staging.eox.at', 'eodash-testing.eox.at', 'localhost2'],
    branding: {
      appName: 'Rapid Action on coronavirus and EO',
      primaryColor: '#003247',
      secondaryColor: '#0098DB',
      headerLogo: './eodash-data/general/RACE_Logo.png',
      faviconPath: './public/img/ESA/favicon.ico',
    },
    pageMeta: {
      rootPath: 'https://race.esa.int',
      googleSiteVerification: 'RfWilP51Q2wsZnVlKbxUTovIx90QqqLRFLebGpAeq14',
      shortDescription: 'The RACE platform demonstrates how the use of EO data can help shed new light on societal and economic changes currently taking place owing to the coronavirus pandemic.',
      twitterCardImagePath: '/img/ESA/twitter_card.jpg',
      imagePath: '/img/ESA',
    },
    storyPath: '/eodash-data/stories/',
    customCSS: 'esa',
    newsBanner: {
      color: 'green darken-1',
      icon: 'calendar-star',
      text: '<a href="https://eo4society.esa.int/2021/08/01/rapid-action-on-coronavirus-and-eo-race-dashboard-challenge-3/" target="_blank">Sign up for the RACE Dashboard Challenge #3</a>',
      startDate: '2021-08-01',
      endDate: '2021-11-30',
    },
    aboutText: '/eodash-data/general/about',
    welcomeText: '/eodash-data/general/welcome',
    tutorialText: '/eodash-data/general/tutorials',
    showNewsCarousel: true,
    newsCarouselitems: [
      {
        iframe: 'https://www.youtube.com/embed/0Qe2AV9cLnc',
      },
      {
        poi: '100043-OX',
        src: './eodash-data/general/Slide26.png',
      },
      {
        poi: 'CZ7-E8',
        src: './eodash-data/general/Slide25.png',
      },
      {
        src: './eodash-data/general/CustomDash.png',
        href: 'https://medium.com/euro-data-cube/creating-powerful-visuals-of-covid-19-impacts-on-human-activities-8879fa75121d',
      },


    ],
    privacyText: '/eodash-data/general/privacy',
    termsText: '/eodash-data/general/terms',
    challengesText: '/eodash-data/general/challenges',
    feedbackTwitterHandles: ['esa_eo', 'EO_OPEN_SCIENCE', 'eurodatacube'],
    configuredMapPois: [],
    // The label parameter can be used as string to select the parameter identifier
    // or it can be an array of strings the same size as features to set custom
    // tab titles for each of the tabbed groups
    featureGrouping: [
      {
        features: [
          'IT16-C1',
          'IT16-C2',
          'IT16-C3',
        ],
        label: ['Boats & NO2', 'People & NO2', 'Cars & NO2'],
      },
      {
        features: [
          'IT3-C1',
          'IT3-C2',
          'IT3-C3',
        ],
        label: ['Boats & NO2', 'People & NO2', 'Cars & NO2'],
      },
      {
        features: [
          'CDS-CDS1',
          'CDS-CDS2',
          'CDS-CDS3',
          'CDS-CDS4',
        ],
        label: ['Temperature', 'Relative humidity', 'Wind U', 'Wind V'],
      },
      {
        features: [
          'GCAQ1-N1b',
          'GCAQ2-N1b',
          'GCAQ3-N1b',
          'GCAQ4-N1b',
        ],
        label: ['NO2', 'PM 2.5', 'PM10', 'O3'],
      },
      {
        features: [
          'IT16-E13e',
          'IT16-E13f',
          'IT16-E13g',
          'IT16-E13h',
          'IT16-E13i',
        ],
        label: ['Cargo', 'Fishing', 'Tanker', 'Tug', 'Search Rescue'],
      },
      {
        features: [
          'IT3-E13e',
          'IT3-E13f',
          'IT3-E13g',
          'IT3-E13l',
          'IT3-E13m',
        ],
        label: ['Cargo', 'Fishing', 'Tanker', 'Cruise', 'Passenger'],
      },
      {
        features: [
          'W2-E12c',
          'W3-E12c',
        ],
        label: 'indicatorName',
      },
      {
        features: [
          'CV-CV',
          'OW-OW',
        ],
        label: ['Cases', 'Vaccinations'],
      },
    ].concat([
      'AT4', 'BE6', 'CH1', 'DE12', 'DE13', 'DE14', 'DE15', 'DK1', 'ES10', 'ES11', 'ES14', 'ES15', 'FI4', 'FR13', 'FR8', 'GR2', 'IE1', 'IT13', 'IT9', 'NL1', 'NO1', 'PL6', 'PT1', 'SE23', 'TR1', 'UK4', 'UK5', 'UK6', 'UK7', 'UK8']
      .map((val) => ({ features: [`${val}-E13d`, `${val}-E13d2`], label: ['Airports traffic', 'Detected airplanes'] })))
      .concat([
        'ES22', 'ES23', 'ES24', 'ES30', 'ES41', 'ES42', 'ES43', 'ES51', 'ES52', 'ES61', 'ES62']
        .map((val) => ({ features: [`${val}a-E10a6`, `${val}b-E10a6`], label: 'indicatorValue' })))
      .concat([
        'AT', 'BG', 'CZ', 'DE', 'DK', 'EE', 'FR', 'HR', 'HU', 'LT', 'LV', 'PL', 'RO', 'SE', 'SK', 'UK']
        .map((val) => ({ features: [`${val}a-E10a10`, `${val}b-E10a10`], label: ['Winter cereal', 'Winter rapeseed'] })))
      .concat([
        'NL3', 'TR3', 'GR6', 'ES63', 'RS1', 'DE16', 'CH2', 'UK10', 'SK4', 'BE7',
        'RO9', 'HU5', 'DE13', 'DK1', 'IE3', 'DE17', 'FI4', 'PT3', 'SI3', 'UK11',
        'LU2', 'FR15', 'ES12', 'FR16', 'IT10', 'MC1', 'DE18', 'IT37', 'CY2',
        'NO2', 'FR10', 'ME1', 'CZ6', 'XK1', 'IS1', 'LV3', 'IT11', 'BA1', 'MK1',
        'BG4', 'SE22', 'EE1', 'AL1', 'IT38', 'ES65', 'MT2', 'AT5', 'LT3', 'PL6',
        'HR3', 'OS1',
      ].map((val) => ({ features: [`${val}-N1b`, `${val}-N1a`, `${val}-N1c`, `${val}-N1d`], label: ['NO2', 'PM 2.5', 'PM10', 'O3'] }))),
  },
  {
    id: 'trilateral',
    mailingList: {
      development: 3,
      staging: 3,
      production: 5,
    },
    match: ['eodashboard.org', 'www.eodashboard.org', 'eodash-trilateral.eox.at', 'eodash-trilateral-staging.eox.at', 'eodash-trilateral-testing.eox.at', 'localhost'],
    branding: {
      appName: 'Earth Observing Dashboard',
      primaryColor: '#333333',
      secondaryColor: '#004170',
      headerLogo: './data/trilateral/Trilateral_Logo.svg',
      faviconPath: './public/img/trilateral/favicon.ico',
    },
    pageMeta: {
      rootPath: 'https://eodashboard.org',
      googleSiteVerification: 'iHN2SaSR9qF7T3lOqNYSF4kaq_ZgK-I31SSgO5RKXW8',
      shortDescription: 'The Earth Observing Dashboard combines the resources, technical knowledge and expertise of three partner agencies ESA, JAXA, and NASA to strengthen our global understanding of the environmental and economic effects of the COVID-19 pandemic.',
      twitterCardImagePath: '/img/trilateral/twitter_card.png',
      imagePath: '/img/trilateral',
    },
    displayDummyLocations: './data/trilateral/dummylocations.csv',
    storyPath: '/data/trilateral/',
    customCSS: 'trilateral',
    newsBanner: {
      color: 'green darken-1',
      icon: 'calendar-star',
      text: '<b><a href="https://www.eodashboardhackathon.org/awards/" target="_blank">EO Dashboard Hackathon RESULTS!</a><b>',
      startDate: '2021-08-03',
      endDate: '2021-09-30',
    },
    aboutText: '/data/trilateral/about',
    welcomeText: '/data/trilateral/welcome',
    tutorialText: '/data/trilateral/tutorials',
    challengesText: '/eodash-data/general/eodashboardhackathon',
    showNewsCarousel: true,
    newsCarouselitems: [
      {
        poi: 'US01-E13c',
        src: './data/trilateral/Slide27.png',
        indicator: 'E13c',
      },
      {
        src: './data/trilateral/CustomDash-tri.png',
        href: 'https://medium.com/euro-data-cube/creating-powerful-visuals-of-covid-19-impacts-on-human-activities-8879fa75121d',
      },
      {
        poi: 'GG-GG',
        src: './data/trilateral/GoogleMobility.png',
      },
      {
        poi: 'WorldCO-N1',
        src: './data/trilateral/Slide17.png',
      },
      {
        poi: 'W7-FB',
        src: './data/trilateral/Slide21.png',
      },
      {
        poi: 'W2-N1',
        src: './data/trilateral/Slide19.png',
      },
    ],
    customCountryList: [
      { code: 'US', region: 'NORTH AMERICA' },
      { code: 'BE', region: 'EUROPE' },
      { code: 'HR', region: 'EUROPE' },
      { code: 'FR', region: 'EUROPE' },
      { code: 'GB', region: 'EUROPE' },
      { code: 'DE', region: 'EUROPE' },
      { code: 'IT', region: 'EUROPE' },
      { code: 'SI', region: 'EUROPE' },
      { code: 'ES', region: 'EUROPE' },
      { code: 'JP', region: 'ASIA' },
      { code: 'CN', region: 'ASIA' },
      { code: 'SG', region: 'ASIA' },
      { code: 'BD', region: 'ASIA' },
      { code: 'IN', region: 'ASIA' },
      { code: 'BR', region: 'SOUTH AMERICA' },
      { code: 'CL', region: 'SOUTH AMERICA' },
      { code: 'PE', region: 'SOUTH AMERICA' },
      { code: 'TG', region: 'AFRICA' },
      { code: 'TZ', region: 'AFRICA' },
      { code: 'EG', region: 'AFRICA' },
    ],
    configuredMapPois: [
      'DE1-E13c', 'PL1-E13c', 'BE3-E13c', 'FR3-E13c', 'IT3-E13c',
      'IT9-E13b', 'FR8-E13b', 'UK4-E13b',
    ],
    featureGrouping: [
      {
        features: [
          'NorthAdriaticTSM_ESA-N3a2',
          'NorthAdriaticTSM_NASA-N3a2',
          'NorthAdriaticTSM_JAXA-N3a2',
        ],
        label: 'dataProvider',
      },
      {
        features: [
          'NorthAdriatic_ESA-N3a2',
          'NorthAdriatic_NASA-N3a2',
          'NorthAdriatic_JAXA-N3a2',
        ],
        label: 'dataProvider',
      },
      {
        features: [
          'W1-N1',
          'W2-N1',
          'W3-N1',
        ],
        label: 'eoSensor',
      },
      {
        features: [
          'W4-N2',
          'W5-N2',
        ],
        label: 'calcMethod',
      },
      {
        features: [
          'US08-E10c',
          'US09-E10c',
        ],
        label: 'eoSensor',
      },
      {
        features: [
          'W2-E12c',
          'W3-E12c',
        ],
        label: 'indicatorName',
      },
      {
        features: [
          'CV-CV',
          'OW-OW',
        ],
        label: ['Cases', 'Vaccinations'],
      },
    ].concat([
      'ES22', 'ES23', 'ES24', 'ES30', 'ES41', 'ES42', 'ES43', 'ES51', 'ES52', 'ES61', 'ES62']
      .map((val) => ({ features: [`${val}a-E10a6`, `${val}b-E10a6`], label: 'indicatorValue' }))),
    privacyText: '/data/trilateral/privacy',
    termsText: '/data/trilateral/terms',
    feedbackTwitterHandles: ['ESA_EO', 'esa', 'NASAEarth', 'NASA', 'JAXA_en', 'JAXA_jp', 'eurodatacube'],
    countDownTimer: '2020-06-25T13:30:00.000+02:00',
    countDownMatch: ['eodashboard.org', 'www.eodashboard.org', 'eodash-trilateral.eox.at'],
  },
];
