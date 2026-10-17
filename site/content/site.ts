// Every word on the site lives here. Edit this file to change the copy.

export const site = {
  name: 'Dike Industries',
  // Set NEXT_PUBLIC_SITE_URL to the live domain so link previews resolve.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  pronunciation: '/dee-keh/',
  tagline: 'Engineered from Waste. Built for the Future.',
  manifesto: 'Building the future from what the world throws away.',
  mission: 'We turn waste into tested materials, parts and equipment for industry and defence.',
  founder: 'Emmanuel Udeze',
  contact: {
    // TODO: replace with the real address. `.example` is a placeholder domain.
    email: 'hello@dike.example',
    // Add profile links when the accounts are live; empty ones are hidden.
    x: '',
    linkedin: '',
  },
};

export const nav = [
  { href: '#approach', label: 'Approach' },
  { href: '#build', label: 'What we build' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#company', label: 'Company' },
];

export const facts = [
  { term: 'Materials', value: 'rHDPE · rPP · composites' },
  { term: 'Markets', value: 'Industry · infrastructure · security' },
  { term: 'Now', value: 'Validating our first product' },
];

export const problems = [
  {
    title: 'Waste nobody can use',
    text: 'Mixed, dirty and inconsistent plastic is hard to reuse at a profit with today’s processing.',
  },
  {
    title: 'Buyers need parts that hold',
    text: 'Manufacturers and institutions need parts that meet spec, arrive on time and cost less over their life.',
  },
  {
    title: 'A gap in the chain',
    text: 'Recyclers stop at raw material. The value sits in engineering that material into finished parts.',
  },
];

export const steps = [
  { title: 'Feedstock', text: 'Suitable waste streams from supply partners' },
  { title: 'Assessment', text: 'Sort, clean, process and formulate' },
  { title: 'Engineering', text: 'Design and test against the spec' },
  { title: 'Manufacturing', text: 'Make parts with qualified partners' },
  { title: 'Quality', text: 'Documented checks and traceability' },
  { title: 'Customers', text: 'Industrial and institutional buyers' },
];

export const areas = [
  {
    stage: 'Now',
    title: 'Advanced recycled materials',
    text: 'Recycled plastics and composites, processed into consistent materials for defined industrial uses.',
  },
  {
    stage: 'Next',
    title: 'Industrial hardware and components',
    text: 'Housings, protective covers, fixtures and reusable handling products, where recycled material meets spec.',
  },
  {
    stage: 'Later',
    title: 'Defence and advanced equipment',
    text: 'Protective equipment, non-critical structural parts, UAVs and drones, each qualified for its use.',
  },
];

export const principles = [
  { title: 'Demand before capital', text: 'No expensive machinery until the market and the production numbers are proven.' },
  { title: 'Performance before claims', text: 'Materials must meet the needs of their job. Recycled content comes second.' },
  { title: 'Proof before expansion', text: 'One viable product before many markets.' },
  { title: 'Commercial discipline', text: 'Full costs, margins and repeat orders, tracked from day one.' },
  { title: 'Technical honesty', text: 'We keep what we plan apart from what we have proven.' },
  { title: 'Responsible manufacturing', text: 'We follow the law, safety and environmental standards, and procurement rules.' },
  { title: 'Durable capabilities', text: 'Reliable sourcing, process knowledge, quality and customer trust.' },
];

export const phases = [
  { title: 'Validate the first product', text: 'A real customer, a defined product, viable economics' },
  { title: 'Repeatable production', text: 'A dependable supplier with a repeatable operating model' },
  { title: 'More materials and products', text: 'A focused portfolio built on proven demand' },
  { title: 'Defence products', text: 'Qualified defence products, entered responsibly' },
  { title: 'Integrated industrial group', text: 'Owning stages of the chain where it pays' },
];
