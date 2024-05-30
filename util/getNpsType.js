/**
 * Get result based on nps rating
 *
 * @param {number} score
 * @param forPromoter
 * @param forPassive
 * @param forDetractor
 * @param {Array} limits
 * @returns {string}
 */
const getNpsType = (score, forPromoter, forPassive, forDetractor, limits = [ 7, 9 ]) => {
    return (score >= limits[ 1 ] && forPromoter) ||
        (score >= limits[ 0 ] && forPassive) ||
        forDetractor;
};


export default getNpsType;
