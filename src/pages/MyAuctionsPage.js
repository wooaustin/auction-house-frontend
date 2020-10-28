import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";
import Auction from "../components/Auction";
import BidModal from "../components/BidModal";
import { Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const containerWidth = 1000;
const cardPadding = 14;
const cardWidth = (containerWidth / 2) - (cardPadding * 2); 

const useStyles = makeStyles({
    auctionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: containerWidth,
      margin: 'auto',
      '@media (max-width: 900px)' : {
        alignItems: 'center',
        justifyContent: 'center'
      },
    },
    auctionCard: {
      flexBasis: cardWidth,
      flexShrink: 0,
      padding: cardPadding,
    },
    fabContainer: {
      position: 'fixed',
      bottom: 20,
      right: 20,
    },
    createAuctionButton: {
      background: 'linear-gradient(90deg, rgba(190,52,32,1) 0%, rgba(231,75,77,1) 48%, rgba(231,148,74,1) 100%)',
    },
  });


const MyAuctionsPage = (props) => {
    const { auctionStore, authStore, routerHistory } = props;
    const classes = useStyles();

    useEffect(() =>{
        (async () => {
            await auctionStore.fetchMyAuctions();
            setInterval(() =>{
                if(routerHistory.location.pathname == '/menu/myauctions'){
                    auctionStore.fetchMyAuctions();
                }
            }, process.env.REACT_APP_REFRESH_RATE);
        })();
    }, [ auctionStore, routerHistory]);

    const flag = false;
    const renderAuctions = () => {
        const { auctions } = auctionStore;
        if(!auctions.length){
            return (
                <div style={{textAlign: 'center', width: '100%'}}>
                    <h4>You have no auctions</h4>
                </div>
            );
        }
        return auctions.map((auction) => {
            return (
                <div key={auction.id} className = {classes.auctionCard}>
                    <Auction
                        auction = {auction}
                        bidState='OWN_AUCTION'
                        onBid={() => auctionStore.setBiddingOn(auction)}
                        display={flag}
                    />
                </div>
            );
        });
    };

    return (
        <div className ={classes.auctionsContainer}>
            <BidModal />
            {renderAuctions()}

            <div className={classes.fabContainer}>
                <Fab
                    color="primary"
                    aria-label="add"
                    className={classes.createAuctionButton}
                    onClick={() => routerHistory.push('/create')}
                >
                    <AddIcon />
                </Fab>
            </div>
        </div>
    );
}

export default inject("auctionStore", "authStore", "routerHistory")(observer(MyAuctionsPage));