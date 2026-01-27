export interface Tenue {
  slug: string;
  name: string;
  image: string;
  description: string;
  materials: string[];
}

export const tenues: Tenue[] = [
  {
    slug: "ancestrale",
    name: "Ancestrale",
    image: "/images/tenue-01.jpg",
    description: "Une silhouette qui puise dans les racines profondes de notre héritage. Ancestrale célèbre les lignes épurées et la noblesse des formes traditionnelles, réinterprétées avec une sensibilité contemporaine. Chaque pli raconte une histoire transmise de génération en génération.",
    materials: ["Coton tissé à la main du Burkina Faso", "Fil d'or artisanal", "Soie naturelle teinte aux pigments végétaux"]
  },
  {
    slug: "soleil-noir",
    name: "Soleil Noir",
    image: "/images/tenue-02.jpg",
    description: "L'éclat mystérieux d'un astre caché. Soleil Noir joue sur les contrastes, mariant l'obscurité élégante à des éclats dorés subtils. Une pièce pour ceux qui comprennent que la vraie lumière émane de l'intérieur.",
    materials: ["Velours de soie ébène", "Broderies dorées à la main", "Doublure en satin de coton"]
  },
  {
    slug: "harmonie",
    name: "Harmonie",
    image: "/images/tenue-03.jpg",
    description: "L'équilibre parfait entre force et délicatesse. Harmonie incarne la dualité de l'âme africaine moderne : ancrée dans ses traditions, ouverte sur le monde. Une tenue qui respire la sérénité.",
    materials: ["Lin européen premium", "Tissage kente contemporain", "Boutons en corne naturelle"]
  },
  {
    slug: "royal",
    name: "Royal",
    image: "/images/tenue-04.jpg",
    description: "Digne des cours anciennes, Royal réinvente la majesté. Cette pièce évoque les grands royaumes du passé tout en affirmant une présence résolument actuelle. Porter Royal, c'est revendiquer sa lignée.",
    materials: ["Brocart tissé main", "Fil d'argent et d'or", "Perles de verre vénitiennes"]
  },
  {
    slug: "terre-mere",
    name: "Terre Mère",
    image: "/images/tenue-05.jpg",
    description: "Un hommage à celle qui nous porte tous. Terre Mère célèbre les teintes ocres et terracotta, les textures organiques qui rappellent notre connexion à la nature. Une pièce d'une profonde humanité.",
    materials: ["Coton biologique teinté à l'argile", "Raphia tressé", "Cuir végétal tanné naturellement"]
  },
  {
    slug: "zenith",
    name: "Zénith",
    image: "/images/tenue-06.jpg",
    description: "Au sommet de l'expression artistique. Zénith capture l'instant où le soleil atteint son point culminant. Une création pour les moments d'apothéose, quand l'être rayonne de toute sa puissance.",
    materials: ["Soie sauvage dorée", "Organza cristal", "Broderies de fils métalliques"]
  },
  {
    slug: "murmure",
    name: "Murmure",
    image: "/images/tenue-07.jpg",
    description: "La subtilité comme signature. Murmure parle à ceux qui savent écouter le silence. Des détails délicats, une élégance qui ne s'impose pas mais qui marque durablement les esprits.",
    materials: ["Mousseline de soie légère", "Dentelle artisanale", "Nacre véritable"]
  },
  {
    slug: "orage",
    name: "Orage",
    image: "/images/tenue-08.jpg",
    description: "La puissance contenue avant la tempête. Orage joue sur les tensions, les gris profonds traversés d'éclairs dorés. Une pièce pour ceux qui portent en eux une force tranquille.",
    materials: ["Laine mérinos anthracite", "Cuir grainé", "Fermoirs en bronze patiné"]
  },
  {
    slug: "renaissance",
    name: "Renaissance",
    image: "/images/tenue-09.jpg",
    description: "Le renouveau comme philosophie. Renaissance incarne le mouvement perpétuel de la création. Des formes qui évoluent, des lignes qui s'élancent vers demain tout en honorant hier.",
    materials: ["Jacquard moderne", "Fils de bambou", "Cristaux Swarovski sélectionnés"]
  },
  {
    slug: "sahel",
    name: "Sahel",
    image: "/images/tenue-10.jpg",
    description: "L'immensité silencieuse des terres arides. Sahel capture l'essence de ces paysages où le ciel touche la terre. Une palette de sables et d'or, une sérénité absolue.",
    materials: ["Coton du désert", "Teintures naturelles au henné", "Cuir de chameau artisanal"]
  },
  {
    slug: "nocturne",
    name: "Nocturne",
    image: "/images/tenue-11.jpg",
    description: "La magie des heures sombres. Nocturne célèbre la beauté de la nuit africaine, quand les étoiles guident les rêveurs. Une pièce mystérieuse, envoûtante, inoubliable.",
    materials: ["Velours de nuit", "Sequins discrets", "Soie indigo profond"]
  },
  {
    slug: "flamme",
    name: "Flamme",
    image: "/images/tenue-12.jpg",
    description: "L'énergie vive qui consume et transforme. Flamme ose les tons cuivrés, les rouges profonds, les orangés vibrants. Pour ceux qui n'ont pas peur de briller.",
    materials: ["Soie flammée", "Broderies cuivrées", "Perles de corail véritable"]
  },
  {
    slug: "silence",
    name: "Silence",
    image: "/images/tenue-13.jpg",
    description: "L'éloquence de ce qui n'est pas dit. Silence propose une épure radicale, des lignes pures, une absence assumée d'ornement. La beauté nue, sans artifice.",
    materials: ["Crêpe de Chine immaculé", "Coutures invisibles", "Boutons recouverts main"]
  },
  {
    slug: "cascade",
    name: "Cascade",
    image: "/images/tenue-14.jpg",
    description: "Le mouvement fluide de l'eau qui s'écoule. Cascade joue sur les drapés, les plis qui tombent naturellement. Une pièce vivante, qui danse avec celle qui la porte.",
    materials: ["Jersey de soie fluide", "Charmeuse légère", "Finitions invisibles"]
  },
  {
    slug: "gardien",
    name: "Gardien",
    image: "/images/tenue-15.jpg",
    description: "La force protectrice des ancêtres. Gardien est une armure moderne, une affirmation de puissance bienveillante. Pour ceux qui veillent sur les leurs.",
    materials: ["Cuir structuré", "Laiton martelé à la main", "Doublure en coton égyptien"]
  },
  {
    slug: "aurore",
    name: "Aurore",
    image: "/images/tenue-16.jpg",
    description: "Les premières lueurs d'un nouveau jour. Aurore célèbre les commencements, les possibles infinis de chaque matin. Des teintes rosées mêlées d'or naissant.",
    materials: ["Organza irisé", "Fils de soie rosés", "Perles d'eau douce"]
  },
  {
    slug: "echo",
    name: "Écho",
    image: "/images/tenue-17.jpg",
    description: "Les résonances du passé dans le présent. Écho superpose les époques, mêle les influences, crée un dialogue entre les générations. Une pièce intemporelle.",
    materials: ["Tissage mixte traditionnel-moderne", "Fils recyclés", "Boutons en os sculpté"]
  },
  {
    slug: "horizon",
    name: "Horizon",
    image: "/images/tenue-18.jpg",
    description: "Là où la vision s'étend à l'infini. Horizon est une invitation au voyage, une ouverture sur tous les possibles. Des lignes longues, une allure de conquistador pacifique.",
    materials: ["Gabardine premium", "Passementerie dorée", "Soie sauvage intérieure"]
  },
  {
    slug: "oracle",
    name: "Oracle",
    image: "/images/tenue-19.jpg",
    description: "La sagesse qui voit au-delà du visible. Oracle est une pièce mystique, chargée de symboles anciens. Pour ceux qui lisent entre les lignes du monde.",
    materials: ["Lin cérémoniel", "Broderies symboliques", "Cauris authentiques"]
  },
  {
    slug: "rivage",
    name: "Rivage",
    image: "/images/tenue-20.jpg",
    description: "Là où l'océan rencontre la terre. Rivage évoque les côtes africaines, leurs bleus profonds et leurs sables clairs. Une pièce apaisante comme une brise marine.",
    materials: ["Coton marin premium", "Teinture indigo naturel", "Coquillages polis"]
  },
  {
    slug: "eclipse",
    name: "Éclipse",
    image: "/images/tenue-21.jpg",
    description: "Le moment rare où deux astres s'alignent. Éclipse joue sur l'obscurité traversée de lumière, le mystère d'un phénomène céleste. Une pièce événement.",
    materials: ["Satin noir profond", "Fil d'argent lunaire", "Onyx véritable"]
  },
  {
    slug: "heritage",
    name: "Héritage",
    image: "/images/tenue-22.jpg",
    description: "Ce qui nous a été transmis et que nous transmettons. Héritage est une célébration de la lignée, une reconnaissance de nos dettes envers ceux qui nous précèdent.",
    materials: ["Bogolan traditionnel", "Coton longue fibre", "Teintures ancestrales"]
  },
  {
    slug: "sovereign",
    name: "Souverain",
    image: "/images/tenue-23.jpg",
    description: "L'autorité naturelle de celui qui s'appartient. Souverain affirme une présence, une stature, une légitimité qui ne se discute pas. La pièce maîtresse de la collection.",
    materials: ["Brocart impérial", "Or 22 carats filé", "Velours de cérémonie"]
  },
  {
    slug: "memoire",
    name: "Mémoire",
    image: "/images/tenue-24.jpg",
    description: "Les traces indélébiles de ce qui fut. Mémoire porte en elle les récits, les chants, les prières de nos ancêtres. Une pièce qui raconte autant qu'elle habille.",
    materials: ["Tissu archive reconstitué", "Broderies narratives", "Perles de mémoire"]
  },
  {
    slug: "eternite",
    name: "Éternité",
    image: "/images/tenue-25.jpg",
    description: "Au-delà du temps, au-delà des modes. Éternité clôt la collection AFFIN comme une promesse : ce que nous créons survivra. Une pièce destinée à traverser les âges.",
    materials: ["Soie immortelle", "Fils d'or pur", "Diamants bruts éthiques"]
  }
];

export function getTenueBySlug(slug: string): Tenue | undefined {
  return tenues.find(t => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return tenues.map(t => t.slug);
}
