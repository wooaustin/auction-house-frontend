import React from 'react';
import {Card, makeStyles } from '@material-ui/core';

const CarouselSlide = (props) =>{
    const { image } = props.content;
    const useStyles = makeStyles(() => ({
        card: {
            borderRadius: 5,
            padding: '75px 50px',
            margin: '0px 25px',
            boxShadow: '20px 20px 20px black',
            display: 'flex',
            justifyContent: 'center'
        },
    }));

    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <img src={image} height="height: 50%; width: 50%" />
        </Card>
    );
}

export default CarouselSlide;