import React      from 'react';
import { Input }  from 'reactstrap';
import classNames from 'classnames';

export const Select = (props) => {
    const { className, children, ...restProps } = props;
    return (
        <div className={ classNames('select-wrapper', className) }>
            <Input
                bsSize="lg"
                type="select" { ...restProps }>
                { children }
            </Input>
        </div>
    );
};
