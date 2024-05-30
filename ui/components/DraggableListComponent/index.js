import React, { useState, useCallback } from 'react';
import PropTypes                        from 'prop-types';
import { DndProvider }                  from 'react-dnd';
import HTML5Backend                     from 'react-dnd-html5-backend';
import update                           from 'immutability-helper';
import DraggableListItem                from './DraggableListItem';

const Container = (props) => {
    const { value, setValue } = props;
    {
        const [ listItems, setList ] = useState(value);
        const moveCard = useCallback(
            (dragIndex, hoverIndex) => {
                const dragCard = listItems[ dragIndex ];
                const newValue = update(listItems, {
                    $splice: [ [ dragIndex, 1 ], [ hoverIndex, 0, dragCard ] ],
                });

                setList(newValue);
                setValue(newValue);
            },
            [ listItems ],
        );

        return (
            <DndProvider backend={ HTML5Backend }>
                <div>{
                    listItems.map((card, index) => (
                        <DraggableListItem
                            key={ card.id }
                            index={ index }
                            id={ card.id }
                            label={ card.label }
                            moveCard={ moveCard }
                        />
                    ))
                }</div>
            </DndProvider>
        );
    }
};

Container.propTypes = {
    value: PropTypes.arrayOf(PropTypes.object).isRequired,
    setValue: PropTypes.func.isRequired,
};

export default Container;
