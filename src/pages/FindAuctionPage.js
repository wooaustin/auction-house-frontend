import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import Auction from "../components/Auction";
import BidModal from "../components/BidModal";
import { Fab, makeStyles, TextField } from '@material-ui/core';
import { fade } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from "@material-ui/icons/Search";


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

const FindAuctionsPage = (props) =>{
    const {auctionStore, authStore, routerHistory } = props;
    const classes = useStyles();
    useEffect(() =>{
        (async () =>{
            await auctionStore.fetchRecommendations();
            setInterval(() => {
                if(routerHistory.location.pathname === '/findauctions'){
                    auctionStore.fetchRecommendations();
                }
            }, process.env.REACT_APP_REFRESH_RATE);
        })();
    }, [auctionStore, routerHistory]);

    const renderAuctions = () => {
        const { auctions } = auctionStore;
        if(!auctions.length){
            return (
                <div style={{textAlign: 'center', width: '100%'}}>
                    <h4>No auctions available</h4> 
                </div>
            );
        }
        const flag = true;
        return auctions.map((type, result) =>{
            let bidState = 'CAN_BID';

            if (auction.seller === authStore.email) {
                bidState = 'OWN_AUCTION';
            }

            if (auction.highestBid.bidder === authStore.email) {
                bidState = 'HIGHEST_BIDDER';
            }
            if(!auction.title.includes(filter)){

            }
            else{
                return (
                <div key={auction.id} className={classes.auctionCard}>
                <Auction
                    auction={auction}
                    bidState={bidState}
                    onBid={() => auctionStore.setBiddingOn(auction)}
                    display={flag}
                />
                </div>
                );
            }    
        });
    }

}

export default inject("auctionStore", "authStore", "routerHistory")(observable(FindAuctionsPage));