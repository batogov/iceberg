/*
Если переданная строка – цвет в hex, то функция 
возвращает его в форме RGB.
*/
export const hexToRGB = (color) => {
    if (!color.match(/^#[0-9a-f]{3,6}$/i)) {
        return color;
    }
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
};

/*
Функция возвращает домен с убранными префиксами (например, "http://" или "www.").
*/
export const getDomain = (url) => {
    const prefix = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?/i;
    return url.replace(prefix, '');
};

export const compareLinks = (link1, link2) => (
    getDomain(link1) === getDomain(link2)
);

/*
Функция возвращает 128-битный идентификатор, который используется для
генерации данных демо-пользователя.
*/
export const generateGuid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}`;
};

export const handleClickToCollection = (e, cardId, history) => {
    const { className } = e.target;

    if (className !== 'hash-tag'
        && className !== 'card-footer__user'
        && className !== 'card-footer__actions'
        && className !== 'card-footer__save-action'
        && (typeof className.baseVal === 'undefined'
            || (className.baseVal
            && className.baseVal.trim() !== 'svg-icon'))) {
        history.push({ pathname: `/collection/${cardId}` });
    }
};

export const authDemoUser = (registerFn, callback) => {
    const userId = generateGuid();
    const userPassword = generateGuid();
    const firstName = 'Демо';
    const lastName = 'Пользователь';
    registerFn(userId, userPassword, firstName, lastName, callback);
};

export const socialSharing = (subject, message) => {
    if (typeof window.cordova === 'undefined') return;

    const options = {
        subject,
        message,
        url: 'https://yandex.ru',
        chooserTitle: subject,
    };

    window.plugins.socialsharing.shareWithOptions(options);
};

/**
 * Обновить статус лайка для конкретной ссылки в списке коллекции
 * @param {array} links - список всех ссылок в коллекции
 * @param {string} id - id ссылки
 * @param {bool} status - на какое состояние меняем
 */
export const updateLikeStatusOfLinkInList = (links, id, status) => {
    const editedLinksList = [].concat(links);
    const editindLink = editedLinksList[links.findIndex(x => x._id === id)];
    editindLink.liked = status;
    if (status) {
        editindLink.likes += 1;
    } else {
        editindLink.likes -= 1;
    }
    return editedLinksList;
};

/**
 * Обновить статус сохранения к себе в профиль для конкретной ссылки в списке коллекции
 * @param {array} links - список всех ссылок в коллекции
 * @param {string} id - id ссылки
 * @param {bool} status - на какое состояние меняем
 */
export const updateSavedStatusOfLinkInList = (links, id, status) => {
    const editedLinksList = [].concat(links);
    const editindLink = editedLinksList[links.findIndex(x => x._id === id)];
    editindLink.saved = status;
    if (status) {
        editindLink.savedTimesCount += 1;
    } else {
        editindLink.savedTimesCount -= 1;
    }
    return editedLinksList;
};

/**
 * Обновить состояние открытия для конктреной ссылки в списке коллекции
 * @param {array} links - список всех ссылок в коллекции
 * @param {string} id - id ссылки
 */
export const setLinkAsOpenInList = (links, id) => {
    const editedLinksList = [].concat(links);
    const editindLink = editedLinksList[links.findIndex(x => x._id === id)];
    editindLink.opened = true;
    return editedLinksList;
};
