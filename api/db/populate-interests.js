#! /usr/bin/env node

const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  console.log(
    'Error: you need to specify a valid MongoDB URL as the first argument'
  );

  return;
}

const Interest = require('../models/Interest');

const async = require('async');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [
  'Entertainment',
  'Fitness and wellness',
  'Hobbies and activities',
  'Industry and business',
  'Shopping and fashion',
  'Sports',
];
const interests = [];

const createInterest = (name, avatar, category, callback) => {
  const interest = new Interest({ name, avatar, category });

  interest.save().then(() => {
    console.log(`New interest: ${interest}`);
    interests.push(interest);
    callback(null, interest);
  });
};

const createInterests = () => {
  async.series(
    [
      (seriesCallback) => {
        createInterest(
          'Art',
          'https://image.flaticon.com/icons/svg/2811/2811172.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Ballet',
          'https://image.flaticon.com/icons/png/512/1844/1844042.png',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Bars',
          'https://image.flaticon.com/icons/svg/742/742096.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Board games',
          'https://image.flaticon.com/icons/png/512/2740/2740984.png',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Comics',
          'https://image.flaticon.com/icons/svg/2628/2628930.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Concerts',
          'https://image.flaticon.com/icons/png/512/1789/1789786.png',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Festivals',
          'https://image.flaticon.com/icons/png/512/2406/2406687.png',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Games',
          'https://image.flaticon.com/icons/svg/744/744737.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Literature',
          'https://image.flaticon.com/icons/svg/2599/2599249.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Magazines',
          'https://image.flaticon.com/icons/svg/653/653014.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Movies',
          'https://image.flaticon.com/icons/svg/2824/2824516.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Music',
          'https://image.flaticon.com/icons/svg/651/651758.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'News',
          'https://image.flaticon.com/icons/svg/1825/1825151.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Night clubs',
          'https://image.flaticon.com/icons/svg/1930/1930684.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Reading',
          'https://image.flaticon.com/icons/svg/2599/2599411.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Series',
          'https://image.flaticon.com/icons/svg/2881/2881114.svg',
          categories[0],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Theatre',
          'https://image.flaticon.com/icons/svg/2061/2061056.svg',
          categories[0],
          seriesCallback
        );
      },

      (seriesCallback) => {
        createInterest(
          'Bodybuilding',
          'https://image.flaticon.com/icons/png/512/2307/2307905.png',
          categories[1],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Fitness',
          'https://image.flaticon.com/icons/svg/2307/2307959.svg',
          categories[1],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Meditation',
          'https://image.flaticon.com/icons/png/512/2781/2781698.png',
          categories[1],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Weightlifting',
          'https://image.flaticon.com/icons/svg/2307/2307879.svg',
          categories[1],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Yoga',
          'https://image.flaticon.com/icons/svg/2307/2307981.svg',
          categories[1],
          seriesCallback
        );
      },

      (seriesCallback) => {
        createInterest(
          'Acting',
          'https://image.flaticon.com/icons/svg/2636/2636923.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Automobiles',
          'https://image.flaticon.com/icons/svg/500/500707.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Charity',
          'https://image.flaticon.com/icons/svg/838/838618.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Chat',
          'https://image.flaticon.com/icons/svg/509/509535.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Cooking',
          'https://image.flaticon.com/icons/svg/2863/2863411.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Crafts',
          'https://image.flaticon.com/icons/svg/2611/2611210.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Dance',
          'https://image.flaticon.com/icons/svg/498/498377.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Furniture',
          'https://image.flaticon.com/icons/svg/2610/2610836.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Gardening',
          'https://image.flaticon.com/icons/svg/2824/2824501.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Motorcycles',
          'https://image.flaticon.com/icons/svg/519/519598.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Nature',
          'https://image.flaticon.com/icons/svg/2899/2899987.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Painting',
          'https://image.flaticon.com/icons/svg/2736/2736499.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Pets',
          'https://image.flaticon.com/icons/svg/2064/2064863.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Photography',
          'https://image.flaticon.com/icons/svg/2636/2636410.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Politics',
          'https://image.flaticon.com/icons/svg/1672/1672268.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Religion',
          'https://image.flaticon.com/icons/svg/2242/2242222.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Sculpture',
          'https://image.flaticon.com/icons/png/512/2579/2579979.png',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Singing',
          'https://image.flaticon.com/icons/svg/1974/1974848.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Sustainability',
          'https://image.flaticon.com/icons/svg/2371/2371903.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Theme parks',
          'https://image.flaticon.com/icons/png/512/2809/2809645.png',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Travel',
          'https://image.flaticon.com/icons/svg/1175/1175017.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Vacations',
          'https://image.flaticon.com/icons/svg/1209/1209425.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Volunteering',
          'https://image.flaticon.com/icons/svg/2634/2634501.svg',
          categories[2],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Writing',
          'https://image.flaticon.com/icons/svg/1830/1830934.svg',
          categories[2],
          seriesCallback
        );
      },

      (seriesCallback) => {
        createInterest(
          'Advertising',
          'https://image.flaticon.com/icons/svg/2787/2787828.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Agriculture',
          'https://image.flaticon.com/icons/svg/2708/2708842.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Architecture',
          'https://image.flaticon.com/icons/svg/2771/2771336.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Aviation',
          'https://image.flaticon.com/icons/svg/2302/2302811.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Business',
          'https://image.flaticon.com/icons/svg/1162/1162489.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Construction',
          'https://image.flaticon.com/icons/svg/819/819392.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Design',
          'https://image.flaticon.com/icons/svg/802/802033.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Economics',
          'https://image.flaticon.com/icons/svg/2179/2179261.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Education',
          'https://image.flaticon.com/icons/svg/2681/2681857.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Engineering',
          'https://image.flaticon.com/icons/svg/897/897168.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Entrepreneurship',
          'https://image.flaticon.com/icons/svg/1535/1535019.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Health care',
          'https://image.flaticon.com/icons/svg/1021/1021606.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Insurance',
          'https://image.flaticon.com/icons/svg/2754/2754975.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Investment',
          'https://image.flaticon.com/icons/svg/2474/2474455.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Law',
          'https://image.flaticon.com/icons/svg/1208/1208198.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Management',
          'https://image.flaticon.com/icons/svg/1208/1208203.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Marketing',
          'https://image.flaticon.com/icons/svg/1378/1378593.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Real estate',
          'https://image.flaticon.com/icons/svg/602/602175.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Retail',
          'https://image.flaticon.com/icons/svg/1198/1198361.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Sales',
          'https://image.flaticon.com/icons/svg/1312/1312187.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Science',
          'https://image.flaticon.com/icons/svg/2784/2784451.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Social media',
          'https://image.flaticon.com/icons/svg/2065/2065203.svg',
          categories[3],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Software',
          'https://image.flaticon.com/icons/svg/1149/1149168.svg',
          categories[3],
          seriesCallback
        );
      },

      (seriesCallback) => {
        createInterest(
          'Beauty salons',
          'https://image.flaticon.com/icons/svg/1940/1940922.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Boutiques',
          'https://image.flaticon.com/icons/svg/1719/1719625.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Clothing',
          'https://image.flaticon.com/icons/svg/2794/2794012.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Cosmetics',
          'https://image.flaticon.com/icons/svg/545/545159.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Coupons',
          'https://image.flaticon.com/icons/svg/423/423809.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Discount stores',
          'https://image.flaticon.com/icons/svg/411/411807.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Fragrances',
          'https://image.flaticon.com/icons/svg/2611/2611095.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Hairdressing',
          'https://image.flaticon.com/icons/svg/393/393164.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Handbags',
          'https://image.flaticon.com/icons/svg/679/679997.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Jewelry',
          'https://image.flaticon.com/icons/svg/703/703280.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Piercings',
          'https://image.flaticon.com/icons/svg/1686/1686352.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Shoes',
          'https://image.flaticon.com/icons/svg/1940/1940912.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Shopping malls',
          'https://image.flaticon.com/icons/svg/1057/1057313.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Spas',
          'https://image.flaticon.com/icons/svg/2770/2770760.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Sunglasses',
          'https://image.flaticon.com/icons/svg/399/399745.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Tattoos',
          'https://image.flaticon.com/icons/svg/1686/1686442.svg',
          categories[4],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Toys',
          'https://image.flaticon.com/icons/svg/522/522043.svg',
          categories[4],
          seriesCallback
        );
      },

      (seriesCallback) => {
        createInterest(
          'American football',
          'https://image.flaticon.com/icons/svg/625/625369.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Baseball',
          'https://image.flaticon.com/icons/svg/484/484482.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Basketball',
          'https://image.flaticon.com/icons/svg/500/500245.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Bowling',
          'https://image.flaticon.com/icons/svg/2438/2438473.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Boxing',
          'https://image.flaticon.com/icons/svg/418/418171.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Chess',
          'https://image.flaticon.com/icons/svg/2633/2633894.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Cycling',
          'https://image.flaticon.com/icons/svg/2906/2906833.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Esports',
          'https://image.flaticon.com/icons/svg/2285/2285714.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Fishing',
          'https://image.flaticon.com/icons/svg/1830/1830797.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Football',
          'https://image.flaticon.com/icons/svg/2784/2784491.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Golf',
          'https://image.flaticon.com/icons/svg/491/491972.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Martial arts',
          'https://image.flaticon.com/icons/svg/625/625357.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Ping pong',
          'https://image.flaticon.com/icons/svg/866/866748.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Poker',
          'https://image.flaticon.com/icons/svg/867/867864.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Racing',
          'https://image.flaticon.com/icons/svg/469/469122.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Running',
          'https://image.flaticon.com/icons/svg/2460/2460093.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Sailing',
          'https://image.flaticon.com/icons/svg/434/434077.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Skiing',
          'https://image.flaticon.com/icons/svg/625/625360.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Snowboarding',
          'https://image.flaticon.com/icons/svg/2592/2592838.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Speedcubing',
          'https://image.flaticon.com/icons/svg/522/522052.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Surfing',
          'https://image.flaticon.com/icons/svg/2768/2768580.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Swimming',
          'https://image.flaticon.com/icons/svg/495/495821.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Tennis',
          'https://image.flaticon.com/icons/svg/802/802289.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Volleyball',
          'https://image.flaticon.com/icons/svg/2906/2906725.svg',
          categories[5],
          seriesCallback
        );
      },
      (seriesCallback) => {
        createInterest(
          'Waterpolo',
          'https://image.flaticon.com/icons/svg/495/495843.svg',
          categories[5],
          seriesCallback
        );
      },
    ],
    (error, results) => {
      if (error) {
        console.log(`Final error: ${error}`);
      } else {
        console.log(`Final results: ${results}`);
      }

      mongoose.connection.close();
    }
  );
};

createInterests();
