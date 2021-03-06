import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from '../../../blocks';

import { hexToRGB } from '../../../utils/shared-functions';

import './create-empty-card__header.scss';
import { cardBlue } from '../../../variables.scss';

import { createCollection, clearCollection } from '../../../reducers/create-collection.reducer';
import { actions as modalActions } from '../../../reducers/modal.reducer';
import { getCollection } from './../../../reducers/collection.reducer';

/*
Компонент хедера экрана создания новой коллекции. По нажатию на кнопку "Создать"
обращается к серверу и создаёт новую коллекцию. Данные берёт из поля
"createCollection" стора.
*/
class CreateEmptyCardHeader extends Component {
    static propTypes = {
        title: PropTypes.string,
        photo: PropTypes.string,
        color: PropTypes.string,
        closed: PropTypes.bool,
        description: PropTypes.string,
        tags: PropTypes.array,
        token: PropTypes.string.isRequired,
        history: PropTypes.any.isRequired,
        showErrorModal: PropTypes.func.isRequired,
        createCollection: PropTypes.func.isRequired,
        clearCollection: PropTypes.func.isRequired,
        getCollection: PropTypes.func.isRequired,
    }

    static defaultProps = {
        title: '',
        description: '',
        tags: [],
        photo: '',
        color: cardBlue,
        closed: false,
    };

    constructor() {
        super();
        this.state = {
            submitStatus: false,
        };
    }

    componentWillMount = () => {
        this.setSubmitStatus(this.props);
    };

    componentWillReceiveProps = (nextProps) => {
        const {
            title: currTitle,
            tags: currHashTags,
        } = this.props;
        const { title, tags } = nextProps;

        if ((title && currTitle !== title) ||
            (tags && currHashTags !== tags)
        ) {
            this.setSubmitStatus(nextProps);
        }
    };

    setSubmitStatus = ({ title, tags }) => {
        this.setState({
            submitStatus: (
                title.length > 4 &&
                tags.length > 0
            ),
        });
    };

    goBack = () => {
        this.props.history.goBack();
        this.props.clearCollection();
    };

    changeRoute = (data) => {
        // Записываем в стор collection только что созданную коллекцию 
        this.props.getCollection(data.collection._id, this.props.token);
        this.props.history.push('/creating-successfully');
    };

    handleSubmitData = () => {
        if (!this.state.submitStatus) {
            this.props.showErrorModal({
                title: 'Укажите категорию и название темы',
                text: 'Укажите хотя бы одну категорию и введите название темы (не менее 5 символов), чтобы другим было проще найти вашу подборку',
                buttonText: 'Ок',
            });
        } else {
            const {
                title, color, tags, photo, description, closed, token,
            } = this.props;

            const body = {
                name: title,
                color: hexToRGB(color || cardBlue),
                tags: tags.map(tag => tag.id).reverse(),
            };
            if (photo) { body.photo = photo; }
            if (description) { body.description = description; }
            if (closed) { body.closed = closed; }
            this.props.createCollection(body, token, this.changeRoute);
        }
    };

    render() {
        return (
            <header className="create-empty-card__header create-empty-card-header">
                <span onClick={this.goBack}>
                    <Icon iconName={'arrow-back'} />
                </span>
                <h4 className="create-empty-card-header__title">Новая тема</h4>
                <button
                    className={`create-empty-card-header__submit ${this.state.submitStatus ? 'create-empty-card-header__submit--active' : ''}`}
                    onClick={this.handleSubmitData}
                >Создать</button>
            </header>
        );
    }
}

export default connect(
    state => ({
        user: state.user.data,
        title: state.createCollection.title,
        description: state.createCollection.description,
        closed: state.createCollection.closed,
        tags: state.createCollection.tags,
        token: state.authorization.access_token,
        color: state.createCollection.color,
        photo: state.createCollection.photo,
    }),
    { createCollection, ...modalActions, clearCollection, getCollection },
)(withRouter(CreateEmptyCardHeader));
