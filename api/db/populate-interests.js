const { createPrompt } = require('./utils');

const Interest = require('../models/Interest');

const categories = [
  'Entertainment',
  'Fitness and wellness',
  'Hobbies and activities',
  'Industry and business',
  'Shopping and fashion',
  'Sports',
];

const interests = [];
let displayLogs;

const createInterest = async (name, avatar, category) => {
  const interest = new Interest({ name, avatar, category });
  await interest.save();
  interests.push(interest);

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New interest created: ${interest}`);
  }
};

const createInterests = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating interests collection...');
  displayLogs = verbose;

  if ((await Interest.countDocuments()) !== 0) {
    const proceed = await createPrompt(
      'The interests collection already exists. If you continue, the existing collection will be dropped to avoid duplication. Please note that this can break your application. Do you want to continue?'
    );

    if (proceed) {
      await Interest.collection.drop();
      console.log('\x1b[31m', 'Dropped old interests collection');
    } else {
      console.log('\x1b[33m', 'Aborted interests collection population');
      return;
    }
  }

  // Entertainment category
  await createInterest(
    'Art',
    'https://image.flaticon.com/icons/svg/2811/2811172.svg',
    categories[0]
  );
  await createInterest(
    'Ballet',
    'https://image.flaticon.com/icons/png/512/1844/1844042.png',
    categories[0]
  );
  await createInterest(
    'Bars',
    'https://image.flaticon.com/icons/svg/742/742096.svg',
    categories[0]
  );
  await createInterest(
    'Board games',
    'https://image.flaticon.com/icons/png/512/2740/2740984.png',
    categories[0]
  );
  await createInterest(
    'Comics',
    'https://image.flaticon.com/icons/svg/2628/2628930.svg',
    categories[0]
  );
  await createInterest(
    'Concerts',
    'https://image.flaticon.com/icons/png/512/1789/1789786.png',
    categories[0]
  );
  await createInterest(
    'Festivals',
    'https://image.flaticon.com/icons/png/512/2406/2406687.png',
    categories[0]
  );
  await createInterest(
    'Games',
    'https://image.flaticon.com/icons/svg/744/744737.svg',
    categories[0]
  );
  await createInterest(
    'Literature',
    'https://image.flaticon.com/icons/svg/2599/2599249.svg',
    categories[0]
  );
  await createInterest(
    'Magazines',
    'https://image.flaticon.com/icons/svg/653/653014.svg',
    categories[0]
  );
  await createInterest(
    'Movies',
    'https://image.flaticon.com/icons/svg/2824/2824516.svg',
    categories[0]
  );
  await createInterest(
    'Music',
    'https://image.flaticon.com/icons/svg/651/651758.svg',
    categories[0]
  );
  await createInterest(
    'News',
    'https://image.flaticon.com/icons/svg/1825/1825151.svg',
    categories[0]
  );
  await createInterest(
    'Night clubs',
    'https://image.flaticon.com/icons/svg/1930/1930684.svg',
    categories[0]
  );
  await createInterest(
    'Reading',
    'https://image.flaticon.com/icons/svg/2599/2599411.svg',
    categories[0]
  );
  await createInterest(
    'Series',
    'https://image.flaticon.com/icons/svg/2881/2881114.svg',
    categories[0]
  );
  await createInterest(
    'Theatre',
    'https://image.flaticon.com/icons/svg/2061/2061056.svg',
    categories[0]
  );

  // Fitness and wellness category
  await createInterest(
    'Bodybuilding',
    'https://image.flaticon.com/icons/png/512/2307/2307905.png',
    categories[1]
  );
  await createInterest(
    'Fitness',
    'https://image.flaticon.com/icons/svg/2307/2307959.svg',
    categories[1]
  );
  await createInterest(
    'Meditation',
    'https://image.flaticon.com/icons/png/512/2781/2781698.png',
    categories[1]
  );
  await createInterest(
    'Weightlifting',
    'https://image.flaticon.com/icons/svg/2307/2307879.svg',
    categories[1]
  );
  await createInterest(
    'Yoga',
    'https://image.flaticon.com/icons/svg/2307/2307981.svg',
    categories[1]
  );

  // Hobbies and activities category
  await createInterest(
    'Acting',
    'https://image.flaticon.com/icons/svg/2636/2636923.svg',
    categories[2]
  );
  await createInterest(
    'Automobiles',
    'https://image.flaticon.com/icons/svg/500/500707.svg',
    categories[2]
  );
  await createInterest(
    'Charity',
    'https://image.flaticon.com/icons/svg/838/838618.svg',
    categories[2]
  );
  await createInterest(
    'Chat',
    'https://image.flaticon.com/icons/svg/509/509535.svg',
    categories[2]
  );
  await createInterest(
    'Cooking',
    'https://image.flaticon.com/icons/svg/2863/2863411.svg',
    categories[2]
  );
  await createInterest(
    'Crafts',
    'https://image.flaticon.com/icons/svg/2611/2611210.svg',
    categories[2]
  );
  await createInterest(
    'Dance',
    'https://image.flaticon.com/icons/svg/498/498377.svg',
    categories[2]
  );
  await createInterest(
    'Furniture',
    'https://image.flaticon.com/icons/svg/2610/2610836.svg',
    categories[2]
  );
  await createInterest(
    'Gardening',
    'https://image.flaticon.com/icons/svg/2824/2824501.svg',
    categories[2]
  );
  await createInterest(
    'Motorcycles',
    'https://image.flaticon.com/icons/svg/519/519598.svg',
    categories[2]
  );
  await createInterest(
    'Nature',
    'https://image.flaticon.com/icons/svg/2899/2899987.svg',
    categories[2]
  );
  await createInterest(
    'Painting',
    'https://image.flaticon.com/icons/svg/2736/2736499.svg',
    categories[2]
  );
  await createInterest(
    'Pets',
    'https://image.flaticon.com/icons/svg/2064/2064863.svg',
    categories[2]
  );
  await createInterest(
    'Photography',
    'https://image.flaticon.com/icons/svg/2636/2636410.svg',
    categories[2]
  );
  await createInterest(
    'Politics',
    'https://image.flaticon.com/icons/svg/1672/1672268.svg',
    categories[2]
  );
  await createInterest(
    'Religion',
    'https://image.flaticon.com/icons/svg/2242/2242222.svg',
    categories[2]
  );
  await createInterest(
    'Sculpture',
    'https://image.flaticon.com/icons/png/512/2579/2579979.png',
    categories[2]
  );
  await createInterest(
    'Singing',
    'https://image.flaticon.com/icons/svg/1974/1974848.svg',
    categories[2]
  );
  await createInterest(
    'Sustainability',
    'https://image.flaticon.com/icons/svg/2371/2371903.svg',
    categories[2]
  );
  await createInterest(
    'Theme parks',
    'https://image.flaticon.com/icons/png/512/2809/2809645.png',
    categories[2]
  );
  await createInterest(
    'Travel',
    'https://image.flaticon.com/icons/svg/1175/1175017.svg',
    categories[2]
  );
  await createInterest(
    'Vacations',
    'https://image.flaticon.com/icons/svg/1209/1209425.svg',
    categories[2]
  );
  await createInterest(
    'Volunteering',
    'https://image.flaticon.com/icons/svg/2634/2634501.svg',
    categories[2]
  );
  await createInterest(
    'Writing',
    'https://image.flaticon.com/icons/svg/1830/1830934.svg',
    categories[2]
  );

  // Industry and business category
  await createInterest(
    'Advertising',
    'https://image.flaticon.com/icons/svg/2787/2787828.svg',
    categories[3]
  );
  await createInterest(
    'Agriculture',
    'https://image.flaticon.com/icons/svg/2708/2708842.svg',
    categories[3]
  );
  await createInterest(
    'Architecture',
    'https://image.flaticon.com/icons/svg/2771/2771336.svg',
    categories[3]
  );
  await createInterest(
    'Aviation',
    'https://image.flaticon.com/icons/svg/2302/2302811.svg',
    categories[3]
  );
  await createInterest(
    'Business',
    'https://image.flaticon.com/icons/svg/1162/1162489.svg',
    categories[3]
  );
  await createInterest(
    'Construction',
    'https://image.flaticon.com/icons/svg/819/819392.svg',
    categories[3]
  );
  await createInterest(
    'Design',
    'https://image.flaticon.com/icons/svg/802/802033.svg',
    categories[3]
  );
  await createInterest(
    'Economics',
    'https://image.flaticon.com/icons/svg/2179/2179261.svg',
    categories[3]
  );
  await createInterest(
    'Education',
    'https://image.flaticon.com/icons/svg/2681/2681857.svg',
    categories[3]
  );
  await createInterest(
    'Engineering',
    'https://image.flaticon.com/icons/svg/897/897168.svg',
    categories[3]
  );
  await createInterest(
    'Entrepreneurship',
    'https://image.flaticon.com/icons/svg/1535/1535019.svg',
    categories[3]
  );
  await createInterest(
    'Health care',
    'https://image.flaticon.com/icons/svg/1021/1021606.svg',
    categories[3]
  );
  await createInterest(
    'Insurance',
    'https://image.flaticon.com/icons/svg/2754/2754975.svg',
    categories[3]
  );
  await createInterest(
    'Investment',
    'https://image.flaticon.com/icons/svg/2474/2474455.svg',
    categories[3]
  );
  await createInterest(
    'Law',
    'https://image.flaticon.com/icons/svg/1208/1208198.svg',
    categories[3]
  );
  await createInterest(
    'Management',
    'https://image.flaticon.com/icons/svg/1208/1208203.svg',
    categories[3]
  );
  await createInterest(
    'Marketing',
    'https://image.flaticon.com/icons/svg/1378/1378593.svg',
    categories[3]
  );
  await createInterest(
    'Real estate',
    'https://image.flaticon.com/icons/svg/602/602175.svg',
    categories[3]
  );
  await createInterest(
    'Retail',
    'https://image.flaticon.com/icons/svg/1198/1198361.svg',
    categories[3]
  );
  await createInterest(
    'Sales',
    'https://image.flaticon.com/icons/svg/1312/1312187.svg',
    categories[3]
  );
  await createInterest(
    'Science',
    'https://image.flaticon.com/icons/svg/2784/2784451.svg',
    categories[3]
  );
  await createInterest(
    'Social media',
    'https://image.flaticon.com/icons/svg/2065/2065203.svg',
    categories[3]
  );
  await createInterest(
    'Software',
    'https://image.flaticon.com/icons/svg/1149/1149168.svg',
    categories[3]
  );

  // Shopping and fashion category
  await createInterest(
    'Beauty salons',
    'https://image.flaticon.com/icons/svg/1940/1940922.svg',
    categories[4]
  );
  await createInterest(
    'Boutiques',
    'https://image.flaticon.com/icons/svg/1719/1719625.svg',
    categories[4]
  );
  await createInterest(
    'Clothing',
    'https://image.flaticon.com/icons/svg/2794/2794012.svg',
    categories[4]
  );
  await createInterest(
    'Cosmetics',
    'https://image.flaticon.com/icons/svg/545/545159.svg',
    categories[4]
  );
  await createInterest(
    'Coupons',
    'https://image.flaticon.com/icons/svg/423/423809.svg',
    categories[4]
  );
  await createInterest(
    'Discount stores',
    'https://image.flaticon.com/icons/svg/411/411807.svg',
    categories[4]
  );
  await createInterest(
    'Fragrances',
    'https://image.flaticon.com/icons/svg/2611/2611095.svg',
    categories[4]
  );
  await createInterest(
    'Hairdressing',
    'https://image.flaticon.com/icons/svg/393/393164.svg',
    categories[4]
  );
  await createInterest(
    'Handbags',
    'https://image.flaticon.com/icons/svg/679/679997.svg',
    categories[4]
  );
  await createInterest(
    'Jewelry',
    'https://image.flaticon.com/icons/svg/703/703280.svg',
    categories[4]
  );
  await createInterest(
    'Piercings',
    'https://image.flaticon.com/icons/svg/1686/1686352.svg',
    categories[4]
  );
  await createInterest(
    'Shoes',
    'https://image.flaticon.com/icons/svg/1940/1940912.svg',
    categories[4]
  );
  await createInterest(
    'Shopping malls',
    'https://image.flaticon.com/icons/svg/1057/1057313.svg',
    categories[4]
  );
  await createInterest(
    'Spas',
    'https://image.flaticon.com/icons/svg/2770/2770760.svg',
    categories[4]
  );
  await createInterest(
    'Sunglasses',
    'https://image.flaticon.com/icons/svg/399/399745.svg',
    categories[4]
  );
  await createInterest(
    'Tattoos',
    'https://image.flaticon.com/icons/svg/1686/1686442.svg',
    categories[4]
  );
  await createInterest(
    'Toys',
    'https://image.flaticon.com/icons/svg/522/522043.svg',
    categories[4]
  );

  // Sports category
  await createInterest(
    'American football',
    'https://image.flaticon.com/icons/svg/625/625369.svg',
    categories[5]
  );
  await createInterest(
    'Baseball',
    'https://image.flaticon.com/icons/svg/484/484482.svg',
    categories[5]
  );
  await createInterest(
    'Basketball',
    'https://image.flaticon.com/icons/svg/500/500245.svg',
    categories[5]
  );
  await createInterest(
    'Bowling',
    'https://image.flaticon.com/icons/svg/2438/2438473.svg',
    categories[5]
  );
  await createInterest(
    'Boxing',
    'https://image.flaticon.com/icons/svg/418/418171.svg',
    categories[5]
  );
  await createInterest(
    'Chess',
    'https://image.flaticon.com/icons/svg/2633/2633894.svg',
    categories[5]
  );
  await createInterest(
    'Cycling',
    'https://image.flaticon.com/icons/svg/2906/2906833.svg',
    categories[5]
  );
  await createInterest(
    'Esports',
    'https://image.flaticon.com/icons/svg/2285/2285714.svg',
    categories[5]
  );
  await createInterest(
    'Fishing',
    'https://image.flaticon.com/icons/svg/1830/1830797.svg',
    categories[5]
  );
  await createInterest(
    'Football',
    'https://image.flaticon.com/icons/svg/2784/2784491.svg',
    categories[5]
  );
  await createInterest(
    'Golf',
    'https://image.flaticon.com/icons/svg/491/491972.svg',
    categories[5]
  );
  await createInterest(
    'Martial arts',
    'https://image.flaticon.com/icons/svg/625/625357.svg',
    categories[5]
  );
  await createInterest(
    'Ping pong',
    'https://image.flaticon.com/icons/svg/866/866748.svg',
    categories[5]
  );
  await createInterest(
    'Poker',
    'https://image.flaticon.com/icons/svg/867/867864.svg',
    categories[5]
  );
  await createInterest(
    'Racing',
    'https://image.flaticon.com/icons/svg/469/469122.svg',
    categories[5]
  );
  await createInterest(
    'Running',
    'https://image.flaticon.com/icons/svg/2460/2460093.svg',
    categories[5]
  );
  await createInterest(
    'Sailing',
    'https://image.flaticon.com/icons/svg/434/434077.svg',
    categories[5]
  );
  await createInterest(
    'Skiing',
    'https://image.flaticon.com/icons/svg/625/625360.svg',
    categories[5]
  );
  await createInterest(
    'Snowboarding',
    'https://image.flaticon.com/icons/svg/2592/2592838.svg',
    categories[5]
  );
  await createInterest(
    'Speedcubing',
    'https://image.flaticon.com/icons/svg/522/522052.svg',
    categories[5]
  );
  await createInterest(
    'Surfing',
    'https://image.flaticon.com/icons/svg/2768/2768580.svg',
    categories[5]
  );
  await createInterest(
    'Swimming',
    'https://image.flaticon.com/icons/svg/495/495821.svg',
    categories[5]
  );
  await createInterest(
    'Tennis',
    'https://image.flaticon.com/icons/svg/802/802289.svg',
    categories[5]
  );
  await createInterest(
    'Volleyball',
    'https://image.flaticon.com/icons/svg/2906/2906725.svg',
    categories[5]
  );
  await createInterest(
    'Waterpolo',
    'https://image.flaticon.com/icons/svg/495/495843.svg',
    categories[5]
  );

  console.log('\x1b[32m', `Created ${interests.length} interests`);
};

module.exports = { createInterests };
