import React from 'react'
const styles = {
    theoryHead: {
        textAlign: 'center',
        marginTop: '80px',
        marginBottom: '60px'
    },
    theroyContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '50px',
    }
}
export default function Theory() {
    return (
        <div id="theory">
            <h1 style={styles.theoryHead}>Theory behind my work</h1>
            <div  style={styles.theroyContainer}>
                <embed width="850" height="500" wmode="transparent" src="https://drive.google.com/uc?id=1qIovGSN4pZ6hheSLSXHkq29YxyfOnQ3g#page=1&zoom=100" type="application/pdf" />
            </div>
        </div>
    );
}
