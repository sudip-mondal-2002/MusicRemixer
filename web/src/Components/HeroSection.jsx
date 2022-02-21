import React from 'react';
import {Image} from 'react-bootstrap'
const styles = {
    "heroImage":{
        "marginLeft" : "10%",
        "width": "80%",
        "marginRight":"10%",
        "marginTop": "20px"
    }
}
const Herosection = () => {
    return (
        <div id="home">
            <Image src="https://github.com/sudip-mondal-2002/MusicRemixer/blob/master/web/src/assets/images/hero.jpg?raw=true" width="80%" style={styles.heroImage}/>
        </div>
    );
}

export default Herosection;
