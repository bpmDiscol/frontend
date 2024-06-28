import { Meteor } from "meteor/meteor";
import { BlackListCollection } from "./blackListCollection";

Meteor.methods({
  get_blackList() {
    return BlackListCollection.find({});
  },
  add_blackList_member(member) {
    return BlackListCollection.insert({ member });
  },
  delete_blackList_member(_id){
    return BlackListCollection.remove({_id})
  }
});
