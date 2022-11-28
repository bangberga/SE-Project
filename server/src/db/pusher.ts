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

export { fruitsChangeStream };
