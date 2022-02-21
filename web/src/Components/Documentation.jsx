import React from 'react';
const styles = {
    "apiMeta": {
        "backgroundColor": "#ccddaa",
        "padding": "20px",
        "margin": "10px 15%",
        "borderRadius": "20px"
    },
    "apiDetails": {
        "margin": "0",
        "fontWeight": "bold",
    },
    "apiDetailsVal": {
        "color": "#1d8cc5",
        "fontWeight": "normal"
    },
    "apiHead": {
        "textAlign": "center",
        "marginTop": "80px"
    }
}
const Documentation = () => {
    return (
        <div id="docs">
            <h1 style={styles.apiHead}>API Documentation</h1>
            <div style={styles.apiMeta}>
                <p style={styles.apiDetails}>endpoint : <span style={styles.apiDetailsVal}>https://musicremixer.herokuapp.com/</span></p>
                <p style={styles.apiDetails}>path: <span style={styles.apiDetailsVal}>/remix</span></p>
                <p style={styles.apiDetails}>method : <span style={styles.apiDetailsVal}>POST</span></p>
                <p style={styles.apiDetails}>body : <span style={styles.apiDetailsVal}>{"{ 'urls' : string[] }"}</span></p>
            </div>

        </div>

    );
}

export default Documentation;
