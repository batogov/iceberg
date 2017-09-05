import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import ProfileHeader from './header/account-profile-header';
import ProfileFeed from './feed/account-profile-feed';
import { UserInfo, Tabs } from './../../blocks';

import { myCollectionsLoader, savedLinksLoader } from './../../reducers/user.reducer';

import './account-profile.scss';

class AccountProfile extends Component {
    componentDidMount() {
        if (this.props.history.location.pathname.indexOf('links') >= 0) {
            this.getSavedLinks();
        } else {
            this.getMyCollections();
        }
    }

    getMyCollections = () => {
        this.props.myCollectionsLoader(this.props.token, 'myCollection');
    }

    getSavedLinks = () => {
        this.props.savedLinksLoader(this.props.token, 'savedLinks');
    }

    render() {
        const { user, archive, typeToFeed } = this.props;
        const tabs = [
            {
                id: 1,
                title: 'Подборки',
                linkTo: '/profile',
                onClick: this.getMyCollections,
            },
            {
                id: 2,
                title: 'Ссылки',
                linkTo: '/profile/links',
                onClick: this.getSavedLinks,
            },
        ];

        const filterItems = this.props.history.location.pathname.indexOf('links') > -1 ? [
            {
                id: 0,
                title: 'Новые',
                name: 'savedLinks',
            },
            {
                id: 1,
                title: 'Прочитанные',
                name: 'savedLinks',
            },
        ] : [
            {
                id: 0,
                title: 'Созданные мной',
                name: 'myCollections',
            },
            {
                id: 1,
                title: 'Сохраненные другими',
                name: 'savedCollections',
            },
        ];
        const data = typeToFeed.toLowerCase().indexOf('links') > -1 ? archive.links : archive.collections;
        return (<div className="account-profile-wrap">
            <ProfileHeader />
            <UserInfo user={user} />
            <div className="account-profile__tabs-wrap">
                <Tabs tabs={tabs} />
            </div>
            <ProfileFeed data={data} type={typeToFeed} filterItems={filterItems} />
        </div>);
    }
}

AccountProfile.propTypes = {
    user: PropTypes.object.isRequired,
    archive: PropTypes.object.isRequired,
    typeToFeed: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    myCollectionsLoader: PropTypes.func.isRequired,
    savedLinksLoader: PropTypes.func.isRequired,
    history: PropTypes.any.isRequired,
};

function mapStateToProps(state) {
    return {
        user: state.user.data,
        token: state.app.token,
        archive: state.user.archive,
        typeToFeed: state.user.typeToFeed,
    };
}

export default
connect(mapStateToProps, { myCollectionsLoader, savedLinksLoader })(withRouter(AccountProfile));
