import { action, observable } from 'mobx';
import Axios from 'axios';
import AuthStore from './AuthStore';
import OverlayStore from './OverlayStore';

const axios = Axios.create({
  baseURL: process.env.REACT_APP_AUCTIONS_ENDPOINT,
});

class AuctionStore {
  @observable auctions = [];
  @observable typeList = [];
  @observable biddingOn = null;
  @observable bidAmount = 0;
  @observable recommendations = [];
  
  /*Fetch all auctions with status set to 'OPEN' */
  @action
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
      let temp = [];
      result.data.forEach((auction) =>{
        if(auction.status === 'OPEN'){
          temp.push(auction);
        }
      });
      this.auctions = temp;
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
      if(auction.type === type && auction.seller !== AuthStore.email){
        arr.push(auction);
      }
    });
    return arr;
  }

  /* Builds a typelist of every type of auction in the database at the moment */
  @action 
  buildMapping(){
    let arr = [];
    this.auctions.forEach((auction) =>{
      if(auction.type && !arr.includes(auction.type))
        arr.push(auction.type);
    });
    this.typeList = arr;
  }

  @action
  findRandom(){
    const type = Math.floor(Math.random() * this.typeList.length);
    let auctions = this.getAuctionsByType(this.typeList[type]);
    const randomIndex = Math.floor(Math.random() * auctions.length);
    const auction = auctions[randomIndex];
    return auction;
  }

  @action
  async buildRecommendations(){
    //Get all items in the database to classify type mapping
    await this.fetchAuctions();
    //Build type mapping
    this.buildMapping();
    //Randomize within the typeList 2 indexes to choose from
    let rec1 = this.findRandom();
    if(this.recommendations.length < 2 && rec1){
      this.recommendations.push(rec1);
    }
    let rec2 = this.findRandom();
    if(this.recommendations.length < 2 && rec2){
      this.recommendations.push(rec2);
    }
    //alert(`Length of rec list ${this.recommendations.length}`);
  }

  @action
  async fetchMyBids(){
    try{
      const result = await axios.get('/auction/menu/mybids', {
        headers: {
          Authorization: AuthStore.token,
        }
      });
      let temp = [];
      result.data.forEach((auction) =>{
        if(auction.status === 'OPEN'){
          temp.push(auction);
        }
      });
      this.auctions = temp;
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

  async createAuction(title, pictureBase64, description, type) {
    let auctionId;
    OverlayStore.setLoadingSpinner(true);

    try {
      const createAuctionResult = await axios.post('/auction', { title, description, type }, {
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