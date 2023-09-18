import PropTypes from "prop-types";
import { PrintPlugin } from "./print-html";
import htmlForm from "./html-form";

const exportPdf = async ({ data }) => {
  try {
    // if (!selectData) {
    //   console.log(`Item not found.`);
    //   return;
    // }
    const htmlText = await htmlForm({ data: data });
    PrintPlugin.print(htmlText);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
exportPdf.propTypes = {
  selectData: PropTypes.object,
};
exportPdf.defaultProps = {
  selectData: {},
};

export default exportPdf;
