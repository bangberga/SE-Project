import Pusher from "pusher";
import { db } from "./connect";

function fruitsChangeStream(pusher: Pusher) {
  const channel = "fruits";
  const fruitsCollection = db.collection("fruits");
  const changeStream = fruitsCollection.watch();
  changeStream.on("change", (change) => {
    const type = change.operationType;
    switch (type) {
      case "insert":
        const fruit = change.fullDocument;
        pusher.trigger(channel, "insert fruit", fruit);
        break;
      case "delete":
        pusher.trigger(channel, "delete fruit", change.documentKey._id);
        break;
      case "update":
        pusher.trigger(channel, "update fruit", {
          _id: change.documentKey._id,
          fields: change.updateDescription.updatedFields,
        });
        break;
      default:
        break;
    }
  });
}

function ordersChangeStream(pusher: Pusher) {
  const channel = "orders";
  const ordersCollection = db.collection("orders");
  const changeStream = ordersCollection.watch();
  changeStream.on("change", (change) => {
    const type = change.operationType;
    switch (type) {
      case "insert":
        const order = change.fullDocument;
        pusher.trigger(channel, "insert order", order);
        break;
      case "delete":
        pusher.trigger(channel, "delete order", change.documentKey._id);
        break;
      default:
        break;
    }
  });
}

function transactionsChangeStream(pusher: Pusher) {
  const channel = "transactions";
  const transactionsCollection = db.collection("transactions");
  const changeStream = transactionsCollection.watch();
  changeStream.on("change", (change) => {
    const type = change.operationType;
    switch (type) {
      case "insert":
        const transaction = change.fullDocument;
        pusher.trigger(channel, "insert transaction", transaction);
        break;
      case "update":
        pusher.trigger(channel, "update transaction", {
          _id: change.documentKey._id,
          fields: change.updateDescription.updatedFields,
        });
        break;
      case "delete":
        pusher.trigger(channel, "delete transaction", change.documentKey._id);
        break;
      default:
        break;
    }
  });
}

export { fruitsChangeStream, ordersChangeStream, transactionsChangeStream };
