import { action, observable } from 'mobx';
import Axios from 'axios';
import AuthStore from './AuthStore';
import OverlayStore from './OverlayStore';

const axios = Axios.create({
  baseURL: process.env.REACT_APP_AUCTIONS_ENDPOINT,
});

class AuctionStore {
  @observable auctions = [];
  @observable auctionTypes = {};
  @observable biddingOn = null;
  @observable bidAmount = 0;
  @action

  /*Fetch all auctions with status set to 'OPEN' */
  async fetchAuctions() {
    try {
      const result = await axios.get('/auctions?status=OPEN', {
        headers: {
          Authorization: AuthStore.token,
        }
      });

      this.auctions = result.data;
    } catch (error) {
      alert('Could not fetch auctions! Check console for more details.');
      console.error(error);
    }

    if (this.biddingOn) {
      this.auctions.forEach(auction => {
        if (auction.id === this.biddingOn.id) {
          this.bidAmount = auction.highestBid.amount + 1;
        }
      });
    }
  }

  /* Fetches all auctions uploaded by the current user */
  @action
  async fetchMyAuctions(){
    try{
      const result = await axios.get('/auction/menu/myauctions',{
        headers: {
          Authorization: AuthStore.token,
        }
      });
      this.auctions = result.data;
    }catch(error){
      alert('Could not fetch your auctions! Check console for more details.');
      console.error(error);
    }
  }

  /* Fetches all auctions regardless of status */
  @action
  async fetchAllAuctions(){
    try{
      const result = await axios.get('/auction/allAuctions',{
        headers:{
          Authorization: AuthStore.token,
        }
      });
      this.auctions = result.data;
    }catch(error){
      alert('Could not fetch auctions, check console for more details');
      console.error(error);
    }
  }

  /* Gets all auctions based on input type */
  @action
  getAuctionsByType(type){
    let arr = [];
    this.auctions.forEach((auction) => {
      if(auction.type === type){
        arr.add(auction);
      }
    });
    return arr;
  }

  /* Checks all auctions regardless of status for user activity, activity is defined by either a user is hosting an auction or bidding on one */
  @action
  activityExists(){
    for(const auction in this.auctions){
      if(auction.seller === AuthStore.email || auction.bidder === AuthStore.email){
        return true;
      }
    }
    return false;
  }

  /* Builds HashMap of auctions based on user activity type frequency, sorted in decreasing order */
  @action
  buildUserFrequencyMap(){
    const map = {};
    this.auctions.forEach((auction) => {
      if(map[auction.type] && (auction.seller === AuthStore.email || auction.bidder === AuthStore.email)){
        map[auction.type]++;
      }
    });
    return map;
  }

  /* Builds HashMap of auctions based on total type frequency, sorted in decreasing order */
  @action
  buildDefaultFrequencyMap(){
    const map = {};
    this.auctions.forEach((auction) => {
      if(map[auction.type]){
        map[auction.type]++;
      }
      else{
        map[auction.type] = 1;
      }
    });
    return map;
  }


  //Removes all entries of userMap from defaultMap, creating an ordering of userMap items first, then defaultMap items next  
  @action
  filterMappings(userMap, defaultMap){
    defaultMap.forEach((entry) =>{
      if(userMap[entry]){
        defaultMap.splice(defaultMap.indexOf(entry));
      }
    })
  }


  @action
  async fetchRecommendations(){
    map = {};
    //Load the correct data into the AuctionStore
    //Fetch all auctions might be unnecessary in this spot, will only need to load each time page is loaded
    this.fetchAllAuctions();
    const defaultMap = this.buildDefaultFrequencyMap();
    const userMap = this.buildUserFrequencyMap();
    filterMappings(defaultMap, userMap);
    userMap.map((entry) =>{
      map.push(entry);
    });
    defaultMap.map((entry) => {
      map.push(entry);
    })
    this.auctions = map;
  }


  @action
  async fetchMyBids(){
    try{
      const result = await axios.get('/auction/menu/mybids', {
        headers: {
          Authorization: AuthStore.token,
        }
      });
      this.auctions = result.data;
    }catch(error){
      alert('Count not fetch your auctions! Check console for more details');
      console.error(error);
    }
  }

  @action
  setBiddingOn(auction) {
    this.biddingOn = auction;

    if (auction) {
      this.bidAmount = auction.highestBid.amount + 1;
    } else {
      this.bidAmount = 0;
    }
  }

  @action
  setBidAmount(amount) {
    this.bidAmount = amount;
  }

  @action
  async placeBid() {
    const id = this.biddingOn.id;
    const amount = this.bidAmount;

    OverlayStore.setLoadingSpinner(true);

    try {
      await axios.patch(`/auction/${id}/bid`, { amount }, {
        headers: {
          Authorization: AuthStore.token,
        }
      });
    } catch (error) {
      alert('Could not place bid! Check console for more details.');
      console.error(error);
    }

    this.fetchAuctions();
    this.biddingOn = null;
    this.bidAmount = 0;
    OverlayStore.setLoadingSpinner(false);
  }

  async createAuction(title, pictureBase64, description, category) {
    let auctionId;
    OverlayStore.setLoadingSpinner(true);

    try {
      const createAuctionResult = await axios.post('/auction', { title, description, category }, {
        headers: {
          Authorization: AuthStore.token,
        }
      });
      
      const auction = createAuctionResult.data;
      auctionId = auction.id;
      
      await axios.patch(`/auction/${auctionId}/picture`, pictureBase64, {
        headers: {
          Authorization: AuthStore.token,
        },
      });
    } catch (error) {
      alert('Could not create auction! Check console for more details.');
      console.error(error);
    }

    OverlayStore.setLoadingSpinner(false);
  }
}

export default new AuctionStore();