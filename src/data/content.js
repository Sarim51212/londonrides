import {
  Plane, Train, Car, Users, Briefcase, Compass, Clock, Building2, PlaneTakeoff, Ship, Castle,
  Radar, BadgeCheck, Timer, MessageSquare, Calculator, CreditCard, Smartphone, Armchair,
  CalendarCheck, Baby, PlaneLanding, Luggage, ShieldCheck, Fingerprint, Gavel, MapPin, Wallet, Headphones, Leaf,
} from 'lucide-react';

export const SERVICE_STRIP = [
  { icon: Plane, title: 'Airport Transfers', sub: 'All major airports', to: '/airports' },
  { icon: Train, title: 'Station Transfers', sub: 'Across London & UK', to: '/services#stations' },
  { icon: Car, title: 'Chauffeur Services', sub: 'Luxury & executive', to: '/services#hourly' },
  { icon: Users, title: 'Group Travel', sub: 'MPVs & minibuses', to: '/fleet' },
  { icon: Briefcase, title: 'Corporate Travel', sub: 'Business accounts', to: '/services#corporate' },
  { icon: Compass, title: 'Tours & Experiences', sub: 'Explore the UK', to: '/services#day-tours' },
];

export const AIRPORTS = [
  { slug: 'heathrow', locId: 'lhr', code: 'LHR', name: 'Heathrow Airport', detail: 'Terminals 2, 3, 4 & 5', status: 'On time', blurb: "The UK's busiest hub. Your chauffeur waits in the arrivals hall of your terminal with a name board, tracking your flight in real time." },
  { slug: 'gatwick', locId: 'lgw', code: 'LGW', name: 'Gatwick Airport', detail: 'North & South Terminals', status: 'On time', blurb: 'Fast M23 corridor transfers into the City, Canary Wharf and South London with complimentary waiting after touchdown.' },
  { slug: 'london-city', locId: 'lcy', code: 'LCY', name: 'London City Airport', detail: 'Royal Docks, E16', status: 'Optimal', blurb: 'The business traveller’s airport — minutes from Canary Wharf and the Square Mile. Ideal for same-day roadshows.' },
  { slug: 'stansted', locId: 'stn', code: 'STN', name: 'Stansted Airport', detail: 'Main terminal & private FBO', status: 'Normal', blurb: 'M11 express transfers to North and Central London, Cambridge and the Home Counties.' },
  { slug: 'luton', locId: 'ltn', code: 'LTN', name: 'Luton Airport', detail: 'Harrods Aviation / Signature', status: 'On time', blurb: 'Commercial and private aviation pickups with discreet chauffeurs for Harrods Aviation and Signature FBO.' },
  { slug: 'farnborough', locId: 'fab', code: 'FAB', name: 'Farnborough Airport', detail: 'Private jet FBO', status: 'VIP', blurb: 'Apron-adjacent private jet collections with NDA-compliant chauffeurs and First Class vehicles.' },
];

// Destinations used in the airport fare tables (reference-site style).
export const FARE_DESTINATIONS = ['mayfair', 'city', 'canary', 'kensington', 'stp', 'sou', 'dov', 'windsor'];

export const POPULAR_ROUTES = [
  { from: 'lhr', to: 'mayfair', tag: 'Most Popular', fromNote: 'All terminals 2–5', toNote: 'Hotels, residences & offices' },
  { from: 'lgw', to: 'canary', tag: 'Financial Hub', fromNote: 'North & South terminals', toNote: 'Bank, E14, EC2 & Bishopsgate' },
  { from: 'lhr', to: 'sou', tag: 'Cruise Transfer', fromNote: 'Direct terminal kerbside', toNote: 'Ocean, Mayflower, QEII & Horizon' },
  { from: 'lcy', to: 'city', tag: 'Express Business', fromNote: 'Express terminal exit', toNote: 'EC1, EC2, EC3, EC4' },
  { from: 'stn', to: 'soho', tag: 'North London', fromNote: 'Essex / M11 corridor', toNote: 'W1, WC1, SW1' },
  { from: 'fab', to: 'mayfair', tag: 'VIP Aviation', fromNote: 'Private jet terminal', toNote: "The Connaught, Claridge's, Bulgari" },
];

export const FLIGHT_FEATURES = [
  { icon: Radar, title: 'Live Flight Tracking', text: 'We sync with live flight data, so your chauffeur is dispatched for the actual landing time — not the timetable.' },
  { icon: BadgeCheck, title: 'In-Terminal Meet & Greet', text: 'Your chauffeur waits at arrivals with a personalised name board, ready to take your luggage.' },
  { icon: Timer, title: '60-Min Grace Period', text: 'Clear passport control and collect your bags without rushing or paying waiting fees.' },
  { icon: MessageSquare, title: 'Direct Driver Contact', text: 'Driver name, photo, phone and registration sent by SMS & WhatsApp before you land.' },
];

