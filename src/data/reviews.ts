
export interface ReviewShowcaseItem {
  id: number;
  platform: 'google' | 'yelp' | 'facebook' | 'tripadvisor';
  business: string;
  reviewer: string;
  rating: number;
  review: string;
  response: string;
  avatar: string;
}

export const reviewShowcase: ReviewShowcaseItem[] = [
  {
    id: 1,
    platform: 'google',
    business: 'Bella Italia Restaurant',
    reviewer: 'Sarah M.',
    rating: 5,
    review: "Best Italian food I've had outside of Italy! The carbonara was absolutely perfect and the tiramisu was heavenly.",
    response:
      "Sarah, you've made our entire kitchen team smile! We're thrilled our carbonara transported you to Italy – our chef insists on using authentic guanciale and pecorino romano. Your kind words about the tiramisu are going straight to Nonna! We can't wait to welcome you back for another taste of Italy. Grazie mille! – Marco, Owner",
    avatar: 'SM',
  },
  {
    id: 2,
    platform: 'yelp',
    business: 'Premier Auto Spa',
    reviewer: 'Mike T.',
    rating: 2,
    review: 'Waited 3 hours for a detail that was supposed to take 90 minutes. Car looked okay but not worth the wait.',
    response:
      "Mike, I sincerely apologize for the extended wait time – that's simply not the experience we strive to deliver. You trusted us with your vehicle and we let you down on timing. I'd love to make this right with a complimentary express detail on your next visit. Please reach out to me directly at manager@premierautospa.com. – James, General Manager",
    avatar: 'MT',
  },
  {
    id: 3,
    platform: 'facebook',
    business: 'Sunshine Dental Care',
    reviewer: 'Emily R.',
    rating: 5,
    review:
      "Dr. Chen is amazing! Finally found a dentist who doesn't make me anxious. The whole staff is so friendly and patient.",
    response:
      "Emily, thank you for sharing your experience! Dr. Chen and our entire team are dedicated to creating a comfortable, anxiety-free environment. We believe everyone deserves stress-free dental care, and we're honored you've entrusted us with your smile. See you at your next checkup! – Sunshine Dental Care Team",
    avatar: 'ER',
  },
  {
    id: 4,
    platform: 'tripadvisor',
    business: 'Harbor View Hotel',
    reviewer: 'David L.',
    rating: 5,
    review: 'Celebrated our 25th anniversary here. The staff surprised us with champagne and rose petals. Unforgettable!',
    response:
      "David, congratulations on 25 wonderful years! It was our absolute pleasure to help make your anniversary celebration special. Moments like these are why we do what we do. We've noted your anniversary in our guest records – we hope to help you celebrate many more milestones! – The Harbor View Family",
    avatar: 'DL',
  },
  {
    id: 5,
    platform: 'google',
    business: "Tony's Barber Shop",
    reviewer: 'Chris P.',
    rating: 4,
    review: 'Great haircut as always! Only reason for 4 stars is the wait time can be long on weekends.',
    response:
      "Thanks Chris! Glad you're happy with the cut. You're right about weekends – we've heard you! We're introducing online booking next month to help manage the rush. Pro tip: Tuesday and Wednesday afternoons are usually our quietest times. See you in the chair! – Tony",
    avatar: 'CP',
  },
  {
    id: 6,
    platform: 'yelp',
    business: 'Green Leaf Yoga Studio',
    reviewer: 'Jennifer K.',
    rating: 5,
    review: 'The hot yoga classes are incredible! Lost 15 pounds in 3 months and my flexibility has improved so much.',
    response:
      "Jennifer, what an incredible transformation! 15 pounds and improved flexibility is no small achievement – that's YOUR dedication showing up on the mat every class. Stories like yours inspire our whole community. Keep flowing, keep growing! 🧘‍♀️ – Namaste, The Green Leaf Team",
    avatar: 'JK',
  },
  {
    id: 7,
    platform: 'facebook',
    business: 'Happy Paws Pet Grooming',
    reviewer: 'Lisa H.',
    rating: 1,
    review: "They cut my dog's ear while grooming. Very upset. Dog was traumatized.",
    response:
      "Lisa, I am deeply sorry about what happened to your fur baby. This is completely unacceptable, and I take full responsibility. I've personally addressed this with our grooming team and enhanced our safety protocols. I would like to cover all veterinary expenses and discuss how we can make this right. Please call me directly at 555-0123. – Amanda, Owner",
    avatar: 'LH',
  },
  {
    id: 8,
    platform: 'google',
    business: 'Quick Fix Phone Repair',
    reviewer: 'Brandon S.',
    rating: 5,
    review: 'Fixed my cracked iPhone screen in 20 minutes while I waited. Price was fair and they even cleaned my phone!',
    response:
      "Brandon, thanks for choosing Quick Fix! We know a cracked screen can ruin your day, so we hustle to get you back up and running ASAP. The complimentary cleaning is our little extra touch. Remember, we also do battery replacements when that time comes! – Quick Fix Crew",
    avatar: 'BS',
  },
  {
    id: 9,
    platform: 'tripadvisor',
    business: 'Mountain Peak Adventures',
    reviewer: 'Rachel & Tom',
    rating: 5,
    review: 'Our guide Jake made our first hiking experience absolutely incredible. Felt safe the entire time. Photos were stunning!',
    response:
      "Rachel & Tom, Jake is going to be thrilled to hear this! He's passionate about introducing newcomers to the trails safely. Those photos from Sunset Ridge are frame-worthy! Now that you've caught the hiking bug, ask about our intermediate trails for your next adventure. Happy trails! – Mountain Peak Team",
    avatar: 'RT',
  },
  {
    id: 10,
    platform: 'yelp',
    business: 'Casa Maria Mexican Grill',
    reviewer: 'Andrew W.',
    rating: 3,
    review: 'Food was good but portions seem smaller than before. Prices went up too. Still decent for the area.',
    response:
      "Andrew, we appreciate your honest feedback. You're right – rising ingredient costs have been challenging, and we've had to make some adjustments. What we won't compromise on is quality and authenticity. We're introducing a new 'Grande' portion option next month for heartier appetites. Hope to see you back! – Maria",
    avatar: 'AW',
  },
  {
    id: 11,
    platform: 'google',
    business: 'Elite Fitness Gym',
    reviewer: 'Nicole F.',
    rating: 5,
    review: "Best gym I've ever joined! Clean equipment, helpful trainers, and 24/7 access is a game changer for my schedule.",
    response:
      "Nicole, welcome to the Elite family! We're big believers that fitness should fit YOUR life, not the other way around. That 24/7 access is perfect for early birds and night owls alike. Have you tried our new HIIT classes on Tuesday nights? You'd crush it! – Elite Fitness Team",
    avatar: 'NF',
  },
  {
    id: 12,
    platform: 'facebook',
    business: 'Cozy Corner Bookshop',
    reviewer: 'Margaret P.',
    rating: 5,
    review: 'A gem! Staff recommendations are always spot-on. The reading nook with tea is just lovely.',
    response:
      "Margaret, you've discovered our favorite spot! There's nothing better than a good book and a warm cup of tea. Your kind words mean the world to our small team. We've just received some new releases we think you'll love – pop by this weekend! – With gratitude, The Cozy Corner Family",
    avatar: 'MP',
  },
  {
    id: 13,
    platform: 'google',
    business: 'Apex Moving Company',
    reviewer: 'Steven & Julie',
    rating: 5,
    review: 'Moved our entire 4-bedroom house in 6 hours. Nothing broken, nothing lost. Team was professional and careful.',
    response:
      "Steven & Julie, moving day can be so stressful, and we're honored you trusted Apex with your home and memories. Our crew takes pride in treating every item like it's their own grandmother's china! Wishing you countless happy moments in your new home. – The Apex Team",
    avatar: 'SJ',
  },
  {
    id: 14,
    platform: 'yelp',
    business: 'Glamour Nails & Spa',
    reviewer: 'Ashley B.',
    rating: 4,
    review: 'Love the gel manicures here! Only wish they had more evening appointment slots available.',
    response:
      "Ashley, thank you! Our nail techs put their heart into every manicure. Great news – we've heard requests like yours and starting next month, we're extending hours until 8 PM on Thursdays and Fridays! Perfect for post-work pampering. Book early, those slots will go fast! – Glamour Team",
    avatar: 'AB',
  },
  {
    id: 15,
    platform: 'tripadvisor',
    business: 'Oceanside Seafood House',
    reviewer: 'Frank M.',
    rating: 5,
    review: "The lobster bisque is liquid gold. Been coming here for 20 years and it's never disappointed. A local treasure.",
    response:
      "Frank, 20 years! You've been with us since practically the beginning. Customers like you are why we're still here, still making that bisque with the same recipe and the same love. Next time you're in, the first bowl's on us – you've more than earned it. – Chef Roberto & Family",
    avatar: 'FM',
  },
  {
    id: 16,
    platform: 'google',
    business: 'Bright Smile Orthodontics',
    reviewer: 'Parent of Tyler, age 14',
    rating: 5,
    review: "Dr. Williams is so patient with teenagers! Tyler actually looks forward to his appointments. Braces journey has been smooth.",
    response:
      "What a wonderful update on Tyler's journey! Teenagers can be tough customers (we get it!), and we're so glad he's having a positive experience. A great attitude makes treatment go smoother – Tyler's clearly got that down. Can't wait to see that final reveal smile! – Dr. Williams & The Bright Smile Team",
    avatar: 'PT',
  },
  {
    id: 17,
    platform: 'facebook',
    business: 'Rustic Barn Wedding Venue',
    reviewer: 'Newlyweds Katie & Jim',
    rating: 5,
    review: 'Our wedding day was absolutely PERFECT. The team handled everything flawlessly. Photos look like a fairytale!',
    response:
      "Katie & Jim, congratulations on your beautiful wedding! Watching you two say 'I do' under those string lights was pure magic. Every detail, from the flowers to the sunset timing, came together perfectly because of your vision and trust in us. Wishing you a lifetime of happiness! – The Rustic Barn Family",
    avatar: 'KJ',
  },
  {
    id: 18,
    platform: 'yelp',
    business: 'Thompson Plumbing Services',
    reviewer: 'Robert G.',
    rating: 5,
    review: 'Emergency call at 11 PM for a burst pipe. Mike arrived in 30 minutes and fixed it fast. True professional.',
    response:
      "Robert, that's what we're here for! A burst pipe at 11 PM is nobody's idea of a good evening. Mike takes pride in fast response times – he knows water damage waits for no one. Glad we could get you dried out and back to normal quickly. We're always just a call away! – Thompson Plumbing Team",
    avatar: 'RG',
  },
  {
    id: 19,
    platform: 'google',
    business: 'Little Learners Daycare',
    reviewer: 'Amanda & Carlos',
    rating: 5,
    review: "Our daughter Emma has thrived here! She's learned so much and made wonderful friends. Teachers genuinely care.",
    response:
      "Amanda & Carlos, watching Emma blossom has been such a joy for our whole team! She came out of her shell beautifully, and her curiosity is contagious in the classroom. Those finger-paint masterpieces on our wall? Pure Emma magic. Thank you for entrusting us with your little learner! – Miss Sarah & The Little Learners Family",
    avatar: 'AC',
  },
  {
    id: 20,
    platform: 'tripadvisor',
    business: 'Serenity Day Spa',
    reviewer: 'Michelle D.',
    rating: 5,
    review: 'The hot stone massage was heavenly. Left feeling like a new person. Already booked my next appointment!',
    response:
      "Michelle, we're so glad you floated out of here feeling renewed! Our massage therapists are true artists, and the hot stones work their magic on every tired muscle. Smart move booking ahead – self-care should always be on the calendar! See you soon for more serenity. – With warmth, Serenity Spa",
    avatar: 'MD',
  },
];

export const platformColors: Record<string, { bg: string; text: string; glow: string }> = {
  google: { bg: 'bg-blue-500', text: 'text-blue-600', glow: 'platform-glow-google' },
  yelp: { bg: 'bg-red-500', text: 'text-red-600', glow: 'platform-glow-yelp' },
  facebook: { bg: 'bg-indigo-500', text: 'text-indigo-600', glow: 'platform-glow-facebook' },
  tripadvisor: { bg: 'bg-green-500', text: 'text-green-600', glow: 'platform-glow-tripadvisor' },
};

export const platformNames: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  tripadvisor: 'TripAdvisor',
};
