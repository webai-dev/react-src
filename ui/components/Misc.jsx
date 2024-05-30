import React     from 'react';
import Currency  from 'react-currency-formatter';
import { Alert } from 'reactstrap';

export const Money = ({ children: money }) => {
    return (
        <Currency
            quantity={ money } // Required
            currency="AUD" // Optional (USD by default)
        />
    );
};

export const ErrorList = ({ errors }) =>
    errors && errors.length > 0 ? (
        <Alert color="danger">
            { (Array.isArray(errors) ? errors : [ errors ]).reduce((items, it, index) => {
                if (items.length > 0) {
                    items.push(<hr key={ index } />);
                }
                items.push(<p key={ it.key }>{ it.value }</p>);
                return items;
            }, []) }
        </Alert>
    ) : null;
