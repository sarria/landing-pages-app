import React from 'react';
import PropTypes from 'prop-types';
import styles from './Header.module.scss';
import Logo from './Logo';

const Header = () => {
    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <Logo />
            </div>
        </div>
    );
}

Header.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
};

export default Header;
