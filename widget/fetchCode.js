const fetchCode = (serverUrl, slug, type, ids) => {
    return new Promise((resolve, reject) => {
        const reviewsQuery = ids.length ? `
            nodes(ids: [${ ids.map(id => `"${ id }"`)
            .join(', ') }]) {
                ...on Rating {
                    title
                    overallRating
                    review
                    firstName
                    lastName
                    isEmployer: responsiveness
                    placement {
                        companyName
                    }
                }
            }
        ` : '';
        const lastRatingsQuery = !ids.length ? `
            lastRatings: ratings {
                title
                overallRating
                review
                firstName
                lastName
                isEmployer: responsiveness
                placement {
                    companyName
                }
            }` : '';

        const query = {
            query: `{
            profile: sluggable(slug: "${ slug }", type: "${ type }") {
                ...on Agency {
                    hasActiveSubscription
                    name
                    city
                    state
                    country
                    contactNumber
                    postcode
                    rating {
                        overallRating
                        reviewsCount
                        ${ lastRatingsQuery }
                    }
                    photo {
                        url
                    }
                }
                ...on Recruiter {
                    hasActiveSubscription
                    firstName
                    lastName
                    city
                    state
                    country
                    contactNumber
                    postcode
                    rating {
                        overallRating
                        reviewsCount
                        ${ lastRatingsQuery }
                    }
                    photo: profilePhoto {
                        url
                    }
                }
            }
            ${ reviewsQuery }
        }`
        };

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('POST', serverUrl);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            resolve(xhr?.response?.data);
        };
        xhr.onerror = function (error) {
            reject(error);
        };

        xhr.send(JSON.stringify(query));
    });
};

export default fetchCode;
