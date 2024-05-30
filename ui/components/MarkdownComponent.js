import React      from 'react';
import PropTypes  from 'prop-types';
import Markdown   from 'react-markdown/with-html';

const MarkdownComponent = (props) => {
    const { source, className } = props;

    return (
        <Markdown
            source={ source }
            escapeHtml={ false }
            className={ className }
        />
    );
};

MarkdownComponent.propTypes = {
    source: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default MarkdownComponent;
