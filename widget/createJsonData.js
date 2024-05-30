const createJsonData = (profile, isFreelancer, pathToAgencyPage) => {
    const jsonLD = profile && {
        '@context': 'https://schema.org/',
        '@type': 'EmploymentAgency',
        '@id': pathToAgencyPage,
        'url': pathToAgencyPage,
        'image': profile.photo?.url,
        'name': isFreelancer ? [ profile.firstName, profile.lastName ].join(' ') : profile.name,
        'telephone': profile.contactNumber,
        'priceRange': 'Contact Agency',
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': profile.city,
            'addressRegion': profile.state,
            'postalCode': profile.postcode,
            'areaServed': profile.country
        },
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': profile.rating.overallRating,
            'ratingCount': profile.rating.reviewsCount
        }
    };
    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.text = JSON.stringify(jsonLD);
    document.head.appendChild(scriptTag);
};

export default createJsonData;
