/* WorthGo classification model — keep venue, food, timing and experience separate. */
window.WORTHGO_TAXONOMY={
  foodCategories:[
    'South Indian Breakfast','Tiffin Centers','Dosa','Idli & Vada','Pesarattu','Poori & Upma','Paratha','North Indian Breakfast','Arabic Breakfast','Pakistani Breakfast',
    'Samosa','Chaat','Bajji & Pakora','Punugulu & Bonda','Street Sandwiches','Shawarma','Kebabs','Grilled Meat','Street Seafood','Local Snack Stalls',
    'Biryani','Hyderabadi Cuisine','Telugu / Andhra Cuisine','Telangana Cuisine','South Indian Meals','North Indian','Pakistani','Kerala','Tamil','Sri Lankan',
    'Arabic / Emirati','Iranian / Persian','Lebanese','Turkish','Afghan','Chinese','Thai','Japanese','Korean','Italian',
    'Irani Cafes','Karak & Chai','Specialty Coffee','Bakeries','Desserts','Ice Cream','Mithai / Indian Sweets','Juices & Fresh Drinks','Late-Night Food','Budget Eats'
  ],
  venueTypes:['Tiffin Center','Restaurant','Cafe','Bakery','Food Stall','Food Truck','Cafeteria','Sweet Shop','Juice Shop','Street Food Vendor','Fine Dining','Food Market','Heritage Site','Museum','Park','Viewpoint','Market','Neighbourhood','Cultural Venue'],
  mealTimes:['Breakfast','Brunch','Lunch','Evening Snack','Dinner','Late Night'],
  experiences:['Local Favorite','Hidden Gem','Famous','Worth the Trip','Budget','Quick','Family','Date','Solo','Tourist Friendly','Late Night','Quiet','Outdoor','Heritage','Shopping','Food Walk'],
  cityDefaults:{
    Hyderabad:{currency:'INR',symbol:'₹',budgetSteps:[100,250,500,1000],areas:['Any area','Old City','Central Hyderabad','Jubilee Hills','Gachibowli','Secunderabad','Koti','Begum Bazar','Ghansi Bazaar']},
    Dubai:{currency:'AED',symbol:'AED ',budgetSteps:[20,50,100,250],areas:['Any area','Al Fahidi','Bur Dubai','Deira','Dubai Marina','Downtown Dubai','Al Satwa','Karama','Jumeirah','JLT','Al Quoz']}
  }
};

/* Backward-compatible mapping: existing records can stay compact while the UI gets richer. */
window.WORTHGO_TAXONOMY.normalize=function(p){
  const venue=p.venueType || (p.type==='experience'?'Cultural Venue':((p.subtypes||[]).includes('tiffin')?'Tiffin Center':((p.subtypes||[]).includes('cafe')?'Cafe':'Restaurant')));
  const food=[...(p.foodCategories||[])];
  const sub=(p.subtypes||[]).map(String).join(' ').toLowerCase();
  const cats=(p.categories||[]).join(' ').toLowerCase();
  if((sub.includes('tiffin')||cats.includes('breakfast'))&&!food.includes('Tiffin Centers'))food.push('Tiffin Centers');
  if(sub.includes('dosa'))food.push('Dosa');
  if(sub.includes('idli')||sub.includes('vada'))food.push('Idli & Vada');
  if(sub.includes('biryani'))food.push('Biryani');
  if(sub.includes('kebab'))food.push('Kebabs');
  if(sub.includes('shawarma'))food.push('Shawarma');
  if(sub.includes('iranian'))food.push('Iranian / Persian');
  if(sub.includes('pakistani'))food.push('Pakistani');
  if(sub.includes('seafood'))food.push('Street Seafood');
  if(sub.includes('bakery'))food.push('Bakeries');
  if(sub.includes('chai')||sub.includes('karak'))food.push('Karak & Chai');
  if(sub.includes('coffee')||venue==='Cafe')food.push('Specialty Coffee');
  if((p.tags||[]).includes('budget'))food.push('Budget Eats');
  if((p.tags||[]).includes('late-night'))food.push('Late-Night Food');
  const meal=[...(p.mealTimes||[])];
  if(p.categories?.includes('breakfast'))meal.push('Breakfast');
  if(p.categories?.includes('tonight'))meal.push('Dinner');
  if((p.tags||[]).includes('late-night'))meal.push('Late Night');
  const exp=[...(p.experienceTags||[])];
  const cls=p.classification||[];
  if(cls.includes('localFavorite'))exp.push('Local Favorite');
  if(cls.includes('hiddenGem'))exp.push('Hidden Gem');
  if(cls.includes('famous'))exp.push('Famous');
  if(cls.includes('worthTheTrip'))exp.push('Worth the Trip');
  if((p.tags||[]).includes('budget'))exp.push('Budget');
  if((p.tags||[]).includes('family'))exp.push('Family');
  if((p.tags||[]).includes('date'))exp.push('Date');
  if((p.tags||[]).includes('late-night'))exp.push('Late Night');
  return {...p,venueType:venue,foodCategories:[...new Set(food)],mealTimes:[...new Set(meal)],experienceTags:[...new Set(exp)]};
};
