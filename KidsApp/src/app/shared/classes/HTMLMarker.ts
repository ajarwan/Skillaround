/* global google */
declare var $: any;
declare var google: any;

const createHTMLMapMarker = ({
  OverlayView = google.maps.OverlayView,
  ...args
}) => {
  class HTMLMapMarker extends OverlayView {
    constructor() {
      super();
      this.latlng = args.latlng;
      this.html = args.html;
      this.Id = args.id;
      this.setMap(args.map);
      this.IsDeleted = false;
    }

    createDiv() {
      this.div = document.createElement("div");
      this.div.style.position = "absolute";
      if (this.html) {
        this.div.innerHTML = this.html;
      }
      google.maps.event.addDomListener(this.div, "click", event => {
        google.maps.event.trigger(this, "click");
      });
    }

    appendDivToOverlay() {
      const panes = this.getPanes();
      panes.overlayImage.appendChild(this.div);
    }

    positionDiv() {
      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      let offset = 0;
      if (point) {
        this.div.style.left = `${point.x - offset}px`;
        this.div.style.top = `${point.y - offset}px`;
      }
    }

    draw() {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
      this.positionDiv();
    }

    remove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    delete() {
      this.setMap(null);
      this.IsDeleted = true;
    }

    public getPosition() {
      return this.latlng;
    }

    public getDraggable() {
      return false;
    }
  }

  return new HTMLMapMarker();
};

export default createHTMLMapMarker;
