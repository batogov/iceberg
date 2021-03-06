import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon } from '../../blocks';

import { addTag, deleteTag, getTags, sendTags } from '../../reducers/onboarding.reducer';
import './onboarding.scss';

const slides = [
    {
        _id: 0,
        img: 'onboard1',
        title: 'Изучите любую тему',
        text: 'Найдите подборку с ссылками по интересующей вас теме',
        type: '',
    },
    {
        _id: 1,
        img: 'onboard2',
        title: 'Сохраняйте подборки и ссылки',
        text: 'Так вы быстро найдете их в профиле и лучше настроите свою ленту',
        type: '',
    },
    {
        _id: 2,
        img: 'onboard3',
        title: 'Создавайте подборки из ссылок сами',
        text: 'Помогайте другим разобраться в теме и делитесь в социальных сетях',
        type: '',
    },
    {
        _id: 3,
        title: 'Выберите интересные вам темы',
        text: '',
        type: 'tags',
    },
];

/*
Компонент онбординга. Содержит экраны с текстовой информацией и интерактивный экран
с выбором пользовательских тегов. Работает с полем "onboarding" стора, отсылает серверу
информацию о выбранных тегах.
*/
class Onboarding extends Component {
    static propTypes = {
        selectedTags: PropTypes.array,
        hashTags: PropTypes.array,
        addTag: PropTypes.func.isRequired,
        deleteTag: PropTypes.func.isRequired,
        getTags: PropTypes.func.isRequired,
        sendTags: PropTypes.func.isRequired,
        token: PropTypes.string.isRequired,
        history: PropTypes.any.isRequired,
    };

    static defaultProps = {
        selectedTags: [],
        hashTags: [],
    };

    constructor() {
        super();
        this.state = {
            currentSlide: 0,
            selectedTags: [],
        };
    }

    componentDidMount() {
        this.props.getTags(this.props.token);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedTags !== nextProps.selectedTags) {
            this.setTags(nextProps.selectedTags);
        }
    }

    setCurrentSlide = (slide) => {
        this.setState({
            currentSlide: slide,
        });
    };

    setTags = (selectedTags) => {
        this.setState({
            selectedTags,
        });
    };

    handleClickTag = id => (event) => {
        const target = event.target;
        const className = 'onboarding-slider__hash-tag--selected';

        if (target.classList.contains(className)) {
            target.classList.remove(className);
            this.props.deleteTag(id);
        } else {
            target.classList.add(className);
            this.props.addTag(id);
        }
    };

    handleReady = () => {
        this.props.sendTags(this.state.selectedTags, this.props.token);
        this.props.history.push('/feed');
    };

    nextSlide = () => {
        this.setCurrentSlide(this.state.currentSlide + 1);
    };

    prevSlide = () => {
        this.setCurrentSlide(this.state.currentSlide - 1);
    };

    render() {
        const { currentSlide, selectedTags } = this.state;
        const { hashTags } = this.props;

        return (
            <main className="onboarding">
                <header className="onboarding__header">
                    <button
                        onClick={this.handleReady}
                        className="onboarding__link"
                    >Пропустить</button>
                </header>

                <div className="onboarding-slider">
                    <div className="onboarding-slider__track" style={{ transform: `translateX(-${100 * currentSlide}%)` }}>
                        { slides.map(slide => (
                            <div className="onboarding-slider__slide" key={slide._id}>
                                { slide.type === 'tags'
                                    ? (
                                        <div className="onboarding-slider__hash-tags-wrapper">
                                            { hashTags.length > 0 && hashTags.map(hashTag => (
                                                <span
                                                    onClick={this.handleClickTag(hashTag._id)}
                                                    className="onboarding-slider__hash-tag"
                                                    key={hashTag._id}
                                                >{`#${hashTag.name}`}</span>))
                                            }
                                        </div>
                                    )
                                    : (
                                        <span className="onboarding-slider__icon-wrapper">
                                            <Icon
                                                iconName={slide.img}
                                                iconWidth={'180'}
                                                iconHeight={'180'}
                                            />
                                        </span>
                                    )
                                }
                                <h2 className="onboarding-slider__title">{slide.title}</h2>
                                <p className="onboarding-slider__text">{slide.text}</p>
                            </div>
                        )) }
                    </div>
                </div>
                <footer className="onboarding__footer">
                    <div className="onboarding-slider__nav-block">
                        { currentSlide !== 0
                            && (
                                <button
                                    onClick={this.prevSlide}
                                    className="onboarding__link onboarding-slider__prev"
                                >Назад</button>
                            )
                        }
                    </div>
                    <div className="onboarding-slider__pagination-wrapper">
                        { slides.length > 1 && slides.map(slide => (
                            <span
                                className={`
                                onboarding-slider__pagination-item
                                ${currentSlide === slide._id ? 'onboarding-slider__pagination-item--active' : ''}
                                `}
                                key={slide._id}
                                id={slide._id}
                            />))
                        }
                    </div>
                    <div className="onboarding-slider__nav-block">
                        {
                            currentSlide === (slides.length - 1) && <button
                                onClick={this.handleReady}
                                className={
                                    `onboarding__link onboarding-slider__next 
                                    ${selectedTags.length === 0 ? 'onboarding__link--inactive' : ''}`
                                }
                            >Готово</button>
                        }
                        {
                            currentSlide !== (slides.length - 1) && <button
                                onClick={this.nextSlide}
                                className="onboarding__link onboarding-slider__next"
                            >Далее</button>
                        }
                    </div>
                </footer>
            </main>
        );
    }
}

export default connect(
    state => ({
        selectedTags: state.onboarding.selectedTags,
        hashTags: state.onboarding.hashTags,
        token: state.authorization.access_token,
    }),
    { addTag, deleteTag, getTags, sendTags },
)(Onboarding);
