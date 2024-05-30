import React, { Fragment }      from 'react';
import HeaderRowComponent       from '../../components/HeaderRowComponent';
import HeaderRowButtonComponent from '../../components/HeaderRowButtonComponent';
import ActionsRowComponent      from '../../components/ActionsRowComponent';
import SearchContainer          from '../../components/Form/SearchContainer';
import { ROUTES }               from '../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
} from '../../components/ButtonComponent';
import SelectComponent              from '../../components/SelectComponent';
import RowItemComponent, { STATUS } from '../../components/RowItemComponent';
import DeleteActionComponent        from '../../components/RowItemComponent/DeleteActionComponent';
import ButtonActionComponent        from '../../components/RowItemComponent/ButtonActionComponent';
import styles                       from './styles.scss';

const BlogView = () => (
    <Fragment>
        <HeaderRowComponent
            tabs={
                <Fragment>
                    <HeaderRowButtonComponent url={ ROUTES.BLOG } label="Blog" isActive/>
                </Fragment>
            }
            search={
                <SearchContainer label="Find..." name="search" innerSearchStyle />
            }
         />
        <ActionsRowComponent
            itemActions={
                <Fragment>
                    <SelectComponent
                        setValue={ () => {} }
                        className={ styles.dropDown }
                        value="all"
                        values={ [
                            {
                                key: 'actions',
                                label: 'actions',
                            },
                            {
                                key: 'delete',
                                label: 'Delete',
                            },
                        ] }
                    />
                    <ButtonComponent btnType={ BUTTON_TYPE.LINK } size={ BUTTON_SIZE.BIG }>
                        Apply
                    </ButtonComponent>
                </Fragment>
            }
            pageActions={
                <Fragment>
                    <SelectComponent
                        setValue={ () => {} }
                        className={ styles.dropDown }
                        value="all"
                        values={ [
                            {
                                key: 'status',
                                label: 'Status',
                            },
                            {
                                key: 'drafts',
                                label: 'Drafts',
                            },
                            {
                                key: 'published',
                                label: 'Published',
                            },
                        ] }
                    />
                    <ButtonComponent to={ ROUTES.BLOG_NEW } btnType={ BUTTON_TYPE.ACCENT } size={ BUTTON_SIZE.BIG }>
                        Add a new content
                    </ButtonComponent>
                </Fragment>
            }
        />
        <RowItemComponent
            onCheckBoxClick={ () => {} }
            id="eimf3fa"
            header="Lorem ipsum dolor sit amet"
            accentText="Strategy"
            status={ STATUS.SUCCESS }
            statusText="VIDEO"
            videoUrl="https://www.youtube.com/embed/OY025jHrNsc"
            actions={
                <Fragment>
                    <ButtonActionComponent onClick={ () => {} } text="Preview" />
                    <ButtonActionComponent onClick={ () => {} } text="Edit" />
                    <DeleteActionComponent onClick={ () => {} } />
                </Fragment>
            }
        />
        <RowItemComponent
            onCheckBoxClick={ () => {} }
            id="eia2mf34hgfa"
            header="Ipsum dolor sit amet"
            accentText="Strategy"
            status={ STATUS.NOT_ACTIVE }
            statusText="ARTICLE (DRAFT)"
            videoUrl="https://www.youtube.com/embed/OY025jHrNsc"
            actions={
                <Fragment>
                    <ButtonActionComponent onClick={ () => {} } text="Preview" />
                    <ButtonActionComponent onClick={ () => {} } text="Edit" />
                    <DeleteActionComponent onClick={ () => {} } />
                </Fragment>
            }
        />
    </Fragment>
);

export default BlogView;
