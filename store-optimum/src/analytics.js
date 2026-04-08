import Analytics from "analytics";
import bponiAnalytics from "./bponi-analytics.js";

const analytics = ({ siteId }) => {
  return Analytics({
    app: "bponi-analytics",
    debug: true,
    plugins: [
      bponiAnalytics({
        siteId: siteId,
      }),
    ],
  });
};

export default analytics;
