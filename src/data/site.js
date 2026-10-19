// Central business details — update these before going live.
export const SITE = {
  name: 'London Rides',
  tagline: 'Luxury Taxi & Chauffeur Service',
  phone: '+44 20 7946 0888',
  phoneHref: 'tel:+442079460888',
  whatsapp: 'https://wa.me/447700900123',
  email: 'bookings@londonrides.co.uk',
  address: 'Mayfair, London W1J, United Kingdom',
  tflLicence: 'TfL Operator #009842/01',
  rating: 4.9,
  reviewCount: 2840,
  since: 2012,
  socials: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    linkedin: 'https://linkedin.com/',
  },
};

export const NAV = [
  { label: 'Home', to: '/' },
  {
    label: 'Airports',
    to: '/airports',
    children: [
      { label: 'Heathrow (LHR)', to: '/airports/heathrow', note: 'T2–T5' },
      { label: 'Gatwick (LGW)', to: '/airports/gatwick', note: 'N & S' },
      { label: 'London City (LCY)', to: '/airports/london-city' },
      { label: 'Stansted (STN)', to: '/airports/stansted' },
      { label: 'Luton (LTN)', to: '/airports/luton' },
      { label: 'Farnborough FBO', to: '/airports/farnborough', note: 'VIP' },
    ],
  },
  { label: 'Services', to: '/services' },
  { label: 'Fleet', to: '/fleet' },
  { label: 'Fares', to: '/#fares' },
  { label: 'Contact', to: '/contact' },
];
