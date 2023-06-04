import {
  itemAdmin,
  itemCommander,
  itemSceneInvestigator,
  itemDirector,
  itemExpert,
} from "./items-nav";

export const getItemsNav = () => {
  //add check role from api
  const role = "0"

  let items = [];

  switch (role) {
    case "0": //admin
      items = itemAdmin;
      break;
    case "1": //commander
      items = itemCommander;
      break;
    case "2": //Scene Investigator
      items = itemSceneInvestigator;
      break;
    case "3": //Director
      items = itemDirector;
      break;
    case "4": //Expert
      items = itemExpert;
      break;
    default:
      items = [];
  }

  return items;
};