export const STEPS = [
  { icon: Calculator, title: 'Instant Quote & Car', text: 'Enter your journey and choose from saloons, Mercedes S-Class or spacious V-Class MPVs.', tag: '100% fixed fare guarantee' },
  { icon: CreditCard, title: 'Secure Payment', text: 'Pay by card, Google Pay, Apple Pay or PayPal. Your confirmation and VAT receipt arrive instantly.', tag: 'Zero surge pricing ever' },
  { icon: Smartphone, title: 'Driver Details', text: "Receive your chauffeur's name, photo and vehicle registration via SMS & WhatsApp before pickup.", tag: 'Live GPS tracking link' },
  { icon: Armchair, title: 'Meet, Greet & Relax', text: 'Your chauffeur greets you, assists with baggage and navigates London effortlessly.', tag: '60 mins free airport waiting' },
];

export const SERVICES = [
  { id: 'airport', icon: PlaneTakeoff, title: 'Executive Airport Transfers', text: 'Precision transfers to and from Heathrow, Gatwick, Luton, London City and Stansted with automated flight tracking and in-terminal meeting.', cta: 'Airport fares', to: '/airports' },
  { id: 'hourly', icon: Clock, title: 'Hourly As-Directed Hire', text: 'Retain an executive car and dedicated chauffeur for back-to-back meetings, Bond Street shopping, events or dinner transfers. From 3 hours.', cta: 'Book by the hour', to: '/book?type=hourly' },
  { id: 'corporate', icon: Building2, title: 'Corporate Accounts & Roadshows', text: 'Monthly invoicing, consolidated statements, dedicated account managers and priority allocation for financial, legal and concierge teams.', cta: 'Open an account', to: '/contact?topic=corporate' },
  { id: 'fbo', icon: Plane, title: 'Private Jet & FBO Transfers', text: 'Apron-adjacent service at Farnborough, Biggin Hill, Luton Signature and RAF Northolt. Complete discretion with NDA-compliant chauffeurs.', cta: 'FBO transfers', to: '/airports/farnborough' },
  { id: 'cruise', icon: Ship, title: 'Seaport & Cruise Transfers', text: 'Comfortable long-distance transfers to Southampton, Dover, Portsmouth, Tilbury and Harwich, with high-capacity vehicles for extra luggage.', cta: 'Cruise fares', to: '/book?to=sou' },
  { id: 'tours', icon: Castle, title: 'Bespoke UK Day Tours', text: 'Private full-day itineraries to Windsor Castle, Stonehenge, the Cotswolds, Oxford and Bicester Village with knowledgeable chauffeurs.', cta: 'Explore tours', to: '/services#day-tours' },
  { id: 'stations', icon: Train, title: 'Rail & Eurostar Transfers', text: "Door-to-platform transfers for St Pancras International, King's Cross, Paddington, Euston and every London terminus.", cta: 'Book a station transfer', to: '/book?to=stp' },
  { id: 'events', icon: Users, title: 'Weddings & Events', text: 'Immaculate vehicles for weddings, galas, Wimbledon, Ascot and the O2 — with coordinated multi-car logistics for your guests.', cta: 'Plan your event', to: '/contact?topic=events' },
];

export const TOURS = [
  { title: 'Windsor Castle & Eton', hours: 5, locId: 'windsor', text: 'The oldest occupied castle in the world, followed by a stroll through historic Eton.' },
  { title: 'Stonehenge & Bath', hours: 10, locId: 'stonehenge', text: 'The prehistoric monument and the Georgian splendour of the Roman spa city.' },
  { title: 'Oxford & The Cotswolds', hours: 9, locId: 'oxford', text: 'Dreaming spires, honey-stone villages and a classic English country pub lunch.' },
  { title: 'Bicester Village Shopping', hours: 6, locId: 'bicester', text: 'Luxury designer outlet with VIP drop-off and boot space for every bag.' },
];

export const WHY_US = [
  { icon: Wallet, title: 'Fixed, All-Inclusive Fares', text: 'Congestion Charge, ULEZ, parking and airport fees included. No surge, ever.' },
  { icon: Radar, title: 'Flight Monitoring', text: 'Delayed or early? We adjust automatically, at no extra cost.' },
  { icon: ShieldCheck, title: 'Licensed & Insured', text: 'TfL-licensed operator with enhanced DBS-checked chauffeurs.' },
  { icon: Headphones, title: '24/7 Live Support', text: 'Real people on phone and WhatsApp, around the clock, 365 days a year.' },
  { icon: Leaf, title: 'Modern, Low-Emission Fleet', text: 'Vehicles under 3 years old, hybrid-first, valeted before every journey.' },
  { icon: MapPin, title: 'Live Tracking', text: 'Share your chauffeur’s live location with family or colleagues.' },
];

