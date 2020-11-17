import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import {
  Container,
  FormControl,
  Button,
  makeStyles,
  TextField,
} from "@material-ui/core";
import PictureUpload from '../components/PictureUpload';

const useStyles = makeStyles((theme) => ({
  form: {
    maxWidth: 400,
  },
  pictureUpload: {
    marginTop: 20,
    marginBottom: 20,
  },
}));

const CreateAuctionPage = ({ auctionStore, routerHistory }) => {
  const [title, setTitle] = useState("");
  const [base64, setBase64] = useState(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const classes = useStyles();

  const createAuction = async (title) => {
    await auctionStore.createAuction(title, base64, description, type);
    routerHistory.push("/auctions");
  };

  return (
    <Container width={200} fixed>
      <h1>Create an Auction</h1>

      <form className={classes.form} noValidate autoComplete="off">
        <FormControl fullWidth>
          <TextField
            label="Auction Title"
            id="standard-adornment-amount"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Lemonade from the '60s"
            type="string"
            variant="outlined"
          />
          <TextField
            label="Description"
            id="standard-adornment-amount"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of Item"
            type="string"
            variant="outlined"
          />
          <TextField
            label="Type"
            id="standard-adornment-amount"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Item Type"
            type="string"
            variant="outlined"
          />
        </FormControl>
        <div className={classes.pictureUpload}>
          <PictureUpload onPictureSelected={base64 => setBase64(base64)} />
        </div>
        <div>
          <Button
            onClick={() => createAuction(title)}
            disabled={!title.length || !base64}
          >
            Create auction
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default inject(
  "auctionStore",
  "authStore",
  "routerHistory"
)(observer(CreateAuctionPage));
