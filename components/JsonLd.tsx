/**
 * JSON-LD Structured Data Components for SEO
 * These components add schema.org markup for better search engine understanding
 */

type OrganizationJsonLdProps = {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
};

/**
 * Organization/Museum structured data for the root layout
 */
export function OrganizationJsonLd({
  name = 'The Mini Museum',
  url = 'https://minimuseumproject.com',
  logo = 'https://minimuseumproject.com/logo.png',
  description = 'Big History. Small Spaces. Monthly curated exhibitions bringing museum experiences to schools and libraries.',
}: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Museum',
    name,
    url,
    logo,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type ExhibitionJsonLdProps = {
  name: string;
  description: string;
  url: string;
  image?: string;
  startDate?: string;
  endDate?: string;
};

/**
 * Exhibition event structured data
 */
export function ExhibitionJsonLd({
  name,
  description,
  url,
  image,
  startDate,
  endDate,
}: ExhibitionJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExhibitionEvent',
    name,
    description,
    url,
    image,
    startDate,
    endDate,
    location: {
      '@type': 'Place',
      name: 'The Mini Museum',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Austin',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'The Mini Museum',
      url: 'https://minimuseumproject.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type EducationalResourceJsonLdProps = {
  name: string;
  description: string;
  url: string;
  educationalLevel?: string[];
  learningResourceType?: string;
};

/**
 * Educational resource structured data for lesson plans
 */
export function EducationalResourceJsonLd({
  name,
  description,
  url,
  educationalLevel = ['PreK', 'K-2', '3-5', '6-8'],
  learningResourceType = 'Lesson Plan',
}: EducationalResourceJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name,
    description,
    url,
    educationalLevel,
    learningResourceType,
    provider: {
      '@type': 'Organization',
      name: 'The Mini Museum',
      url: 'https://minimuseumproject.com',
    },
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type BreadcrumbJsonLdProps = {
  items: Array<{ name: string; url: string }>;
};

/**
 * Breadcrumb structured data for navigation paths
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
