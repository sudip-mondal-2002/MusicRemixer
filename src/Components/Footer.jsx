import React from 'react';
const styles ={
    footer:{
        textAlign: 'center',
        marginBottom: '50px',
        marginTop: '50px',
        fontWeight: 'bold'
    }
}
const Footer = () => {
    return (
        <div style={styles.footer} id="footer">
            Made with ❤️ by Sudip Mondal. Happy Coding 🧑‍💻.
        </div>
    );
}

export default Footer;
