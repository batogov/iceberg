import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import './creating-successfully-header.scss';

import { Icon } from '../../../blocks';
import { clearCollection } from '../../../reducers/create-collection.reducer';

class CreatingSuccessfullyHeader extends Component {
    handleClickClose = () => {
        this.props.clearCollection();
        /* Если создаем закрытую подборку, то переходим в профиль,
        * иначе в ленту "Новое"
        */
        if (this.props.closed) {
            this.props.history.push('/profile');
        } else {
            this.props.history.push('/feed/time');
        }
    }

    render() {
        return (
            <header className="create-successfully-header">
                <h2>Готово</h2>
                <span onClick={this.handleClickClose}>
                    <Icon iconName={'close'} />
                </span>
            </header>
        );
    }
}

CreatingSuccessfullyHeader.propTypes = {
    history: PropTypes.object.isRequired,
    clearCollection: PropTypes.func.isRequired,
    closed: PropTypes.bool.isRequired,
};

export default connect(
    state => state,
    { clearCollection },
)(withRouter(CreatingSuccessfullyHeader));
