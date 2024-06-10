import styles from './Header.module.scss'
import Logo from './Logo'

const Header = () => {
    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <Logo />
            </div>
        </div>
    )
}

export default Header
