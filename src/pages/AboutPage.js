import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";
import { makeStyles } from '@material-ui/core';


const containerWidth = 1000;

const useStyles = makeStyles({
    aboutContainer: {
        alignItems: "center",
        flexWrap: 'wrap',
        maxWidth: containerWidth,
        margin: 'auto',
    },
    about: {
        flexWrap: 'wrap',
        display: 'flex',
    }
    
});


const AboutPage = (props) => {
    const {authStore, routerHistory } = props;
    return (
        <div className="aboutContainer"> 
            <h1> About Us</h1>
            <div className="about"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
        </div>
    );
}

export default inject("authStore")(observer(AboutPage));