export const SAFETY = [
  { icon: Gavel, text: 'TfL Licensed Operator' },
  { icon: Fingerprint, text: 'Enhanced DBS-checked chauffeurs' },
  { icon: ShieldCheck, text: '£10M passenger liability insurance' },
];

export const POLICIES = [
  { icon: CalendarCheck, title: '100% Refundable', text: 'Full refund on cancellations made up to 12 hours before pickup. No admin fees.', tag: '12h free cancellation' },
  { icon: Baby, title: 'Free Child Seats', text: 'Certified infant, child and booster seats, sanitised and fitted before dispatch.', tag: 'Zero extra fee' },
  { icon: PlaneLanding, title: 'Delay Protection', text: 'Your pickup time follows your flight, with 60 minutes free waiting after landing.', tag: 'Flight synchronised' },
  { icon: Luggage, title: 'Luggage Guarantee', text: 'Guaranteed boot capacity for your party, with chauffeur assistance at every stop.', tag: 'Help with every bag' },
];

// Placeholder testimonials from the design — replace with real, verified reviews before launch.
export const REVIEWS = [
  { initials: 'AL', name: 'Arthur L.', role: 'Private client · London & Zurich', source: 'Google', text: 'Our flight from JFK was delayed by over 90 minutes, but our chauffeur was right there at Terminal 5 arrivals with my name. Flawless S-Class and a silent drive to The Connaught.' },
  { initials: 'EK', name: 'Elena K.', role: 'VP Global Operations', source: 'Trustpilot', text: 'We booked three V-Class vehicles for our team during London Tech Week. Multiple Gatwick arrivals managed seamlessly, and the fixed invoicing was clean with zero surprises.' },
  { initials: 'MC', name: 'Marcus C.', role: 'Family traveller · Singapore', source: 'TripAdvisor', text: 'Twin toddlers and six large suitcases from Southampton to Stansted. The driver helped with every bag and had two pristine child seats already fitted.' },
  { initials: 'SR', name: 'Sophie R.', role: 'Wedding planner · Surrey', source: 'Google', text: 'Four cars, perfectly timed, immaculate inside and out. The chauffeurs were courteous with every guest. We will book again for every event.' },
  { initials: 'JD', name: 'James D.', role: 'Partner · City law firm', source: 'Trustpilot', text: 'Our go-to for client pickups at London City. Always early, always discreet, and the WhatsApp updates are genuinely useful.' },
  { initials: 'PN', name: 'Priya N.', role: 'Frequent flyer', source: 'Google', text: 'Booked at midnight for a 5am Heathrow run. Instant confirmation, driver details the evening before, and a spotless E-Class waiting outside.' },
];

export const FAQS = [
  { q: 'What happens if my flight is delayed or lands early?', a: 'We track every flight in real time. You do not need to tell us about delays — your pickup automatically moves to your actual landing time. Up to 60 minutes of free waiting starts only after touchdown, with no delay surcharges.' },
  { q: 'Where will I meet my chauffeur at the airport?', a: 'All airport pickups include in-terminal Meet & Greet. Your chauffeur waits at the arrivals exit with a personalised name board. Before you land you receive an SMS and WhatsApp with their name, phone number and vehicle registration.' },
  { q: 'Are your fares really fixed and all-inclusive?', a: 'Yes. Every quote includes the Congestion Charge, ULEZ, airport drop-off and parking fees, and VAT. The price you see when booking is the price you pay — no surge pricing, weekend premiums or late-night extras.' },
  { q: 'Which payment methods do you accept?', a: 'Visa, Mastercard, American Express and Maestro, plus Google Pay, Apple Pay and PayPal. All payments are processed securely by Stripe and PayPal — we never see or store your card details.' },
  { q: 'What is your cancellation policy?', a: 'Cancel up to 12 hours before pickup for a 100% refund. Flight numbers, terminals and pickup times can be changed free of charge any time via our 24/7 team.' },
  { q: 'Can you provide child seats?', a: 'Yes, free of charge. We supply certified infant capsules, toddler seats and high-back boosters. Just add them in the booking form.' },
  { q: 'How much luggage can each vehicle take?', a: 'Saloons and Executive cars take 2 large suitcases plus 2 hand luggage, Estates take 3, the V-Class MPV takes up to 7, and our VIP Sprinter takes up to 16 in a dedicated luggage bay. The booking form only shows vehicles that fit your party.' },
];

export const STATS = [
  { value: 4.9, decimals: 1, suffix: '/5', label: 'Average rating' },
  { value: 2840, suffix: '+', label: 'Verified reviews' },
  { value: 60, suffix: ' min', label: 'Free airport waiting' },
  { value: 24, suffix: '/7', label: 'Live dispatch desk' },
];
