class ScrollDrawer extends HTMLElement {
  html = `
  <div class="drawer" open="false" snapping="false">
    <div class="snap-sentinel"></div>
    <div class="snap-sentinel"></div>
    <div class="body">
      <div class="head">
        <div class="head-slot">
          <slot name="header"></slot>
        </div>
        <div class="handle"></div>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
  `;

  style = `
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .drawer {
    --top-margin: 60px;
    overflow-y: auto;
    padding: 0;
    scrollbar-width: none;
    overscroll-behavior: contain;
    z-index: 1;
    grid-column: 2/3;
    grid-row: 1/2;
    max-block-size: 100vh;
    position: fixed;
    inset: 0;
    scroll-snap-type: y mandatory;
    display: grid;
    grid-template-rows: 39vh calc(61vh + 1px) 1fr;

    -webkit-mask-image: url(mask.svg);
    mask-image: url(mask.svg);

  }

  // .drawer::before {
  //   content: "";
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100vh;
  //   background: rgba(0, 0, 0, 0.4);
  //   transition: 0.2s opacity ease;
  // }
  
  .drawer:not([open="true"]) {
    pointer-events: none;
  }
  .drawer:not([open="true"])::before {
    opacity: 0;
  }

  .drawer::-webkit-scrollbar {
    display: none;
  }

  .body {
    background-color: #fff;
    box-shadow: 0 50rem #fff, 0 0 5px 0px rgba(0,0,0,0.2);
    // background-color: rgba(255,255,255,0.8);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    // box-shadow: 0 50rem rgba(255,255,255,0.8);
    display: grid;
    place-items: center;
    width: 100%;
    border-radius: 10px 10px 0 0;
    scroll-snap-align: start;
    position: relative;
    height: 100%;
    scroll-margin-top: var(--top-margin);
    padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
  }

  .content {
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .snap-sentinel {
    scroll-snap-align: start;
    position: relative;
  }
  
  .head {
    width: 100%;
    padding: 5px 0 0 0;
    position: sticky;
    top: var(--top-margin);
    // border-bottom: 1px solid grey;
    z-index: 4;
    border-radius: 10px 10px 0 0;
    // height: 15px;
    margin-bottom: -10px;
    background-color: inherit;
  }

  .handle {
    width: 36px;
    height: 5px;
    border-radius: 5px;
    background-color: #BEBFBE;
    margin: 0 auto;
    position: relative;
  }

  .head-slot {
    visibility: hidden;
  }
  .drawer[snapping="true"] .head-slot {
    visibility: visible;
  }
  `;

  constructor() {
    super();

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleIntersect = this.handleIntersect.bind(this);

    this.attachShadowDom();
  }

  _isOpen = false;
  set isOpen(open) {
    this.root.setAttribute("open", open);
    this._isOpen = open;
  }

  _isSnapping = false;
  set isSnapping(snapping) {
    this.root.setAttribute("snapping", snapping);
    this._isSnapping = snapping;
  }

  /**
   * Component events
   */

  attachShadowDom() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    const htmlFragment = document.createElement("div");
    htmlFragment.innerHTML = this.html;
    shadowRoot.appendChild(htmlFragment.firstElementChild);

    const styleFragment = document.createElement("style");
    styleFragment.innerHTML = this.style;
    shadowRoot.appendChild(styleFragment);
  }

  connectedCallback() {
    this.root = this.shadowRoot.querySelector(".drawer");
    // this.closeBtn = this.shadowRoot.querySelector(".close");
    this.snapSentinels = Array.from(
      this.shadowRoot.querySelectorAll(".snap-sentinel")
    );

    this.body = this.shadowRoot.querySelector(".body");
    this.observer = new IntersectionObserver(this.handleIntersect, {
      rootMargin: "0px",
      threshold: 0.0,
    });
    this.observer.observe(this.body);
  }

  disconnectedCallback() {
    // this.closeBtn.removeEventListener("click", this.close);
    this.observer.disconnect();
    this.snapSentinels[1].removeEventListener("click", this.close);
    this.root.removeEventListener("scroll", this.handleScroll);
  }

  handleIntersect(entries) {
    if (!entries.length) return;
    this.isOpen = entries[0].isIntersecting;
  }

  open() {
    this.snapSentinels[1].scrollIntoView({ behavior: "smooth" });
    this.isOpen = true;

    // this.closeBtn.addEventListener("click", this.close);
    this.snapSentinels[1].addEventListener("click", this.close);
    this.root.addEventListener("scroll", this.handleScroll);
  }

  close() {
    this.snapSentinels[0].scrollIntoView({ behavior: "smooth" });
    this.isOpen = false;

    // this.closeBtn.removeEventListener("click", this.close);
    this.snapSentinels[1].removeEventListener("click", this.close);
    this.root.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll(e) {
    this.isSnapping = this.root.scrollTop > window.innerHeight - 59;
  }
}

customElements.define("scroll-drawer", ScrollDrawer);
