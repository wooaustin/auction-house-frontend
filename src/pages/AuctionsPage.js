import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import Auction from "../components/Auction";
import BidModal from "../components/BidModal";
import { Fab, makeStyles, TextField } from '@material-ui/core';
import { fade } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from "@material-ui/icons/Search";

const containerWidth = 1000;
const cardPadding = 14;
const cardWidth = (containerWidth / 2) - (cardPadding * 2); 

const useStyles = makeStyles(theme => ({
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
  searchContainer: {
    display: 'flex',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    paddingLeft: "20px",
    paddingRight: "20px",
    marginTop: "5px",
    marginBottom: "5px",
  },
  searchIcon:{
    alignSelf: "flex-end",
    margin: "5px",
  },
  serachText:{
    width: "200px",
    margin: "5px",
  }
}));

const AuctionsPage = (props) => {
  const { auctionStore, authStore, routerHistory } = props;
  const classes = useStyles();
  const [filter, setFilter] = useState("");

  const handleSearchChange = (e) =>{
    setFilter(e.target.value);
  };
  useEffect(() => {
    (async () => {
      await auctionStore.fetchAuctions();
      setInterval(() => {
        if (routerHistory.location.pathname === '/auctions' || routerHistory.location.pathname === '/') {
          auctionStore.fetchAuctions();
        }
      }, process.env.REACT_APP_REFRESH_RATE);
    })();
  }, [auctionStore, routerHistory]);

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
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.searchContainer}>
        <SearchIcon className={classes.searchIcon} />
        <TextField
          onChange={handleSearchChange} 
          className={classes.searchText}
          label="Auction Item"
          variant="standard"
        />
      </div>
      <div className={classes.auctionsContainer}>
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
    </div>
  );
};

export default inject("auctionStore", "authStore", "routerHistory")(observer(AuctionsPage));
