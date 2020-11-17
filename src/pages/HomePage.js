import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";
import Auction from "../components/Auction";
import { makeStyles } from '@material-ui/core';
import CarouselSlide from '../components/CarouselSlide';
import { HOME_PAGE_IMAGES } from '../components/HomePageImages';



const containerWidth = 1000;
const cardPadding = 14;
const cardWidth = (containerWidth / 2) - (cardPadding * 2); 

const useStyles = makeStyles({
    auctionContainer:{
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
    placeholder:{
        paddingBottom: 500,
    },
    recTitle:{
        width: "100%",
    }

});

const HomePage = (props) =>{
    const {auctionStore, authStore, routerHistory } = props;
    const classes = useStyles();
    useEffect(() => {
        (async () => {
          if (routerHistory.location.pathname === '/') {
            auctionStore.buildRecommendations();
          }
        })();
      }, [auctionStore, routerHistory]);
    const renderRecommendations = () =>{
        const { recommendations } = auctionStore;
        if(!recommendations.length){
          return (
            <div style={{textAlign: 'center', width: '100%'}}>
                <h4> No recommendations</h4>
            </div>
          )
        }
        return recommendations.map((auction) =>{
          let flag = true;
          let bidState = 'CAN_BID';
          if(auction.seller === authStore.email){
            bidState = 'OWN_AUCTION';
          }
          if(auction.bidder === authStore.email){
            bidState = 'HIGHEST_BIDDER';
          }
          if(auction.status === "CLOSED"){
              flag = false;
          }
          return (
            <div key={auction.id} className={classes.auctionCard}>
              <Auction
                auction={auction}
                bidState={bidState}
                onBid={() => auctionStore.setBiddingOn(auction)}
                display={flag}
              />
            </div>
          )
        });
    }
    const renderAuctions = () => {
      const { auctions } = auctionStore;
  
      if (!auctions.length) {
        return (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h4>No auctions available. Create one?</h4>
          </div>
        );
      }
      const flag = true;
      return auctions.map((auction) => {
        let bidState = 'CAN_BID';
  
        if (auction.seller === authStore.email) {
          bidState = 'OWN_AUCTION';
        }
  
        if (auction.bidder === authStore.email) {
          bidState = 'HIGHEST_BIDDER';
        }
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
      });
    };
    
    return (
        <div className="mainContainer">
            <div className={classes.auctionContainer}>
                <div className={classes.recTitle}> 
                    <h3>Recommendations</h3>
                </div>
                {renderRecommendations()}
            </div>
            <div className={classes.auctionContainer}>
            <div className={classes.recTitle}> 
                    <h3>Auctions</h3>
                </div>
              {renderAuctions()}
            </div>
        </div>
    );
};

export default inject("auctionStore", "authStore", "routerHistory")(observer(HomePage));