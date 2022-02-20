import React from 'react';
import {Image} from 'react-bootstrap'
import heroImage from '../assets/images/hero.jpg'
const styles = {
    "heroImage":{
        "marginLeft" : "10%",
        "width": "80%",
        "marginRight":"10%"
    }
}
const Herosection = () => {
    return (
        <div id="home">
            <Image src={heroImage} width="80%" style={styles.heroImage}/>
        </div>
    );
}

export default Herosection;
