import { Component } from "react";
import { AppDesktop } from "./AppDesktop";
import { AppMobile } from "./AppMobile";
import { isMobile } from "./utils";
import { getSearchObj } from "./utils/query_params";

export class App extends Component {
  resize = null;
  componentDidMount() {
    if (document && document.body) {
      const searchObj = getSearchObj(window.location.search);
      const filters = searchObj.filters || {};
      if (filters && Object.keys(filters).length > 0) {
      }
    }
  }
  render() {
    const mobile = isMobile();
    if (mobile) {
      return <AppMobile />;
    } else {
      return <AppDesktop />;
    }
  }
}
