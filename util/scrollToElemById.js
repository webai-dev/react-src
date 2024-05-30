/**
 * Will scroll to the element
 *
 * @param {string} id - id of the element
 * @param {boolean} [smooth] - behaviour
 */
const scrollToElemById = (id, smooth) => {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }
    const yOffset = 70;
    window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - yOffset,
        behavior: smooth ? 'smooth' : 'auto'
    });
};

export default scrollToElemById;
